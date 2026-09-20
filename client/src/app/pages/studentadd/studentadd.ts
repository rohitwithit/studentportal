import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { StudentService } from '../../services/student.service';

@Component({
  imports: [ReactiveFormsModule, RouterLink],
  standalone: true,
  selector: 'app-studentadd',
  styleUrl: './studentadd.css',
  templateUrl: './studentadd.html',
})
export class Studentadd {
  private fb = inject(FormBuilder);
  private studentService = inject(StudentService);

  loading = false;
  message = '';
  error = '';

  form = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    gender: ['', Validators.required],
    dob: ['', Validators.required],
    class: ['', Validators.required],
    course: ['', Validators.required],
    fees: [0, [Validators.required, Validators.min(0)]],
    phone: [''],
    address: [''],
  });

  fields = [
    { name: 'name', label: 'Full Name', type: 'text', full: false },
    { name: 'email', label: 'Email', type: 'email', full: false },
    {
      name: 'gender',
      label: 'Gender',
      type: 'select',
      options: ['Male', 'Female', 'Other'],
      full: false,
    },
    { name: 'dob', label: 'Date of Birth', type: 'date', full: false },
    { name: 'class', label: 'Class', type: 'text', full: false },
    { name: 'course', label: 'Course', type: 'text', full: false },
    { name: 'fees', label: 'Fees', type: 'number', full: false },
    { name: 'phone', label: 'Phone', type: 'text', full: false },
    { name: 'address', label: 'Address', type: 'text', full: true },
  ];

  submit() {
    this.message = '';
    this.error = '';

    if (this.form.invalid) {
      this.form.markAllAsTouched();
      this.error = 'Please fill all required fields correctly.';
      return;
    }

    this.loading = true;
    this.studentService.createStudent(this.form.getRawValue()).subscribe({
      next: (res) => {
        this.message = res.message;
        this.form.reset({ fees: 0 });
        this.loading = false;
      },
      error: (err) => {
        this.error = err?.error?.message || 'Could not add student.';
        this.loading = false;
      },
    });
  }
}