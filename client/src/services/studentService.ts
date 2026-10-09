import api from './api'

export interface Student {
  _id?: string
  name: string
  email: string
  gender: string
  dob: string
  class: string
  course: string
  fees: number
  phone?: string
  address?: string
  isActive?: boolean
}

export const studentService = {
  async createStudent(
    student: Student
  ): Promise<{ success: boolean; message: string; student: Student }> {
    const { data } = await api.post('/students', student)
    return data
  },

  async getStudents(): Promise<{ success: boolean; students: Student[] }> {
    const { data } = await api.get('/students')
    return data
  },

  async updateStudent(
    id: string,
    student: Student
  ): Promise<{ success: boolean; message: string; student: Student }> {
    const { data } = await api.put(`/students/${id}`, student)
    return data
  },

  async deleteStudent(id: string): Promise<{ success: boolean; message: string }> {
    const { data } = await api.delete(`/students/${id}`)
    return data
  },
}
