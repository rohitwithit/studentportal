# studentportal
Angular App

Here is the full **README.md** content:

```markdown
# Student Portal

A full-stack Student Portal application built with **Angular 22** (Frontend), **Node.js + Express** (Backend), and **MongoDB Atlas** (Database).

---

## Tech Stack

| Layer      | Technology                          |
|------------|-------------------------------------|
| Frontend   | Angular 22, Tailwind CSS, TypeScript |
| Backend    | Node.js, Express 5, Mongoose        |
| Database   | MongoDB Atlas                       |
| Auth       | JWT + bcryptjs                      |

---

## Project Structure

```
studentportal/
├── client/                 # Angular 22 Frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── guards/
│   │   │   ├── pages/      # home, login, dashboard, studentadd
│   │   │   └── services/
│   │   └── environments/
│   ├── angular.json
│   └── package.json
│
├── server/                 # Express Backend
│   ├── config/             # Database connection
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── repositories/
│   ├── routes/
│   ├── services/
│   ├── validators/
│   ├── seedAdmin.js
│   ├── server.js
│   └── package.json
│
└── README.md
```

---

## Prerequisites

Make sure you have the following installed on your machine:

- **Node.js** (v20 or higher recommended) → [Download](https://nodejs.org/)
- **npm** (comes with Node.js)
- **Angular CLI** (optional but recommended)
- A free **MongoDB Atlas** account → [Sign up](https://www.mongodb.com/cloud/atlas)

Check your versions:

```bash
node -v
npm -v
```

---

## 1. Clone the Repository

```bash
git clone https://github.com/rohitwithit/studentportal.git
cd studentportal
```

---

## 2. MongoDB Atlas Setup

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and log in.
2. Create a new project (or use an existing one).
3. Click **Build a Database** → Choose the **Free (M0)** tier.
4. Select a cloud provider & region → Click **Create**.
5. Create a database user:
   - Username: e.g. `studentportal`
   - Password: create a strong password (save it)
6. Under **Network Access** → Add IP Address:
   - Click **Add IP Address**
   - Choose **Allow Access from Anywhere** (`0.0.0.0/0`) for development
7. Click **Connect** on your cluster → Choose **Drivers** → Copy the connection string.

Your connection string will look like this:

```
mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/studentportal?retryWrites=true&w=majority
```

**Important:** Replace `<username>` and `<password>` with your actual credentials.

---

## 3. Backend Setup (Express + Node)

### Step 3.1 – Install Dependencies

```bash
cd server
npm install
```

### Step 3.2 – Create Environment File

Create a file named `.env` inside the `server` folder:

```bash
# On Linux / macOS
touch .env

# On Windows (PowerShell)
New-Item .env
```

Paste the following content into `server/.env`:

```env
PORT=3000
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/studentportal?retryWrites=true&w=majority
JWT_SECRET=e06318ea90639f113e30d6657e167f035097db05818ada81ce18a79a620543a111feb2650d7b346ffffd23a5fece4006002561c6d2eaebde0457447eb967c348
```

**Replace:**
- `MONGO_URI` → your actual MongoDB Atlas connection string
- `JWT_SECRET` → a long random string (you can generate one online or use a password generator)

> ⚠️ Never commit the `.env` file to Git. It is already listed in `.gitignore`.

### Step 3.3 – Seed Admin User

This creates the default admin account in the database:

```bash
npm run seed-admin
```

**Default Admin Credentials:**

| Field    | Value                    |
|----------|--------------------------|
| Email    | `emailexample@gmail.com`  |
| Password | `Example@123`            |

> You can change these credentials later by modifying `server/seedAdmin.js` and running the seed command again (it skips if the admin already exists).

### Step 3.4 – Start the Backend Server

**Development mode** (with auto-restart):

```bash
npm run dev
```

**Production mode:**

```bash
npm start
```

You should see:

```
✅ MongoDB Connected Successfully
Server running at http://localhost:3000
```

Test the health endpoint:

```bash
curl http://localhost:3000/api/health
```

Expected response:

```json
{
  "success": true,
  "message": "Student Portal API is running"
}
```

---

## 4. Frontend Setup (Angular 22)

Open a **new terminal** (keep the backend running).

### Step 4.1 – Install Dependencies

```bash
cd client
npm install
```

### Step 4.2 – Verify Environment Configuration

Open `client/src/environments/environment.ts` and confirm it points to your backend:

```ts
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

### Step 4.3 – Start the Angular Development Server

```bash
npm start
```

or

```bash
npx ng serve
```

The app will be available at:

```
http://localhost:4200
```

---

## 5. Running the Full Application

1. Start **Backend** first:
   ```bash
   cd server
   npm run dev
   ```

2. Start **Frontend** in another terminal:
   ```bash
   cd client
   npm start
   ```

3. Open your browser and go to:  
   **http://localhost:4200**

4. Login using the seeded admin credentials:
   - **Email:** `rohitwithit@gmail.com`
   - **Password:** `Dahiwad@123`

---

## Available Scripts

### Backend (`server/`)

| Command              | Description                          |
|----------------------|--------------------------------------|
| `npm start`          | Start server in production mode      |
| `npm run dev`        | Start server with nodemon (dev)      |
| `npm run seed-admin` | Create default admin user            |

### Frontend (`client/`)

| Command              | Description                          |
|----------------------|--------------------------------------|
| `npm start`          | Start Angular dev server             |
| `npm run build`      | Build for production                 |
| `npm run watch`      | Build and watch for changes          |
| `npm test`           | Run unit tests                       |

---

## API Endpoints

| Method | Endpoint                  | Description              | Auth Required |
|--------|---------------------------|--------------------------|---------------|
| GET    | `/api/health`             | Health check             | No            |
| POST   | `/api/admin/login`        | Admin login              | No            |
| GET    | `/api/students`           | Get all students         | Yes           |
| POST   | `/api/students`           | Add new student          | Yes           |
| GET    | `/api/students/:id`       | Get student by ID        | Yes           |
| PUT    | `/api/students/:id`       | Update student           | Yes           |
| DELETE | `/api/students/:id`       | Delete student           | Yes           |

---

## Common Issues & Troubleshooting

### 1. MongoDB Connection Failed

- Double-check your `MONGO_URI` in `server/.env`
- Make sure you replaced `<username>` and `<password>`
- Verify Network Access in Atlas allows your IP (`0.0.0.0/0` for development)
- Ensure the database name (`studentportal`) is correct

### 2. CORS Error

The backend is configured to allow requests only from `http://localhost:4200`.  
If you change the frontend port, update this line in `server/server.js`:

```js
app.use(cors({ origin: "http://localhost:4200" }));
```

### 3. Port Already in Use

If port `3000` is occupied, change `PORT` in `server/.env` and also update `apiUrl` in the Angular environment file.

### 4. Angular CLI not found

Install it globally:

```bash
npm install -g @angular/cli@22
```

### 5. Admin already exists

The seed script will not create a duplicate. If you want to reset:

1. Delete the admin document from MongoDB Atlas (or drop the collection)
2. Run `npm run seed-admin` again

---

## Production Notes

1. Change the `JWT_SECRET` to a strong random value.
2. Update `client/src/environments/environment.prod.ts` with your production API URL.
3. Never commit `.env` files.
4. Restrict MongoDB Atlas Network Access to your server IPs only.
5. Change the default admin password after first login.

---

## License

This project is for educational purposes.
```