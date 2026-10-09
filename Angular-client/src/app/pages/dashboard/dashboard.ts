import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Student, StudentService } from '../../services/student.service';

@Component({
  imports: [FormsModule, RouterLink, DatePipe],
  standalone: true,
  selector: 'app-dashboard',
  styleUrl: './dashboard.css',
  templateUrl: './dashboard.html',
})
export class Dashboard implements OnInit {
  private studentService = inject(StudentService);
  private auth = inject(AuthService);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef); // ← add this

  students: Student[] = [];
  editingId: string | null = null;
  editModel: Student = this.emptyStudent();
  message = '';
  error = '';

  ngOnInit() {
    this.loadStudents();
  }

  loadStudents() {
    this.studentService.getStudents().subscribe({
      next: (res) => {
        this.students = res.students ?? [];
        this.message = `Loaded ${this.students.length} students`;
        this.cdr.detectChanges(); // ← force the view to update
      },
      error: (err) => {
        this.error = err?.error?.message || 'Could not load students.';
        if (err.status === 401) {
          this.auth.logout();
          this.router.navigate(['/login']);
        }
        this.cdr.detectChanges();
      },
    });
  }

  startEdit(student: Student) {
    this.editingId = student._id || null;
    this.editModel = { ...student, dob: student.dob.substring(0, 10) };
  }

  cancelEdit() {
    this.editingId = null;
  }

  saveEdit(id: string) {
    this.studentService.updateStudent(id, this.editModel).subscribe({
      next: (res) => {
        const index = this.students.findIndex((s) => s._id === id);
        if (index >= 0) this.students[index] = res.student;
        this.editingId = null;
        this.message = res.message;
      },
      error: (err) => (this.error = err?.error?.message || 'Update failed.'),
    });
  }

  deleteStudent(id: string) {
    if (!confirm('Are you sure you want to delete this student?')) return;

    this.studentService.deleteStudent(id).subscribe({
      next: (res) => {
        this.students = this.students.filter((s) => s._id !== id);
        this.message = res.message;
      },
      error: (err) => (this.error = err?.error?.message || 'Delete failed.'),
    });
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }

  private emptyStudent(): Student {
    return {
      name: '',
      email: '',
      gender: 'Male',
      dob: '',
      class: '',
      course: '',
      fees: 0,
    };
  }
}
