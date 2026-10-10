# Student Portal – Docker Compose Deployment

Full-stack Student Portal deployed with **Docker Compose** on a single Ubuntu EC2 instance.

| Layer    | Technology                        |
|----------|-----------------------------------|
| Frontend | React 19 + Vite + Tailwind + Nginx |
| Backend  | Node.js + Express + Mongoose    |
| Database | MongoDB 7                         |

---

## Architecture

| Service   | Container Name            | Port on Host     | Public?              |
|-----------|---------------------------|------------------|----------------------|
| MongoDB   | studentportal-database    | 127.0.0.1:27017  | No                   |
| Backend   | studentportal-backend     | 127.0.0.1:3000   | No                   |
| Frontend  | studentportal-frontend    | 80 (443 later)   | Yes                  |

---

## Prerequisites

- Ubuntu 22.04 / 24.04 EC2
- Security Group:
  - **22** → Your IP only
  - **80** → 0.0.0.0/0
  - **443** → 0.0.0.0/0 (for later HTTPS)
  - **Do not open** 27017 or 3000 to the internet
- Docker + Docker Compose plugin

---

## 1. Install Docker & Compose

```bash
sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io docker-compose-v2
sudo usermod -aG docker ubuntu
newgrp docker
sudo systemctl enable --now docker
```

## 2. Clone the Repository

```bash
git clone https://github.com/rohitwithit/studentportal.git
cd studentportal
```

## 3. Required Files Structure

Ensure the following files exist in your repository:
- `docker-compose.yml` (root)
- `server/Dockerfile`
- `client/Dockerfile`
- `client/nginx.conf` (with `proxy_pass http://backend:3000/api/;`)

## 4. Stop Apache (if present)

Port 80 must be free.

```bash
sudo systemctl stop apache2
sudo systemctl disable apache2
sudo apt remove apache2 -y
```

## 5. Build & Start All Services

```bash
# Build and start in background
docker compose up -d --build
```

## 6. Seed Admin User

```bash
docker compose exec backend node seedAdmin.js
```

**Default credentials:**
| Field | Value |
|---|---|
| **Email** | `example@gmail.com` |
| **Password** | `Example@123` |

## 7. Verify

```bash
docker compose ps
curl http://localhost/api/health
```

Open in your browser:
`http://YOUR_PUBLIC_IP` (or your domain after Route 53 setup).

## 8. Route 53 Domain Setup

1. Allocate an Elastic IP and associate it with the EC2 instance.
2. In Route 53 → Hosted Zone → Create A Record:
   - **Name:** `@` (or `www`)
   - **Type:** `A`
   - **Value:** Your Elastic IP
3. Wait a few minutes and visit `http://yourdomain.com`.

---

## Useful Commands

```bash
# Restart services
docker compose restart

# Stop everything
docker compose down

# Stop + delete database volume (WARNING: deletes data)
docker compose down -v

# Rebuild after code changes
docker compose up -d --build
```

---

## Security Checklist

- [ ] MongoDB and Backend only bound to `127.0.0.1`
- [ ] Ports 27017 & 3000 closed in Security Group
- [ ] Only port 80 (and later 443) open publicly
- [ ] Strong `JWT_SECRET` set in `docker-compose.yml`
- [ ] Change default admin password after first login
- [ ] Enable HTTPS with Let’s Encrypt (recommended)

### Changing JWT Secret

Edit `docker-compose.yml`:
```yaml
JWT_SECRET: your_super_long_random_secret_here
```
Then restart:
```bash
docker compose up -d
```

---

## Quick Start Summary

```bash
# After cloning and checking files
sudo systemctl stop apache2 && sudo systemctl disable apache2 && sudo apt remove apache2 -y

docker compose up -d --build
docker compose exec backend node seedAdmin.js

# Test
curl http://localhost/api/health
```

---

## License

This project is for educational purposes.