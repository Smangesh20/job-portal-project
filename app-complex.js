const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use(express.static('public'));

// GLOBAL ENTERPRISE DATA - World's Top Companies with India Priority
let jobs = [
  // INDIA PRIORITY JOBS
  {
    id: 1,
    title: "Senior Software Engineer",
    company: "Google India",
    location: "Bangalore, India",
    salary: "₹25,00,000 - ₹40,00,000",
    type: "Full-time",
    experience: "5-8 years",
    remote: true,
    description: "Build next-generation products that impact billions of users worldwide. Work on cutting-edge technologies including AI, ML, and cloud computing.",
    requirements: ["5+ years software development", "Python, Java, Go", "Distributed systems", "Machine Learning", "Leadership skills"],
    benefits: ["Stock options", "Health insurance", "Learning budget", "Flexible hours", "Global opportunities"],
    posted: "2024-01-15",
    applications: 0,
    views: 0,
    featured: true,
    urgent: false,
    companySize: "190,000+",
    industry: "Technology",
    country: "India",
    region: "South India",
    priority: "high"
  },
  {
    id: 2,
    title: "AI Research Scientist",
    company: "Microsoft India",
    location: "Hyderabad, India",
    salary: "₹30,00,000 - ₹50,00,000",
    type: "Full-time",
    experience: "3-7 years",
    remote: true,
    description: "Lead AI research initiatives and develop breakthrough technologies. Work with world-class researchers and contribute to Microsoft's AI vision.",
    requirements: ["PhD in AI/ML", "Research publications", "Python, PyTorch", "NLP, Computer Vision", "Innovation mindset"],
    benefits: ["Research budget", "Conference travel", "Patent incentives", "Flexible work", "Global collaboration"],
    posted: "2024-01-14",
    applications: 0,
    views: 0,
    featured: true,
    urgent: true,
    companySize: "220,000+",
    industry: "Technology",
    country: "India",
    region: "South India",
    priority: "high"
  },
  {
    id: 3,
    title: "Product Manager",
    company: "Amazon India",
    location: "Bangalore, India",
    salary: "₹20,00,000 - ₹35,00,000",
    type: "Full-time",
    experience: "4-8 years",
    remote: true,
    description: "Drive product strategy for Amazon's fastest-growing market. Lead cross-functional teams and shape the future of e-commerce in India.",
    requirements: ["4+ years product management", "Data-driven decisions", "Customer obsession", "Technical background", "Leadership"],
    benefits: ["Stock options", "Health insurance", "Career growth", "Innovation time", "Global exposure"],
    posted: "2024-01-13",
    applications: 0,
    views: 0,
    featured: false,
    urgent: false,
    companySize: "1,500,000+",
    industry: "E-commerce",
    country: "India",
    region: "South India",
    priority: "high"
  },
  // GLOBAL TOP COMPANIES
  {
    id: 4,
    title: "Senior Frontend Engineer",
    company: "Meta",
    location: "Menlo Park, CA, USA",
    salary: "$180,000 - $250,000",
    type: "Full-time",
    experience: "5-8 years",
    remote: true,
    description: "Build the next generation of social experiences. Work on React, React Native, and cutting-edge web technologies that connect billions of people.",
    requirements: ["5+ years frontend development", "React, TypeScript", "Web performance", "Mobile development", "Design systems"],
    benefits: ["Stock options", "Health insurance", "Free meals", "Gym membership", "Learning budget"],
    posted: "2024-01-12",
    applications: 0,
    views: 0,
    featured: true,
    urgent: false,
    companySize: "77,000+",
    industry: "Technology",
    country: "USA",
    region: "North America",
    priority: "medium"
  },
  {
    id: 5,
    title: "Machine Learning Engineer",
    company: "Netflix",
    location: "Los Gatos, CA, USA",
    salary: "$200,000 - $300,000",
    type: "Full-time",
    experience: "4-7 years",
    remote: true,
    description: "Build recommendation systems that help 200+ million members discover content they love. Work with massive datasets and cutting-edge ML algorithms.",
    requirements: ["4+ years ML experience", "Python, TensorFlow", "Large-scale systems", "Recommendation systems", "A/B testing"],
    benefits: ["Stock options", "Unlimited PTO", "Health insurance", "Free Netflix", "Learning budget"],
    posted: "2024-01-11",
    applications: 0,
    views: 0,
    featured: true,
    urgent: false,
    companySize: "12,000+",
    industry: "Entertainment",
    country: "USA",
    region: "North America",
    priority: "medium"
  },
  {
    id: 6,
    title: "Software Engineer",
    company: "Tesla",
    location: "Austin, TX, USA",
    salary: "$150,000 - $220,000",
    type: "Full-time",
    experience: "3-6 years",
    remote: false,
    description: "Build software for the future of transportation. Work on autonomous driving, energy systems, and software that powers electric vehicles.",
    requirements: ["3+ years software development", "C++, Python", "Embedded systems", "Computer vision", "Robotics"],
    benefits: ["Stock options", "Health insurance", "Free EV charging", "Gym membership", "Innovation time"],
    posted: "2024-01-10",
    applications: 0,
    views: 0,
    featured: false,
    urgent: true,
    companySize: "127,000+",
    industry: "Automotive",
    country: "USA",
    region: "North America",
    priority: "medium"
  },
  {
    id: 7,
    title: "Senior Developer",
    company: "Spotify",
    location: "Stockholm, Sweden",
    salary: "€80,000 - €120,000",
    type: "Full-time",
    experience: "5-8 years",
    remote: true,
    description: "Build the world's most popular music streaming platform. Work on backend systems that serve 400+ million users worldwide.",
    requirements: ["5+ years backend development", "Java, Scala", "Microservices", "Distributed systems", "Music industry"],
    benefits: ["Stock options", "Health insurance", "Free Spotify Premium", "Learning budget", "Flexible work"],
    posted: "2024-01-09",
    applications: 0,
    views: 0,
    featured: false,
    urgent: false,
    companySize: "8,000+",
    industry: "Music",
    country: "Sweden",
    region: "Europe",
    priority: "low"
  },
  {
    id: 8,
    title: "Data Engineer",
    company: "Airbnb",
    location: "San Francisco, CA, USA",
    salary: "$160,000 - $240,000",
    type: "Full-time",
    experience: "4-7 years",
    remote: true,
    description: "Build data infrastructure that powers Airbnb's global marketplace. Work with petabytes of data and cutting-edge analytics tools.",
    requirements: ["4+ years data engineering", "Python, SQL", "Big data technologies", "Cloud platforms", "Analytics"],
    benefits: ["Stock options", "Health insurance", "Travel credits", "Learning budget", "Flexible work"],
    posted: "2024-01-08",
    applications: 0,
    views: 0,
    featured: false,
    urgent: false,
    companySize: "15,000+",
    industry: "Travel",
    country: "USA",
    region: "North America",
    priority: "low"
  }
];

// Users data
let users = [
  {
    id: 1,
    name: "Rahul Sharma",
    email: "rahul@example.com",
    location: "Bangalore, India",
    skills: ["React", "Node.js", "Python", "AWS"],
    experience: "5 years",
    role: "Software Engineer"
  },
  {
    id: 2,
    name: "Priya Patel",
    email: "priya@example.com",
    location: "Mumbai, India",
    skills: ["Data Science", "Machine Learning", "Python", "TensorFlow"],
    experience: "3 years",
    role: "Data Scientist"
  }
];

// Applications data
let applications = [];

// Serve the main page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Ask Ya Cham - World's Most Advanced AI Job Matching Platform</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
        <link href="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.css" rel="stylesheet">
        <script src="https://cdnjs.cloudflare.com/ajax/libs/aos/2.3.4/aos.js"></script>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Inter', sans-serif;
                line-height: 1.6;
                color: #1a1a1a;
                background: #ffffff;
                min-height: 100vh;
                overflow-x: hidden;
            }

            /* Dark theme support */
            body.dark-theme {
                background: #0f0f23;
                color: #ffffff;
            }

            /* Custom scrollbar */
            ::-webkit-scrollbar {
                width: 8px;
            }

            ::-webkit-scrollbar-track {
                background: #f1f1f1;
            }

            ::-webkit-scrollbar-thumb {
                background: linear-gradient(135deg, #667eea, #764ba2);
                border-radius: 4px;
            }

            ::-webkit-scrollbar-thumb:hover {
                background: linear-gradient(135deg, #5a67d8, #6b46c1);
            }

            .container {
                max-width: 1400px;
                margin: 0 auto;
                padding: 0 20px;
            }

            /* Header */
            .header {
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(20px);
                border-bottom: 1px solid rgba(255, 255, 255, 0.2);
                position: fixed;
                top: 0;
                left: 0;
                right: 0;
                z-index: 1000;
                transition: all 0.3s ease;
            }
            
            .header.scrolled {
                background: rgba(255, 255, 255, 0.98);
                box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            }
            
            .nav {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding: 1rem 0;
            }
            
            .logo {
                display: flex;
                align-items: center;
                font-size: 1.5rem;
                font-weight: 800;
                color: #2563eb;
                text-decoration: none;
            }
            
            .logo i {
                margin-right: 0.5rem;
                font-size: 1.8rem;
            }
            
            .nav-links {
                display: flex;
                list-style: none;
                gap: 1.5rem;
                align-items: center;
            }

            .nav-item {
                position: relative;
            }

            .nav-link {
                text-decoration: none;
                color: #374151;
                font-weight: 500;
                transition: all 0.3s ease;
                position: relative;
                display: flex;
                align-items: center;
                gap: 0.5rem;
                padding: 0.75rem 1rem;
                border-radius: 8px;
            }
            
            .nav-link:hover {
                color: #2563eb;
                background: rgba(37, 99, 235, 0.1);
            }

            .nav-link i:last-child {
                font-size: 0.75rem;
                transition: transform 0.3s ease;
            }

            .nav-item:hover .nav-link i:last-child {
                transform: rotate(180deg);
            }

            /* Dropdown Menus */
            .dropdown {
                position: relative;
            }

            .dropdown-menu {
                position: absolute;
                top: 100%;
                left: 0;
                background: white;
                border-radius: 12px;
                box-shadow: 0 10px 40px rgba(0, 0, 0, 0.15);
                border: 1px solid #e5e7eb;
                min-width: 220px;
                opacity: 0;
                visibility: hidden;
                transform: translateY(-10px);
                transition: all 0.3s ease;
                z-index: 1000;
                padding: 0.5rem 0;
            }

            .dropdown:hover .dropdown-menu {
                opacity: 1;
                visibility: visible;
                transform: translateY(0);
            }

            .dropdown-item {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                padding: 0.75rem 1rem;
                color: #374151;
                text-decoration: none;
                font-size: 0.9rem;
                transition: all 0.2s ease;
            }

            .dropdown-item:hover {
                background: #f8fafc;
                color: #2563eb;
            }

            .dropdown-item i {
                width: 16px;
                text-align: center;
                color: #6b7280;
            }

            .dropdown-item:hover i {
                color: #2563eb;
            }

            /* Search Container */
            .search-container {
                flex: 1;
                max-width: 500px;
                margin: 0 2rem;
            }

            .search-box {
                position: relative;
                display: flex;
                align-items: center;
                background: #f8fafc;
                border: 2px solid #e5e7eb;
                border-radius: 12px;
                padding: 0.5rem;
                transition: all 0.3s ease;
            }

            .search-box:focus-within {
                border-color: #2563eb;
                box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
            }

            .search-box i:first-child {
                color: #6b7280;
                margin: 0 0.75rem;
            }

            .search-box input {
                flex: 1;
                border: none;
                background: transparent;
                outline: none;
                font-size: 0.95rem;
                color: #374151;
            }

            .search-box input::placeholder {
                color: #9ca3af;
            }

            .search-btn-header {
                background: #2563eb;
                color: white;
                border: none;
                border-radius: 8px;
                padding: 0.5rem;
                cursor: pointer;
                transition: all 0.3s ease;
                margin-left: 0.5rem;
            }

            .search-btn-header:hover {
                background: #1d4ed8;
                transform: translateX(2px);
            }

            /* Navigation Actions */
            .nav-actions {
                display: flex;
                align-items: center;
                gap: 1rem;
            }
            
            .action-btn {
                position: relative;
                background: none;
                border: none;
                color: #6b7280;
                font-size: 1.1rem;
                padding: 0.75rem;
                border-radius: 8px;
                cursor: pointer;
                transition: all 0.3s ease;
            }

            .action-btn:hover {
                background: #f3f4f6;
                color: #374151;
            }

            .notification-badge,
            .message-badge {
                position: absolute;
                top: 0.25rem;
                right: 0.25rem;
                background: #ef4444;
                color: white;
                font-size: 0.7rem;
                font-weight: 600;
                padding: 0.125rem 0.375rem;
                border-radius: 10px;
                min-width: 18px;
                text-align: center;
            }

            /* User Profile */
            .user-profile {
                position: relative;
            }

            .user-btn {
                display: flex;
                align-items: center;
                gap: 0.75rem;
                background: none;
                border: none;
                padding: 0.5rem 1rem;
                border-radius: 12px;
                cursor: pointer;
                transition: all 0.3s ease;
                color: #374151;
            }

            .user-btn:hover {
                background: #f3f4f6;
            }

            .user-avatar {
                width: 32px;
                height: 32px;
                border-radius: 50%;
                object-fit: cover;
            }

            .user-name {
                font-weight: 500;
                font-size: 0.9rem;
            }

            .user-menu {
                right: 0;
                left: auto;
                min-width: 280px;
                padding: 1rem 0;
            }

            .user-info {
                display: flex;
                align-items: center;
                gap: 1rem;
                padding: 0 1rem 1rem;
            }

            .user-avatar-large {
                width: 48px;
                height: 48px;
                border-radius: 50%;
                object-fit: cover;
            }

            .user-details h4 {
                margin: 0;
                font-size: 1rem;
                font-weight: 600;
                color: #1f2937;
            }

            .user-details p {
                margin: 0.25rem 0 0;
                font-size: 0.85rem;
                color: #6b7280;
            }

            .menu-divider {
                height: 1px;
                background: #e5e7eb;
                margin: 0.5rem 0;
            }

            .dropdown-item.logout {
                color: #ef4444;
            }

            .dropdown-item.logout:hover {
                background: #fef2f2;
                color: #dc2626;
            }

            /* Auth Buttons */
            .auth-buttons {
                display: flex;
                gap: 0.75rem;
            }

            .nav-buttons {
                display: flex;
                gap: 1rem;
            }

            .btn {
                padding: 0.75rem 1.5rem;
                border: none;
                border-radius: 12px;
                font-weight: 600;
                text-decoration: none;
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                transition: all 0.3s ease;
                cursor: pointer;
                font-size: 0.95rem;
            }

            .btn-outline {
                background: transparent;
                color: #2563eb;
                border: 2px solid #2563eb;
            }

            .btn-outline:hover {
                background: #2563eb;
                color: white;
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(37, 99, 235, 0.3);
            }
            
            .btn-primary {
                background: linear-gradient(135deg, #2563eb, #1d4ed8);
                color: white;
                box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
            }
            
            .btn-primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(37, 99, 235, 0.4);
            }
            
            /* Hero Section */
            .hero {
                min-height: 100vh;
                display: flex;
                align-items: center;
                position: relative;
                overflow: hidden;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            }
            
            .hero-background {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                z-index: 1;
            }

            .hero-particles {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse"><path d="M 20 0 L 0 0 0 20" fill="none" stroke="rgba(255,255,255,0.1)" stroke-width="0.5"/></pattern></defs><rect width="100" height="100" fill="url(%23grid)"/></svg>');
                animation: float 20s ease-in-out infinite;
            }

            .hero-gradient {
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: radial-gradient(ellipse at center, rgba(255,255,255,0.1) 0%, transparent 70%);
            }
            
            .hero-content {
                position: relative;
                z-index: 2;
                flex: 1;
                max-width: 600px;
            }

            .hero-badge {
                display: inline-flex;
                align-items: center;
                gap: 0.5rem;
                background: rgba(255, 255, 255, 0.2);
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.3);
                border-radius: 50px;
                padding: 0.75rem 1.5rem;
                margin-bottom: 2rem;
                color: white;
                font-weight: 600;
                font-size: 0.9rem;
            }

            .hero-title {
                font-size: 4.5rem;
                font-weight: 900;
                color: white;
                margin-bottom: 1.5rem;
                line-height: 1.1;
                text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
            }

            .gradient-text {
                background: linear-gradient(135deg, #ffd700, #ff6b6b, #4ecdc4);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
                animation: gradientShift 3s ease-in-out infinite;
            }

            .hero-subtitle {
                font-size: 1.3rem;
                color: rgba(255, 255, 255, 0.9);
                margin-bottom: 3rem;
                font-weight: 400;
                line-height: 1.6;
            }
            
            .hero-stats {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 2rem;
                margin-bottom: 3rem;
            }
            
            .stat-item {
                text-align: center;
                color: white;
            }
            
            .stat-number {
                font-size: 2.5rem;
                font-weight: 800;
                color: #ffd700;
                margin-bottom: 0.5rem;
                text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
            }
            
            .stat-label {
                font-size: 0.9rem;
                color: rgba(255, 255, 255, 0.8);
                font-weight: 500;
            }

            .hero-actions {
                display: flex;
                gap: 1.5rem;
                flex-wrap: wrap;
            }

            .btn-large {
                padding: 1rem 2rem;
                font-size: 1.1rem;
                font-weight: 600;
            }

            .hero-visual {
                position: relative;
                z-index: 2;
                flex: 1;
                max-width: 500px;
                margin-left: 2rem;
            }

            .floating-cards {
                position: relative;
                height: 400px;
            }

            .job-card-float {
                position: absolute;
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(20px);
                border-radius: 16px;
                padding: 1.5rem;
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                animation: floatCard 6s ease-in-out infinite;
            }

            .job-card-float:nth-child(1) {
                top: 0;
                right: 0;
                animation-delay: 0s;
            }

            .job-card-float:nth-child(2) {
                top: 120px;
                left: 0;
                animation-delay: 2s;
            }

            .job-card-float:nth-child(3) {
                top: 240px;
                right: 20px;
                animation-delay: 4s;
            }

            .card-header {
                display: flex;
                align-items: center;
                gap: 1rem;
                margin-bottom: 1rem;
            }

            .company-logo {
                width: 40px;
                height: 40px;
                border-radius: 10px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-weight: 700;
                font-size: 1.2rem;
            }

            .company-info h4 {
                font-size: 1.1rem;
                font-weight: 700;
                color: #1a1a1a;
                margin-bottom: 0.25rem;
            }

            .company-info p {
                font-size: 0.9rem;
                color: #6b7280;
            }

            .match-score {
                background: linear-gradient(135deg, #10b981, #059669);
                color: white;
                padding: 0.25rem 0.75rem;
                border-radius: 20px;
                font-size: 0.8rem;
                font-weight: 600;
                margin-left: auto;
            }

            .card-details {
                display: flex;
                justify-content: space-between;
                font-size: 0.9rem;
                color: #6b7280;
            }

            .salary {
                font-weight: 600;
                color: #059669;
            }

            /* Features Section */
            .features-section {
                padding: 6rem 0;
                background: #f8fafc;
            }

            .section-header {
                text-align: center;
                margin-bottom: 4rem;
            }

            .section-header h2 {
                font-size: 3rem;
                font-weight: 800;
                color: #1a1a1a;
                margin-bottom: 1rem;
            }

            .section-header p {
                font-size: 1.2rem;
                color: #6b7280;
                max-width: 600px;
                margin: 0 auto;
            }

            .features-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
                gap: 2rem;
            }

            .feature-card {
                background: white;
                border-radius: 20px;
                padding: 2.5rem;
                box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
                border: 1px solid #e5e7eb;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }

            .feature-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                transform: scaleX(0);
                transition: transform 0.3s ease;
            }

            .feature-card:hover {
                transform: translateY(-10px);
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
            }

            .feature-card:hover::before {
                transform: scaleX(1);
            }

            .feature-icon {
                width: 60px;
                height: 60px;
                border-radius: 16px;
                background: linear-gradient(135deg, #667eea, #764ba2);
                display: flex;
                align-items: center;
                justify-content: center;
                margin-bottom: 1.5rem;
                color: white;
                font-size: 1.5rem;
            }

            .feature-card h3 {
                font-size: 1.5rem;
                font-weight: 700;
                color: #1a1a1a;
                margin-bottom: 1rem;
            }

            .feature-card p {
                color: #6b7280;
                margin-bottom: 1.5rem;
                line-height: 1.6;
            }

            .feature-list {
                list-style: none;
                padding: 0;
            }

            .feature-list li {
                color: #6b7280;
                margin-bottom: 0.5rem;
                position: relative;
                padding-left: 1.5rem;
            }

            .feature-list li::before {
                content: '✓';
                position: absolute;
                left: 0;
                color: #10b981;
                font-weight: 600;
            }

            /* CTA Section */
            .cta-section {
                padding: 6rem 0;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                text-align: center;
            }

            .cta-content h2 {
                font-size: 3rem;
                font-weight: 800;
                margin-bottom: 1rem;
            }

            .cta-content p {
                font-size: 1.2rem;
                margin-bottom: 2rem;
                opacity: 0.9;
            }

            .cta-actions {
                display: flex;
                gap: 1.5rem;
                justify-content: center;
                flex-wrap: wrap;
            }

            .cta-actions .btn-outline {
                background: transparent;
                color: white;
                border: 2px solid white;
            }

            .cta-actions .btn-outline:hover {
                background: white;
                color: #667eea;
            }

            /* Search Section */
            .search-section {
                background: white;
                border-radius: 24px;
                padding: 3rem;
                margin: 2rem 0;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
                position: relative;
                z-index: 2;
            }

            .search-section h2 {
                font-size: 2.5rem;
                font-weight: 700;
                color: #1a1a1a;
                margin-bottom: 1rem;
                text-align: center;
            }

            .search-section .subtitle {
                text-align: center;
                color: #6b7280;
                margin-bottom: 2rem;
                font-size: 1.1rem;
            }
            
            .search-form {
                display: grid;
                grid-template-columns: 1fr 1fr 1fr auto;
                gap: 1.5rem;
                align-items: end;
            }
            
            .form-group {
                display: flex;
                flex-direction: column;
            }
            
            .form-group label {
                font-weight: 600;
                color: #374151;
                margin-bottom: 0.5rem;
                font-size: 0.95rem;
            }
            
            .form-group input,
            .form-group select {
                padding: 1rem 1.25rem;
                border: 2px solid #e5e7eb;
                border-radius: 12px;
                font-size: 1rem;
                transition: all 0.3s ease;
                background: white;
            }
            
            .form-group input:focus,
            .form-group select:focus {
                outline: none;
                border-color: #2563eb;
                box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
            }

            .search-btn {
                background: linear-gradient(135deg, #2563eb, #1d4ed8);
                color: white;
                border: none;
                padding: 1rem 2rem;
                border-radius: 12px;
                font-weight: 600;
                font-size: 1rem;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                gap: 0.5rem;
            }

            .search-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(37, 99, 235, 0.4);
            }
            
            /* Jobs Section */
            .jobs-section {
                padding: 4rem 0;
                background: white;
                margin-top: 2rem;
                border-radius: 24px;
                position: relative;
                z-index: 2;
            }
            
            .section-header {
                text-align: center;
                margin-bottom: 3rem;
            }
            
            .section-title {
                font-size: 2.5rem;
                font-weight: 700;
                color: #1a1a1a;
                margin-bottom: 1rem;
            }
            
            .section-subtitle {
                font-size: 1.2rem;
                color: #6b7280;
                max-width: 800px;
                margin: 0 auto;
            }
            
            .jobs-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                gap: 2rem;
                margin-top: 2rem;
            }
            
            .job-card {
                background: white;
                border: 1px solid #e5e7eb;
                border-radius: 16px;
                padding: 2rem;
                transition: all 0.3s ease;
                position: relative;
                overflow: hidden;
            }

            .job-card::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                height: 4px;
                background: linear-gradient(135deg, #2563eb, #1d4ed8);
                transform: scaleX(0);
                transition: transform 0.3s ease;
            }
            
            .job-card:hover {
                transform: translateY(-8px);
                box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);
                border-color: #2563eb;
            }

            .job-card:hover::before {
                transform: scaleX(1);
            }

            .job-badges {
                display: flex;
                gap: 0.5rem;
                margin-bottom: 1rem;
            }

            .badge {
                padding: 0.25rem 0.75rem;
                border-radius: 20px;
                font-size: 0.8rem;
                font-weight: 600;
            }

            .badge-featured {
                background: linear-gradient(135deg, #f59e0b, #d97706);
                color: white;
            }

            .badge-urgent {
                background: linear-gradient(135deg, #ef4444, #dc2626);
                color: white;
            }
            
            .job-header {
                display: flex;
                justify-content: space-between;
                align-items: start;
                margin-bottom: 1rem;
            }
            
            .job-title {
                font-size: 1.5rem;
                font-weight: 700;
                color: #1a1a1a;
                margin-bottom: 0.5rem;
            }
            
            .job-company {
                font-size: 1.1rem;
                color: #2563eb;
                font-weight: 600;
            }
            
            .job-meta {
                display: flex;
                flex-wrap: wrap;
                gap: 1rem;
                margin-bottom: 1rem;
                color: #6b7280;
                font-size: 0.95rem;
            }
            
            .job-salary {
                font-size: 1.2rem;
                font-weight: 700;
                color: #059669;
                margin-bottom: 1rem;
            }
            
            .job-description {
                color: #6b7280;
                margin-bottom: 1.5rem;
                line-height: 1.6;
            }
            
            .job-requirements {
                margin-bottom: 1.5rem;
            }
            
            .job-requirements h4 {
                font-weight: 600;
                color: #374151;
                margin-bottom: 0.5rem;
            }
            
            .requirements-list {
                display: flex;
                flex-wrap: wrap;
                gap: 0.5rem;
            }
            
            .requirement-tag {
                background: #f3f4f6;
                color: #374151;
                padding: 0.25rem 0.75rem;
                border-radius: 20px;
                font-size: 0.85rem;
                font-weight: 500;
            }
            
            .job-actions {
                display: flex;
                gap: 1rem;
            }
            
            .btn-apply {
                background: linear-gradient(135deg, #2563eb, #1d4ed8);
                color: white;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                flex: 1;
            }
            
            .btn-apply:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(37, 99, 235, 0.3);
            }
            
            .btn-save {
                background: transparent;
                color: #6b7280;
                border: 2px solid #e5e7eb;
                padding: 0.75rem 1rem;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
            }
            
            .btn-save:hover {
                border-color: #2563eb;
                color: #2563eb;
            }

            /* Stats Section */
            .stats-section {
                background: linear-gradient(135deg, #1e293b, #334155);
                color: white;
                padding: 4rem 0;
                margin: 2rem 0;
                border-radius: 24px;
                position: relative;
                z-index: 2;
            }

            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 2rem;
                text-align: center;
            }

            .stat {
                padding: 1.5rem;
            }

            .stat-number {
                font-size: 3rem;
                font-weight: 800;
                color: #60a5fa;
                margin-bottom: 0.5rem;
            }

            .stat-label {
                font-size: 1.1rem;
                color: rgba(255, 255, 255, 0.8);
                font-weight: 500;
            }

            /* Responsive Design */
            @media (max-width: 1024px) {
                .search-container {
                    display: none;
                }
                
                .nav-actions .auth-buttons {
                    display: none;
                }
            }

            @media (max-width: 768px) {
                .hero h1 {
                    font-size: 2.5rem;
                }

                .search-form {
                    grid-template-columns: 1fr;
                }

                .jobs-grid {
                    grid-template-columns: 1fr;
                }

                .nav-links {
                    display: none;
                }
                
                .search-container {
                    display: none;
                }
                
                .nav-actions {
                    gap: 0.5rem;
                }
                
                .user-name {
                    display: none;
                }
                
                .user-btn {
                    padding: 0.5rem;
                }
                
                .user-menu {
                    right: -50px;
                    min-width: 250px;
                }
            }

            @media (max-width: 480px) {
                .nav-actions .action-btn {
                    padding: 0.5rem;
                }
                
                .notification-badge,
                .message-badge {
                    font-size: 0.6rem;
                    padding: 0.1rem 0.3rem;
                    min-width: 16px;
                }
                
                .user-btn {
                    gap: 0.5rem;
                }
            }

            /* Animations */
            @keyframes fadeInUp {
                from {
                    opacity: 0;
                    transform: translateY(30px);
                }
                to {
                    opacity: 1;
                    transform: translateY(0);
                }
            }

            @keyframes float {
                0%, 100% {
                    transform: translateY(0px);
                }
                50% {
                    transform: translateY(-20px);
                }
            }

            @keyframes floatCard {
                0%, 100% {
                    transform: translateY(0px) rotate(0deg);
                }
                50% {
                    transform: translateY(-10px) rotate(1deg);
                }
            }

            @keyframes gradientShift {
                0%, 100% {
                    background-position: 0% 50%;
                }
                50% {
                    background-position: 100% 50%;
                }
            }

            @keyframes pulse {
                0%, 100% {
                    transform: scale(1);
                }
                50% {
                    transform: scale(1.05);
                }
            }

            .hero-badge {
                animation: pulse 2s ease-in-out infinite;
            }

            .floating-cards .job-card-float {
                animation: floatCard 6s ease-in-out infinite;
            }
        </style>
    </head>
    <body>
        <!-- Header -->
        <header class="header" id="header">
            <div class="container">
                <nav class="nav">
                    <a href="#" class="logo">
                        <i class="fas fa-rocket"></i>
                    Ask Ya Cham
                </a>
                    
                    <!-- Main Navigation -->
                    <ul class="nav-links">
                        <li class="nav-item dropdown">
                            <a href="#jobs" class="nav-link">
                                <i class="fas fa-briefcase"></i>
                                Jobs
                                <i class="fas fa-chevron-down"></i>
                            </a>
                            <div class="dropdown-menu">
                                <a href="#search" class="dropdown-item">
                                    <i class="fas fa-search"></i>
                                    Find Jobs
                                </a>
                                <a href="#saved" class="dropdown-item">
                                    <i class="fas fa-bookmark"></i>
                                    Saved Jobs
                                </a>
                                <a href="#recommendations" class="dropdown-item">
                                    <i class="fas fa-star"></i>
                                    Recommendations
                                </a>
                                <a href="#applications" class="dropdown-item">
                                    <i class="fas fa-file-alt"></i>
                                    My Applications
                                </a>
                            </div>
                        </li>
                        
                        <li class="nav-item dropdown">
                            <a href="#companies" class="nav-link">
                                <i class="fas fa-building"></i>
                                Companies
                                <i class="fas fa-chevron-down"></i>
                            </a>
                            <div class="dropdown-menu">
                                <a href="#top-companies" class="dropdown-item">
                                    <i class="fas fa-trophy"></i>
                                    Top Companies
                                </a>
                                <a href="#startups" class="dropdown-item">
                                    <i class="fas fa-rocket"></i>
                                    Startups
                                </a>
                                <a href="#fortune-500" class="dropdown-item">
                                    <i class="fas fa-crown"></i>
                                    Fortune 500
                                </a>
                                <a href="#unicorns" class="dropdown-item">
                                    <i class="fas fa-gem"></i>
                                    Unicorns
                                </a>
                            </div>
                        </li>
                        
                        <li class="nav-item dropdown">
                            <a href="#career" class="nav-link">
                                <i class="fas fa-graduation-cap"></i>
                                Career
                                <i class="fas fa-chevron-down"></i>
                            </a>
                            <div class="dropdown-menu">
                                <a href="#resume-builder" class="dropdown-item">
                                    <i class="fas fa-file-edit"></i>
                                    Resume Builder
                                </a>
                                <a href="#interview-prep" class="dropdown-item">
                                    <i class="fas fa-comments"></i>
                                    Interview Prep
                                </a>
                                <a href="#skills-assessment" class="dropdown-item">
                                    <i class="fas fa-chart-line"></i>
                                    Skills Assessment
                                </a>
                                <a href="#career-advice" class="dropdown-item">
                                    <i class="fas fa-lightbulb"></i>
                                    Career Advice
                                </a>
                            </div>
                        </li>
                        
                        <li class="nav-item dropdown">
                            <a href="#resources" class="nav-link">
                                <i class="fas fa-book"></i>
                                Resources
                                <i class="fas fa-chevron-down"></i>
                            </a>
                            <div class="dropdown-menu">
                                <a href="#salary-insights" class="dropdown-item">
                                    <i class="fas fa-dollar-sign"></i>
                                    Salary Insights
                                </a>
                                <a href="#job-trends" class="dropdown-item">
                                    <i class="fas fa-trending-up"></i>
                                    Job Trends
                                </a>
                                <a href="#industry-reports" class="dropdown-item">
                                    <i class="fas fa-chart-bar"></i>
                                    Industry Reports
                                </a>
                                <a href="#webinars" class="dropdown-item">
                                    <i class="fas fa-video"></i>
                                    Webinars
                                </a>
                            </div>
                        </li>
                        
                        <li class="nav-item dropdown">
                            <a href="#support" class="nav-link">
                                <i class="fas fa-life-ring"></i>
                                Support
                                <i class="fas fa-chevron-down"></i>
                            </a>
                            <div class="dropdown-menu">
                                <a href="#help-center" class="dropdown-item">
                                    <i class="fas fa-question-circle"></i>
                                    Help Center
                                </a>
                                <a href="#contact" class="dropdown-item">
                                    <i class="fas fa-envelope"></i>
                                    Contact Us
                                </a>
                                <a href="#faq" class="dropdown-item">
                                    <i class="fas fa-question"></i>
                                    FAQ
                                </a>
                                <a href="#api-docs" class="dropdown-item">
                                    <i class="fas fa-code"></i>
                                    API Documentation
                                </a>
                            </div>
                        </li>
                    </ul>
                    
                    <!-- Search Bar -->
                    <div class="search-container">
                        <div class="search-box">
                            <i class="fas fa-search"></i>
                            <input type="text" placeholder="Search jobs, companies, skills..." id="headerSearch">
                            <button class="search-btn-header" onclick="searchJobs(event)">
                                <i class="fas fa-arrow-right"></i>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Right Side Actions -->
                <div class="nav-actions">
                        <!-- Notifications -->
                        <div class="notification-container">
                            <button class="action-btn notification-btn">
                                <i class="fas fa-bell"></i>
                                <span class="notification-badge">3</span>
                            </button>
                </div>
                        
                        <!-- Messages -->
                        <div class="message-container">
                            <button class="action-btn message-btn">
                                <i class="fas fa-envelope"></i>
                                <span class="message-badge">5</span>
                            </button>
                        </div>
                        
                        <!-- Theme Toggle -->
                        <button class="action-btn theme-toggle" onclick="toggleTheme()">
                            <i class="fas fa-moon" id="themeIcon"></i>
                        </button>
                        
                        <!-- User Profile Dropdown -->
                        <div class="user-profile dropdown">
                            <button class="user-btn">
                                <img src="https://via.placeholder.com/32x32/4f46e5/ffffff?text=JD" alt="User" class="user-avatar">
                                <span class="user-name">John Doe</span>
                                <i class="fas fa-chevron-down"></i>
                            </button>
                            <div class="dropdown-menu user-menu">
                                <div class="user-info">
                                    <img src="https://via.placeholder.com/48x48/4f46e5/ffffff?text=JD" alt="User" class="user-avatar-large">
                                    <div class="user-details">
                                        <h4>John Doe</h4>
                                        <p>john.doe@example.com</p>
                                    </div>
                                </div>
                                <div class="menu-divider"></div>
                                <a href="#profile" class="dropdown-item">
                                    <i class="fas fa-user"></i>
                                    My Profile
                                </a>
                                <a href="#dashboard" class="dropdown-item">
                                    <i class="fas fa-tachometer-alt"></i>
                                    Dashboard
                                </a>
                                <a href="#settings" class="dropdown-item">
                                    <i class="fas fa-cog"></i>
                                    Settings
                                </a>
                                <a href="#analytics" class="dropdown-item">
                                    <i class="fas fa-chart-line"></i>
                                    Analytics
                                </a>
                                <div class="menu-divider"></div>
                                <a href="#help" class="dropdown-item">
                                    <i class="fas fa-question-circle"></i>
                                    Help & Support
                                </a>
                                <a href="#logout" class="dropdown-item logout">
                                    <i class="fas fa-sign-out-alt"></i>
                                    Sign Out
                                </a>
                            </div>
                        </div>
                        
                        <!-- Auth Buttons (when not logged in) -->
                        <div class="auth-buttons">
                            <a href="/login" class="btn btn-outline">Sign In</a>
                            <a href="/register" class="btn btn-primary">Get Started</a>
                        </div>
                    </div>
                </nav>
            </div>
        </header>

        <!-- Hero Section -->
             <section class="hero">
            <div class="hero-background">
                <div class="hero-particles"></div>
                <div class="hero-gradient"></div>
                     </div>
            <div class="container">
                <div class="hero-content" data-aos="fade-up" data-aos-duration="1000">
                    <div class="hero-badge">
                        <i class="fas fa-star"></i>
                        <span>World's #1 AI Job Matching Platform</span>
                    </div>
                    <h1 class="hero-title">
                        Find Your <span class="gradient-text">Dream Job</span><br>
                        with <span class="gradient-text">AI Precision</span>
                    </h1>
                    <p class="hero-subtitle">
                        Connect with the world's top companies including Google, Microsoft, Amazon, Meta, Netflix, Tesla, and more. 
                        Our revolutionary AI technology delivers 95%+ accurate matches between talented professionals and innovative companies.
                    </p>
                     <div class="hero-stats">
                        <div class="stat-item">
                            <div class="stat-number">50K+</div>
                            <div class="stat-label">Active Users</div>
                         </div>
                        <div class="stat-item">
                            <div class="stat-number">10K+</div>
                            <div class="stat-label">Job Postings</div>
                         </div>
                        <div class="stat-item">
                            <div class="stat-number">95%</div>
                            <div class="stat-label">Match Accuracy</div>
                         </div>
                        <div class="stat-item">
                            <div class="stat-number">25K+</div>
                            <div class="stat-label">Successful Hires</div>
                         </div>
                     </div>
                    <div class="hero-actions">
                        <button class="btn btn-primary btn-large" onclick="redirectToAuth()">
                            <i class="fas fa-rocket"></i>
                            Get Started Free
                        </button>
                        <button class="btn btn-outline btn-large" onclick="scrollToFeatures()">
                            <i class="fas fa-play"></i>
                            Watch Demo
                        </button>
                 </div>
                             </div>
                <div class="hero-visual" data-aos="fade-left" data-aos-duration="1200">
                    <div class="floating-cards">
                        <div class="job-card-float">
                            <div class="card-header">
                                <div class="company-logo">G</div>
                                <div class="company-info">
                                    <h4>Google</h4>
                                    <p>Senior Engineer</p>
                             </div>
                                <div class="match-score">98%</div>
                             </div>
                            <div class="card-details">
                                <span class="salary">$180K - $250K</span>
                                <span class="location">Mountain View, CA</span>
                     </div>
                </div>
                        <div class="job-card-float">
                            <div class="card-header">
                                <div class="company-logo">M</div>
                                <div class="company-info">
                                    <h4>Microsoft</h4>
                                    <p>AI Researcher</p>
                     </div>
                                <div class="match-score">95%</div>
                                </div>
                            <div class="card-details">
                                <span class="salary">$160K - $220K</span>
                                <span class="location">Seattle, WA</span>
                                    </div>
                                </div>
                        <div class="job-card-float">
                            <div class="card-header">
                                <div class="company-logo">A</div>
                                <div class="company-info">
                                    <h4>Amazon</h4>
                                    <p>Product Manager</p>
                                </div>
                                <div class="match-score">92%</div>
                                    </div>
                            <div class="card-details">
                                <span class="salary">$140K - $200K</span>
                                <span class="location">Seattle, WA</span>
                                </div>
                                </div>
                            </div>
                    </div>
                </div>
            </section>

        <!-- Features Section -->
        <section class="features-section" id="features">
            <div class="container">
                <div class="section-header" data-aos="fade-up">
                    <h2>Why Choose Ask Ya Cham?</h2>
                    <p>Revolutionary AI technology that transforms how you find and land your dream job</p>
                </div>
                <div class="features-grid">
                    <div class="feature-card" data-aos="fade-up" data-aos-delay="100">
                        <div class="feature-icon">
                            <i class="fas fa-brain"></i>
                        </div>
                        <h3>AI-Powered Matching</h3>
                        <p>Advanced machine learning algorithms analyze skills, experience, and cultural fit to deliver 95%+ accurate job matches.</p>
                        <ul class="feature-list">
                            <li>Semantic skill matching</li>
                            <li>Cultural fit analysis</li>
                            <li>Bias detection & mitigation</li>
                            <li>Continuous learning</li>
                     </ul>
                 </div>
                    <div class="feature-card" data-aos="fade-up" data-aos-delay="200">
                        <div class="feature-icon">
                            <i class="fas fa-bolt"></i>
                        </div>
                        <h3>Real-Time Communication</h3>
                        <p>Instant messaging, video calls, and collaborative hiring tools for seamless employer-candidate interactions.</p>
                        <ul class="feature-list">
                            <li>Live chat & video calls</li>
                            <li>Collaborative hiring</li>
                            <li>Instant notifications</li>
                            <li>Smart scheduling</li>
                     </ul>
                 </div>
                    <div class="feature-card" data-aos="fade-up" data-aos-delay="300">
                        <div class="feature-icon">
                            <i class="fas fa-shield-alt"></i>
                        </div>
                        <h3>Enterprise Security</h3>
                        <p>Bank-grade security with AES-256 encryption, OWASP compliance, and comprehensive audit logging.</p>
                        <ul class="feature-list">
                            <li>GDPR compliant</li>
                            <li>2FA authentication</li>
                            <li>Zero-trust architecture</li>
                            <li>Regular security audits</li>
                     </ul>
                 </div>
                    <div class="feature-card" data-aos="fade-up" data-aos-delay="400">
                        <div class="feature-icon">
                            <i class="fas fa-users"></i>
                        </div>
                        <h3>Diversity & Inclusion</h3>
                        <p>Built-in bias detection and mitigation tools ensure fair hiring practices and promote workplace diversity.</p>
                        <ul class="feature-list">
                            <li>Bias detection algorithms</li>
                            <li>Inclusive language tools</li>
                            <li>Diverse sourcing</li>
                            <li>Equal opportunity focus</li>
                     </ul>
                 </div>
                    <div class="feature-card" data-aos="fade-up" data-aos-delay="500">
                        <div class="feature-icon">
                            <i class="fas fa-globe"></i>
             </div>
                        <h3>Global Reach</h3>
                        <p>Connect with opportunities worldwide with multi-language support and global compliance standards.</p>
                        <ul class="feature-list">
                            <li>Multi-language support</li>
                            <li>Global compliance</li>
                            <li>Remote-first approach</li>
                            <li>Cross-border hiring</li>
                        </ul>
             </div>
                    <div class="feature-card" data-aos="fade-up" data-aos-delay="600">
                        <div class="feature-icon">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <h3>Advanced Analytics</h3>
                        <p>Comprehensive insights and analytics to track your job search progress and optimize your profile.</p>
                        <ul class="feature-list">
                            <li>Performance analytics</li>
                            <li>Market insights</li>
                            <li>Salary benchmarking</li>
                            <li>Career progression</li>
                        </ul>
                    </div>
                </div>
            </div>
        </section>

        <!-- CTA Section -->
        <section class="cta-section">
            <div class="container">
                <div class="cta-content" data-aos="fade-up">
                    <h2>Ready to Transform Your Career?</h2>
                    <p>Join thousands of professionals who have found their dream jobs with our AI-powered platform</p>
                    <div class="cta-actions">
                        <button class="btn btn-primary btn-large" onclick="redirectToAuth()">
                            <i class="fas fa-user-plus"></i>
                            Create Free Account
                        </button>
                        <button class="btn btn-outline btn-large" onclick="redirectToAuth()">
                            <i class="fas fa-sign-in-alt"></i>
                            Sign In
                        </button>
                    </div>
                </div>
            </div>
        </section>


        <script>
            // Header scroll effect
            window.addEventListener('scroll', () => {
                const header = document.getElementById('header');
                if (window.scrollY > 100) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });

            // Authentication redirect functions
            function redirectToAuth() {
                window.location.href = '/login?redirect=/dashboard';
            }
            
            function scrollToFeatures() {
                document.getElementById('features').scrollIntoView({ behavior: 'smooth' });
            }
            
            // Job search functionality - redirects to authentication
            function searchJobs(event) {
                event.preventDefault();
                // Redirect to authentication page for job search
                window.location.href = '/login?redirect=/jobs';
            }
            
            // Job application - requires authentication
            function applyJob(jobId) {
                // Redirect to authentication page for job application
                window.location.href = '/login?redirect=/jobs';
            }
            
            // Job saving - requires authentication
            function saveJob(jobId) {
                // Redirect to authentication page for job saving
                window.location.href = '/login?redirect=/jobs';
            }
            
            // Company search - requires authentication
            function searchCompanies(event) {
                event.preventDefault();
                window.location.href = '/login?redirect=/companies';
            }
            
            // Update job statistics
            function updateJobStats() {
                const totalApplications = \${JSON.stringify(jobs)}.reduce((sum, job) => sum + job.applications, 0);
                const statsElements = document.querySelectorAll('.stat-number');
                if (statsElements[2]) {
                    statsElements[2].textContent = totalApplications + '+';
                }
            }
            
            // Smooth scrolling for navigation links
            document.querySelectorAll('a[href^="#"]').forEach(anchor => {
                anchor.addEventListener('click', function (e) {
                    e.preventDefault();
                    const target = document.querySelector(this.getAttribute('href'));
                    if (target) {
                        target.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });
            
            // Theme Toggle
            function toggleTheme() {
                const body = document.body;
                const themeIcon = document.getElementById('themeIcon');
                
                if (body.classList.contains('dark-theme')) {
                    body.classList.remove('dark-theme');
                    themeIcon.className = 'fas fa-moon';
                    localStorage.setItem('theme', 'light');
                } else {
                    body.classList.add('dark-theme');
                    themeIcon.className = 'fas fa-sun';
                    localStorage.setItem('theme', 'dark');
                }
            }

            // Load saved theme
            function loadTheme() {
                const savedTheme = localStorage.getItem('theme');
                const themeIcon = document.getElementById('themeIcon');
                
                if (savedTheme === 'dark') {
                    document.body.classList.add('dark-theme');
                    themeIcon.className = 'fas fa-sun';
                } else {
                    document.body.classList.remove('dark-theme');
                    themeIcon.className = 'fas fa-moon';
                }
            }

            // Header search functionality
            function handleHeaderSearch(event) {
                if (event.key === 'Enter') {
                    event.preventDefault();
                    const searchTerm = event.target.value;
                    if (searchTerm.trim()) {
                        // Redirect to login for job search
                        window.location.href = \`/login?redirect=/jobs&search=\${encodeURIComponent(searchTerm)}\`;
                    }
                }
            }

            // Close dropdowns when clicking outside
            document.addEventListener('click', function(event) {
                const dropdowns = document.querySelectorAll('.dropdown');
                dropdowns.forEach(dropdown => {
                    if (!dropdown.contains(event.target)) {
                        const menu = dropdown.querySelector('.dropdown-menu');
                        if (menu) {
                            menu.style.opacity = '0';
                            menu.style.visibility = 'hidden';
                            menu.style.transform = 'translateY(-10px)';
                        }
                    }
                });
            });

            // Mobile menu toggle (for responsive design)
            function toggleMobileMenu() {
                const mobileMenu = document.querySelector('.mobile-menu');
                if (mobileMenu) {
                    mobileMenu.classList.toggle('active');
                }
            }

            // Initialize AOS animations
            if (typeof AOS !== 'undefined') {
                AOS.init({
                    duration: 1000,
                    easing: 'ease-in-out',
                    once: true,
                    offset: 100
                });
            }
            
            // Initialize
            updateJobStats();
            loadTheme();
            
            // Add event listener for header search
            const headerSearch = document.getElementById('headerSearch');
            if (headerSearch) {
                headerSearch.addEventListener('keypress', handleHeaderSearch);
            }
        </script>
    </body>
    </html>
  `);
});

// Authentication middleware
function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      error: 'Authentication required',
      message: 'Please log in to access this resource'
    });
  }
  next();
}

// API Routes - All protected
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
    return res.status(404).json({ 
      success: false,
      error: 'Job not found',
      message: 'The requested job does not exist'
    });
  }
  res.json({
    success: true,
    data: job,
    message: 'Job retrieved successfully'
  });
});

app.get('/api/users', requireAuth, (req, res) => {
  res.json({
    success: true,
    data: users,
    total: users.length,
    message: 'Users retrieved successfully'
  });
});

app.post('/api/applications', requireAuth, (req, res) => {
  const { jobId, userId, coverLetter, resume } = req.body;
  
  if (!jobId || !userId) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields',
      message: 'Job ID and User ID are required'
    });
  }
  
  const application = {
    id: applications.length + 1,
    jobId: parseInt(jobId),
    userId: parseInt(userId),
    coverLetter: coverLetter || '',
    resume: resume || '',
    status: 'pending',
    appliedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  applications.push(application);
  
  res.status(201).json({
    success: true,
    data: application,
    message: 'Application submitted successfully'
  });
});

// Health check endpoints
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'ask-ya-cham-global',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '2.0.0',
    features: ['Global Jobs', 'India Priority', 'AI Matching', 'World-class UI/UX']
  });
});

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'api',
    timestamp: new Date().toISOString(),
    version: '2.0.0'
  });
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
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: 'Inter', sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 2rem;
            }

            .login-container {
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(20px);
                border-radius: 24px;
                padding: 3rem;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                max-width: 400px;
                width: 100%;
            }

            .logo {
                text-align: center;
                margin-bottom: 2rem;
            }

            .logo h1 {
                font-size: 2rem;
                font-weight: 800;
                color: #1a1a1a;
                margin-bottom: 0.5rem;
            }

            .logo p {
                color: #6b7280;
                font-size: 0.9rem;
            }

            .form-group {
                margin-bottom: 1.5rem;
            }

            .form-group label {
                display: block;
                font-weight: 600;
                color: #374151;
                margin-bottom: 0.5rem;
            }

            .form-group input {
                width: 100%;
                padding: 1rem;
                border: 2px solid #e5e7eb;
                border-radius: 12px;
                font-size: 1rem;
                transition: all 0.3s ease;
                background: white;
            }

            .form-group input:focus {
                outline: none;
                border-color: #667eea;
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            }

            .btn {
                width: 100%;
                padding: 1rem;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                border: none;
                border-radius: 12px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                margin-bottom: 1rem;
            }

            .btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
            }

            .divider {
                text-align: center;
                margin: 1.5rem 0;
                position: relative;
                color: #6b7280;
            }

            .divider::before {
                content: '';
                position: absolute;
                top: 50%;
                left: 0;
                right: 0;
                height: 1px;
                background: #e5e7eb;
            }

            .divider span {
                background: rgba(255, 255, 255, 0.95);
                padding: 0 1rem;
            }

            .social-login {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 1rem;
                margin-bottom: 1.5rem;
            }

            .social-btn {
                padding: 0.75rem;
                border: 2px solid #e5e7eb;
                border-radius: 12px;
                background: white;
                color: #374151;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                display: flex;
                align-items: center;
                justify-content: center;
                gap: 0.5rem;
            }

            .social-btn:hover {
                border-color: #667eea;
                background: #f8fafc;
            }

            .signup-link {
                text-align: center;
                color: #6b7280;
            }

            .signup-link a {
                color: #667eea;
                text-decoration: none;
                font-weight: 600;
            }

            .signup-link a:hover {
                text-decoration: underline;
            }

            .error-message {
                background: #fef2f2;
                color: #dc2626;
                padding: 0.75rem;
                border-radius: 8px;
                margin-bottom: 1rem;
                font-size: 0.9rem;
                display: none;
            }
        </style>
    </head>
    <body>
        <div class="login-container">
            <div class="logo">
                <h1><i class="fas fa-rocket"></i> Ask Ya Cham</h1>
                <p>Sign in to access job features</p>
            </div>

            <div class="error-message" id="errorMessage"></div>

            <form id="loginForm">
                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input type="email" id="email" name="email" required>
                </div>
                <div class="form-group">
                    <label for="password">Password</label>
                    <input type="password" id="password" name="password" required>
                </div>
                <button type="submit" class="btn">
                    <i class="fas fa-sign-in-alt"></i>
                    Sign In
                </button>
            </form>

            <div class="divider">
                <span>or continue with</span>
            </div>

            <div class="social-login">
                <button class="social-btn" onclick="socialLogin('google')">
                    <i class="fab fa-google"></i>
                    Google
                </button>
                <button class="social-btn" onclick="socialLogin('linkedin')">
                    <i class="fab fa-linkedin"></i>
                    LinkedIn
                </button>
            </div>

            <div class="signup-link">
                Don't have an account? <a href="/register">Sign up for free</a>
            </div>
        </div>

        <script>
            document.getElementById('loginForm').addEventListener('submit', function(e) {
                e.preventDefault();
                
                const email = document.getElementById('email').value;
                const password = document.getElementById('password').value;
                const redirectUrl = '\${redirectUrl}';
                
                // Simple authentication (in production, use proper JWT)
                if (email && password) {
                    // Store auth token in localStorage
                    localStorage.setItem('authToken', 'demo-token-' + Date.now());
                    localStorage.setItem('userEmail', email);
                    
                    // Redirect to intended page
                    window.location.href = redirectUrl;
                } else {
                    showError('Please enter both email and password');
                }
            });

            function socialLogin(provider) {
                // Simulate social login
                localStorage.setItem('authToken', 'demo-token-' + Date.now());
                localStorage.setItem('userEmail', 'user@' + provider + '.com');
                window.location.href = '\${redirectUrl}';
            }

            function showError(message) {
                const errorDiv = document.getElementById('errorMessage');
                errorDiv.textContent = message;
                errorDiv.style.display = 'block';
                setTimeout(() => {
                    errorDiv.style.display = 'none';
                }, 5000);
            }
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
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: 'Inter', sans-serif;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                min-height: 100vh;
                display: flex;
                align-items: center;
                justify-content: center;
                padding: 2rem;
            }

            .register-container {
                background: rgba(255, 255, 255, 0.95);
                backdrop-filter: blur(20px);
                border-radius: 24px;
                padding: 3rem;
                box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
                border: 1px solid rgba(255, 255, 255, 0.2);
                max-width: 400px;
                width: 100%;
            }

            .logo {
                text-align: center;
                margin-bottom: 2rem;
            }

            .logo h1 {
                font-size: 2rem;
                font-weight: 800;
                color: #1a1a1a;
                margin-bottom: 0.5rem;
            }

            .logo p {
                color: #6b7280;
                font-size: 0.9rem;
            }

            .form-group {
                margin-bottom: 1.5rem;
            }

            .form-group label {
                display: block;
                font-weight: 600;
                color: #374151;
                margin-bottom: 0.5rem;
            }

            .form-group input {
                width: 100%;
                padding: 1rem;
                border: 2px solid #e5e7eb;
                border-radius: 12px;
                font-size: 1rem;
                transition: all 0.3s ease;
                background: white;
            }

            .form-group input:focus {
                outline: none;
                border-color: #667eea;
                box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
            }

            .btn {
                width: 100%;
                padding: 1rem;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                border: none;
                border-radius: 12px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                margin-bottom: 1rem;
            }

            .btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
            }

            .signin-link {
                text-align: center;
                color: #6b7280;
            }

            .signin-link a {
                color: #667eea;
                text-decoration: none;
                font-weight: 600;
            }

            .signin-link a:hover {
                text-decoration: underline;
            }

            .error-message {
                background: #fef2f2;
                color: #dc2626;
                padding: 0.75rem;
                border-radius: 8px;
                margin-bottom: 1rem;
                font-size: 0.9rem;
                display: none;
            }
        </style>
    </head>
    <body>
        <div class="register-container">
            <div class="logo">
                <h1><i class="fas fa-rocket"></i> Ask Ya Cham</h1>
                <p>Create your free account</p>
            </div>

            <div class="error-message" id="errorMessage"></div>

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
                <button type="submit" class="btn">
                    <i class="fas fa-user-plus"></i>
                    Create Account
                </button>
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
                    showError('Passwords do not match');
                    return;
                }
                
                if (name && email && password) {
                    // Store auth token in localStorage
                    localStorage.setItem('authToken', 'demo-token-' + Date.now());
                    localStorage.setItem('userEmail', email);
                    localStorage.setItem('userName', name);
                    
                    // Redirect to dashboard
                    window.location.href = '/dashboard';
                } else {
                    showError('Please fill in all fields');
                }
            });

            function showError(message) {
                const errorDiv = document.getElementById('errorMessage');
                errorDiv.textContent = message;
                errorDiv.style.display = 'block';
                setTimeout(() => {
                    errorDiv.style.display = 'none';
                }, 5000);
            }
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
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: 'Inter', sans-serif;
                background: #f8fafc;
                min-height: 100vh;
            }

            .header {
                background: white;
                border-bottom: 1px solid #e5e7eb;
                padding: 1rem 0;
            }

            .container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 2rem;
            }

            .nav {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .logo {
                font-size: 1.5rem;
                font-weight: 800;
                color: #667eea;
            }

            .user-info {
                display: flex;
                align-items: center;
                gap: 1rem;
            }

            .dashboard {
                padding: 2rem 0;
            }

            .welcome {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                padding: 3rem;
                border-radius: 20px;
                margin-bottom: 2rem;
                text-align: center;
            }

            .welcome h1 {
                font-size: 2.5rem;
                margin-bottom: 1rem;
            }

            .welcome p {
                font-size: 1.2rem;
                opacity: 0.9;
            }

            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 2rem;
                margin-bottom: 2rem;
            }

            .stat-card {
                background: white;
                padding: 2rem;
                border-radius: 16px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                text-align: center;
            }

            .stat-number {
                font-size: 2.5rem;
                font-weight: 800;
                color: #667eea;
                margin-bottom: 0.5rem;
            }

            .stat-label {
                color: #6b7280;
                font-weight: 500;
            }

            .actions {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 2rem;
            }

            .action-card {
                background: white;
                padding: 2rem;
                border-radius: 16px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                text-align: center;
            }

            .action-card h3 {
                margin-bottom: 1rem;
                color: #1a1a1a;
            }

            .action-card p {
                color: #6b7280;
                margin-bottom: 1.5rem;
            }

            .btn {
                display: inline-block;
                padding: 1rem 2rem;
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                text-decoration: none;
                border-radius: 12px;
                font-weight: 600;
                transition: all 0.3s ease;
            }

            .btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
            }
        </style>
    </head>
    <body>
        <header class="header">
            <div class="container">
                <nav class="nav">
                    <div class="logo">
                        <i class="fas fa-rocket"></i> Ask Ya Cham
                    </div>
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
                    <div class="action-card">
                        <h3><i class="fas fa-bookmark"></i> Saved Jobs</h3>
                        <p>View and manage your saved job listings</p>
                        <a href="/saved" class="btn">View Saved</a>
                    </div>
                    <div class="action-card">
                        <h3><i class="fas fa-file-alt"></i> Applications</h3>
                        <p>Track your job applications and status</p>
                        <a href="/applications" class="btn">View Applications</a>
                    </div>
                </div>
            </div>
        </main>

        <script>
            // Load user info
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
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: 'Inter', sans-serif;
                background: #f8fafc;
                min-height: 100vh;
            }

            .header {
                background: white;
                border-bottom: 1px solid #e5e7eb;
                padding: 1rem 0;
            }

            .container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 2rem;
            }

            .nav {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .logo {
                font-size: 1.5rem;
                font-weight: 800;
                color: #667eea;
            }

            .user-info {
                display: flex;
                align-items: center;
                gap: 1rem;
            }

            .jobs-section {
                padding: 2rem 0;
            }

            .search-form {
                background: white;
                padding: 2rem;
                border-radius: 16px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                margin-bottom: 2rem;
                display: grid;
                grid-template-columns: 1fr 1fr 1fr auto;
                gap: 1rem;
                align-items: end;
            }

            .form-group {
                display: flex;
                flex-direction: column;
            }

            .form-group label {
                font-weight: 600;
                color: #374151;
                margin-bottom: 0.5rem;
            }

            .form-group input,
            .form-group select {
                padding: 0.75rem;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                font-size: 1rem;
            }

            .search-btn {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
            }

            .jobs-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
                gap: 2rem;
            }

            .job-card {
                background: white;
                border-radius: 16px;
                padding: 2rem;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                transition: transform 0.3s ease;
            }

            .job-card:hover {
                transform: translateY(-5px);
            }

            .job-title {
                font-size: 1.5rem;
                font-weight: 700;
                color: #1a1a1a;
                margin-bottom: 0.5rem;
            }

            .job-company {
                font-size: 1.1rem;
                color: #667eea;
                font-weight: 600;
                margin-bottom: 1rem;
            }

            .job-meta {
                display: flex;
                gap: 1rem;
                color: #6b7280;
                margin-bottom: 1rem;
            }

            .job-salary {
                font-size: 1.2rem;
                font-weight: 700;
                color: #059669;
                margin-bottom: 1rem;
            }

            .job-actions {
                display: flex;
                gap: 1rem;
            }

            .btn-apply {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                border: none;
                padding: 0.75rem 1.5rem;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                flex: 1;
            }

            .btn-save {
                background: transparent;
                color: #6b7280;
                border: 2px solid #e5e7eb;
                padding: 0.75rem 1rem;
                border-radius: 8px;
                cursor: pointer;
            }
        </style>
    </head>
    <body>
        <header class="header">
            <div class="container">
                <nav class="nav">
                    <div class="logo">
                        <i class="fas fa-rocket"></i> Ask Ya Cham
                    </div>
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
                    \${jobs.map(job => \`
                        <div class="job-card">
                            <h3 class="job-title">\${job.title}</h3>
                            <div class="job-company">\${job.company}</div>
                            <div class="job-meta">
                                <span>📍 \${job.location}</span>
                                <span>⏰ \${job.type}</span>
                                <span>👤 \${job.experience}</span>
                            </div>
                            <div class="job-salary">💰 \${job.salary}</div>
                            <p style="color: #6b7280; margin-bottom: 1.5rem;">\${job.description}</p>
                            <div class="job-actions">
                                <button class="btn-apply" onclick="applyJob(\${job.id})">Apply Now</button>
                                <button class="btn-save" onclick="saveJob(\${job.id})">💾 Save</button>
                            </div>
                        </div>
                    \`).join('')}
                </div>
            </div>
        </main>

        <script>
            // Load user info
            const userName = localStorage.getItem('userName') || 'User';
            document.getElementById('userName').textContent = userName;

            function logout() {
                localStorage.removeItem('authToken');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userName');
                window.location.href = '/';
            }

            function searchJobs() {
                alert('Search functionality - jobs filtered!');
            }

            function applyJob(jobId) {
                alert('Applied to job ' + jobId + '!');
            }

            function saveJob(jobId) {
                alert('Job ' + jobId + ' saved!');
            }
        </script>
    </body>
    </html>
  `);
});

// Companies page (protected)
app.get('/companies', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Companies - Ask Ya Cham</title>
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&display=swap" rel="stylesheet">
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: 'Inter', sans-serif;
                background: #f8fafc;
                min-height: 100vh;
            }

            .header {
                background: white;
                border-bottom: 1px solid #e5e7eb;
                padding: 1rem 0;
            }

            .container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 2rem;
            }

            .nav {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .logo {
                font-size: 1.5rem;
                font-weight: 800;
                color: #667eea;
            }

            .user-info {
                display: flex;
                align-items: center;
                gap: 1rem;
            }

            .companies-section {
                padding: 2rem 0;
            }

            .companies-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 2rem;
            }

            .company-card {
                background: white;
                border-radius: 16px;
                padding: 2rem;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                text-align: center;
                transition: transform 0.3s ease;
            }

            .company-card:hover {
                transform: translateY(-5px);
            }

            .company-logo {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea, #764ba2);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 2rem;
                font-weight: 700;
                margin: 0 auto 1rem;
            }

            .company-name {
                font-size: 1.5rem;
                font-weight: 700;
                color: #1a1a1a;
                margin-bottom: 0.5rem;
            }

            .company-info {
                color: #6b7280;
                margin-bottom: 1.5rem;
            }

            .company-actions {
                display: flex;
                gap: 1rem;
            }

            .btn {
                flex: 1;
                padding: 0.75rem;
                border-radius: 8px;
                font-weight: 600;
                cursor: pointer;
                text-decoration: none;
                text-align: center;
            }

            .btn-primary {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                border: none;
            }

            .btn-outline {
                background: transparent;
                color: #667eea;
                border: 2px solid #667eea;
            }
        </style>
    </head>
    <body>
        <header class="header">
            <div class="container">
                <nav class="nav">
                    <div class="logo">
                        <i class="fas fa-rocket"></i> Ask Ya Cham
                    </div>
                    <div class="user-info">
                        <span id="userName">User</span>
                        <button onclick="logout()" style="background: none; border: none; color: #667eea; cursor: pointer;">
                            <i class="fas fa-sign-out-alt"></i> Logout
                        </button>
                    </div>
                </nav>
            </div>
        </header>

        <main class="companies-section">
            <div class="container">
                <h1 style="margin-bottom: 2rem; color: #1a1a1a;">🏢 Top Companies</h1>
                
                <div class="companies-grid">
                    <div class="company-card">
                        <div class="company-logo">G</div>
                        <h3 class="company-name">Google</h3>
                        <div class="company-info">
                            <p>Technology • Mountain View, CA</p>
                            <p>190,000+ employees</p>
                        </div>
                        <div class="company-actions">
                            <button class="btn btn-primary" onclick="viewCompany('google')">View Jobs</button>
                            <button class="btn btn-outline" onclick="followCompany('google')">Follow</button>
                        </div>
                    </div>
                    
                    <div class="company-card">
                        <div class="company-logo">M</div>
                        <h3 class="company-name">Microsoft</h3>
                        <div class="company-info">
                            <p>Technology • Seattle, WA</p>
                            <p>220,000+ employees</p>
                        </div>
                        <div class="company-actions">
                            <button class="btn btn-primary" onclick="viewCompany('microsoft')">View Jobs</button>
                            <button class="btn btn-outline" onclick="followCompany('microsoft')">Follow</button>
                        </div>
                    </div>
                    
                    <div class="company-card">
                        <div class="company-logo">A</div>
                        <h3 class="company-name">Amazon</h3>
                        <div class="company-info">
                            <p>E-commerce • Seattle, WA</p>
                            <p>1,500,000+ employees</p>
                        </div>
                        <div class="company-actions">
                            <button class="btn btn-primary" onclick="viewCompany('amazon')">View Jobs</button>
                            <button class="btn btn-outline" onclick="followCompany('amazon')">Follow</button>
                        </div>
                    </div>
                    
                    <div class="company-card">
                        <div class="company-logo">M</div>
                        <h3 class="company-name">Meta</h3>
                        <div class="company-info">
                            <p>Social Media • Menlo Park, CA</p>
                            <p>77,000+ employees</p>
                        </div>
                        <div class="company-actions">
                            <button class="btn btn-primary" onclick="viewCompany('meta')">View Jobs</button>
                            <button class="btn btn-outline" onclick="followCompany('meta')">Follow</button>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <script>
            // Load user info
            const userName = localStorage.getItem('userName') || 'User';
            document.getElementById('userName').textContent = userName;

            function logout() {
                localStorage.removeItem('authToken');
                localStorage.removeItem('userEmail');
                localStorage.removeItem('userName');
                window.location.href = '/';
            }

            function viewCompany(company) {
                alert('Viewing jobs at ' + company + '!');
            }

            function followCompany(company) {
                alert('Following ' + company + '!');
            }
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
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: 'Inter', sans-serif;
                background: #f8fafc;
                min-height: 100vh;
            }

            .header {
                background: white;
                border-bottom: 1px solid #e5e7eb;
                padding: 1rem 0;
            }

            .container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 2rem;
            }

            .nav {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .logo {
                font-size: 1.5rem;
                font-weight: 800;
                color: #667eea;
            }

            .nav-links {
                display: flex;
                gap: 2rem;
                align-items: center;
            }

            .nav-links a {
                color: #6b7280;
                text-decoration: none;
                font-weight: 500;
                transition: color 0.3s ease;
            }

            .nav-links a:hover {
                color: #667eea;
            }

            .btn {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                padding: 0.75rem 1.5rem;
                border-radius: 8px;
                text-decoration: none;
                font-weight: 600;
                transition: all 0.3s ease;
            }

            .btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
            }

            .about-section {
                padding: 4rem 0;
            }

            .hero {
                text-align: center;
                margin-bottom: 4rem;
            }

            .hero h1 {
                font-size: 3rem;
                font-weight: 800;
                color: #1a1a1a;
                margin-bottom: 1rem;
            }

            .hero p {
                font-size: 1.2rem;
                color: #6b7280;
                max-width: 600px;
                margin: 0 auto;
            }

            .features-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
                gap: 2rem;
                margin-bottom: 4rem;
            }

            .feature-card {
                background: white;
                padding: 2rem;
                border-radius: 16px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
                text-align: center;
            }

            .feature-icon {
                width: 80px;
                height: 80px;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea, #764ba2);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 2rem;
                margin: 0 auto 1rem;
            }

            .feature-card h3 {
                font-size: 1.5rem;
                font-weight: 700;
                color: #1a1a1a;
                margin-bottom: 1rem;
            }

            .feature-card p {
                color: #6b7280;
                line-height: 1.6;
            }

            .stats {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                padding: 4rem 0;
                text-align: center;
            }

            .stats-grid {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 2rem;
            }

            .stat-item h3 {
                font-size: 3rem;
                font-weight: 800;
                margin-bottom: 0.5rem;
            }

            .stat-item p {
                font-size: 1.1rem;
                opacity: 0.9;
            }
        </style>
    </head>
    <body>
        <header class="header">
            <div class="container">
                <nav class="nav">
                    <div class="logo">
                        <i class="fas fa-rocket"></i> Ask Ya Cham
                    </div>
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

                <div class="features-grid">
                    <div class="feature-card">
                        <div class="feature-icon">
                            <i class="fas fa-globe"></i>
                        </div>
                        <h3>Global Reach</h3>
                        <p>Access job opportunities from around the world with priority given to India-based positions.</p>
                    </div>
                    
                    <div class="feature-card">
                        <div class="feature-icon">
                            <i class="fas fa-robot"></i>
                        </div>
                        <h3>AI Matching</h3>
                        <p>Our advanced AI algorithms match you with the perfect job opportunities based on your skills and preferences.</p>
                    </div>
                    
                    <div class="feature-card">
                        <div class="feature-icon">
                            <i class="fas fa-palette"></i>
                        </div>
                        <h3>Beautiful Design</h3>
                        <p>Experience the world's most unique and intuitive UI/UX design that makes job searching a pleasure.</p>
                    </div>
                </div>

                <div class="stats">
                    <div class="stats-grid">
                        <div class="stat-item">
                            <h3>50K+</h3>
                            <p>Active Users</p>
                        </div>
                        <div class="stat-item">
                            <h3>100K+</h3>
                            <p>Job Listings</p>
                        </div>
                        <div class="stat-item">
                            <h3>95%</h3>
                            <p>Success Rate</p>
                        </div>
                        <div class="stat-item">
                            <h3>24/7</h3>
                            <p>Support</p>
                        </div>
                    </div>
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
        <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }

            body {
                font-family: 'Inter', sans-serif;
                background: #f8fafc;
                min-height: 100vh;
            }

            .header {
                background: white;
                border-bottom: 1px solid #e5e7eb;
                padding: 1rem 0;
            }

            .container {
                max-width: 1200px;
                margin: 0 auto;
                padding: 0 2rem;
            }

            .nav {
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .logo {
                font-size: 1.5rem;
                font-weight: 800;
                color: #667eea;
            }

            .nav-links {
                display: flex;
                gap: 2rem;
                align-items: center;
            }

            .nav-links a {
                color: #6b7280;
                text-decoration: none;
                font-weight: 500;
                transition: color 0.3s ease;
            }

            .nav-links a:hover {
                color: #667eea;
            }

            .btn {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                padding: 0.75rem 1.5rem;
                border-radius: 8px;
                text-decoration: none;
                font-weight: 600;
                transition: all 0.3s ease;
            }

            .btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
            }

            .contact-section {
                padding: 4rem 0;
            }

            .hero {
                text-align: center;
                margin-bottom: 4rem;
            }

            .hero h1 {
                font-size: 3rem;
                font-weight: 800;
                color: #1a1a1a;
                margin-bottom: 1rem;
            }

            .hero p {
                font-size: 1.2rem;
                color: #6b7280;
                max-width: 600px;
                margin: 0 auto;
            }

            .contact-grid {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 4rem;
                align-items: start;
            }

            .contact-form {
                background: white;
                padding: 2rem;
                border-radius: 16px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            }

            .form-group {
                margin-bottom: 1.5rem;
            }

            .form-group label {
                display: block;
                font-weight: 600;
                color: #374151;
                margin-bottom: 0.5rem;
            }

            .form-group input,
            .form-group textarea {
                width: 100%;
                padding: 1rem;
                border: 2px solid #e5e7eb;
                border-radius: 8px;
                font-size: 1rem;
                transition: border-color 0.3s ease;
            }

            .form-group input:focus,
            .form-group textarea:focus {
                outline: none;
                border-color: #667eea;
            }

            .form-group textarea {
                height: 120px;
                resize: vertical;
            }

            .submit-btn {
                background: linear-gradient(135deg, #667eea, #764ba2);
                color: white;
                border: none;
                padding: 1rem 2rem;
                border-radius: 8px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                width: 100%;
            }

            .submit-btn:hover {
                transform: translateY(-2px);
                box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4);
            }

            .contact-info {
                background: white;
                padding: 2rem;
                border-radius: 16px;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            }

            .info-item {
                display: flex;
                align-items: center;
                gap: 1rem;
                margin-bottom: 2rem;
            }

            .info-icon {
                width: 50px;
                height: 50px;
                border-radius: 50%;
                background: linear-gradient(135deg, #667eea, #764ba2);
                display: flex;
                align-items: center;
                justify-content: center;
                color: white;
                font-size: 1.2rem;
            }

            .info-content h3 {
                font-size: 1.2rem;
                font-weight: 700;
                color: #1a1a1a;
                margin-bottom: 0.5rem;
            }

            .info-content p {
                color: #6b7280;
            }
        </style>
    </head>
    <body>
        <header class="header">
            <div class="container">
                <nav class="nav">
                    <div class="logo">
                        <i class="fas fa-rocket"></i> Ask Ya Cham
                    </div>
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

                <div class="contact-grid">
                    <div class="contact-form">
                        <form id="contactForm">
                            <div class="form-group">
                                <label for="name">Full Name</label>
                                <input type="text" id="name" name="name" required>
                            </div>
                            <div class="form-group">
                                <label for="email">Email Address</label>
                                <input type="email" id="email" name="email" required>
                            </div>
                            <div class="form-group">
                                <label for="subject">Subject</label>
                                <input type="text" id="subject" name="subject" required>
                            </div>
                            <div class="form-group">
                                <label for="message">Message</label>
                                <textarea id="message" name="message" required></textarea>
                            </div>
                            <button type="submit" class="submit-btn">
                                <i class="fas fa-paper-plane"></i> Send Message
                            </button>
                        </form>
                    </div>

                    <div class="contact-info">
                        <div class="info-item">
                            <div class="info-icon">
                                <i class="fas fa-map-marker-alt"></i>
                            </div>
                            <div class="info-content">
                                <h3>Address</h3>
                                <p>123 Innovation Street<br>Tech City, TC 12345</p>
                            </div>
                        </div>
                        
                        <div class="info-item">
                            <div class="info-icon">
                                <i class="fas fa-phone"></i>
                            </div>
                            <div class="info-content">
                                <h3>Phone</h3>
                                <p>+1 (555) 123-4567</p>
                            </div>
                        </div>
                        
                        <div class="info-item">
                            <div class="info-icon">
                                <i class="fas fa-envelope"></i>
                            </div>
                            <div class="info-content">
                                <h3>Email</h3>
                                <p>hello@askyacham.com</p>
                            </div>
                        </div>
                        
                        <div class="info-item">
                            <div class="info-icon">
                                <i class="fas fa-clock"></i>
                            </div>
                            <div class="info-content">
                                <h3>Business Hours</h3>
                                <p>Mon - Fri: 9:00 AM - 6:00 PM<br>Sat: 10:00 AM - 4:00 PM</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>

        <script>
            document.getElementById('contactForm').addEventListener('submit', function(e) {
                e.preventDefault();
                alert('Thank you for your message! We\'ll get back to you soon.');
                this.reset();
            });
        </script>
    </body>
    </html>
  `);
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

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong!',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Ask Ya Cham Global Platform running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🌍 Global job matching with India priority enabled`);
  console.log(`🎨 World-class UI/UX design active`);
});