// angular import
import { Component } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { LoginService } from '../services/login.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export default class LoginComponent {
  form!: FormGroup;
  submitted = false;
  emailPattern =
    '^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$';
  loading: boolean = false;
  errorMessage: string = '';
  fieldTextType: boolean = false;

  get f() {
    return this.form.controls;
  }

  get fv() {
    return this.form.value;
  }

  constructor(
    private readonly _formBuilder: FormBuilder,
    private readonly _router: Router,
    private loginService: LoginService
  ) { }

  ngOnInit(): void {
    this.form = this._formBuilder.group({
      email: new FormControl('', [Validators.required]),
      password: new FormControl('', Validators.required),
    });
  }

  onSubmit() {
    this.submitted = true;
    this.loading = true;
    this.errorMessage = '';
    if (this.form.invalid) {
      this.loading = false;
      return;
    }
    const postData = {
      email: this.fv.email,
      password: this.fv.password
    };
    this.loginService.login(postData).subscribe({
      next: (res: any) => {
        if (res?.token) {
          localStorage.setItem('token', res.token);
          this._router.navigate(['/user']);
        }
      },
      error: (error) => {
        this.loading = false;
        this.errorMessage = error?.error?.error || 'Invalid credentials';
      }
    });
  }

  toggleFieldTextType() {
    this.fieldTextType = !this.fieldTextType;
  }
}
