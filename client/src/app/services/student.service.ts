import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Student {
  _id?: string;
  name: string;
  email: string;
  gender: string;
  dob: string;
  class: string;
  course: string;
  fees: number;
  phone?: string;
  address?: string;
  isActive?: boolean;
}

@Injectable({ providedIn: 'root' })
export class StudentService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/students`;

  createStudent(
    student: Student,
  ): Observable<{ success: boolean; message: string; student: Student }> {
    return this.http.post<{
      success: boolean;
      message: string;
      student: Student;
    }>(this.apiUrl, student);
  }

  getStudents(): Observable<{ success: boolean; students: Student[] }> {
    return this.http.get<{ success: boolean; students: Student[] }>(this.apiUrl);
  }

  updateStudent(
    id: string,
    student: Student,
  ): Observable<{ success: boolean; message: string; student: Student }> {
    return this.http.put<{
      success: boolean;
      message: string;
      student: Student;
    }>(`${this.apiUrl}/${id}`, student);
  }

  deleteStudent(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`);
  }
}
