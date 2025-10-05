import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService, User } from '../../auth/services/auth.service';
import { ProfileService } from '../services/profile.service';

@Component({
  selector: 'app-profile',
  template: `
    <div class="profile-container">
      <!-- Profile Header -->
      <div class="profile-header">
        <div class="profile-avatar">
          <img [src]="currentUser?.picture || 'assets/default-avatar.svg'" 
               [alt]="currentUser?.name" 
               class="avatar-image">
          <button mat-icon-button class="edit-avatar-button">
            <mat-icon>camera_alt</mat-icon>
          </button>
        </div>
        <div class="profile-info">
          <h2 class="profile-name">{{ currentUser?.name || 'Your Name' }}</h2>
          <p class="profile-email">{{ currentUser?.email }}</p>
          <div class="profile-badges">
            <mat-chip class="verified-badge" *ngIf="currentUser?.verified_email">
              <mat-icon>verified</mat-icon>
              Verified Email
            </mat-chip>
            <mat-chip class="provider-badge">
              <mat-icon>account_circle</mat-icon>
              {{ currentUser?.provider | titlecase }} Account
            </mat-chip>
          </div>
        </div>
        <div class="profile-actions">
          <button mat-raised-button class="edit-profile-button" (click)="toggleEditMode()">
            <mat-icon>edit</mat-icon>
            {{ isEditing ? 'Save Changes' : 'Edit Profile' }}
          </button>
        </div>
      </div>

      <!-- Profile Form -->
      <mat-card class="profile-card">
        <mat-card-header>
          <mat-card-title>Personal Information</mat-card-title>
          <mat-card-subtitle>Keep your profile up to date</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <form [formGroup]="profileForm" (ngSubmit)="saveProfile()">
            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Full Name</mat-label>
                <input matInput formControlName="fullName" [readonly]="!isEditing">
                <mat-icon matSuffix>person</mat-icon>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="email-field">
                <mat-label>Email Address</mat-label>
                <input matInput type="email" formControlName="email" readonly>
                <mat-icon matSuffix>email</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline" class="phone-field">
                <mat-label>Phone Number</mat-label>
                <input matInput type="tel" formControlName="phone" [readonly]="!isEditing">
                <mat-icon matSuffix>phone</mat-icon>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="location-field">
                <mat-label>Location</mat-label>
                <input matInput formControlName="location" [readonly]="!isEditing">
                <mat-icon matSuffix>location_on</mat-icon>
              </mat-form-field>

              <mat-form-field appearance="outline" class="linkedin-field">
                <mat-label>LinkedIn Profile</mat-label>
                <input matInput formControlName="linkedin" [readonly]="!isEditing">
                <mat-icon matSuffix>link</mat-icon>
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="full-width">
                <mat-label>Professional Summary</mat-label>
                <textarea matInput 
                          formControlName="summary" 
                          rows="4" 
                          [readonly]="!isEditing"
                          placeholder="Tell us about yourself, your skills, and what you're looking for..."></textarea>
              </mat-form-field>
            </div>

            <!-- Skills Section -->
            <div class="skills-section">
              <h3>Skills & Expertise</h3>
              <div class="skills-container">
                <mat-chip-set>
                  <mat-chip *ngFor="let skill of skills" 
                            [removable]="isEditing" 
                            (removed)="removeSkill(skill)">
                    {{ skill }}
                    <mat-icon matChipRemove *ngIf="isEditing">cancel</mat-icon>
                  </mat-chip>
                </mat-chip-set>
                
                <div class="add-skill" *ngIf="isEditing">
                  <mat-form-field appearance="outline" class="skill-input">
                    <mat-label>Add Skill</mat-label>
                    <input matInput 
                           [(ngModel)]="newSkill" 
                           (keyup.enter)="addSkill()"
                           placeholder="e.g. JavaScript, Python, React">
                    <mat-icon matSuffix (click)="addSkill()">add</mat-icon>
                  </mat-form-field>
                </div>
              </div>
            </div>

            <!-- Experience Section -->
            <div class="experience-section">
              <h3>Work Experience</h3>
              <div class="experience-list">
                <div *ngFor="let exp of experience; let i = index" class="experience-item">
                  <div class="experience-header">
                    <h4>{{ exp.title }}</h4>
                    <button mat-icon-button *ngIf="isEditing" (click)="removeExperience(i)">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                  <p class="company">{{ exp.company }}</p>
                  <p class="duration">{{ exp.startDate }} - {{ exp.endDate || 'Present' }}</p>
                  <p class="description">{{ exp.description }}</p>
                </div>
              </div>
              
              <button mat-button *ngIf="isEditing" (click)="addExperience()">
                <mat-icon>add</mat-icon>
                Add Experience
              </button>
            </div>

            <!-- Education Section -->
            <div class="education-section">
              <h3>Education</h3>
              <div class="education-list">
                <div *ngFor="let edu of education; let i = index" class="education-item">
                  <div class="education-header">
                    <h4>{{ edu.degree }}</h4>
                    <button mat-icon-button *ngIf="isEditing" (click)="removeEducation(i)">
                      <mat-icon>delete</mat-icon>
                    </button>
                  </div>
                  <p class="institution">{{ edu.institution }}</p>
                  <p class="year">{{ edu.graduationYear }}</p>
                </div>
              </div>
              
              <button mat-button *ngIf="isEditing" (click)="addEducation()">
                <mat-icon>add</mat-icon>
                Add Education
              </button>
            </div>

            <!-- Save Button -->
            <div class="form-actions" *ngIf="isEditing">
              <button mat-raised-button type="submit" class="save-button" [disabled]="!profileForm.valid">
                <mat-icon>save</mat-icon>
                Save Profile
              </button>
              <button mat-button type="button" (click)="cancelEdit()">
                Cancel
              </button>
            </div>
          </form>
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [`
    .profile-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 0;
    }

    .profile-header {
      display: flex;
      align-items: center;
      gap: 24px;
      margin-bottom: 32px;
      padding: 24px;
      background: white;
      border-radius: 8px;
      box-shadow: 0 1px 2px 0 rgba(60, 64, 67, 0.3), 0 1px 3px 1px rgba(60, 64, 67, 0.15);
    }

    .profile-avatar {
      position: relative;
      flex-shrink: 0;
    }

    .avatar-image {
      width: 120px;
      height: 120px;
      border-radius: 50%;
      object-fit: cover;
      border: 4px solid #e8eaed;
    }

    .edit-avatar-button {
      position: absolute;
      bottom: 0;
      right: 0;
      background: #1a73e8;
      color: white;
      width: 36px;
      height: 36px;
    }

    .edit-avatar-button:hover {
      background: #1557b0;
    }

    .profile-info {
      flex: 1;
    }

    .profile-name {
      font-family: 'Google Sans', sans-serif;
      font-size: 28px;
      font-weight: 400;
      color: #202124;
      margin: 0 0 8px 0;
    }

    .profile-email {
      font-size: 16px;
      color: #5f6368;
      margin: 0 0 16px 0;
    }

    .profile-badges {
      display: flex;
      gap: 8px;
    }

    .verified-badge {
      background-color: #e8f5e8;
      color: #137333;
    }

    .provider-badge {
      background-color: #e3f2fd;
      color: #1565c0;
    }

    .profile-actions {
      flex-shrink: 0;
    }

    .edit-profile-button {
      background-color: #1a73e8;
      color: white;
      font-family: 'Google Sans', sans-serif;
      font-weight: 500;
      text-transform: none;
      letter-spacing: 0.25px;
    }

    .edit-profile-button:hover {
      background-color: #1557b0;
    }

    .profile-card {
      margin-bottom: 32px;
    }

    .form-row {
      display: flex;
      gap: 16px;
      margin-bottom: 16px;
    }

    .form-row:last-child {
      margin-bottom: 0;
    }

    .full-width {
      width: 100%;
    }

    .email-field {
      flex: 1;
    }

    .phone-field {
      flex: 1;
    }

    .location-field {
      flex: 1;
    }

    .linkedin-field {
      flex: 1;
    }

    .skills-section,
    .experience-section,
    .education-section {
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #e8eaed;
    }

    .skills-section h3,
    .experience-section h3,
    .education-section h3 {
      font-family: 'Google Sans', sans-serif;
      font-size: 20px;
      font-weight: 500;
      color: #202124;
      margin: 0 0 16px 0;
    }

    .skills-container {
      margin-bottom: 16px;
    }

    .add-skill {
      margin-top: 16px;
    }

    .skill-input {
      width: 300px;
    }

    .experience-item,
    .education-item {
      padding: 16px;
      border: 1px solid #e8eaed;
      border-radius: 8px;
      margin-bottom: 16px;
    }

    .experience-header,
    .education-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 8px;
    }

    .experience-header h4,
    .education-header h4 {
      font-family: 'Google Sans', sans-serif;
      font-size: 16px;
      font-weight: 500;
      color: #202124;
      margin: 0;
    }

    .company,
    .institution {
      font-size: 14px;
      color: #1a73e8;
      margin: 0 0 4px 0;
      font-weight: 500;
    }

    .duration,
    .year {
      font-size: 14px;
      color: #5f6368;
      margin: 0 0 8px 0;
    }

    .description {
      font-size: 14px;
      color: #5f6368;
      line-height: 1.5;
      margin: 0;
    }

    .form-actions {
      display: flex;
      gap: 16px;
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid #e8eaed;
    }

    .save-button {
      background-color: #1a73e8;
      color: white;
      font-family: 'Google Sans', sans-serif;
      font-weight: 500;
      text-transform: none;
      letter-spacing: 0.25px;
    }

    .save-button:hover {
      background-color: #1557b0;
    }

    /* Responsive Design */
    @media (max-width: 768px) {
      .profile-header {
        flex-direction: column;
        text-align: center;
        gap: 16px;
      }

      .form-row {
        flex-direction: column;
        gap: 12px;
      }

      .email-field,
      .phone-field,
      .location-field,
      .linkedin-field {
        width: 100%;
      }

      .skill-input {
        width: 100%;
      }

      .form-actions {
        flex-direction: column;
      }

      .save-button {
        width: 100%;
      }
    }
  `]
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  currentUser: User | null = null;
  isEditing = false;
  newSkill = '';
  
  skills: string[] = ['JavaScript', 'TypeScript', 'Angular', 'React', 'Node.js'];
  experience: any[] = [
    {
      title: 'Senior Software Engineer',
      company: 'Tech Corp',
      startDate: '2020',
      endDate: 'Present',
      description: 'Leading development of web applications and mentoring junior developers.'
    }
  ];
  education: any[] = [
    {
      degree: 'Bachelor of Computer Science',
      institution: 'University of Technology',
      graduationYear: '2019'
    }
  ];

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private profileService: ProfileService
  ) {
    this.profileForm = this.fb.group({
      fullName: ['', [Validators.required]],
      email: [{ value: '', disabled: true }],
      phone: [''],
      location: [''],
      linkedin: [''],
      summary: ['']
    });
  }

  ngOnInit(): void {
    this.currentUser = this.authService.getCurrentUser();
    this.loadProfile();
  }

  private loadProfile(): void {
    if (this.currentUser) {
      this.profileForm.patchValue({
        fullName: this.currentUser.name,
        email: this.currentUser.email,
        phone: '',
        location: '',
        linkedin: '',
        summary: ''
      });
    }
  }

  toggleEditMode(): void {
    if (this.isEditing) {
      this.saveProfile();
    } else {
      this.isEditing = true;
      this.profileForm.enable();
    }
  }

  async saveProfile(): Promise<void> {
    if (this.profileForm.valid) {
      try {
        const profileData = this.profileForm.value;
        await this.profileService.updateProfile(profileData);
        this.isEditing = false;
        this.profileForm.disable();
      } catch (error) {
        console.error('Error saving profile:', error);
      }
    }
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.loadProfile();
    this.profileForm.disable();
  }

  addSkill(): void {
    if (this.newSkill.trim()) {
      this.skills.push(this.newSkill.trim());
      this.newSkill = '';
    }
  }

  removeSkill(skill: string): void {
    const index = this.skills.indexOf(skill);
    if (index > -1) {
      this.skills.splice(index, 1);
    }
  }

  addExperience(): void {
    this.experience.push({
      title: '',
      company: '',
      startDate: '',
      endDate: '',
      description: ''
    });
  }

  removeExperience(index: number): void {
    this.experience.splice(index, 1);
  }

  addEducation(): void {
    this.education.push({
      degree: '',
      institution: '',
      graduationYear: ''
    });
  }

  removeEducation(index: number): void {
    this.education.splice(index, 1);
  }
}
