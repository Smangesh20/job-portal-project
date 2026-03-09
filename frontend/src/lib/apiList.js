export const server = "http://localhost:4444";

const apiList = {
  login: `${server}/auth/login`,
  signup: `${server}/auth/signup`,
  otpRequest: `${server}/auth/otp/request`,
  otpVerify: `${server}/auth/otp/verify`,
  uploadResume: `${server}/upload/resume`,
  uploadProfileImage: `${server}/upload/profile`,
  jobs: `${server}/api/jobs`,
  applications: `${server}/api/applications`,
  rating: `${server}/api/rating`,
  user: `${server}/api/user`,
  applicants: `${server}/api/applicants`,
  learningCatalog: `${server}/api/learning/catalog`,
  learningSteps: `${server}/api/learning/steps`,
  learningStep: `${server}/api/learning/step`,
  learningCheckAnswer: `${server}/api/learning/check-answer`,
  learningProgress: `${server}/api/learning/progress`,
  learningFollowup: `${server}/api/learning/followup`,
};

export default apiList;
