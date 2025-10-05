import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Profile {
  id: string;
  fullName: string;
  email: string;
  phone?: string;
  location?: string;
  linkedin?: string;
  summary?: string;
  skills: string[];
  experience: WorkExperience[];
  education: Education[];
  created_at: string;
  updated_at: string;
}

export interface WorkExperience {
  id?: string;
  title: string;
  company: string;
  startDate: string;
  endDate?: string;
  description: string;
}

export interface Education {
  id?: string;
  degree: string;
  institution: string;
  graduationYear: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProfileService {
  private readonly API_BASE_URL = 'https://www.askyacham.com/api/profile';

  constructor(private http: HttpClient) {}

  // Get user profile
  async getProfile(): Promise<Profile> {
    // In production, this would make an HTTP GET request
    // For now, return mock data
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          id: '1',
          fullName: 'John Doe',
          email: 'john.doe@example.com',
          phone: '+1 (555) 123-4567',
          location: 'San Francisco, CA',
          linkedin: 'https://linkedin.com/in/johndoe',
          summary: 'Experienced software engineer with 5+ years in web development. Passionate about creating scalable applications and leading development teams.',
          skills: ['JavaScript', 'TypeScript', 'Angular', 'React', 'Node.js', 'Python', 'AWS'],
          experience: [
            {
              id: '1',
              title: 'Senior Software Engineer',
              company: 'Tech Corp',
              startDate: '2020-01',
              endDate: 'Present',
              description: 'Leading development of web applications and mentoring junior developers.'
            },
            {
              id: '2',
              title: 'Software Engineer',
              company: 'StartupXYZ',
              startDate: '2018-06',
              endDate: '2019-12',
              description: 'Developed full-stack web applications using modern technologies.'
            }
          ],
          education: [
            {
              id: '1',
              degree: 'Bachelor of Computer Science',
              institution: 'University of Technology',
              graduationYear: '2018'
            }
          ],
          created_at: '2023-01-01T00:00:00Z',
          updated_at: '2023-12-01T00:00:00Z'
        });
      }, 500);
    });
  }

  // Update user profile
  async updateProfile(profileData: Partial<Profile>): Promise<Profile> {
    // In production, this would make an HTTP PUT request
    // For now, simulate successful update
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Profile updated:', profileData);
        resolve({
          id: '1',
          fullName: profileData.fullName || 'John Doe',
          email: profileData.email || 'john.doe@example.com',
          phone: profileData.phone,
          location: profileData.location,
          linkedin: profileData.linkedin,
          summary: profileData.summary,
          skills: profileData.skills || [],
          experience: profileData.experience || [],
          education: profileData.education || [],
          created_at: '2023-01-01T00:00:00Z',
          updated_at: new Date().toISOString()
        });
      }, 1000);
    });
  }

  // Upload profile picture
  async uploadProfilePicture(file: File): Promise<string> {
    // In production, this would make an HTTP POST request with FormData
    // For now, simulate successful upload
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Profile picture uploaded:', file.name);
        resolve('https://example.com/profile-pictures/user-1.jpg');
      }, 2000);
    });
  }

  // Add work experience
  async addWorkExperience(experience: WorkExperience): Promise<WorkExperience> {
    // In production, this would make an HTTP POST request
    // For now, simulate successful addition
    return new Promise((resolve) => {
      setTimeout(() => {
        const newExperience = {
          ...experience,
          id: Date.now().toString()
        };
        console.log('Work experience added:', newExperience);
        resolve(newExperience);
      }, 500);
    });
  }

  // Update work experience
  async updateWorkExperience(id: string, experience: WorkExperience): Promise<WorkExperience> {
    // In production, this would make an HTTP PUT request
    // For now, simulate successful update
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedExperience = {
          ...experience,
          id
        };
        console.log('Work experience updated:', updatedExperience);
        resolve(updatedExperience);
      }, 500);
    });
  }

  // Delete work experience
  async deleteWorkExperience(id: string): Promise<boolean> {
    // In production, this would make an HTTP DELETE request
    // For now, simulate successful deletion
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Work experience deleted:', id);
        resolve(true);
      }, 300);
    });
  }

  // Add education
  async addEducation(education: Education): Promise<Education> {
    // In production, this would make an HTTP POST request
    // For now, simulate successful addition
    return new Promise((resolve) => {
      setTimeout(() => {
        const newEducation = {
          ...education,
          id: Date.now().toString()
        };
        console.log('Education added:', newEducation);
        resolve(newEducation);
      }, 500);
    });
  }

  // Update education
  async updateEducation(id: string, education: Education): Promise<Education> {
    // In production, this would make an HTTP PUT request
    // For now, simulate successful update
    return new Promise((resolve) => {
      setTimeout(() => {
        const updatedEducation = {
          ...education,
          id
        };
        console.log('Education updated:', updatedEducation);
        resolve(updatedEducation);
      }, 500);
    });
  }

  // Delete education
  async deleteEducation(id: string): Promise<boolean> {
    // In production, this would make an HTTP DELETE request
    // For now, simulate successful deletion
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log('Education deleted:', id);
        resolve(true);
      }, 300);
    });
  }

  // Get profile completeness score
  async getProfileCompleteness(): Promise<number> {
    // In production, this would calculate based on profile data
    // For now, return a mock score
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(85); // 85% complete
      }, 200);
    });
  }

  // Get profile suggestions
  async getProfileSuggestions(): Promise<string[]> {
    // In production, this would provide AI-powered suggestions
    // For now, return mock suggestions
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          'Add more skills to your profile',
          'Include a professional summary',
          'Add your LinkedIn profile',
          'Upload a professional photo'
        ]);
      }, 300);
    });
  }
}
