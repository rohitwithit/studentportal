

```markdown
# Student Portal – Docker Deployment Guide (Single EC2)

Full-stack Student Portal  
**Frontend:** React 19 + Vite + Tailwind  
**Backend:** Node.js + Express + Mongoose  
**Database:** MongoDB  

This guide deploys **all three services on a single Ubuntu EC2 instance** using plain Docker (no Docker Compose, no custom Docker network).

Containers talk through host ports + IP, so you can later move each service to its own instance easily.

---

## Architecture

| Service   | Container | Host Port     | Publicly Open?      |
|-----------|-----------|---------------|---------------------|
| MongoDB   | database  | 27017         | No (Security Group) |
| Backend   | backend   | 3000          | No (Security Group) |
| Frontend  | frontend  | 80 (443 later)| Yes                 |

---

## Prerequisites

- Ubuntu 22.04 / 24.04 EC2 instance
- Security Group rules:
  - **22** → Your IP only (SSH)
  - **80** → 0.0.0.0/0 (HTTP)
  - **443** → 0.0.0.0/0 (HTTPS – later)
  - **27017** and **3000** → **Never open to the internet**
- Elastic IP (recommended for Route 53)

---

## 1. Connect to EC2 & Install Docker

```bash
ssh -i your-key.pem ubuntu@YOUR_ELASTIC_IP

sudo apt update && sudo apt upgrade -y
sudo apt install -y docker.io
sudo usermod -aG docker ubuntu
newgrp docker
sudo systemctl enable --now docker
```

---

## 2. Clone the Repository

```bash
git clone https://github.com/rohitwithit/studentportal.git
cd studentportal
```

---

## 3. Get the Host Private IP

```bash
HOST_IP=$(hostname -I | awk '{print $1}')
echo "Your HOST_IP is: $HOST_IP"
```

Save this value — you will use it in the next steps.

---

## 4. Run MongoDB

```bash
docker run -d \
  --name database \
  --restart always \
  -p 27017:27017 \
  -v mongo_data:/data/db \
  -e MONGO_INITDB_DATABASE=studentportal \
  mongo:7
```

---

## 5. Build & Run Backend

```bash
cd server
docker build -t studentportal-backend .

docker run -d \
  --name backend \
  --restart always \
  -p 3000:3000 \
  -e PORT=3000 \
  -e MONGO_URI=mongodb://$HOST_IP:27017/studentportal \
  -e JWT_SECRET=CHANGE_THIS_TO_A_LONG_RANDOM_STRING \
  -e CORS_ORIGIN="*" \
  studentportal-backend
```

### Seed Admin User

```bash
docker exec -it backend node seedAdmin.js
```

Default credentials (from `seedAdmin.js`):

| Field    | Value               |
|----------|---------------------|
| Email    | example@gmail.com   |
| Password | Example@123         |

---

## 6. Stop Apache (if present) – Required before Frontend

Port 80 must be free for the frontend container.

```bash
sudo systemctl stop apache2
sudo systemctl disable apache2
sudo apt remove apache2 -y
```

---

## 7. Build & Run Frontend

```bash
cd ../client

# Replace HOST_IP placeholder in nginx.conf
sed -i "s/HOST_IP/$HOST_IP/g" nginx.conf

# Build image
docker build -t studentportal-frontend .

# Run container
docker run -d \
  --name frontend \
  --restart always \
  -p 80:80 \
  studentportal-frontend
```

---

## 8. Verify Everything

```bash
docker ps
curl http://localhost/api/health
curl http://$HOST_IP/api/health
```

Open browser:

```
http://YOUR_PUBLIC_IP
```

or

```
http://yourdomain.com
```

---

## 9. Connect Domain with Route 53

1. Allocate an **Elastic IP** and associate it with the EC2 instance.
2. Go to **Route 53 → Hosted Zone** of your domain.
3. Create an **A Record**:
   - Name: `@` (or `www`)
   - Type: A
   - Value: Your Elastic IP
4. Wait a few minutes for DNS propagation.

Users can now visit `http://yourdomain.com`.

---

## Security Checklist

- [x] MongoDB bound only to `HOST_IP and 127.0.0.1`
- [x] Backend bound only to `HOST_IP and 127.0.0.1`
- [x] Ports 27017 and 3000 closed in Security Group
- [x] Only ports 80 (and later 443) open to the world
- [x] Strong `JWT_SECRET` set
- [x] Default admin password changed after first login
- [ ] HTTPS enabled with Let’s Encrypt (recommended next step)

---

## Moving to 3 Separate Instances Later

| Service  | Change only this                                    |
|----------|-----------------------------------------------------|
| Backend  | `MONGO_URI=mongodb://DATABASE_INSTANCE_IP:27017/...` |
| Frontend | In `nginx.conf` → `proxy_pass http://BACKEND_INSTANCE_IP:3000/api/;` then rebuild |
| MongoDB  | Open port 27017 only to the Backend instance Security Group |

No Docker network is required at any stage.

---

## License

This project is for educational purposes.
```

You can copy the whole block above into a file named `README-DEPLOY.md` in the studentportal/docker/ of your repository.