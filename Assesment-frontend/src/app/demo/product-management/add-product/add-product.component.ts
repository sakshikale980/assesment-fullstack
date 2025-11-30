import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../category-management/service/category.service';
import { ProductService } from '../service/product.service';

@Component({
  selector: 'app-add-product',
  standalone: true,
  imports: [CommonModule,FormsModule,ReactiveFormsModule],
  templateUrl: './add-product.component.html',
  styleUrl: './add-product.component.scss'
})
export class AddProductComponent {
  productForm!: FormGroup;
  submitted = false;
  isEditMode = false;
  id!: string;
  categories: any[] = [];
  selectedImage!: File;
  previewImage: string | ArrayBuffer | null = null;
  showSuccessAlert = false;
  notificationMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private categoryService: CategoryService,
    private productService: ProductService
  ) {}

 ngOnInit(): void {
  this.id = this.route.snapshot.queryParams['id'];

  this.initializeForm();
  this.loadCategoriesForDropdown();

  if (this.id) {
    this.isEditMode = true;
    this.loadProductById();
  }
}
  initializeForm() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      categoryId: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(1)]],
      image: [null]
    });
  }

  loadCategoriesForDropdown() {
    this.categoryService.getCategoryList(1000, 1).subscribe({
      next: (res: any) => {
        this.categories = Array.isArray(res) ? res : res.rows || [];
      },
      error: (err) => console.error('Error loading categories', err)
    });
  }

  loadProductById() {
    this.productService.getById(this.id).subscribe({
      next: (res: any) => {
        this.productForm.patchValue({
          name: res.name,
          categoryId: res.CategoryId,
          price: res.price
        });

        if (res.image) {
          this.previewImage = `http://localhost:9000/uploads/${res.image}`;
        }
      },
      error: (err) => console.error('Error loading product', err)
    });
  }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;

      const reader = new FileReader();
      reader.onload = () => (this.previewImage = reader.result);
      reader.readAsDataURL(file);

      this.productForm.patchValue({ image: file });
    }
  }

  submit() {
    this.submitted = true;
    if (this.productForm.invalid) return;
    const formData = new FormData();
    formData.append('name', this.productForm.value.name);
    formData.append('categoryId', this.productForm.value.categoryId);
    formData.append('price', this.productForm.value.price);

    if (this.selectedImage) formData.append('image', this.selectedImage);

    if (this.isEditMode) {
      // Update
      this.productService.update(this.id, formData).subscribe({
        next: () => this.showAlert('Product Updated Successfully!'),
        error: (err) => console.error(err)
      });
    } else {
      // Add
      this.productService.create(formData).subscribe({
        next: () => {
          this.showAlert('Product Added Successfully!');
          this.productForm.reset();
          this.previewImage = null;
          this.submitted = false;
        },
        error: (err) => console.error(err)
      });
    }
  }

  showAlert(message: string) {
    this.notificationMessage = message;
    this.showSuccessAlert = true;

    setTimeout(() => {
      this.showSuccessAlert = false;
      this.router.navigate(['/product']);
    }, 1500);
  }

  closeAlert() {
    this.showSuccessAlert = false;
  }

   navigateToBackProduct() {
    this.router.navigate(['/product']);
  }

}