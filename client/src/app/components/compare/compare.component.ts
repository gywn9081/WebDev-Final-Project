// import { Component, OnInit } from '@angular/core';
// import { ActivatedRoute } from '@angular/router';
// import { AuthService } from '../../services/auth.service';
// import { CompareService } from '../../services/compare.service';
// import { FriendService } from '../../services/friend.service';
// import { ScheduleService } from '../../services/schedule.service';
// import { CompareResult, Schedule, User } from '../../interfaces/models.interface';
// import { forkJoin } from 'rxjs';

// @Component({
//   selector: 'app-compare',
//   templateUrl: './compare.component.html',
//   styleUrls: ['./compare.component.css'],
// })
// export class CompareComponent implements OnInit {
//   currentUser!: User;
//   friend: User | null = null;
//   compareResult: CompareResult | null = null;
//   mySchedules: Schedule[] = [];
//   friendSchedules: Schedule[] = [];
//   isLoading = false;
//   errorMessage = '';

//   readonly days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

//   constructor(
//     private route: ActivatedRoute,
//     private authService: AuthService,
//     private compareService: CompareService,
//     private friendService: FriendService,
//     private scheduleService: ScheduleService
//   ) {}

//   ngOnInit(): void {
//     this.currentUser = this.authService.currentUser!;
//     const friendId = this.route.snapshot.paramMap.get('friendId')!;
//     this.loadData(friendId);
//   }

//   private loadData(friendId: string): void {
//     this.isLoading = true;

//     forkJoin({
//       friendData: this.friendService.getFriends(this.currentUser._id),
//       compareData: this.compareService.compareWithFriend(this.currentUser._id, friendId),
//       mySchedules: this.scheduleService.getSchedulesByUser(this.currentUser._id),
//       friendSchedules: this.scheduleService.getSchedulesByUser(friendId),
//     }).subscribe({
//       next: ({ friendData, compareData, mySchedules, friendSchedules }) => {
//         this.friend = friendData.find((f) => f._id === friendId) || null;
//         this.compareResult = compareData;
//         this.mySchedules = mySchedules;
//         this.friendSchedules = friendSchedules;
//         this.isLoading = false;
//       },
//       error: () => {
//         this.errorMessage = 'Failed to load comparison data.';
//         this.isLoading = false;
//       },
//     });
//   }

//   getMyCoursesForDay(day: string): Schedule[] {
//     return this.mySchedules
//       .filter((s) => s.days.includes(day))
//       .sort((a, b) => a.startTime.localeCompare(b.startTime));
//   }

//   getFriendCoursesForDay(day: string): Schedule[] {
//     return this.friendSchedules
//       .filter((s) => s.days.includes(day))
//       .sort((a, b) => a.startTime.localeCompare(b.startTime));
//   }

//   isSharedCourse(courseName: string): boolean {
//     return (
//       this.compareResult?.sharedClasses.some(
//         (sc) => sc.courseName.toLowerCase() === courseName.toLowerCase()
//       ) ?? false
//     );
//   }
// }


import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CompareService } from '../../services/compare.service';
import { FriendService } from '../../services/friend.service';
import { ScheduleService } from '../../services/schedule.service';
import { CompareResult, Schedule, User } from '../../interfaces/models.interface';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-compare',
  templateUrl: './compare.component.html',
  styleUrls: ['./compare.component.css'],
})
export class CompareComponent implements OnInit {
  currentUser!: User;
  friend: User | null = null;
  compareResult: CompareResult | null = null;
  mySchedules: Schedule[] = [];
  friendSchedules: Schedule[] = [];
  isLoading = false;
  errorMessage = '';

  readonly days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'];

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService,
    private compareService: CompareService,
    private friendService: FriendService,
    private scheduleService: ScheduleService
  ) {}

  ngOnInit(): void {
    this.currentUser = this.authService.currentUser!;
    const friendId = this.route.snapshot.paramMap.get('friendId')!;
    this.loadData(friendId);
  }

  private loadData(friendId: string): void {
    this.isLoading = true;

    forkJoin({
      friendData: this.friendService.getFriends(this.currentUser._id),
      compareData: this.compareService.compareWithFriend(this.currentUser._id, friendId),
      mySchedules: this.scheduleService.getSchedulesByUser(this.currentUser._id),
      friendSchedules: this.scheduleService.getSchedulesByUser(friendId),
    }).subscribe({
      next: ({ friendData, compareData, mySchedules, friendSchedules }) => {
        this.friend = friendData.find((f) => f._id === friendId) || null;
        this.compareResult = compareData;
        this.mySchedules = mySchedules;
        this.friendSchedules = friendSchedules;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Failed to load comparison data.';
        this.isLoading = false;
      },
    });
  }

  getMyCoursesForDay(day: string): Schedule[] {
    return this.mySchedules
      .filter((s) => s.days.includes(day))
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }

  getFriendCoursesForDay(day: string): Schedule[] {
    return this.friendSchedules
      .filter((s) => s.days.includes(day))
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  }

  isSharedCourse(courseName: string): boolean {
    return (
      this.compareResult?.sharedClasses.some(
        (sc) => sc.courseName.toLowerCase() === courseName.toLowerCase()
      ) ?? false
    );
  }

  hasWeekendData(): boolean {
    const all = [...this.mySchedules, ...this.friendSchedules];
    return all.some((s) => s.days.includes('Saturday') || s.days.includes('Sunday'));
  }

  getVisibleDays(): string[] {
    return this.hasWeekendData() ? this.days : this.days.slice(0, 5);
  }
}
