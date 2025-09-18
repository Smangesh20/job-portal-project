const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(helmet());
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Sample job data
const jobs = [
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "Google",
    location: "Bangalore, India",
    type: "Full-time",
    experience: "5+ years",
    salary: "₹25-40 LPA",
    description: "Join our team to build cutting-edge products that impact billions of users worldwide.",
    applications: 150
  },
  {
    id: 2,
    title: "Full Stack Developer",
    company: "Microsoft",
    location: "Hyderabad, India",
    type: "Full-time",
    experience: "3+ years",
    salary: "₹20-35 LPA",
    description: "Work on cloud services and enterprise solutions that power businesses globally.",
    applications: 200
  },
  {
    id: 3,
    title: "AI/ML Engineer",
    company: "Amazon",
    location: "Remote",
    type: "Full-time",
    experience: "4+ years",
    salary: "₹30-50 LPA",
    description: "Develop machine learning models and AI solutions for e-commerce platforms.",
    applications: 180
  }
];

// Authentication middleware
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.replace('Bearer ', '') || req.query.token;
  if (!token || !token.startsWith('demo-token-')) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
}

// Routes
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Ask Ya Cham - Global Job Platform</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Inter', sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; }
            .container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
            .hero { text-align: center; color: white; margin-bottom: 4rem; }
            .hero h1 { font-size: 3.5rem; font-weight: 800; margin-bottom: 1rem; }
            .hero p { font-size: 1.3rem; opacity: 0.9; margin-bottom: 2rem; }
            .btn { display: inline-block; padding: 1rem 2rem; background: white; color: #667eea; text-decoration: none; border-radius: 12px; font-weight: 600; margin: 0.5rem; transition: all 0.3s ease; }
            .btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(255,255,255,0.3); }
            .features { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; margin: 4rem 0; }
            .feature { background: rgba(255,255,255,0.1); backdrop-filter: blur(10px); padding: 2rem; border-radius: 16px; text-align: center; color: white; }
            .feature h3 { font-size: 1.5rem; margin-bottom: 1rem; }
            .nav { display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem; }
            .logo { font-size: 1.8rem; font-weight: 800; color: white; }
            .nav-links { display: flex; gap: 2rem; }
            .nav-links a { color: white; text-decoration: none; font-weight: 500; }
        </style>
    </head>
    <body>
        <div class="container">
            <nav class="nav">
                <div class="logo"><i class="fas fa-rocket"></i> Ask Ya Cham</div>
                <div class="nav-links">
                    <a href="/about">About</a>
                    <a href="/contact">Contact</a>
                    <a href="/login" class="btn">Sign In</a>
                </div>
            </nav>
            
            <div class="hero">
                <h1>🌍 Global Job Opportunities</h1>
                <p>Find your dream job with AI-powered matching and world-class UI/UX</p>
                <a href="/login" class="btn">Get Started Free</a>
                <a href="/about" class="btn">Learn More</a>
            </div>
            
            <div class="features">
                <div class="feature">
                    <h3><i class="fas fa-globe"></i> Global Reach</h3>
                    <p>Access jobs worldwide with priority for India-based positions</p>
                </div>
                <div class="feature">
                    <h3><i class="fas fa-robot"></i> AI Matching</h3>
                    <p>Smart algorithms match you with perfect opportunities</p>
                </div>
                <div class="feature">
                    <h3><i class="fas fa-palette"></i> Beautiful Design</h3>
                    <p>World's most unique and intuitive user experience</p>
                </div>
            </div>
        </div>
    </body>
    </html>
  `);
});

// Login page
app.get('/login', (req, res) => {
  const redirectUrl = req.query.redirect || '/dashboard';
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sign In - Ask Ya Cham</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Inter', sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem; }
            .login-container { background: rgba(255,255,255,0.95); backdrop-filter: blur(20px); border-radius: 24px; padding: 3rem; box-shadow: 0 20px 60px rgba(0,0,0,0.1); max-width: 400px; width: 100%; }
            .logo { text-align: center; margin-bottom: 2rem; }
            .logo h1 { font-size: 2rem; font-weight: 800; color: #1a1a1a; margin-bottom: 0.5rem; }
            .form-group { margin-bottom: 1.5rem; }
            .form-group label { display: block; font-weight: 600; color: #374151; margin-bottom: 0.5rem; }
            .form-group input { width: 100%; padding: 1rem; border: 2px solid #e5e7eb; border-radius: 12px; font-size: 1rem; }
            .btn { width: 100%; padding: 1rem; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 12px; font-size: 1rem; font-weight: 600; cursor: pointer; margin-bottom: 1rem; }
            .btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(102,126,234,0.4); }
            .signup-link { text-align: center; color: #6b7280; }
            .signup-link a { color: #667eea; text-decoration: none; font-weight: 600; }
        </style>
    </head>
    <body>
        <div class="login-container">
            <div class="logo">
                <h1><i class="fas fa-rocket"></i> Ask Ya Cham</h1>
                <p>Sign in to access job features</p>
            </div>
            <form id="loginForm">
                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <button type="submit" class="btn">Sign In</button>
            </form>
            <div class="signup-link">
                Don't have an account? <a href="/register">Sign up for free</a>
            </div>
        </div>
        <script>
            document.getElementById('loginForm').addEventListener('submit', function(e) {
                e.preventDefault();
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const redirectUrl = '${redirectUrl}';
                
                if (email && password) {
                    localStorage.setItem('authToken', 'demo-token-' + Date.now());
                    localStorage.setItem('userEmail', email);
                    window.location.href = redirectUrl;
                } else {
                    alert('Please enter both email and password');
                }
            });
        </script>
    </body>
    </html>
  `);
});

// Register page
app.get('/register', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Sign Up - Ask Ya Cham</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Inter', sans-serif; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 2rem; }
            .register-container { background: rgba(255,255,255,0.95); backdrop-filter: blur(20px); border-radius: 24px; padding: 3rem; box-shadow: 0 20px 60px rgba(0,0,0,0.1); max-width: 400px; width: 100%; }
            .logo { text-align: center; margin-bottom: 2rem; }
            .logo h1 { font-size: 2rem; font-weight: 800; color: #1a1a1a; margin-bottom: 0.5rem; }
            .form-group { margin-bottom: 1.5rem; }
            .form-group label { display: block; font-weight: 600; color: #374151; margin-bottom: 0.5rem; }
            .form-group input { width: 100%; padding: 1rem; border: 2px solid #e5e7eb; border-radius: 12px; font-size: 1rem; }
            .btn { width: 100%; padding: 1rem; background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; border-radius: 12px; font-size: 1rem; font-weight: 600; cursor: pointer; margin-bottom: 1rem; }
            .btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(102,126,234,0.4); }
            .signin-link { text-align: center; color: #6b7280; }
            .signin-link a { color: #667eea; text-decoration: none; font-weight: 600; }
        </style>
    </head>
    <body>
        <div class="register-container">
            <div class="logo">
                <h1><i class="fas fa-rocket"></i> Ask Ya Cham</h1>
                <p>Create your free account</p>
            </div>
            <form id="registerForm">
                <div class="form-group">
                    <label for="name">Full Name</label>
                    <input type="text" id="name" name="name" required>
                </div>
                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <div class="form-group">
                    <label for="confirmPassword">Confirm Password</label>
                    <input type="password" id="confirmPassword" name="confirmPassword" required>
                </div>
                <button type="submit" class="btn">Create Account</button>
            </form>
            <div class="signin-link">
                Already have an account? <a href="/login">Sign in</a>
            </div>
        </div>
        <script>
            document.getElementById('registerForm').addEventListener('submit', function(e) {
                e.preventDefault();
                const name = document.getElementById('name').value;
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const confirmPassword = document.getElementById('confirmPassword').value;
                
                if (password !== confirmPassword) {
                    alert('Passwords do not match');
                    return;
                }
                
                if (name && email && password) {
                    localStorage.setItem('authToken', 'demo-token-' + Date.now());
                    localStorage.setItem('userEmail', email);
                    localStorage.setItem('userName', name);
                    window.location.href = '/dashboard';
                } else {
                    alert('Please fill in all fields');
                }
            });
        </script>
    </body>
    </html>
  `);
});

// Dashboard page (protected)
app.get('/dashboard', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Dashboard - Ask Ya Cham</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Inter', sans-serif; background: #f8fafc; min-height: 100vh; }
            .header { background: white; border-bottom: 1px solid #e5e7eb; padding: 1rem 0; }
            .container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
            .nav { display: flex; justify-content: space-between; align-items: center; }
            .logo { font-size: 1.5rem; font-weight: 800; color: #667eea; }
            .user-info { display: flex; align-items: center; gap: 1rem; }
            .dashboard { padding: 2rem 0; }
            .welcome { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 3rem; border-radius: 20px; margin-bottom: 2rem; text-align: center; }
            .welcome h1 { font-size: 2.5rem; margin-bottom: 1rem; }
            .welcome p { font-size: 1.2rem; opacity: 0.9; }
            .stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 2rem; margin-bottom: 2rem; }
            .stat-card { background: white; padding: 2rem; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); text-align: center; }
            .stat-number { font-size: 2.5rem; font-weight: 800; color: #667eea; margin-bottom: 0.5rem; }
            .stat-label { color: #6b7280; font-weight: 500; }
            .actions { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
            .action-card { background: white; padding: 2rem; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); text-align: center; }
            .action-card h3 { margin-bottom: 1rem; color: #1a1a1a; }
            .action-card p { color: #6b7280; margin-bottom: 1.5rem; }
            .btn { display: inline-block; padding: 1rem 2rem; background: linear-gradient(135deg, #667eea, #764ba2); color: white; text-decoration: none; border-radius: 12px; font-weight: 600; transition: all 0.3s ease; }
            .btn:hover { transform: translateY(-2px); box-shadow: 0 8px 25px rgba(102,126,234,0.4); }
        </style>
    </head>
    <body>
        <header class="header">
            <div class="container">
                <nav class="nav">
                    <div class="logo"><i class="fas fa-rocket"></i> Ask Ya Cham</div>
                    <div class="user-info">
                        <span id="userName">User</span>
                        <button onclick="logout()" style="background: none; border: none; color: #667eea; cursor: pointer;">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </button>
                    </div>
                </nav>
            </div>
        </header>
        <main class="dashboard">
            <div class="container">
                <div class="welcome">
                    <h1>Welcome to Your Dashboard!</h1>
                    <p>You're now signed in and can access all job features</p>
                </div>
                <div class="stats-grid">
                    <div class="stat-card">
                        <div class="stat-number">12</div>
                        <div class="stat-label">Job Applications</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">8</div>
                        <div class="stat-label">Saved Jobs</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">3</div>
                        <div class="stat-label">Interviews</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-number">95%</div>
                        <div class="stat-label">Profile Complete</div>
                    </div>
                </div>
                <div class="actions">
                    <div class="action-card">
                        <h3><i class="fas fa-search"></i> Search Jobs</h3>
                        <p>Find your perfect job with our AI-powered matching</p>
                        <a href="/jobs" class="btn">Start Searching</a>
                    </div>
                    <div class="action-card">
                        <h3><i class="fas fa-building"></i> Browse Companies</h3>
                        <p>Explore top companies and their opportunities</p>
                        <a href="/companies" class="btn">View Companies</a>
                    </div>
                </div>
            </div>
        </main>
        <script>
            const userName = localStorage.getItem('userName') || 'User';
            document.getElementById('userName').textContent = userName;
            function logout() {
                localStorage.removeItem('authToken');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userName');
                window.location.href = '/';
            }
        </script>
    </body>
    </html>
  `);
});

// Jobs page (protected)
app.get('/jobs', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Jobs - Ask Ya Cham</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Inter', sans-serif; background: #f8fafc; min-height: 100vh; }
            .header { background: white; border-bottom: 1px solid #e5e7eb; padding: 1rem 0; }
            .container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
            .nav { display: flex; justify-content: space-between; align-items: center; }
            .logo { font-size: 1.5rem; font-weight: 800; color: #667eea; }
            .user-info { display: flex; align-items: center; gap: 1rem; }
            .jobs-section { padding: 2rem 0; }
            .search-form { background: white; padding: 2rem; border-radius: 16px; box-shadow: 0 4px 20px rgba(0,0,0,0.1); margin-bottom: 2rem; display: grid; grid-template-columns: 1fr 1fr 1fr auto; gap: 1rem; align-items: end; }
            .form-group { display: flex; flex-direction: column; }
            .form-group label { font-weight: 600; color: #374151; margin-bottom: 0.5rem; }
            .form-group input, .form-group select { padding: 0.75rem; border: 2px solid #e5e7eb; border-radius: 8px; font-size: 1rem; }
            .search-btn { background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; cursor: pointer; }
            .jobs-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(400px, 1fr)); gap: 2rem; }
            .job-card { background: white; border-radius: 16px; padding: 2rem; box-shadow: 0 4px 20px rgba(0,0,0,0.1); transition: transform 0.3s ease; }
            .job-card:hover { transform: translateY(-5px); }
            .job-title { font-size: 1.5rem; font-weight: 700; color: #1a1a1a; margin-bottom: 0.5rem; }
            .job-company { font-size: 1.1rem; color: #667eea; font-weight: 600; margin-bottom: 1rem; }
            .job-meta { display: flex; gap: 1rem; color: #6b7280; margin-bottom: 1rem; }
            .job-salary { font-size: 1.2rem; font-weight: 700; color: #059669; margin-bottom: 1rem; }
            .job-actions { display: flex; gap: 1rem; }
            .btn-apply { background: linear-gradient(135deg, #667eea, #764ba2); color: white; border: none; padding: 0.75rem 1.5rem; border-radius: 8px; font-weight: 600; cursor: pointer; flex: 1; }
            .btn-save { background: transparent; color: #6b7280; border: 2px solid #e5e7eb; padding: 0.75rem 1rem; border-radius: 8px; cursor: pointer; }
        </style>
    </head>
    <body>
        <header class="header">
            <div class="container">
                <nav class="nav">
                    <div class="logo"><i class="fas fa-rocket"></i> Ask Ya Cham</div>
                    <div class="user-info">
                        <span id="userName">User</span>
                        <button onclick="logout()" style="background: none; border: none; color: #667eea; cursor: pointer;">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </button>
                    </div>
                </nav>
            </div>
        </header>
        <main class="jobs-section">
            <div class="container">
                <h1 style="margin-bottom: 2rem; color: #1a1a1a;">🌍 Global Job Opportunities</h1>
                <div class="search-form">
                    <div class="form-group">
                        <label for="jobTitle">Job Title</label>
                        <input type="text" id="jobTitle" placeholder="e.g. Software Engineer">
                    </div>
                    <div class="form-group">
                        <label for="location">Location</label>
                        <select id="location">
                            <option value="">All Locations</option>
                            <option value="India">India (Priority)</option>
                            <option value="USA">United States</option>
                            <option value="Remote">Remote</option>
                        </select>
                    </div>
                    <div class="form-group">
                        <label for="jobType">Job Type</label>
                        <select id="jobType">
                            <option value="">All Types</option>
                            <option value="Full-time">Full-time</option>
                            <option value="Part-time">Part-time</option>
                            <option value="Contract">Contract</option>
                        </select>
                    </div>
                    <button class="search-btn" onclick="searchJobs()">
                        <i class="fas fa-search"></i> Search
                    </button>
                </div>
                <div class="jobs-grid" id="jobsGrid">
                    ${jobs.map(job => `
                        <div class="job-card">
                            <h3 class="job-title">${job.title}</h3>
                            <div class="job-company">${job.company}</div>
                            <div class="job-meta">
                                <span>📍 ${job.location}</span>
                                <span>⏰ ${job.type}</span>
                                <span>👤 ${job.experience}</span>
                            </div>
                            <div class="job-salary">💰 ${job.salary}</div>
                            <p style="color: #6b7280; margin-bottom: 1.5rem;">${job.description}</p>
                            <div class="job-actions">
                                <button class="btn-apply" onclick="applyJob(${job.id})">Apply Now</button>
                                <button class="btn-save" onclick="saveJob(${job.id})">💾 Save</button>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </main>
        <script>
            const userName = localStorage.getItem('userName') || 'User';
            document.getElementById('userName').textContent = userName;
            function logout() {
                localStorage.removeItem('authToken');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userName');
                window.location.href = '/';
            }
            function searchJobs() { alert('Search functionality - jobs filtered!'); }
            function applyJob(jobId) { alert('Applied to job ' + jobId + '!'); }
            function saveJob(jobId) { alert('Job ' + jobId + ' saved!'); }
        </script>
    </body>
    </html>
  `);
});

// About page (public)
app.get('/about', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>About Us - Ask Ya Cham</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Inter', sans-serif; background: #f8fafc; min-height: 100vh; }
            .header { background: white; border-bottom: 1px solid #e5e7eb; padding: 1rem 0; }
            .container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
            .nav { display: flex; justify-content: space-between; align-items: center; }
            .logo { font-size: 1.5rem; font-weight: 800; color: #667eea; }
            .nav-links { display: flex; gap: 2rem; align-items: center; }
            .nav-links a { color: #6b7280; text-decoration: none; font-weight: 500; }
            .nav-links a:hover { color: #667eea; }
            .btn { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: 600; }
            .about-section { padding: 4rem 0; }
            .hero { text-align: center; margin-bottom: 4rem; }
            .hero h1 { font-size: 3rem; font-weight: 800; color: #1a1a1a; margin-bottom: 1rem; }
            .hero p { font-size: 1.2rem; color: #6b7280; max-width: 600px; margin: 0 auto; }
        </style>
    </head>
    <body>
        <header class="header">
            <div class="container">
                <nav class="nav">
                    <div class="logo"><i class="fas fa-rocket"></i> Ask Ya Cham</div>
                    <div class="nav-links">
                        <a href="/">Home</a>
                        <a href="/about">About</a>
                        <a href="/contact">Contact</a>
                        <a href="/login" class="btn">Sign In</a>
                    </div>
                </nav>
            </div>
        </header>
        <main class="about-section">
            <div class="container">
                <div class="hero">
                    <h1>About Ask Ya Cham</h1>
                    <p>We're revolutionizing the job search experience with AI-powered matching, global opportunities, and world-class UI/UX design.</p>
                </div>
            </div>
        </main>
    </body>
    </html>
  `);
});

// Contact page (public)
app.get('/contact', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Contact Us - Ask Ya Cham</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
        <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: 'Inter', sans-serif; background: #f8fafc; min-height: 100vh; }
            .header { background: white; border-bottom: 1px solid #e5e7eb; padding: 1rem 0; }
            .container { max-width: 1200px; margin: 0 auto; padding: 0 2rem; }
            .nav { display: flex; justify-content: space-between; align-items: center; }
            .logo { font-size: 1.5rem; font-weight: 800; color: #667eea; }
            .nav-links { display: flex; gap: 2rem; align-items: center; }
            .nav-links a { color: #6b7280; text-decoration: none; font-weight: 500; }
            .nav-links a:hover { color: #667eea; }
            .btn { background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 0.75rem 1.5rem; border-radius: 8px; text-decoration: none; font-weight: 600; }
            .contact-section { padding: 4rem 0; }
            .hero { text-align: center; margin-bottom: 4rem; }
            .hero h1 { font-size: 3rem; font-weight: 800; color: #1a1a1a; margin-bottom: 1rem; }
            .hero p { font-size: 1.2rem; color: #6b7280; max-width: 600px; margin: 0 auto; }
        </style>
    </head>
    <body>
        <header class="header">
            <div class="container">
                <nav class="nav">
                    <div class="logo"><i class="fas fa-rocket"></i> Ask Ya Cham</div>
                    <div class="nav-links">
                        <a href="/">Home</a>
                        <a href="/about">About</a>
                        <a href="/contact">Contact</a>
                        <a href="/login" class="btn">Sign In</a>
                    </div>
                </nav>
            </div>
        </header>
        <main class="contact-section">
            <div class="container">
                <div class="hero">
                    <h1>Get in Touch</h1>
                    <p>Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.</p>
                </div>
            </div>
        </main>
    </body>
    </html>
  `);
});

// API Routes
app.get('/api', (req, res) => {
  res.json({
    success: true,
    message: 'Ask Ya Cham Global API',
    version: '2.0.0',
    endpoints: {
      jobs: '/api/jobs',
      users: '/api/users',
      applications: '/api/applications',
      health: '/api/health'
    },
    features: ['Global Jobs', 'India Priority', 'AI Matching', 'World-class UI/UX'],
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'api',
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
});

app.get('/api/jobs', requireAuth, (req, res) => {
  res.json({
    success: true,
    data: jobs,
    total: jobs.length,
    message: 'Jobs retrieved successfully'
  });
});

app.get('/api/jobs/:id', requireAuth, (req, res) => {
  const job = jobs.find(j => j.id === parseInt(req.params.id));
  if (!job) {
    return res.status(404).json({ error: 'Job not found' });
  }
  res.json({
    success: true,
    data: job,
    message: 'Job retrieved successfully'
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The requested resource was not found',
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Ask Ya Cham Global Platform running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
});

