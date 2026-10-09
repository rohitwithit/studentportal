import { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import { studentService, type Student } from '../services/studentService'
import axios from 'axios'

function formatDate(dob: string) {
  try {
    return new Date(dob).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch {
    return dob
  }
}

const emptyStudent = (): Student => ({
  name: '',
  email: '',
  gender: 'Male',
  dob: '',
  class: '',
  course: '',
  fees: 0,
})

export default function Dashboard() {
  const [students, setStudents] = useState<Student[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editModel, setEditModel] = useState<Student>(emptyStudent())
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const { logout } = useAuth()
  const navigate = useNavigate()

  const loadStudents = useCallback(async () => {
    try {
      const res = await studentService.getStudents()
      setStudents(res.students ?? [])
      setMessage(`Loaded ${res.students?.length ?? 0} students`)
      setError('')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Could not load students.')
        if (err.response?.status === 401) {
          logout()
          navigate('/login')
        }
      } else {
        setError('Could not load students.')
      }
    }
  }, [logout, navigate])

  useEffect(() => {
    loadStudents()
  }, [loadStudents])

  const startEdit = (student: Student) => {
    setEditingId(student._id || null)
    setEditModel({
      ...student,
      dob: student.dob ? student.dob.substring(0, 10) : '',
    })
  }

  const cancelEdit = () => {
    setEditingId(null)
  }

  const saveEdit = async (id: string) => {
    try {
      const res = await studentService.updateStudent(id, editModel)
      setStudents((prev) =>
        prev.map((s) => (s._id === id ? res.student : s))
      )
      setEditingId(null)
      setMessage(res.message)
      setError('')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Update failed.')
      } else {
        setError('Update failed.')
      }
    }
  }

  const deleteStudent = async (id: string) => {
    if (!confirm('Are you sure you want to delete this student?')) return

    try {
      const res = await studentService.deleteStudent(id)
      setStudents((prev) => prev.filter((s) => s._id !== id))
      setMessage(res.message)
      setError('')
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Delete failed.')
      } else {
        setError('Delete failed.')
      }
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      <nav className="bg-slate-900 text-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <Link to="/" className="font-bold">
            Student Portal Admin
          </Link>
          <button
            onClick={handleLogout}
            className="rounded-lg bg-white/10 px-4 py-2 hover:bg-white/20"
          >
            Logout
          </button>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <p className="text-slate-600">Manage all registered students.</p>
          </div>
          <Link
            to="/add-student"
            className="rounded-lg bg-slate-900 px-5 py-3 font-semibold text-white"
          >
            + Add Student
          </Link>
        </div>

        {message && (
          <p className="mb-5 rounded-lg bg-emerald-50 p-3 text-emerald-700">{message}</p>
        )}

        {error && <p className="mb-5 rounded-lg bg-red-50 p-3 text-red-700">{error}</p>}

        <div className="overflow-x-auto rounded-2xl bg-white shadow">
          <table className="min-w-full text-left text-sm">
            <thead className="bg-slate-100">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Gender</th>
                <th className="px-4 py-3">DOB</th>
                <th className="px-4 py-3">Class</th>
                <th className="px-4 py-3">Course</th>
                <th className="px-4 py-3">Fees</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-12 text-center text-slate-500">
                    No students found.
                  </td>
                </tr>
              ) : (
                students.map((student) => (
                  <tr key={student._id} className="border-t">
                    {editingId === student._id ? (
                      <>
                        <td className="px-4 py-3">
                          <input
                            value={editModel.name}
                            onChange={(e) =>
                              setEditModel((m) => ({ ...m, name: e.target.value }))
                            }
                            className="w-32 rounded border px-2 py-1"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            value={editModel.email}
                            onChange={(e) =>
                              setEditModel((m) => ({ ...m, email: e.target.value }))
                            }
                            className="w-44 rounded border px-2 py-1"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <select
                            value={editModel.gender}
                            onChange={(e) =>
                              setEditModel((m) => ({ ...m, gender: e.target.value }))
                            }
                            className="rounded border px-2 py-1"
                          >
                            <option>Male</option>
                            <option>Female</option>
                            <option>Other</option>
                          </select>
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="date"
                            value={editModel.dob}
                            onChange={(e) =>
                              setEditModel((m) => ({ ...m, dob: e.target.value }))
                            }
                            className="rounded border px-2 py-1"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            value={editModel.class}
                            onChange={(e) =>
                              setEditModel((m) => ({ ...m, class: e.target.value }))
                            }
                            className="w-24 rounded border px-2 py-1"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            value={editModel.course}
                            onChange={(e) =>
                              setEditModel((m) => ({ ...m, course: e.target.value }))
                            }
                            className="w-28 rounded border px-2 py-1"
                          />
                        </td>
                        <td className="px-4 py-3">
                          <input
                            type="number"
                            value={editModel.fees}
                            onChange={(e) =>
                              setEditModel((m) => ({
                                ...m,
                                fees: Number(e.target.value),
                              }))
                            }
                            className="w-24 rounded border px-2 py-1"
                          />
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button
                            onClick={() => saveEdit(student._id!)}
                            className="mr-2 text-emerald-600"
                          >
                            Save
                          </button>
                          <button onClick={cancelEdit} className="text-slate-500">
                            Cancel
                          </button>
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-4 py-3 font-medium">{student.name}</td>
                        <td className="px-4 py-3">{student.email}</td>
                        <td className="px-4 py-3">{student.gender}</td>
                        <td className="px-4 py-3">{formatDate(student.dob)}</td>
                        <td className="px-4 py-3">{student.class}</td>
                        <td className="px-4 py-3">{student.course}</td>
                        <td className="px-4 py-3">₹{student.fees}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          <button
                            onClick={() => startEdit(student)}
                            className="mr-3 text-blue-600"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => deleteStudent(student._id!)}
                            className="text-red-600"
                          >
                            Delete
                          </button>
                        </td>
                      </>
                    )}
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </main>
    </>
  )
}
