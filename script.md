# Student Portal – Easy Deployment Guide

This guide explains how to deploy the **Student Portal** application on an Ubuntu EC2 instance or any Ubuntu-based server using a single deployment script.

## Prerequisites

Before starting, ensure you have:

- Ubuntu 22.04 / 24.04 / 26.04 server.
- A user account with `sudo` privileges (default `ubuntu` user on AWS EC2).
- An AWS Security Group or firewall configured to allow the following ports:

| Port | Protocol | Purpose | Source |
|---|---|---|---|
| 22 | SSH | Server access | Your IP address |
| 80 | HTTP | Web application access | `0.0.0.0/0` |

---

## Quick Deployment (Recommended)

### Step 1: Connect to Your Server

Connect to your Ubuntu EC2 instance using SSH:

```bash
ssh ubuntu@<YOUR_PUBLIC_IP>
```

### Step 2: Create the Deployment Script

Create a new deployment script:

```bash
vim deploy.sh
```

Paste the following script into the file:

### Deployment Script

```bash
#!/bin/bash
set -euxo pipefail

echo "===== Starting deployment ====="

function remove_apache() {
    echo "===== Force removing Apache ====="
    sudo systemctl stop apache2 2>/dev/null || true
    sudo systemctl disable apache2 2>/dev/null || true
    sudo apt-get purge -y apache2 apache2-utils apache2-bin apache2-data 2>/dev/null || true
    sudo apt-get autoremove -y 2>/dev/null || true
    sudo rm -rf /var/www/html 2>/dev/null || true
    return 0
}

function install_dep() {
    echo "===== Installing Docker + Git ====="
    sudo apt-get update -y
    sudo apt-get install -y docker.io docker-compose-v2 git
}

function docker_start() {
    echo "===== Starting Docker ====="
    sudo systemctl enable --now docker
    sudo usermod -aG docker ubuntu
}

function repo_clone() {
    echo "===== Cloning repository ====="
    cd /home/ubuntu
    rm -rf studentportal
    git clone https://github.com/rohitwithit/studentportal.git
    sudo chown -R ubuntu:ubuntu /home/ubuntu/studentportal
    cd studentportal

    # Fix HOST_IP problem in nginx config
    sed -i 's|proxy_pass http://HOST_IP:3000/api/;|proxy_pass http://backend:3000/api/;|' client/nginx.conf
}

function docker_compose() {
    echo "===== Starting containers ====="
    sudo docker compose up -d --build
}

function seed_admin() {
    echo "===== Seeding admin ====="
    sudo docker compose exec -T backend node seedAdmin.js
}

function end() {
    echo "===== Deployment finished successfully ====="
    sudo docker ps -a
}

# ========== Execution ==========

if ! remove_apache; then
    echo "apache remove failed!"
    exit 1
fi

if ! install_dep; then
    echo "docker and git installation failed"
    exit 1
fi

# Remove Apache again AFTER install (some packages pull it back)
if ! remove_apache; then
    echo "apache remove after install failed!"
    exit 1
fi

if ! docker_start; then
    echo "docker start failed"
    exit 1
fi

if ! repo_clone; then
    echo "repo cloning failed"
    exit 1
fi

if ! docker_compose; then
    echo "docker compose failed"
    exit 1
fi

sleep 25

if ! seed_admin; then
    echo "seed admin failed"
    exit 1
fi

if ! end; then
    echo "deployment not ended"
    exit 1
fi
```

### Step 3: Make the Script Executable

Run the following command to grant execution permissions:

```bash
chmod +x deploy.sh
```

### Step 4: Execute the Deployment Script

Start the deployment:

```bash
./deploy.sh
```

Wait approximately **2–4 minutes** for the deployment process to complete.

The script automatically performs the following operations:

1. Removes Apache to free up port 80.
2. Installs Docker, Docker Compose V2, and Git.
3. Removes Apache again after package installation.
4. Enables and starts the Docker service.
5. Clones the Student Portal repository from GitHub.
6. Updates the Nginx configuration to use the Docker backend service.
7. Builds and starts all Docker containers.
8. Waits 25 seconds for the containers to initialize.
9. Executes `seedAdmin.js` to create the default admin user.
10. Displays the running Docker containers.

---

## After Deployment

### 1. Access the Application

Once deployment is complete, open your browser and navigate to:

```text
http://<YOUR_PUBLIC_IP>
```

Replace `<YOUR_PUBLIC_IP>` with your EC2 instance's actual public IP address.

### 2. Default Admin Credentials

Use the following credentials to access the admin portal:

| Field | Value |
|---|---|
| Email | example@gmail.com |
| Password | |

> **Note:** Replace the example email and enter the actual admin password configured in your `seedAdmin.js` file.

---

## Deployment Verification

To verify that the Docker containers are running successfully, execute:

```bash
sudo docker ps
```

To view all containers, including stopped containers:

```bash
sudo docker ps -a
```

To check application logs:

```bash
sudo docker compose logs -f
```

To check backend logs:

```bash
sudo docker compose logs -f backend
```

To check frontend logs:

```bash
sudo docker compose logs -f client
```

---

## Important Notes

- Ensure that port 80 is available before starting the deployment.
- Make sure your GitHub repository is publicly accessible or that the server has the required GitHub authentication configured.
- Verify that the environment variables required by the backend are configured correctly.
- The Docker Compose configuration must define the `backend` service and the corresponding `client` service.
- The admin seeding script must be available at the backend container's expected path.
- Do not share your admin password or production environment credentials.

---

**Deployment Guide – Student Portal**

