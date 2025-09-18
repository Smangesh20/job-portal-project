-- Initial database schema migration
-- This migration creates all the necessary tables for the Ask Ya Cham platform

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";
CREATE EXTENSION IF NOT EXISTS "btree_gin";

-- Create custom types
CREATE TYPE user_role AS ENUM ('CANDIDATE', 'EMPLOYER', 'ADMIN');
CREATE TYPE profile_visibility AS ENUM ('PUBLIC', 'PRIVATE', 'CONNECTIONS_ONLY');
CREATE TYPE availability AS ENUM ('ACTIVELY_LOOKING', 'OPEN_TO_OPPORTUNITIES', 'NOT_LOOKING');
CREATE TYPE work_type AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE', 'INTERNSHIP');
CREATE TYPE work_location AS ENUM ('REMOTE', 'ONSITE', 'HYBRID');
CREATE TYPE skill_level AS ENUM ('BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT');
CREATE TYPE company_size AS ENUM ('STARTUP', 'SMALL', 'MEDIUM', 'LARGE', 'ENTERPRISE');
CREATE TYPE job_type AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'FREELANCE', 'INTERNSHIP');
CREATE TYPE experience_level AS ENUM ('ENTRY_LEVEL', 'MID_LEVEL', 'SENIOR_LEVEL', 'LEAD', 'PRINCIPAL', 'EXECUTIVE');
CREATE TYPE job_status AS ENUM ('DRAFT', 'ACTIVE', 'PAUSED', 'CLOSED', 'EXPIRED');
CREATE TYPE application_status AS ENUM ('APPLIED', 'UNDER_REVIEW', 'INTERVIEW_SCHEDULED', 'INTERVIEWED', 'OFFER_MADE', 'ACCEPTED', 'REJECTED', 'WITHDRAWN');
CREATE TYPE interview_type AS ENUM ('PHONE', 'VIDEO', 'IN_PERSON', 'TECHNICAL', 'BEHAVIORAL', 'FINAL');
CREATE TYPE interview_status AS ENUM ('SCHEDULED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'RESCHEDULED');
CREATE TYPE notification_type AS ENUM ('JOB_MATCH', 'APPLICATION_UPDATE', 'INTERVIEW_SCHEDULED', 'MESSAGE_RECEIVED', 'COMPANY_FOLLOW', 'JOB_POSTED', 'APPLICATION_RECEIVED', 'SYSTEM');
CREATE TYPE conversation_type AS ENUM ('DIRECT', 'GROUP', 'SUPPORT');
CREATE TYPE participant_role AS ENUM ('ADMIN', 'MODERATOR', 'MEMBER');
CREATE TYPE message_type AS ENUM ('TEXT', 'IMAGE', 'FILE', 'SYSTEM', 'APPLICATION_UPDATE');

-- Users table
CREATE TABLE users (
    id TEXT PRIMARY KEY DEFAULT 'user_' || substr(md5(random()::text), 1, 16),
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    name TEXT NOT NULL,
    avatar TEXT,
    bio TEXT,
    role user_role DEFAULT 'CANDIDATE',
    is_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret TEXT,
    last_login_at TIMESTAMP WITH TIME ZONE,
    phone TEXT,
    website TEXT,
    location TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    twitter_url TEXT,
    email_notifications BOOLEAN DEFAULT TRUE,
    sms_notifications BOOLEAN DEFAULT FALSE,
    profile_visibility profile_visibility DEFAULT 'PUBLIC',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Profiles table
CREATE TABLE profiles (
    id TEXT PRIMARY KEY DEFAULT 'profile_' || substr(md5(random()::text), 1, 16),
    user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    summary TEXT,
    headline TEXT,
    availability availability DEFAULT 'ACTIVELY_LOOKING',
    salary_expectation INTEGER,
    currency TEXT DEFAULT 'USD',
    work_type work_type[],
    work_location work_location[],
    languages TEXT[],
    visa_status TEXT,
    willing_to_relocate BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- User skills table
CREATE TABLE user_skills (
    id TEXT PRIMARY KEY DEFAULT 'skill_' || substr(md5(random()::text), 1, 16),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill TEXT NOT NULL,
    level skill_level DEFAULT 'INTERMEDIATE',
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, skill)
);

-- Experience table
CREATE TABLE experiences (
    id TEXT PRIMARY KEY DEFAULT 'exp_' || substr(md5(random()::text), 1, 16),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    company TEXT NOT NULL,
    location TEXT,
    description TEXT,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    is_current BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Education table
CREATE TABLE educations (
    id TEXT PRIMARY KEY DEFAULT 'edu_' || substr(md5(random()::text), 1, 16),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    institution TEXT NOT NULL,
    degree TEXT NOT NULL,
    field TEXT,
    location TEXT,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    gpa DECIMAL(3,2),
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Certifications table
CREATE TABLE certifications (
    id TEXT PRIMARY KEY DEFAULT 'cert_' || substr(md5(random()::text), 1, 16),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    issuer TEXT NOT NULL,
    issue_date TIMESTAMP WITH TIME ZONE NOT NULL,
    expiry_date TIMESTAMP WITH TIME ZONE,
    credential_id TEXT,
    credential_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Job preferences table
CREATE TABLE job_preferences (
    id TEXT PRIMARY KEY DEFAULT 'pref_' || substr(md5(random()::text), 1, 16),
    user_id TEXT UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    industries TEXT[],
    job_titles TEXT[],
    locations TEXT[],
    remote_preference BOOLEAN DEFAULT FALSE,
    salary_min INTEGER,
    salary_max INTEGER,
    currency TEXT DEFAULT 'USD',
    work_types work_type[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Companies table
CREATE TABLE companies (
    id TEXT PRIMARY KEY DEFAULT 'company_' || substr(md5(random()::text), 1, 16),
    name TEXT NOT NULL,
    description TEXT NOT NULL,
    website TEXT,
    industry TEXT NOT NULL,
    size company_size NOT NULL,
    location JSONB NOT NULL,
    logo TEXT,
    benefits TEXT[],
    culture TEXT[],
    created_by TEXT NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Company reviews table
CREATE TABLE company_reviews (
    id TEXT PRIMARY KEY DEFAULT 'review_' || substr(md5(random()::text), 1, 16),
    company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title TEXT NOT NULL,
    review TEXT NOT NULL,
    pros TEXT[],
    cons TEXT[],
    recommend BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(company_id, user_id)
);

-- Company follows table
CREATE TABLE company_follows (
    id TEXT PRIMARY KEY DEFAULT 'follow_' || substr(md5(random()::text), 1, 16),
    company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(company_id, user_id)
);

-- Jobs table
CREATE TABLE jobs (
    id TEXT PRIMARY KEY DEFAULT 'job_' || substr(md5(random()::text), 1, 16),
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    requirements TEXT[],
    responsibilities TEXT[],
    benefits TEXT[],
    salary_min INTEGER,
    salary_max INTEGER,
    currency TEXT DEFAULT 'USD',
    location TEXT NOT NULL,
    remote BOOLEAN DEFAULT FALSE,
    job_type job_type NOT NULL,
    experience experience_level NOT NULL,
    status job_status DEFAULT 'DRAFT',
    company_id TEXT NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    created_by TEXT NOT NULL REFERENCES users(id),
    deadline TIMESTAMP WITH TIME ZONE,
    views INTEGER DEFAULT 0,
    applications INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Applications table
CREATE TABLE applications (
    id TEXT PRIMARY KEY DEFAULT 'app_' || substr(md5(random()::text), 1, 16),
    job_id TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status application_status DEFAULT 'APPLIED',
    cover_letter TEXT,
    resume TEXT,
    portfolio TEXT,
    applied_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(job_id, user_id)
);

-- Interviews table
CREATE TABLE interviews (
    id TEXT PRIMARY KEY DEFAULT 'interview_' || substr(md5(random()::text), 1, 16),
    application_id TEXT NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    type interview_type NOT NULL,
    scheduled_at TIMESTAMP WITH TIME ZONE NOT NULL,
    duration INTEGER NOT NULL,
    location TEXT,
    meeting_url TEXT,
    notes TEXT,
    status interview_status DEFAULT 'SCHEDULED',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Application messages table
CREATE TABLE application_messages (
    id TEXT PRIMARY KEY DEFAULT 'msg_' || substr(md5(random()::text), 1, 16),
    application_id TEXT NOT NULL REFERENCES applications(id) ON DELETE CASCADE,
    sender_id TEXT NOT NULL,
    recipient_id TEXT NOT NULL,
    content TEXT NOT NULL,
    attachments TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

-- Job matches table
CREATE TABLE job_matches (
    id TEXT PRIMARY KEY DEFAULT 'match_' || substr(md5(random()::text), 1, 16),
    job_id TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL,
    score DECIMAL(5,2) NOT NULL CHECK (score >= 0 AND score <= 100),
    reasons TEXT[],
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(job_id, user_id)
);

-- Saved jobs table
CREATE TABLE saved_jobs (
    id TEXT PRIMARY KEY DEFAULT 'saved_' || substr(md5(random()::text), 1, 16),
    job_id TEXT NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(job_id, user_id)
);

-- Saved companies table
CREATE TABLE saved_companies (
    id TEXT PRIMARY KEY DEFAULT 'saved_comp_' || substr(md5(random()::text), 1, 16),
    company_id TEXT NOT NULL,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(company_id, user_id)
);

-- User sessions table
CREATE TABLE user_sessions (
    id TEXT PRIMARY KEY DEFAULT 'session_' || substr(md5(random()::text), 1, 16),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token TEXT UNIQUE NOT NULL,
    ip_address TEXT NOT NULL,
    user_agent TEXT NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Notifications table
CREATE TABLE notifications (
    id TEXT PRIMARY KEY DEFAULT 'notif_' || substr(md5(random()::text), 1, 16),
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    type notification_type NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    data JSONB,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

-- Conversations table
CREATE TABLE conversations (
    id TEXT PRIMARY KEY DEFAULT 'conv_' || substr(md5(random()::text), 1, 16),
    type conversation_type DEFAULT 'DIRECT',
    title TEXT,
    created_by TEXT NOT NULL REFERENCES users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Conversation participants table
CREATE TABLE conversation_participants (
    id TEXT PRIMARY KEY DEFAULT 'participant_' || substr(md5(random()::text), 1, 16),
    conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role participant_role DEFAULT 'MEMBER',
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(conversation_id, user_id)
);

-- Messages table
CREATE TABLE messages (
    id TEXT PRIMARY KEY DEFAULT 'message_' || substr(md5(random()::text), 1, 16),
    conversation_id TEXT NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    type message_type DEFAULT 'TEXT',
    attachments TEXT[],
    reply_to_id TEXT REFERENCES messages(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    read_at TIMESTAMP WITH TIME ZONE
);

-- AI matching service tables
CREATE TABLE matching_profiles (
    id TEXT PRIMARY KEY DEFAULT 'match_prof_' || substr(md5(random()::text), 1, 16),
    user_id TEXT UNIQUE NOT NULL,
    skills JSONB,
    experience JSONB,
    preferences JSONB,
    culture JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE matching_jobs (
    id TEXT PRIMARY KEY DEFAULT 'match_job_' || substr(md5(random()::text), 1, 16),
    job_id TEXT UNIQUE NOT NULL,
    title JSONB,
    description JSONB,
    requirements JSONB,
    culture JSONB,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit logs table
CREATE TABLE audit_logs (
    id TEXT PRIMARY KEY DEFAULT 'audit_' || substr(md5(random()::text), 1, 16),
    user_id TEXT,
    action TEXT NOT NULL,
    resource TEXT NOT NULL,
    resource_id TEXT,
    details JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for performance
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
CREATE INDEX idx_users_created_at ON users(created_at);

CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_availability ON profiles(availability);

CREATE INDEX idx_user_skills_user_id ON user_skills(user_id);
CREATE INDEX idx_user_skills_skill ON user_skills(skill);

CREATE INDEX idx_experiences_user_id ON experiences(user_id);
CREATE INDEX idx_experiences_company ON experiences(company);

CREATE INDEX idx_educations_user_id ON educations(user_id);
CREATE INDEX idx_educations_institution ON educations(institution);

CREATE INDEX idx_certifications_user_id ON certifications(user_id);

CREATE INDEX idx_job_preferences_user_id ON job_preferences(user_id);

CREATE INDEX idx_companies_name ON companies(name);
CREATE INDEX idx_companies_industry ON companies(industry);
CREATE INDEX idx_companies_size ON companies(size);
CREATE INDEX idx_companies_created_by ON companies(created_by);
CREATE INDEX idx_companies_location ON companies USING GIN(location);

CREATE INDEX idx_company_reviews_company_id ON company_reviews(company_id);
CREATE INDEX idx_company_reviews_user_id ON company_reviews(user_id);
CREATE INDEX idx_company_reviews_rating ON company_reviews(rating);

CREATE INDEX idx_company_follows_company_id ON company_follows(company_id);
CREATE INDEX idx_company_follows_user_id ON company_follows(user_id);

CREATE INDEX idx_jobs_company_id ON jobs(company_id);
CREATE INDEX idx_jobs_status ON jobs(status);
CREATE INDEX idx_jobs_job_type ON jobs(job_type);
CREATE INDEX idx_jobs_experience ON jobs(experience);
CREATE INDEX idx_jobs_location ON jobs(location);
CREATE INDEX idx_jobs_created_at ON jobs(created_at);
CREATE INDEX idx_jobs_title_search ON jobs USING GIN(to_tsvector('english', title));
CREATE INDEX idx_jobs_description_search ON jobs USING GIN(to_tsvector('english', description));

CREATE INDEX idx_applications_job_id ON applications(job_id);
CREATE INDEX idx_applications_user_id ON applications(user_id);
CREATE INDEX idx_applications_status ON applications(status);
CREATE INDEX idx_applications_applied_at ON applications(applied_at);

CREATE INDEX idx_interviews_application_id ON interviews(application_id);
CREATE INDEX idx_interviews_scheduled_at ON interviews(scheduled_at);
CREATE INDEX idx_interviews_status ON interviews(status);

CREATE INDEX idx_application_messages_application_id ON application_messages(application_id);
CREATE INDEX idx_application_messages_sender_id ON application_messages(sender_id);
CREATE INDEX idx_application_messages_created_at ON application_messages(created_at);

CREATE INDEX idx_job_matches_job_id ON job_matches(job_id);
CREATE INDEX idx_job_matches_user_id ON job_matches(user_id);
CREATE INDEX idx_job_matches_score ON job_matches(score);

CREATE INDEX idx_saved_jobs_job_id ON saved_jobs(job_id);
CREATE INDEX idx_saved_jobs_user_id ON saved_jobs(user_id);

CREATE INDEX idx_saved_companies_company_id ON saved_companies(company_id);
CREATE INDEX idx_saved_companies_user_id ON saved_companies(user_id);

CREATE INDEX idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX idx_user_sessions_token ON user_sessions(token);
CREATE INDEX idx_user_sessions_expires_at ON user_sessions(expires_at);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_type ON notifications(type);
CREATE INDEX idx_notifications_read ON notifications(read);
CREATE INDEX idx_notifications_created_at ON notifications(created_at);

CREATE INDEX idx_conversations_created_by ON conversations(created_by);
CREATE INDEX idx_conversations_created_at ON conversations(created_at);

CREATE INDEX idx_conversation_participants_conversation_id ON conversation_participants(conversation_id);
CREATE INDEX idx_conversation_participants_user_id ON conversation_participants(user_id);

CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_created_at ON messages(created_at);

CREATE INDEX idx_matching_profiles_user_id ON matching_profiles(user_id);
CREATE INDEX idx_matching_jobs_job_id ON matching_jobs(job_id);

CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);
CREATE INDEX idx_audit_logs_action ON audit_logs(action);
CREATE INDEX idx_audit_logs_resource ON audit_logs(resource);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_experiences_updated_at BEFORE UPDATE ON experiences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_educations_updated_at BEFORE UPDATE ON educations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_certifications_updated_at BEFORE UPDATE ON certifications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_job_preferences_updated_at BEFORE UPDATE ON job_preferences FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_company_reviews_updated_at BEFORE UPDATE ON company_reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_jobs_updated_at BEFORE UPDATE ON jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_applications_updated_at BEFORE UPDATE ON applications FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_interviews_updated_at BEFORE UPDATE ON interviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_user_sessions_updated_at BEFORE UPDATE ON user_sessions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_conversations_updated_at BEFORE UPDATE ON conversations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_matching_profiles_updated_at BEFORE UPDATE ON matching_profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_matching_jobs_updated_at BEFORE UPDATE ON matching_jobs FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create full-text search functions
CREATE OR REPLACE FUNCTION search_jobs(search_query TEXT)
RETURNS TABLE (
    id TEXT,
    title TEXT,
    description TEXT,
    company_name TEXT,
    location TEXT,
    salary_min INTEGER,
    salary_max INTEGER,
    job_type job_type,
    experience experience_level,
    created_at TIMESTAMP WITH TIME ZONE,
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        j.id,
        j.title,
        j.description,
        c.name as company_name,
        j.location,
        j.salary_min,
        j.salary_max,
        j.job_type,
        j.experience,
        j.created_at,
        ts_rank(
            setweight(to_tsvector('english', j.title), 'A') ||
            setweight(to_tsvector('english', j.description), 'B') ||
            setweight(to_tsvector('english', c.name), 'C'),
            plainto_tsquery('english', search_query)
        ) as rank
    FROM jobs j
    JOIN companies c ON j.company_id = c.id
    WHERE j.status = 'ACTIVE'
    AND (
        to_tsvector('english', j.title) @@ plainto_tsquery('english', search_query) OR
        to_tsvector('english', j.description) @@ plainto_tsquery('english', search_query) OR
        to_tsvector('english', c.name) @@ plainto_tsquery('english', search_query)
    )
    ORDER BY rank DESC, j.created_at DESC;
END;
$$ LANGUAGE plpgsql;

-- Create function to get job matches for a user
CREATE OR REPLACE FUNCTION get_user_job_matches(user_id_param TEXT, limit_count INTEGER DEFAULT 20)
RETURNS TABLE (
    job_id TEXT,
    match_score DECIMAL(5,2),
    job_title TEXT,
    company_name TEXT,
    location TEXT,
    salary_min INTEGER,
    salary_max INTEGER,
    job_type job_type
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        jm.job_id,
        jm.score as match_score,
        j.title as job_title,
        c.name as company_name,
        j.location,
        j.salary_min,
        j.salary_max,
        j.job_type
    FROM job_matches jm
    JOIN jobs j ON jm.job_id = j.id
    JOIN companies c ON j.company_id = c.id
    WHERE jm.user_id = user_id_param
    AND j.status = 'ACTIVE'
    ORDER BY jm.score DESC, j.created_at DESC
    LIMIT limit_count;
END;
$$ LANGUAGE plpgsql;

-- Create function to update job view count
CREATE OR REPLACE FUNCTION increment_job_views(job_id_param TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE jobs 
    SET views = views + 1 
    WHERE id = job_id_param;
END;
$$ LANGUAGE plpgsql;

-- Create function to update job application count
CREATE OR REPLACE FUNCTION increment_job_applications(job_id_param TEXT)
RETURNS VOID AS $$
BEGIN
    UPDATE jobs 
    SET applications = applications + 1 
    WHERE id = job_id_param;
END;
$$ LANGUAGE plpgsql;

-- Create function to get company statistics
CREATE OR REPLACE FUNCTION get_company_stats(company_id_param TEXT)
RETURNS TABLE (
    total_jobs INTEGER,
    active_jobs INTEGER,
    total_reviews INTEGER,
    average_rating DECIMAL(3,2),
    total_followers INTEGER
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(j.id)::INTEGER as total_jobs,
        COUNT(CASE WHEN j.status = 'ACTIVE' THEN 1 END)::INTEGER as active_jobs,
        COUNT(cr.id)::INTEGER as total_reviews,
        COALESCE(AVG(cr.rating), 0)::DECIMAL(3,2) as average_rating,
        COUNT(cf.id)::INTEGER as total_followers
    FROM companies c
    LEFT JOIN jobs j ON c.id = j.company_id
    LEFT JOIN company_reviews cr ON c.id = cr.company_id
    LEFT JOIN company_follows cf ON c.id = cf.company_id
    WHERE c.id = company_id_param
    GROUP BY c.id;
END;
$$ LANGUAGE plpgsql;

-- Insert sample data
INSERT INTO users (id, email, password, name, role, is_verified) VALUES
('admin_user', 'admin@askyacham.com', '$2b$10$example_hash', 'Admin User', 'ADMIN', true),
('demo_candidate', 'candidate@example.com', '$2b$10$example_hash', 'Demo Candidate', 'CANDIDATE', true),
('demo_employer', 'employer@example.com', '$2b$10$example_hash', 'Demo Employer', 'EMPLOYER', true);

-- Insert sample companies
INSERT INTO companies (id, name, description, industry, size, location, created_by) VALUES
('company_1', 'TechCorp', 'Leading technology company focused on innovation', 'Technology', 'LARGE', '{"city": "San Francisco", "state": "CA", "country": "USA", "remote": true}', 'demo_employer'),
('company_2', 'StartupXYZ', 'Fast-growing startup in the fintech space', 'Financial Technology', 'SMALL', '{"city": "New York", "state": "NY", "country": "USA", "remote": true}', 'demo_employer'),
('company_3', 'InnovateLab', 'Research and development company', 'Research', 'MEDIUM', '{"city": "Austin", "state": "TX", "country": "USA", "remote": false}', 'demo_employer');

-- Insert sample jobs
INSERT INTO jobs (id, title, description, requirements, responsibilities, benefits, salary_min, salary_max, location, job_type, experience, company_id, created_by, status) VALUES
('job_1', 'Senior Frontend Developer', 'Join our team to build the next generation of web applications using React, TypeScript, and modern development practices.', '["5+ years of frontend development", "Strong proficiency in React and TypeScript", "Experience with modern build tools"]', '["Develop responsive web applications", "Collaborate with design team", "Write clean, maintainable code"]', '["Health Insurance", "401k", "Stock Options"]', 120000, 150000, 'San Francisco, CA', 'FULL_TIME', 'SENIOR_LEVEL', 'company_1', 'demo_employer', 'ACTIVE'),
('job_2', 'Full Stack Engineer', 'We are looking for a passionate full-stack engineer to join our growing team and help build scalable applications.', '["3+ years of full-stack development", "Experience with Node.js and React", "Knowledge of PostgreSQL"]', '["Build scalable web applications", "Work with cross-functional teams", "Participate in code reviews"]', '["Flexible Hours", "Remote Work", "Learning Budget"]', 100000, 130000, 'Remote', 'FULL_TIME', 'MID_LEVEL', 'company_2', 'demo_employer', 'ACTIVE'),
('job_3', 'React Developer', 'Help us build innovative solutions for our enterprise clients using cutting-edge technologies.', '["2+ years of React experience", "Knowledge of Redux", "Experience with testing frameworks"]', '["Develop user interfaces", "Optimize application performance", "Collaborate with backend team"]', '["Health Insurance", "Dental", "Vision"]', 90000, 120000, 'New York, NY', 'FULL_TIME', 'MID_LEVEL', 'company_3', 'demo_employer', 'ACTIVE');

COMMIT;
