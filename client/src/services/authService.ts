import api from './api'

export interface LoginResponse {
  success: boolean
  message: string
  token: string
  admin: { id: string; name: string; email: string }
}

export const authService = {
  async login(email: string, password: string): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>('/admin/login', { email, password })
    localStorage.setItem('token', data.token)
    return data
  },

  isLoggedIn(): boolean {
    return !!localStorage.getItem('token')
  },

  logout(): void {
    localStorage.removeItem('token')
  },

  getToken(): string | null {
    return localStorage.getItem('token')
  },
}
