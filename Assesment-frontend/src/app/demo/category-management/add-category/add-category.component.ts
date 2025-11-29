import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-add-category',
  standalone: true,
  imports: [FormsModule,CommonModule, ReactiveFormsModule, ],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.scss'
})
export class AddCategoryComponent {
 categoryForm!: FormGroup;
  submitted = false;
  id: number | null = null;

  showSuccessAlert = false;
  notificationMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    // private categoryService: CategoryService
  ) {}

  ngOnInit(): void {
    this.categoryForm = this.fb.group({
      name: ['', Validators.required]
    });

    this.id = Number(this.route.snapshot.paramMap.get('id'));

    if (this.id) {
      this.loadData();
    }
  }

  get fc() {
    return this.categoryForm.controls;
  }

  loadData() {
    // this.categoryService.getCategoryById(this.id!).subscribe(res => {
    //   this.categoryForm.patchValue({ name: res.name });
    // });
  }

  submit() {
    this.submitted = true;

    if (this.categoryForm.invalid) return;

    if (this.id) {
      // this.categoryService.updateCategory(this.id, this.categoryForm.value).subscribe(() => {
      //   this.showAlert('Category updated successfully!');
      // });
    } else {
      // this.categoryService.addCategory(this.categoryForm.value).subscribe(() => {
      //   this.showAlert('Category added successfully!');
      //   this.categoryForm.reset();
      //   this.submitted = false;
      // });
    }
  }

  showAlert(message: string) {
    this.notificationMessage = message;
    this.showSuccessAlert = true;

    setTimeout(() => {
      this.closeAlert();
      this.router.navigate(['/category']);
    }, 2000);
  }

  closeAlert() {
    this.showSuccessAlert = false;
  }
}