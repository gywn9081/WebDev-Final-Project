// import { Component, OnInit } from '@angular/core';
// import { Observable } from 'rxjs';
// import { AuthService } from '../../services/auth.service';
// import { ScheduleService } from '../../services/schedule.service';
// import { Schedule, ScheduleForm, User } from '../../interfaces/models.interface';

// const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
// const COLORS = ['#4f46e5', '#0891b2', '#16a34a', '#dc2626', '#9333ea', '#ea580c', '#0f766e'];

// @Component({
//   selector: 'app-schedule-dashboard',
//   templateUrl: './schedule-dashboard.component.html',
//   styleUrls: ['./schedule-dashboard.component.css'],
// })
// export class ScheduleDashboardComponent implements OnInit {
//   currentUser!: User;
//   schedules: Schedule[] = [];
//   isLoading = false;
//   showForm = false;
//   isEditing = false;
//   editingId: string | null = null;
//   errorMessage = '';

//   readonly days = DAYS;
//   readonly colors = COLORS;

//   form: ScheduleForm = this.emptyForm();

//   constructor(private authService: AuthService, private scheduleService: ScheduleService) {}

//   ngOnInit(): void {
//     this.currentUser = this.authService.currentUser!;
//     this.loadSchedules();
//   }

//   private emptyForm(): ScheduleForm {
//     return {
//       courseName: '',
//       courseCode: '',
//       days: [],
//       startTime: '',
//       endTime: '',
//       location: '',
//       color: '#4f46e5',
//     };
//   }

//   loadSchedules(): void {
//     this.isLoading = true;
//     this.scheduleService.getSchedulesByUser(this.currentUser._id).subscribe({
//       next: (data) => {
//         this.schedules = data;
//         this.isLoading = false;
//       },
//       error: (err) => {
//         this.errorMessage = 'Failed to load schedules.';
//         this.isLoading = false;
//       },
//     });
//   }

//   openAddForm(): void {
//     this.form = this.emptyForm();
//     this.isEditing = false;
//     this.editingId = null;
//     this.showForm = true;
//     this.errorMessage = '';
//   }

//   openEditForm(schedule: Schedule): void {
//     this.form = {
//       courseName: schedule.courseName,
//       courseCode: schedule.courseCode,
//       days: [...schedule.days],
//       startTime: schedule.startTime,
//       endTime: schedule.endTime,
//       location: schedule.location || '',
//       color: schedule.color || '#4f46e5',
//     };
//     this.isEditing = true;
//     this.editingId = schedule._id!;
//     this.showForm = true;
//     this.errorMessage = '';
//   }

//   cancelForm(): void {
//     this.showForm = false;
//     this.errorMessage = '';
//   }

//   toggleDay(day: string): void {
//     const idx = this.form.days.indexOf(day);
//     if (idx > -1) {
//       this.form.days.splice(idx, 1);
//     } else {
//       this.form.days.push(day);
//     }
//   }

//   isDaySelected(day: string): boolean {
//     return this.form.days.includes(day);
//   }

//   onSubmit(): void {
//     if (!this.form.courseName || !this.form.startTime || !this.form.endTime || this.form.days.length === 0) {
//       this.errorMessage = 'Course name, days, and times are required.';
//       return;
//     }

//     if (this.isEditing && this.editingId) {
//       this.scheduleService.updateSchedule(this.editingId, this.form).subscribe({
//         next: () => {
//           this.showForm = false;
//           this.loadSchedules();
//         },
//         error: () => {
//           this.errorMessage = 'Failed to update schedule entry.';
//         },
//       });
//     } else {
//       this.scheduleService.createSchedule(this.currentUser._id, this.form).subscribe({
//         next: () => {
//           this.showForm = false;
//           this.loadSchedules();
//         },
//         error: () => {
//           this.errorMessage = 'Failed to create schedule entry.';
//         },
//       });
//     }
//   }

//   deleteSchedule(id: string): void {
//     if (!confirm('Delete this course from your schedule?')) return;
//     this.scheduleService.deleteSchedule(id).subscribe({
//       next: () => this.loadSchedules(),
//       error: () => {
//         this.errorMessage = 'Failed to delete schedule entry.';
//       },
//     });
//   }

//   getSchedulesForDay(day: string): Schedule[] {
//     return this.schedules
//       .filter((s) => s.days.includes(day))
//       .sort((a, b) => a.startTime.localeCompare(b.startTime));
//   }

//   hasWeekendClasses(): boolean {
//     return this.schedules.some(
//       (s) => s.days.includes('Saturday') || s.days.includes('Sunday')
//     );
//   }

//   getVisibleDays(): string[] {
//     return this.hasWeekendClasses() ? this.days : this.days.slice(0, 5);
//   }
// }

import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ScheduleService } from '../../services/schedule.service';
import { Schedule, ScheduleForm, User } from '../../interfaces/models.interface';

declare const anime: any;

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const COLORS = ['#f5a623', '#3d8ef0', '#34d399', '#f87171', '#a78bfa', '#fb923c', '#22d3ee'];

@Component({
  selector: 'app-schedule-dashboard',
  templateUrl: './schedule-dashboard.component.html',
  styleUrls: ['./schedule-dashboard.component.css'],
})
export class ScheduleDashboardComponent implements OnInit, AfterViewInit {
  currentUser!: User;
  schedules: Schedule[] = [];
  isLoading = false;
  showForm = false;
  isEditing = false;
  editingId: string | null = null;
  errorMessage = '';

  readonly days = DAYS;
  readonly colors = COLORS;

  form: ScheduleForm = this.emptyForm();

  constructor(private authService: AuthService, private scheduleService: ScheduleService) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser!;
    this.loadSchedules();
  }

  ngAfterViewInit(): void {
    this.animateHeader();
  }

  private animateHeader(): void {
    if (typeof anime === 'undefined') return;
    anime({
      targets: '.dashboard-header, .stats-row',
      opacity: [0, 1],
      translateY: [-20, 0],
      duration: 600,
      easing: 'easeOutExpo',
      delay: anime.stagger(80),
    });
  }

  private animateCards(): void {
    if (typeof anime === 'undefined') return;
    anime({
      targets: '.day-column',
      opacity: [0, 1],
      translateY: [24, 0],
      duration: 500,
      easing: 'easeOutExpo',
      delay: anime.stagger(60),
    });
  }

  private emptyForm(): ScheduleForm {
    return { courseName: '', courseCode: '', days: [], startTime: '', endTime: '', location: '', color: '#f5a623' };
  }

  loadSchedules(): void {
    this.isLoading = true;
    this.scheduleService.getSchedulesByUser(this.currentUser._id).subscribe({
      next: (data) => {
        this.schedules = data;
        this.isLoading = false;
        setTimeout(() => this.animateCards(), 50);
      },
      error: () => {
        this.errorMessage = 'Failed to load schedules.';
        this.isLoading = false;
      },
    });
  }

  get totalCourses(): number { return this.schedules.length; }
  get busyDays(): number {
    const days = new Set(this.schedules.flatMap(s => s.days));
    return days.size;
  }
  get earliestClass(): string {
    if (!this.schedules.length) return '--';
    const sorted = [...this.schedules].sort((a, b) => a.startTime.localeCompare(b.startTime));
    return sorted[0].startTime;
  }

  openAddForm(): void {
    this.form = this.emptyForm();
    this.isEditing = false;
    this.editingId = null;
    this.showForm = true;
    this.errorMessage = '';
  }

  openEditForm(schedule: Schedule): void {
    this.form = {
      courseName: schedule.courseName,
      courseCode: schedule.courseCode,
      days: [...schedule.days],
      startTime: schedule.startTime,
      endTime: schedule.endTime,
      location: schedule.location || '',
      color: schedule.color || '#f5a623',
    };
    this.isEditing = true;
    this.editingId = schedule._id!;
    this.showForm = true;
    this.errorMessage = '';
  }

  cancelForm(): void {
    this.showForm = false;
    this.errorMessage = '';
  }

  toggleDay(day: string): void {
    const idx = this.form.days.indexOf(day);
    if (idx > -1) this.form.days.splice(idx, 1);
    else this.form.days.push(day);
  }

  isDaySelected(day: string): boolean {
    return this.form.days.includes(day);
  }

  onSubmit(): void {
    if (!this.form.courseName || !this.form.startTime || !this.form.endTime || this.form.days.length === 0) {
      this.errorMessage = 'Course name, at least one day, and times are required.';
      return;
    }
    if (this.isEditing && this.editingId) {
      this.scheduleService.updateSchedule(this.editingId, this.form).subscribe({
        next: () => { this.showForm = false; this.loadSchedules(); },
        error: () => { this.errorMessage = 'Failed to update course.'; },
      });
    } else {
      this.scheduleService.createSchedule(this.currentUser._id, this.form).subscribe({
        next: () => { this.showForm = false; this.loadSchedules(); },
        error: () => { this.errorMessage = 'Failed to create course.'; },
      });
    }
  }

  deleteSchedule(id: string): void {
    if (!confirm('Remove this course from your schedule?')) return;
    this.scheduleService.deleteSchedule(id).subscribe({
      next: () => this.loadSchedules(),
      error: () => { this.errorMessage = 'Failed to delete course.'; },
    });
  }

  getSchedulesForDay(day: string): Schedule[] {
    return this.schedules
      .filter((s) => s.days.includes(day))
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }

  hasWeekendClasses(): boolean {
    return this.schedules.some((s) => s.days.includes('Saturday') || s.days.includes('Sunday'));
  }

  getVisibleDays(): string[] {
    return this.hasWeekendClasses() ? this.days : this.days.slice(0, 5);
  }
}