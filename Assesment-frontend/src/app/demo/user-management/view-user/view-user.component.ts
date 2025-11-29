import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../service/user.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-view-user',
  templateUrl: './view-user.component.html',
  styleUrls: ['./view-user.component.scss'],
  providers: [UserService,HttpClient]
})
export class ViewUserComponent implements OnInit {
  id: any;
  user: any;


  constructor(
    private activate: ActivatedRoute,
    private route: Router,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.id = this.activate.snapshot.queryParams['id'];
    this.getUserById(this.id);
  }

  navigateToBackUsers() {
    this.route.navigate(['/user']);
  }

getUserById(id: any): void {
    this.userService.getUserById(id).subscribe(
      response => {
        this.user = response;
      },
      error => {
        console.error('Error fetching user:', error);
      }
    );
  }
}
