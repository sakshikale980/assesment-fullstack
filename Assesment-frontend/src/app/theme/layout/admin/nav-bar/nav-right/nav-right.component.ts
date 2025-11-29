import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-right',
  templateUrl: './nav-right.component.html',
  styleUrls: ['./nav-right.component.scss']
})
export class NavRightComponent implements OnInit {

  userName: string;
  constructor(
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userName = localStorage.getItem('userName');
  }

  onLogout() {
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
