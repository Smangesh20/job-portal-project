# Ask Ya Cham - API Documentation

## 📋 Overview

The Ask Ya Cham API is a RESTful API built with Node.js, Express, and TypeScript. It provides comprehensive endpoints for job matching, user management, real-time communication, and AI-powered features.

**Base URL**: `https://api.askyacham.com`  
**Version**: v1  
**Authentication**: Bearer Token (JWT)

## 🔐 Authentication

### Authentication Flow

1. **Register/Login** → Receive access token and refresh token
2. **Include token** in Authorization header for protected routes
3. **Refresh token** when access token expires

### Headers

```http
Authorization: Bearer <access_token>
Content-Type: application/json
X-Request-ID: <unique_request_id>
```

### Token Structure

```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expiresIn": "15m"
}
```

## 📚 API Endpoints

### Authentication Endpoints

#### POST `/api/auth/register`
Register a new user account.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "confirmPassword": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe",
  "role": "CANDIDATE",
  "agreeToTerms": true,
  "agreeToPrivacy": true
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "CANDIDATE",
      "isVerified": false
    },
    "tokens": {
      "accessToken": "jwt_token",
      "refreshToken": "refresh_token",
      "expiresIn": "15m"
    }
  },
  "message": "Registration successful"
}
```

#### POST `/api/auth/login`
Authenticate user and return tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": "uuid",
      "email": "user@example.com",
      "firstName": "John",
      "lastName": "Doe",
      "role": "CANDIDATE",
      "isVerified": true
    },
    "tokens": {
      "accessToken": "jwt_token",
      "refreshToken": "refresh_token",
      "expiresIn": "15m"
    }
  },
  "message": "Login successful"
}
```

#### POST `/api/auth/logout`
Logout user and invalidate session.

**Headers:** Authorization required

**Response:**
```json
{
  "success": true,
  "message": "Logout successful"
}
```

#### POST `/api/auth/refresh`
Refresh access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "refresh_token"
}
```

#### POST `/api/auth/forgot-password`
Send password reset email.

**Request Body:**
```json
{
  "email": "user@example.com"
}
```

#### POST `/api/auth/reset-password`
Reset password using reset token.

**Request Body:**
```json
{
  "token": "reset_token",
  "newPassword": "NewSecurePass123!",
  "confirmPassword": "NewSecurePass123!"
}
```

### User Management Endpoints

#### GET `/api/users/:id`
Get user profile by ID.

**Headers:** Authorization required

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe",
    "role": "CANDIDATE",
    "profile": {
      "bio": "Experienced software engineer...",
      "location": {
        "city": "San Francisco",
        "state": "CA",
        "country": "USA"
      },
      "skills": ["JavaScript", "React", "Node.js"],
      "experience": [
        {
          "title": "Senior Software Engineer",
          "company": "Tech Corp",
          "startDate": "2020-01-01",
          "endDate": "2023-12-31",
          "current": false
        }
      ]
    }
  }
}
```

#### PUT `/api/users/:id`
Update user profile.

**Headers:** Authorization required

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "bio": "Updated bio...",
  "skills": ["JavaScript", "React", "Node.js", "TypeScript"],
  "preferences": {
    "notifications": true,
    "jobAlerts": true,
    "salaryRange": {
      "min": 80000,
      "max": 120000
    }
  }
}
```

#### POST `/api/users/:id/avatar`
Upload user avatar.

**Headers:** Authorization required, Content-Type: multipart/form-data

**Request Body:** Form data with file

### Job Management Endpoints

#### GET `/api/jobs`
Get list of jobs with filtering and pagination.

**Query Parameters:**
- `query` (string): Search query
- `location` (string): Location filter
- `jobType` (enum): FULL_TIME, PART_TIME, CONTRACT, INTERNSHIP, TEMPORARY
- `experienceLevel` (enum): ENTRY, MID, SENIOR, EXECUTIVE
- `salaryMin` (number): Minimum salary
- `salaryMax` (number): Maximum salary
- `remote` (boolean): Remote work filter
- `skills` (array): Required skills
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20)

**Response:**
```json
{
  "success": true,
  "data": {
    "jobs": [
      {
        "id": "uuid",
        "title": "Senior Software Engineer",
        "company": "Tech Corp",
        "location": {
          "city": "San Francisco",
          "state": "CA",
          "country": "USA",
          "remote": true
        },
        "salary": {
          "min": 120000,
          "max": 180000,
          "currency": "USD",
          "period": "YEARLY"
        },
        "jobType": "FULL_TIME",
        "experienceLevel": "SENIOR",
        "requiredSkills": ["JavaScript", "React", "Node.js"],
        "description": "We are looking for...",
        "postedAt": "2024-01-15T10:00:00Z",
        "matchScore": 95
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 150,
      "totalPages": 8
    }
  }
}
```

#### GET `/api/jobs/:id`
Get specific job details.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "uuid",
    "title": "Senior Software Engineer",
    "company": "Tech Corp",
    "description": "Detailed job description...",
    "requirements": ["5+ years experience", "Strong communication skills"],
    "benefits": ["Health insurance", "401k", "Flexible hours"],
    "applicationDeadline": "2024-02-15T23:59:59Z",
    "employer": {
      "id": "uuid",
      "name": "Tech Corp",
      "logo": "https://example.com/logo.png",
      "description": "Leading technology company..."
    }
  }
}
```

#### POST `/api/jobs`
Create a new job posting.

**Headers:** Authorization required (EMPLOYER role)

**Request Body:**
```json
{
  "title": "Senior Software Engineer",
  "description": "We are looking for...",
  "company": "Tech Corp",
  "location": {
    "city": "San Francisco",
    "state": "CA",
    "country": "USA",
    "remote": true
  },
  "salary": {
    "min": 120000,
    "max": 180000,
    "currency": "USD",
    "period": "YEARLY"
  },
  "jobType": "FULL_TIME",
  "experienceLevel": "SENIOR",
  "requiredSkills": ["JavaScript", "React", "Node.js"],
  "benefits": ["Health insurance", "401k"],
  "requirements": ["5+ years experience"],
  "responsibilities": ["Develop web applications", "Code reviews"]
}
```

#### PUT `/api/jobs/:id`
Update existing job posting.

**Headers:** Authorization required (EMPLOYER role)

#### DELETE `/api/jobs/:id`
Delete job posting.

**Headers:** Authorization required (EMPLOYER role)

#### POST `/api/jobs/search`
Advanced job search with AI matching.

**Request Body:**
```json
{
  "query": "software engineer",
  "location": "San Francisco",
  "skills": ["JavaScript", "React"],
  "experienceLevel": "SENIOR",
  "salaryRange": {
    "min": 100000,
    "max": 150000
  },
  "preferences": {
    "remoteWork": true,
    "companySize": "STARTUP",
    "culture": ["INNOVATIVE", "COLLABORATIVE"]
  }
}
```

### Application Endpoints

#### GET `/api/applications`
Get user's job applications.

**Headers:** Authorization required

**Query Parameters:**
- `status` (enum): PENDING, REVIEWED, INTERVIEW, ACCEPTED, REJECTED
- `page` (number): Page number
- `limit` (number): Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "applications": [
      {
        "id": "uuid",
        "job": {
          "id": "uuid",
          "title": "Senior Software Engineer",
          "company": "Tech Corp"
        },
        "status": "PENDING",
        "appliedAt": "2024-01-15T10:00:00Z",
        "coverLetter": "I am excited to apply...",
        "matchScore": 95
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 25,
      "totalPages": 2
    }
  }
}
```

#### POST `/api/applications`
Submit job application.

**Headers:** Authorization required

**Request Body:**
```json
{
  "jobId": "uuid",
  "coverLetter": "I am excited to apply for this position...",
  "resumeUrl": "https://example.com/resume.pdf",
  "portfolioUrl": "https://portfolio.example.com",
  "linkedinUrl": "https://linkedin.com/in/johndoe",
  "expectedSalary": 130000,
  "availabilityDate": "2024-02-01",
  "noticePeriod": 30,
  "references": [
    {
      "name": "Jane Smith",
      "title": "Engineering Manager",
      "company": "Previous Corp",
      "email": "jane@example.com",
      "phone": "+1234567890"
    }
  ],
  "agreeToTerms": true
}
```

#### PUT `/api/applications/:id`
Update application details.

**Headers:** Authorization required

#### POST `/api/applications/:id/withdraw`
Withdraw application.

**Headers:** Authorization required

### Matching Endpoints

#### GET `/api/matching/matches`
Get job matches for user.

**Headers:** Authorization required

**Query Parameters:**
- `jobId` (string): Filter by specific job
- `limit` (number): Number of matches to return

**Response:**
```json
{
  "success": true,
  "data": {
    "matches": [
      {
        "id": "uuid",
        "job": {
          "id": "uuid",
          "title": "Senior Software Engineer",
          "company": "Tech Corp"
        },
        "matchScore": 95,
        "reasons": [
          "Skills alignment: 98%",
          "Experience match: 92%",
          "Cultural fit: 95%"
        ],
        "createdAt": "2024-01-15T10:00:00Z"
      }
    ]
  }
}
```

#### GET `/api/matching/preferences`
Get user's matching preferences.

**Headers:** Authorization required

#### PUT `/api/matching/preferences`
Update matching preferences.

**Headers:** Authorization required

**Request Body:**
```json
{
  "skills": ["JavaScript", "React", "Node.js"],
  "experienceLevel": "SENIOR",
  "salaryRange": {
    "min": 100000,
    "max": 150000
  },
  "location": {
    "city": "San Francisco",
    "state": "CA",
    "country": "USA"
  },
  "remoteWork": true,
  "jobTypes": ["FULL_TIME", "CONTRACT"],
  "companySize": "STARTUP",
  "culture": ["INNOVATIVE", "COLLABORATIVE"]
}
```

### Chat Endpoints

#### GET `/api/chat/conversations`
Get user's conversations.

**Headers:** Authorization required

**Response:**
```json
{
  "success": true,
  "data": {
    "conversations": [
      {
        "id": "uuid",
        "participants": [
          {
            "id": "uuid",
            "name": "John Doe",
            "avatar": "https://example.com/avatar.jpg"
          },
          {
            "id": "uuid",
            "name": "Jane Smith",
            "avatar": "https://example.com/avatar2.jpg"
          }
        ],
        "lastMessage": {
          "content": "Thank you for the interview!",
          "timestamp": "2024-01-15T10:00:00Z",
          "senderId": "uuid"
        },
        "unreadCount": 2,
        "job": {
          "id": "uuid",
          "title": "Senior Software Engineer",
          "company": "Tech Corp"
        }
      }
    ]
  }
}
```

#### POST `/api/chat/conversations`
Create new conversation.

**Headers:** Authorization required

**Request Body:**
```json
{
  "participantId": "uuid",
  "jobId": "uuid",
  "initialMessage": "Hello, I'm interested in this position."
}
```

#### GET `/api/chat/conversations/:id/messages`
Get conversation messages.

**Headers:** Authorization required

**Query Parameters:**
- `page` (number): Page number
- `limit` (number): Messages per page

#### POST `/api/chat/conversations/:id/messages`
Send message in conversation.

**Headers:** Authorization required

**Request Body:**
```json
{
  "message": "Thank you for considering my application!",
  "messageType": "TEXT"
}
```

#### POST `/api/chat/conversations/:id/read`
Mark conversation as read.

**Headers:** Authorization required

### Notification Endpoints

#### GET `/api/notifications`
Get user notifications.

**Headers:** Authorization required

**Query Parameters:**
- `type` (enum): JOB_MATCH, APPLICATION_UPDATE, INTERVIEW_INVITATION, MESSAGE
- `read` (boolean): Filter by read status
- `page` (number): Page number
- `limit` (number): Items per page

**Response:**
```json
{
  "success": true,
  "data": {
    "notifications": [
      {
        "id": "uuid",
        "type": "JOB_MATCH",
        "title": "New Job Match",
        "message": "We found a great match for you: Senior Software Engineer at Tech Corp",
        "data": {
          "jobId": "uuid",
          "matchScore": 95
        },
        "read": false,
        "createdAt": "2024-01-15T10:00:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "limit": 20,
      "total": 15,
      "totalPages": 1
    }
  }
}
```

#### POST `/api/notifications/:id/read`
Mark notification as read.

**Headers:** Authorization required

#### POST `/api/notifications/read-all`
Mark all notifications as read.

**Headers:** Authorization required

#### PUT `/api/notifications/preferences`
Update notification preferences.

**Headers:** Authorization required

**Request Body:**
```json
{
  "emailNotifications": true,
  "smsNotifications": false,
  "pushNotifications": true,
  "jobAlerts": true,
  "applicationUpdates": true,
  "interviewReminders": true,
  "newMessages": true,
  "marketingEmails": false,
  "weeklyDigest": true,
  "frequency": "DAILY"
}
```

### Analytics Endpoints

#### GET `/api/analytics/dashboard`
Get dashboard analytics data.

**Headers:** Authorization required

**Response:**
```json
{
  "success": true,
  "data": {
    "overview": {
      "totalJobs": 1250,
      "totalApplications": 540,
      "matchRate": 85.5,
      "responseRate": 78.2
    },
    "recentActivity": [
      {
        "type": "APPLICATION_SUBMITTED",
        "description": "Applied for Senior Software Engineer at Tech Corp",
        "timestamp": "2024-01-15T10:00:00Z"
      }
    ],
    "performance": {
      "profileViews": 45,
      "jobViews": 120,
      "applicationViews": 25,
      "interviewInvitations": 8
    }
  }
}
```

#### GET `/api/analytics/jobs/:id`
Get job-specific analytics.

**Headers:** Authorization required

#### GET `/api/analytics/applications`
Get application analytics.

**Headers:** Authorization required

### Admin Endpoints

#### GET `/api/admin/users`
Get all users (admin only).

**Headers:** Authorization required (ADMIN role)

#### GET `/api/admin/jobs`
Get all jobs (admin only).

**Headers:** Authorization required (ADMIN role)

#### POST `/api/admin/jobs/:id/moderate`
Moderate job posting (admin only).

**Headers:** Authorization required (ADMIN role)

**Request Body:**
```json
{
  "action": "APPROVE",
  "reason": "Job posting meets all requirements",
  "notes": "Additional notes for moderation"
}
```

#### GET `/api/admin/analytics`
Get platform analytics (admin only).

**Headers:** Authorization required (ADMIN role)

#### GET `/api/admin/health`
Get system health status (admin only).

**Headers:** Authorization required (ADMIN role)

## 📊 Response Format

### Success Response
```json
{
  "success": true,
  "data": { ... },
  "message": "Operation successful",
  "meta": {
    "timestamp": "2024-01-15T10:00:00Z",
    "requestId": "uuid"
  }
}
```

### Error Response
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  },
  "meta": {
    "timestamp": "2024-01-15T10:00:00Z",
    "requestId": "uuid"
  }
}
```

## 🚨 Error Codes

| Code | HTTP Status | Description |
|------|-------------|-------------|
| `VALIDATION_ERROR` | 400 | Invalid request data |
| `AUTHENTICATION_ERROR` | 401 | Invalid or missing authentication |
| `AUTHORIZATION_ERROR` | 403 | Insufficient permissions |
| `NOT_FOUND` | 404 | Resource not found |
| `CONFLICT_ERROR` | 409 | Resource already exists |
| `RATE_LIMIT_EXCEEDED` | 429 | Too many requests |
| `INTERNAL_ERROR` | 500 | Internal server error |
| `SERVICE_UNAVAILABLE` | 503 | Service temporarily unavailable |

## 🔄 Rate Limiting

- **Authentication endpoints**: 5 requests per 15 minutes per IP
- **General API**: 100 requests per 15 minutes per user
- **File uploads**: 10 requests per hour per user
- **Search endpoints**: 50 requests per 15 minutes per user

## 📱 WebSocket Events

### Connection
```javascript
const socket = io('wss://api.askyacham.com', {
  auth: {
    token: 'your_access_token'
  }
});
```

### Events

#### `notification`
New notification received.
```json
{
  "type": "JOB_MATCH",
  "title": "New Job Match",
  "message": "We found a great match for you!",
  "data": { "jobId": "uuid", "matchScore": 95 }
}
```

#### `job_match`
New job match found.
```json
{
  "jobId": "uuid",
  "jobTitle": "Senior Software Engineer",
  "companyName": "Tech Corp",
  "matchScore": 95
}
```

#### `application_update`
Application status updated.
```json
{
  "applicationId": "uuid",
  "status": "INTERVIEW",
  "message": "You've been selected for an interview!"
}
```

#### `message_received`
New message in conversation.
```json
{
  "conversationId": "uuid",
  "message": {
    "id": "uuid",
    "content": "Hello!",
    "senderId": "uuid",
    "timestamp": "2024-01-15T10:00:00Z"
  }
}
```

## 🔧 SDK Examples

### JavaScript/TypeScript
```javascript
import { AskYaChamAPI } from '@ask-ya-cham/sdk';

const api = new AskYaChamAPI({
  baseURL: 'https://api.askyacham.com',
  apiKey: 'your_api_key'
});

// Login
const { user, tokens } = await api.auth.login({
  email: 'user@example.com',
  password: 'password'
});

// Search jobs
const jobs = await api.jobs.search({
  query: 'software engineer',
  location: 'San Francisco',
  skills: ['JavaScript', 'React']
});

// Submit application
await api.applications.create({
  jobId: 'job_uuid',
  coverLetter: 'I am excited to apply...'
});
```

### Python
```python
from askyacham import AskYaChamAPI

api = AskYaChamAPI(
    base_url='https://api.askyacham.com',
    api_key='your_api_key'
)

# Login
user, tokens = api.auth.login(
    email='user@example.com',
    password='password'
)

# Search jobs
jobs = api.jobs.search(
    query='software engineer',
    location='San Francisco',
    skills=['JavaScript', 'React']
)
```

## 📝 Changelog

### Version 1.0.0 (2024-01-15)
- Initial API release
- Authentication and user management
- Job posting and search
- Application management
- Real-time chat
- AI-powered matching
- Analytics and reporting

## 🤝 Support

- **API Documentation**: https://docs.askyacham.com
- **Support Email**: api-support@askyacham.com
- **Status Page**: https://status.askyacham.com
- **GitHub**: https://github.com/ask-ya-cham/api

---

**Last Updated**: January 15, 2024  
**API Version**: 1.0.0
