const express = require("express");
const mongoose = require("mongoose");
const Joi = require("joi");
const jwtAuth = require("../lib/jwtAuth");

const User = require("../db/User");
const JobApplicant = require("../db/JobApplicant");
const Recruiter = require("../db/Recruiter");
const Job = require("../db/Job");
const Application = require("../db/Application");
const Rating = require("../db/Rating");

// Import new error handling and validation middleware
const { validateBody, validateQuery, validateParams, sanitizeInput, jobSchemas, paramSchemas } = require("../middleware/validation");
const { asyncHandler } = require("../middleware/errorHandler");
const { ValidationError, AuthorizationError, NotFoundError, ConflictError } = require("../utils/errorClasses");
const featureFlags = require("../middleware/featureFlags");

const router = express.Router();

// To add new job
router.post("/jobs", 
  jwtAuth, 
  sanitizeInput(), 
  validateBody(jobSchemas.create), 
  asyncHandler(async (req, res) => {
    const user = req.user;

    if (user.type != "recruiter") {
      throw new AuthorizationError("You don't have permissions to add jobs");
    }

    const data = req.body;

    let job = new Job({
      userId: user._id,
      title: data.title,
      maxApplicants: data.maxApplicants,
      maxPositions: data.maxPositions,
      dateOfPosting: data.dateOfPosting,
      deadline: data.deadline,
      skillsets: data.skillsets,
      jobType: data.jobType,
      duration: data.duration,
      salary: data.salary,
      rating: data.rating,
    });

    await job.save();
    
    // Enhanced response format if feature enabled
    if (featureFlags.isEnabled('ENHANCED_ERROR_HANDLING')) {
      res.json({
        success: true,
        message: "Job added successfully to the database",
        data: { jobId: job._id },
        correlationId: req.correlationId
      });
    } else {
      res.json({ message: "Job added successfully to the database" });
    }
  })
);

// to get all the jobs [pagination] [for recruiter personal and for everyone]
router.get("/jobs", 
  jwtAuth, 
  sanitizeInput(), 
  validateQuery(jobSchemas.query), 
  asyncHandler(async (req, res) => {
    let user = req.user;

    let findParams = {};
    let sortParams = {};

    // const page = parseInt(req.query.page) ? parseInt(req.query.page) : 1;
    // const limit = parseInt(req.query.limit) ? parseInt(req.query.limit) : 10;
    // const skip = page - 1 >= 0 ? (page - 1) * limit : 0;

    // to list down jobs posted by a particular recruiter
    if (user.type === "recruiter" && req.query.myjobs) {
      findParams = {
        ...findParams,
        userId: user._id,
      };
    }

    if (req.query.q) {
      findParams = {
        ...findParams,
        title: {
          $regex: new RegExp(req.query.q, "i"),
        },
      };
    }

    if (req.query.jobType) {
      let jobTypes = [];
      if (Array.isArray(req.query.jobType)) {
        jobTypes = req.query.jobType;
      } else {
        jobTypes = [req.query.jobType];
      }
      console.log(jobTypes);
      findParams = {
        ...findParams,
        jobType: {
          $in: jobTypes,
        },
      };
    }

    if (req.query.salaryMin && req.query.salaryMax) {
      findParams = {
        ...findParams,
        $and: [
          {
            salary: {
              $gte: parseInt(req.query.salaryMin),
            },
          },
          {
            salary: {
              $lte: parseInt(req.query.salaryMax),
            },
          },
        ],
      };
    } else if (req.query.salaryMin) {
      findParams = {
        ...findParams,
        salary: {
          $gte: parseInt(req.query.salaryMin),
        },
      };
    } else if (req.query.salaryMax) {
      findParams = {
        ...findParams,
        salary: {
          $lte: parseInt(req.query.salaryMax),
        },
      };
    }

    if (req.query.duration) {
      findParams = {
        ...findParams,
        duration: {
          $lt: parseInt(req.query.duration),
        },
      };
    }

    if (req.query.asc) {
      if (Array.isArray(req.query.asc)) {
        req.query.asc.map((key) => {
          sortParams = {
            ...sortParams,
            [key]: 1,
          };
        });
      } else {
        sortParams = {
          ...sortParams,
          [req.query.asc]: 1,
        };
      }
    }

    if (req.query.desc) {
      if (Array.isArray(req.query.desc)) {
        req.query.desc.map((key) => {
          sortParams = {
            ...sortParams,
            [key]: -1,
          };
        });
      } else {
        sortParams = {
          ...sortParams,
          [req.query.desc]: -1,
        };
      }
    }

    console.log(findParams);
    console.log(sortParams);

    // Job.find(findParams).collation({ locale: "en" }).sort(sortParams);
    // .skip(skip)
    // .limit(limit)

    let arr = [
      {
        $lookup: {
          from: "recruiterinfos",
          localField: "userId",
          foreignField: "userId",
          as: "recruiter",
        },
      },
      { $unwind: "$recruiter" },
      { $match: findParams },
    ];

    if (Object.keys(sortParams).length > 0) {
      arr = [
        {
          $lookup: {
            from: "recruiterinfos",
            localField: "userId",
            foreignField: "userId",
            as: "recruiter",
          },
        },
        { $unwind: "$recruiter" },
        { $match: findParams },
        {
          $sort: sortParams,
        },
      ];
    }

    console.log(arr);

    const posts = await Job.aggregate(arr);
    
    if (posts == null || posts.length === 0) {
      if (featureFlags.isEnabled('ENHANCED_ERROR_HANDLING')) {
        return res.json({
          success: true,
          data: [],
          message: "No jobs found matching your criteria",
          correlationId: req.correlationId
        });
      } else {
        return res.status(404).json({
          message: "No job found",
        });
      }
    }
    
    // Enhanced response format if feature enabled
    if (featureFlags.isEnabled('ENHANCED_ERROR_HANDLING')) {
      res.json({
        success: true,
        data: posts,
        count: posts.length,
        correlationId: req.correlationId
      });
    } else {
      res.json(posts);
    }
  })
);

// to get info about a particular job
router.get("/jobs/:id", 
  jwtAuth, 
  validateParams(paramSchemas.objectId), 
  asyncHandler(async (req, res) => {
    const job = await Job.findOne({ _id: req.params.id });
    
    if (job == null) {
      throw new NotFoundError("Job does not exist", "job");
    }
    
    // Enhanced response format if feature enabled
    if (featureFlags.isEnabled('ENHANCED_ERROR_HANDLING')) {
      res.json({
        success: true,
        data: job,
        correlationId: req.correlationId
      });
    } else {
      res.json(job);
    }
  })
);

// to update info of a particular job
router.put("/jobs/:id", 
  jwtAuth, 
  sanitizeInput(), 
  validateParams(paramSchemas.objectId), 
  validateBody(jobSchemas.update), 
  asyncHandler(async (req, res) => {
    const user = req.user;
    
    if (user.type != "recruiter") {
      throw new AuthorizationError("You don't have permissions to change the job details");
    }
    
    const job = await Job.findOne({
      _id: req.params.id,
      userId: user.id,
    });
    
    if (job == null) {
      throw new NotFoundError("Job does not exist or you don't have permission to modify it", "job");
    }
    
    const data = req.body;
    if (data.maxApplicants) {
      job.maxApplicants = data.maxApplicants;
    }
    if (data.maxPositions) {
      job.maxPositions = data.maxPositions;
    }
    if (data.deadline) {
      job.deadline = data.deadline;
    }
    
    await job.save();
    
    // Enhanced response format if feature enabled
    if (featureFlags.isEnabled('ENHANCED_ERROR_HANDLING')) {
      res.json({
        success: true,
        message: "Job details updated successfully",
        data: { jobId: job._id },
        correlationId: req.correlationId
      });
    } else {
      res.json({
        message: "Job details updated successfully",
      });
    }
  })
);

// to delete a job
router.delete("/jobs/:id", 
  jwtAuth, 
  validateParams(paramSchemas.objectId), 
  asyncHandler(async (req, res) => {
    const user = req.user;
    
    if (user.type != "recruiter") {
      throw new AuthorizationError("You don't have permissions to delete the job");
    }
    
    const job = await Job.findOneAndDelete({
      _id: req.params.id,
      userId: user.id,
    });
    
    if (job === null) {
      throw new NotFoundError("Job does not exist or you don't have permission to delete it", "job");
    }
    
    // Enhanced response format if feature enabled
    if (featureFlags.isEnabled('ENHANCED_ERROR_HANDLING')) {
      res.json({
        success: true,
        message: "Job deleted successfully",
        data: { jobId: req.params.id },
        correlationId: req.correlationId
      });
    } else {
      res.json({
        message: "Job deleted successfully",
      });
    }
  })
);

// get user's personal details
router.get("/user", jwtAuth, (req, res) => {
  const user = req.user;
  if (user.type === "recruiter") {
    Recruiter.findOne({ userId: user._id })
      .then((recruiter) => {
        if (recruiter == null) {
          res.status(404).json({
            message: "User does not exist",
          });
          return;
        }
        res.json(recruiter);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    JobApplicant.findOne({ userId: user._id })
      .then((jobApplicant) => {
        if (jobApplicant == null) {
          res.status(404).json({
            message: "User does not exist",
          });
          return;
        }
        res.json(jobApplicant);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }
});

// get user details from id
router.get("/user/:id", jwtAuth, (req, res) => {
  User.findOne({ _id: req.params.id })
    .then((userData) => {
      if (userData === null) {
        res.status(404).json({
          message: "User does not exist",
        });
        return;
      }

      if (userData.type === "recruiter") {
        Recruiter.findOne({ userId: userData._id })
          .then((recruiter) => {
            if (recruiter === null) {
              res.status(404).json({
                message: "User does not exist",
              });
              return;
            }
            res.json(recruiter);
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      } else {
        JobApplicant.findOne({ userId: userData._id })
          .then((jobApplicant) => {
            if (jobApplicant === null) {
              res.status(404).json({
                message: "User does not exist",
              });
              return;
            }
            res.json(jobApplicant);
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      }
    })
    .catch((err) => {
      res.status(400).json(err);
    });
});

// update user details
router.put("/user", jwtAuth, (req, res) => {
  const user = req.user;
  const data = req.body;
  if (user.type == "recruiter") {
    Recruiter.findOne({ userId: user._id })
      .then((recruiter) => {
        if (recruiter == null) {
          res.status(404).json({
            message: "User does not exist",
          });
          return;
        }
        if (data.name) {
          recruiter.name = data.name;
        }
        if (data.contactNumber) {
          recruiter.contactNumber = data.contactNumber;
        }
        if (data.bio) {
          recruiter.bio = data.bio;
        }
        recruiter
          .save()
          .then(() => {
            res.json({
              message: "User information updated successfully",
            });
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    JobApplicant.findOne({ userId: user._id })
      .then((jobApplicant) => {
        if (jobApplicant == null) {
          res.status(404).json({
            message: "User does not exist",
          });
          return;
        }
        if (data.name) {
          jobApplicant.name = data.name;
        }
        if (data.education) {
          jobApplicant.education = data.education;
        }
        if (data.skills) {
          jobApplicant.skills = data.skills;
        }
        if (data.resume) {
          jobApplicant.resume = data.resume;
        }
        if (data.profile) {
          jobApplicant.profile = data.profile;
        }
        console.log(jobApplicant);
        jobApplicant
          .save()
          .then(() => {
            res.json({
              message: "User information updated successfully",
            });
          })
          .catch((err) => {
            res.status(400).json(err);
          });
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }
});

// apply for a job [todo: test: done]
router.post("/jobs/:id/applications", 
  jwtAuth, 
  sanitizeInput(), 
  validateParams(paramSchemas.objectId), 
  validateBody({ sop: require('joi').string().min(50).max(1000).trim().required() }), 
  asyncHandler(async (req, res) => {
    const user = req.user;
    
    if (user.type != "applicant") {
      throw new AuthorizationError("You don't have permissions to apply for a job");
    }
    
    const data = req.body;
    const jobId = req.params.id;

    // Check whether applied previously
    const appliedApplication = await Application.findOne({
      userId: user._id,
      jobId: jobId,
      status: {
        $nin: ["deleted", "accepted", "cancelled"],
      },
    });
    
    if (appliedApplication !== null) {
      throw new ConflictError("You have already applied for this job", "duplicate_application");
    }

    // Find job
    const job = await Job.findOne({ _id: jobId });
    if (job === null) {
      throw new NotFoundError("Job does not exist", "job");
    }
    
    // Check count of active applications < limit
    const activeApplicationCount = await Application.countDocuments({
      jobId: jobId,
      status: {
        $nin: ["rejected", "deleted", "cancelled", "finished"],
      },
    });
    
    if (activeApplicationCount >= job.maxApplicants) {
      throw new ConflictError("Application limit reached for this job", "max_applicants_reached");
    }
    
    // Check user has < 10 active applications
    const myActiveApplicationCount = await Application.countDocuments({
      userId: user._id,
      status: {
        $nin: ["rejected", "deleted", "cancelled", "finished"],
      },
    });
    
    if (myActiveApplicationCount >= 10) {
      throw new ConflictError("You have 10 active applications. Hence you cannot apply.", "max_user_applications");
    }
    
    // Check if user is not having any accepted jobs
    const acceptedJobs = await Application.countDocuments({
      userId: user._id,
      status: "accepted",
    });
    
    if (acceptedJobs > 0) {
      throw new ConflictError("You already have an accepted job. Hence you cannot apply.", "already_accepted");
    }
    
    // Create and save application
    const application = new Application({
      userId: user._id,
      recruiterId: job.userId,
      jobId: job._id,
      status: "applied",
      sop: data.sop,
    });
    
    await application.save();
    
    // Enhanced response format if feature enabled
    if (featureFlags.isEnabled('ENHANCED_ERROR_HANDLING')) {
      res.json({
        success: true,
        message: "Job application successful",
        data: { applicationId: application._id },
        correlationId: req.correlationId
      });
    } else {
      res.json({
        message: "Job application successful",
      });
    }
  })
);

// recruiter gets applications for a particular job [pagination] [todo: test: done]
router.get("/jobs/:id/applications", 
  jwtAuth, 
  validateParams(paramSchemas.objectId), 
  validateQuery({ 
    status: require('joi').string().valid('applied', 'shortlisted', 'accepted', 'rejected', 'deleted', 'cancelled', 'finished').optional() 
  }), 
  asyncHandler(async (req, res) => {
    const user = req.user;
    
    if (user.type != "recruiter") {
      throw new AuthorizationError("You don't have permissions to view job applications");
    }
    
    const jobId = req.params.id;

    let findParams = {
      jobId: jobId,
      recruiterId: user._id,
    };

    let sortParams = {};

    if (req.query.status) {
      findParams = {
        ...findParams,
        status: req.query.status,
      };
    }

    const applications = await Application.find(findParams)
      .collation({ locale: "en" })
      .sort(sortParams);
    
    // Enhanced response format if feature enabled
    if (featureFlags.isEnabled('ENHANCED_ERROR_HANDLING')) {
      res.json({
        success: true,
        data: applications,
        count: applications.length,
        correlationId: req.correlationId
      });
    } else {
      res.json(applications);
    }
  })
);

// recruiter/applicant gets all his applications [pagination]
router.get("/applications", 
  jwtAuth, 
  asyncHandler(async (req, res) => {
    const user = req.user;

    const applications = await Application.aggregate([
      {
        $lookup: {
          from: "jobapplicantinfos",
          localField: "userId",
          foreignField: "userId",
          as: "jobApplicant",
        },
      },
      { $unwind: "$jobApplicant" },
      {
        $lookup: {
          from: "jobs",
          localField: "jobId",
          foreignField: "_id",
          as: "job",
        },
      },
      { $unwind: "$job" },
      {
        $lookup: {
          from: "recruiterinfos",
          localField: "recruiterId",
          foreignField: "userId",
          as: "recruiter",
        },
      },
      { $unwind: "$recruiter" },
      {
        $match: {
          [user.type === "recruiter" ? "recruiterId" : "userId"]: user._id,
        },
      },
      {
        $sort: {
          dateOfApplication: -1,
        },
      },
    ]);
    
    // Enhanced response format if feature enabled
    if (featureFlags.isEnabled('ENHANCED_ERROR_HANDLING')) {
      res.json({
        success: true,
        data: applications,
        count: applications.length,
        correlationId: req.correlationId
      });
    } else {
      res.json(applications);
    }
  })
);

// update status of application: [Applicant: Can cancel, Recruiter: Can do everything] [todo: test: done]
router.put("/applications/:id", 
  jwtAuth, 
  validateParams(paramSchemas.objectId), 
  validateBody({ 
    status: require('joi').string().valid('applied', 'shortlisted', 'accepted', 'rejected', 'deleted', 'cancelled', 'finished').required(),
    dateOfJoining: require('joi').date().optional()
  }), 
  asyncHandler(async (req, res) => {
    const user = req.user;
    const id = req.params.id;
    const status = req.body.status;

    // "applied", // when a applicant is applied
    // "shortlisted", // when a applicant is shortlisted
    // "accepted", // when a applicant is accepted
    // "rejected", // when a applicant is rejected
    // "deleted", // when any job is deleted
    // "cancelled", // an application is cancelled by its author or when other application is accepted
    // "finished", // when job is over

    if (user.type === "recruiter") {
      if (status === "accepted") {
        // get job id from application
        // get job info for maxPositions count
        // count applications that are already accepted
        // compare and if condition is satisfied, then save

        const application = await Application.findOne({
          _id: id,
          recruiterId: user._id,
        });
        
        if (application === null) {
          throw new NotFoundError("Application not found", "application");
        }

        const job = await Job.findOne({
          _id: application.jobId,
          userId: user._id,
        });
        
        if (job === null) {
          throw new NotFoundError("Job does not exist", "job");
        }

        const activeApplicationCount = await Application.countDocuments({
          recruiterId: user._id,
          jobId: job._id,
          status: "accepted",
        });
        
        if (activeApplicationCount >= job.maxPositions) {
          throw new ConflictError("All positions for this job are already filled", "max_positions_reached");
        }
        
        // accepted
        application.status = status;
        application.dateOfJoining = req.body.dateOfJoining;
        await application.save();
        
        await Application.updateMany(
          {
            _id: {
              $ne: application._id,
            },
            userId: application.userId,
            status: {
              $nin: [
                "rejected",
                "deleted",
                "cancelled",
                "accepted",
                "finished",
              ],
            },
          },
          {
            $set: {
              status: "cancelled",
            },
          },
          { multi: true }
        );
        
        await Job.findOneAndUpdate(
          {
            _id: job._id,
            userId: user._id,
          },
          {
            $set: {
              acceptedCandidates: activeApplicationCount + 1,
            },
          }
        );
        
        // Enhanced response format if feature enabled
        if (featureFlags.isEnabled('ENHANCED_ERROR_HANDLING')) {
          res.json({
            success: true,
            message: `Application ${status} successfully`,
            data: { applicationId: application._id, status: status },
            correlationId: req.correlationId
          });
        } else {
          res.json({
            message: `Application ${status} successfully`,
          });
        }
      } else {
        const application = await Application.findOneAndUpdate(
          {
            _id: id,
            recruiterId: user._id,
            status: {
              $nin: ["rejected", "deleted", "cancelled"],
            },
          },
          {
            $set: {
              status: status,
            },
          }
        );
        
        if (application === null) {
          throw new ConflictError("Application status cannot be updated", "invalid_status_transition");
        }
        
        // Enhanced response format if feature enabled
        if (featureFlags.isEnabled('ENHANCED_ERROR_HANDLING')) {
          const message = status === "finished" ? `Job ${status} successfully` : `Application ${status} successfully`;
          res.json({
            success: true,
            message: message,
            data: { applicationId: id, status: status },
            correlationId: req.correlationId
          });
        } else {
          if (status === "finished") {
            res.json({
              message: `Job ${status} successfully`,
            });
          } else {
            res.json({
              message: `Application ${status} successfully`,
            });
          }
        }
      }
    } else {
      if (status === "cancelled") {
        const application = await Application.findOneAndUpdate(
          {
            _id: id,
            userId: user._id,
          },
          {
            $set: {
              status: status,
            },
          }
        );
        
        if (application === null) {
          throw new NotFoundError("Application not found", "application");
        }
        
        // Enhanced response format if feature enabled
        if (featureFlags.isEnabled('ENHANCED_ERROR_HANDLING')) {
          res.json({
            success: true,
            message: `Application ${status} successfully`,
            data: { applicationId: id, status: status },
            correlationId: req.correlationId
          });
        } else {
          res.json({
            message: `Application ${status} successfully`,
          });
        }
      } else {
        throw new AuthorizationError("You don't have permissions to update job status");
      }
    }
  })
);

// get a list of final applicants for current job : recruiter
// get a list of final applicants for all his jobs : recuiter
router.get("/applicants", jwtAuth, (req, res) => {
  const user = req.user;
  if (user.type === "recruiter") {
    let findParams = {
      recruiterId: user._id,
    };
    if (req.query.jobId) {
      findParams = {
        ...findParams,
        jobId: new mongoose.Types.ObjectId(req.query.jobId),
      };
    }
    if (req.query.status) {
      if (Array.isArray(req.query.status)) {
        findParams = {
          ...findParams,
          status: { $in: req.query.status },
        };
      } else {
        findParams = {
          ...findParams,
          status: req.query.status,
        };
      }
    }
    let sortParams = {};

    if (!req.query.asc && !req.query.desc) {
      sortParams = { _id: 1 };
    }

    if (req.query.asc) {
      if (Array.isArray(req.query.asc)) {
        req.query.asc.map((key) => {
          sortParams = {
            ...sortParams,
            [key]: 1,
          };
        });
      } else {
        sortParams = {
          ...sortParams,
          [req.query.asc]: 1,
        };
      }
    }

    if (req.query.desc) {
      if (Array.isArray(req.query.desc)) {
        req.query.desc.map((key) => {
          sortParams = {
            ...sortParams,
            [key]: -1,
          };
        });
      } else {
        sortParams = {
          ...sortParams,
          [req.query.desc]: -1,
        };
      }
    }

    Application.aggregate([
      {
        $lookup: {
          from: "jobapplicantinfos",
          localField: "userId",
          foreignField: "userId",
          as: "jobApplicant",
        },
      },
      { $unwind: "$jobApplicant" },
      {
        $lookup: {
          from: "jobs",
          localField: "jobId",
          foreignField: "_id",
          as: "job",
        },
      },
      { $unwind: "$job" },
      { $match: findParams },
      { $sort: sortParams },
    ])
      .then((applications) => {
        if (applications.length === 0) {
          res.status(404).json({
            message: "No applicants found",
          });
          return;
        }
        res.json(applications);
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    res.status(400).json({
      message: "You are not allowed to access applicants list",
    });
  }
});

// to add or update a rating [todo: test]
router.put("/rating", jwtAuth, (req, res) => {
  const user = req.user;
  const data = req.body;
  if (user.type === "recruiter") {
    // can rate applicant
    Rating.findOne({
      senderId: user._id,
      receiverId: data.applicantId,
      category: "applicant",
    })
      .then((rating) => {
        if (rating === null) {
          console.log("new rating");
          Application.countDocuments({
            userId: data.applicantId,
            recruiterId: user._id,
            status: {
              $in: ["accepted", "finished"],
            },
          })
            .then((acceptedApplicant) => {
              if (acceptedApplicant > 0) {
                // add a new rating

                rating = new Rating({
                  category: "applicant",
                  receiverId: data.applicantId,
                  senderId: user._id,
                  rating: data.rating,
                });

                rating
                  .save()
                  .then(() => {
                    // get the average of ratings
                    Rating.aggregate([
                      {
                        $match: {
                          receiverId: mongoose.Types.ObjectId(data.applicantId),
                          category: "applicant",
                        },
                      },
                      {
                        $group: {
                          _id: {},
                          average: { $avg: "$rating" },
                        },
                      },
                    ])
                      .then((result) => {
                        // update the user's rating
                        if (result === null) {
                          res.status(400).json({
                            message: "Error while calculating rating",
                          });
                          return;
                        }
                        const avg = result[0].average;

                        JobApplicant.findOneAndUpdate(
                          {
                            userId: data.applicantId,
                          },
                          {
                            $set: {
                              rating: avg,
                            },
                          }
                        )
                          .then((applicant) => {
                            if (applicant === null) {
                              res.status(400).json({
                                message:
                                  "Error while updating applicant's average rating",
                              });
                              return;
                            }
                            res.json({
                              message: "Rating added successfully",
                            });
                          })
                          .catch((err) => {
                            res.status(400).json(err);
                          });
                      })
                      .catch((err) => {
                        res.status(400).json(err);
                      });
                  })
                  .catch((err) => {
                    res.status(400).json(err);
                  });
              } else {
                // you cannot rate
                res.status(400).json({
                  message:
                    "Applicant didn't worked under you. Hence you cannot give a rating.",
                });
              }
            })
            .catch((err) => {
              res.status(400).json(err);
            });
        } else {
          rating.rating = data.rating;
          rating
            .save()
            .then(() => {
              // get the average of ratings
              Rating.aggregate([
                {
                  $match: {
                    receiverId: mongoose.Types.ObjectId(data.applicantId),
                    category: "applicant",
                  },
                },
                {
                  $group: {
                    _id: {},
                    average: { $avg: "$rating" },
                  },
                },
              ])
                .then((result) => {
                  // update the user's rating
                  if (result === null) {
                    res.status(400).json({
                      message: "Error while calculating rating",
                    });
                    return;
                  }
                  const avg = result[0].average;
                  JobApplicant.findOneAndUpdate(
                    {
                      userId: data.applicantId,
                    },
                    {
                      $set: {
                        rating: avg,
                      },
                    }
                  )
                    .then((applicant) => {
                      if (applicant === null) {
                        res.status(400).json({
                          message:
                            "Error while updating applicant's average rating",
                        });
                        return;
                      }
                      res.json({
                        message: "Rating updated successfully",
                      });
                    })
                    .catch((err) => {
                      res.status(400).json(err);
                    });
                })
                .catch((err) => {
                  res.status(400).json(err);
                });
            })
            .catch((err) => {
              res.status(400).json(err);
            });
        }
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  } else {
    // applicant can rate job
    Rating.findOne({
      senderId: user._id,
      receiverId: data.jobId,
      category: "job",
    })
      .then((rating) => {
        console.log(user._id);
        console.log(data.jobId);
        console.log(rating);
        if (rating === null) {
          console.log(rating);
          Application.countDocuments({
            userId: user._id,
            jobId: data.jobId,
            status: {
              $in: ["accepted", "finished"],
            },
          })
            .then((acceptedApplicant) => {
              if (acceptedApplicant > 0) {
                // add a new rating

                rating = new Rating({
                  category: "job",
                  receiverId: data.jobId,
                  senderId: user._id,
                  rating: data.rating,
                });

                rating
                  .save()
                  .then(() => {
                    // get the average of ratings
                    Rating.aggregate([
                      {
                        $match: {
                          receiverId: mongoose.Types.ObjectId(data.jobId),
                          category: "job",
                        },
                      },
                      {
                        $group: {
                          _id: {},
                          average: { $avg: "$rating" },
                        },
                      },
                    ])
                      .then((result) => {
                        if (result === null) {
                          res.status(400).json({
                            message: "Error while calculating rating",
                          });
                          return;
                        }
                        const avg = result[0].average;
                        Job.findOneAndUpdate(
                          {
                            _id: data.jobId,
                          },
                          {
                            $set: {
                              rating: avg,
                            },
                          }
                        )
                          .then((foundJob) => {
                            if (foundJob === null) {
                              res.status(400).json({
                                message:
                                  "Error while updating job's average rating",
                              });
                              return;
                            }
                            res.json({
                              message: "Rating added successfully",
                            });
                          })
                          .catch((err) => {
                            res.status(400).json(err);
                          });
                      })
                      .catch((err) => {
                        res.status(400).json(err);
                      });
                  })
                  .catch((err) => {
                    res.status(400).json(err);
                  });
              } else {
                // you cannot rate
                res.status(400).json({
                  message:
                    "You haven't worked for this job. Hence you cannot give a rating.",
                });
              }
            })
            .catch((err) => {
              res.status(400).json(err);
            });
        } else {
          // update the rating
          rating.rating = data.rating;
          rating
            .save()
            .then(() => {
              // get the average of ratings
              Rating.aggregate([
                {
                  $match: {
                    receiverId: mongoose.Types.ObjectId(data.jobId),
                    category: "job",
                  },
                },
                {
                  $group: {
                    _id: {},
                    average: { $avg: "$rating" },
                  },
                },
              ])
                .then((result) => {
                  if (result === null) {
                    res.status(400).json({
                      message: "Error while calculating rating",
                    });
                    return;
                  }
                  const avg = result[0].average;
                  console.log(avg);

                  Job.findOneAndUpdate(
                    {
                      _id: data.jobId,
                    },
                    {
                      $set: {
                        rating: avg,
                      },
                    }
                  )
                    .then((foundJob) => {
                      if (foundJob === null) {
                        res.status(400).json({
                          message: "Error while updating job's average rating",
                        });
                        return;
                      }
                      res.json({
                        message: "Rating added successfully",
                      });
                    })
                    .catch((err) => {
                      res.status(400).json(err);
                    });
                })
                .catch((err) => {
                  res.status(400).json(err);
                });
            })
            .catch((err) => {
              res.status(400).json(err);
            });
        }
      })
      .catch((err) => {
        res.status(400).json(err);
      });
  }
});

// get personal rating
router.get("/rating", jwtAuth, (req, res) => {
  const user = req.user;
  Rating.findOne({
    senderId: user._id,
    receiverId: req.query.id,
    category: user.type === "recruiter" ? "applicant" : "job",
  }).then((rating) => {
    if (rating === null) {
      res.json({
        rating: -1,
      });
      return;
    }
    res.json({
      rating: rating.rating,
    });
  });
});

// Application.findOne({
//   _id: id,
//   userId: user._id,
// })
//   .then((application) => {
//     application.status = status;
//     application
//       .save()
//       .then(() => {
//         res.json({
//           message: `Application ${status} successfully`,
//         });
//       })
//       .catch((err) => {
//         res.status(400).json(err);
//       });
//   })
//   .catch((err) => {
//     res.status(400).json(err);
//   });

// router.get("/jobs", (req, res, next) => {
//   passport.authenticate("jwt", { session: false }, function (err, user, info) {
//     if (err) {
//       return next(err);
//     }
//     if (!user) {
//       res.status(401).json(info);
//       return;
//     }
//   })(req, res, next);
// });

module.exports = router;
