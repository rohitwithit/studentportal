import { Link } from 'react-router-dom'

export default function Home() {
  return (
    <>
      <nav className="bg-slate-900 text-white">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link to="/" className="text-xl font-bold">
            Student Portal
          </Link>
          <div className="flex gap-5">
            <Link to="/add-student" className="hover:text-cyan-300">
              Add Student
            </Link>
            <Link to="/login" className="hover:text-cyan-300">
              Admin Login
            </Link>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid items-center gap-12 md:grid-cols-2">
          <section>
            <p className="mb-3 font-semibold text-cyan-600">STUDENT MANAGEMENT SYSTEM</p>
            <h1 className="text-5xl font-extrabold leading-tight">
              Manage student records simply.
            </h1>
            <p className="mt-5 text-lg text-slate-600">
              Add student information from the public portal and manage records securely from the
              admin dashboard.
            </p>
            <div className="mt-8 flex gap-4">
              <Link
                to="/add-student"
                className="rounded-lg bg-slate-900 px-6 py-3 font-semibold text-white hover:bg-slate-700"
              >
                Add Student
              </Link>
              <Link
                to="/login"
                className="rounded-lg border border-slate-300 px-6 py-3 font-semibold hover:bg-white"
              >
                Admin Login
              </Link>
            </div>
          </section>
          <div className="rounded-3xl bg-gradient-to-br from-cyan-500 to-blue-700 p-10 text-white shadow-xl">
            <h2 className="text-3xl font-bold">Student Portal</h2>
            <p className="mt-4 text-cyan-50">React + Tailwind CSS + Express + MongoDB</p>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="rounded-xl bg-white/15 p-5">
                <b className="text-2xl">01</b>
                <p>Add Students</p>
              </div>
              <div className="rounded-xl bg-white/15 p-5">
                <b className="text-2xl">02</b>
                <p>Admin Login</p>
              </div>
              <div className="rounded-xl bg-white/15 p-5">
                <b className="text-2xl">03</b>
                <p>Update Records</p>
              </div>
              <div className="rounded-xl bg-white/15 p-5">
                <b className="text-2xl">04</b>
                <p>Delete Records</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  )
}
