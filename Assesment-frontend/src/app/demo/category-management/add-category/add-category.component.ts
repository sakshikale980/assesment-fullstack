import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../service/category.service';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [FormsModule, CommonModule, ReactiveFormsModule,],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.scss'
})
export class AddCategoryComponent {
  categoryForm!: FormGroup;
  submitted = false;
  id: any = null;

  showSuccessAlert = false;
  notificationMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.id = this.route.snapshot.queryParams['id'];
    if (this.id) {
      this.loadCategory();
    }
  }

  initializeForm() {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required]
    });
  }

  get fc() {
    return this.categoryForm.controls;
  }

  loadCategory() {
    this.categoryService.getCategoryById(this.id).subscribe((res: any) => {
      this.categoryForm.patchValue({
        name: res.name
      });
    });
  }

  submit() {
    this.submitted = true;
    if (this.categoryForm.invalid) return;

    const payload = this.categoryForm.value;
    if (this.id) {
      this.categoryService.updateCategory(this.id, payload).subscribe({
        next: () => this.showAlert('Category updated successfully!'),
        error: () => this.showAlert('Update failed!')
      });

    } else {
      this.categoryService.addCategory(payload).subscribe({
        next: () => {
          this.showAlert('Category added successfully!');
          this.categoryForm.reset();
          this.submitted = false;
        },
        error: () => this.showAlert('Create failed!')
      });
    }
  }

  showAlert(message: string) {
    this.notificationMessage = message;
    this.showSuccessAlert = true;

    setTimeout(() => {
      this.showSuccessAlert = false;
      this.router.navigate(['/category']);
    }, 2000);
  }

  closeAlert() {
    this.showSuccessAlert = false;
  }

  navigateToBackCategory() {
    this.router.navigate(['/category']);
  }
}