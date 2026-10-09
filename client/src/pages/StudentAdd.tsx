import { useState, type FormEvent, type ChangeEvent } from 'react'
import { Link } from 'react-router-dom'
import { studentService, type Student } from '../services/studentService'
import axios from 'axios'

const fields = [
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
] as const

const initialForm: Student = {
  name: '',
  email: '',
  gender: '',
  dob: '',
  class: '',
  course: '',
  fees: 0,
  phone: '',
  address: '',
}

export default function StudentAdd() {
  const [form, setForm] = useState<Student>(initialForm)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }))
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setMessage('')
    setError('')

    if (
      !form.name ||
      form.name.length < 2 ||
      !form.email ||
      !form.gender ||
      !form.dob ||
      !form.class ||
      !form.course ||
      form.fees < 0
    ) {
      setError('Please fill all required fields correctly.')
      return
    }

    setLoading(true)
    try {
      const res = await studentService.createStudent(form)
      setMessage(res.message)
      setForm(initialForm)
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Could not add student.')
      } else {
        setError('Could not add student.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <nav className="bg-slate-900 text-white">
        <div className="mx-auto flex max-w-5xl justify-between px-6 py-4">
          <Link to="/" className="font-bold">
            Student Portal
          </Link>
          <Link to="/login" className="hover:text-cyan-300">
            Admin Login
          </Link>
        </div>
      </nav>

      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Add Student</h1>
          <p className="mt-2 text-slate-600">Enter student details below.</p>
        </div>

        <form onSubmit={handleSubmit} className="rounded-2xl bg-white p-8 shadow">
          <div className="grid gap-5 md:grid-cols-2">
            {fields.map((field) => (
              <div key={field.name} className={field.full ? 'md:col-span-2' : ''}>
                <label className="mb-1 block text-sm font-semibold">{field.label}</label>

                {field.type === 'select' ? (
                  <select
                    name={field.name}
                    value={form[field.name as keyof Student] as string}
                    onChange={handleChange}
                    className="w-full rounded-lg border px-3 py-2"
                  >
                    <option value="">Select</option>
                    {'options' in field &&
                      field.options?.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                  </select>
                ) : (
                  <input
                    type={field.type}
                    name={field.name}
                    value={form[field.name as keyof Student] as string | number}
                    onChange={handleChange}
                    className="w-full rounded-lg border px-3 py-2 outline-none focus:border-cyan-500"
                  />
                )}
              </div>
            ))}
          </div>

          {message && (
            <p className="mt-5 rounded-lg bg-emerald-50 p-3 text-emerald-700">{message}</p>
          )}

          {error && <p className="mt-5 rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="mt-7 rounded-lg bg-slate-900 px-6 py-3 font-semibold text-white disabled:opacity-50"
          >
            {loading ? 'Saving...' : 'Save Student'}
          </button>
        </form>
      </main>
    </>
  )
}
