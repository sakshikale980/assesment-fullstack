import { CommonModule } from '@angular/common';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserService } from '../service/user.service';
import { HttpClient } from '@angular/common/http';
import { NgSelectConfig, NgSelectModule } from '@ng-select/ng-select';
import { DisallowSpaceDirective } from 'src/app/theme/shared/directives/disallow-space.directive';
import { MiddlespacesAllowDirective } from 'src/app/theme/shared/directives/middlespaces-allow.directive';
import { CapitalizeFirstDirective } from 'src/app/theme/shared/directives/capitalize-first.directive';

@Component({
  selector: 'app-add-user',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterLink, NgSelectModule, DisallowSpaceDirective, MiddlespacesAllowDirective, CapitalizeFirstDirective],
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
  providers: [UserService, HttpClient],
})

export class AddUserComponent implements OnInit {
  userForm!: FormGroup;
  submitted = false;
  isEditMode = false;
  fieldTextType = false;
  id: any;
  showSuccessAlert = false;
  notificationMessage = '';
  @ViewChild('alertContainer') alertcontainer!: ElementRef;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private activate: ActivatedRoute,
    private userService: UserService
  ) {
    this.id = this.activate.snapshot.queryParams['id'];
  }

  ngOnInit(): void {
    this.initializeForm();
    if (this.id) {
      this.isEditMode = true;
      this.loadUser();
      this.removePasswordValidation();
    }
  }

  initializeForm() {
    this.userForm = this.fb.group({
      userName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  get fc() {
    return this.userForm.controls;
  }

  loadUser() {
    this.userService.getUserById(this.id).subscribe((res: any) => {
      this.userForm.patchValue({
        userName: res.userName,
        email: res.email
      });
    });
  }

  removePasswordValidation() {
    this.userForm.get('password')?.clearValidators();
    this.userForm.get('password')?.updateValueAndValidity();
  }

  togglefieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }

  onSubmit() {
    this.submitted = true;
    if (this.userForm.invalid) return;
    const payload = this.userForm.value;
    if (this.isEditMode) {
      delete payload.password; 
      this.userService.updateUser(this.id, payload).subscribe({
        next: (res: any) => this.showNotification({
          message: 'User updated successfully!'
        }),
        error: (err) => this.showNotification({
          message: err.error?.message || 'Update failed!'
        })
      });

    } else {
      this.userService.addUser(payload).subscribe({
        next: (res: any) => this.showNotification({
          message: 'User added successfully!'
        }),
        error: (err) => this.showNotification({
          message: err.error?.message || 'Create failed!'
        })
      });
    }
  }

  showNotification(res: any) {
    this.notificationMessage = res.message;
    this.showSuccessAlert = true;

    setTimeout(() => {
      this.showSuccessAlert = false;
      this.navigateToBackUsers();
    }, 2000);
  }

  closeAlert() {
    this.showSuccessAlert = false;
  }

  navigateToBackUsers() {
    this.router.navigate(['/user']);
  }
  
}




