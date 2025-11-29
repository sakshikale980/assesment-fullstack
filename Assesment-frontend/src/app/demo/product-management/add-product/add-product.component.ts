import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

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
  id!: number;

  categories: any[] = [];
  selectedImage!: File;
  previewImage: string | ArrayBuffer | null = null;

  // Alert UI
  showSuccessAlert = false;
  notificationMessage = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    // private productService: ProductService,
    // private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {

    this.id = Number(this.route.snapshot.paramMap.get('id'));

    this.initializeForm();
    this.loadCategories();

    // Edit Mode
    if (this.id) {
      this.loadProductById();
    }
  }

  // Initialize form
  initializeForm() {
    this.productForm = this.fb.group({
      name: ['', Validators.required],
      categoryId: ['', Validators.required],
      price: ['', [Validators.required, Validators.min(1)]],
      image: [null]
    });
  }

  // Load categories
  loadCategories() {
    // this.categoryService.getAll().subscribe({
    //   next: (res: any) => {
    //     this.categories = res.data || res;
    //   },
    //   error: err => console.log(err)
    // });
  }

  // Load product (Edit mode)
  loadProductById() {
    // this.productService.getById(this.id).subscribe({
    //   next: (res: any) => {
    //     const product = res.data || res;
    //     this.productForm.patchValue(product);

    //     if (product.imageUrl) {
    //       this.previewImage = product.imageUrl;
    //     }
    //   },
    //   error: err => console.log(err)
    // });
  }

  // File Select
  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedImage = file;

      // Preview Image
      const reader = new FileReader();
      reader.onload = () => (this.previewImage = reader.result);
      reader.readAsDataURL(file);

      this.productForm.patchValue({
        image: file
      });
    }
  }

  // Form submit
  submit() {
    this.submitted = true;
    if (this.productForm.invalid) return;

    let formData = new FormData();
    formData.append('name', this.productForm.value.name);
    formData.append('categoryId', this.productForm.value.categoryId);
    formData.append('price', this.productForm.value.price);

    if (this.selectedImage) {
      formData.append('image', this.selectedImage);
    }

    if (this.id) {
      // Update
      // this.productService.update(this.id, formData).subscribe({
      //   next: () => this.showAlert('Product Updated Successfully!'),
      //   error: (err) => console.log(err)
      // });
    } else {
      // Create
      // this.productService.create(formData).subscribe({
      //   next: () => {
      //     this.showAlert('Product Added Successfully!');
      //     this.productForm.reset();
      //     this.previewImage = null;
      //     this.submitted = false;
      //   },
      //   error: (err) => console.log(err)
      // });
    }
  }

  // Alert popup show
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
}
