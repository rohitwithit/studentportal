# Student Portal - Easy Deployment Guide

This guide helps you deploy the **Student Portal** application on an Ubuntu EC2 instance (or any Ubuntu server) using a single script.

---

## Prerequisites

- Ubuntu 22.04 / 24.04 / 26.04 server
- User with `sudo` privileges (default `ubuntu` user on AWS)
- Security Group / Firewall must allow:
  - **Port 22** (SSH) — from your IP
  - **Port 80** (HTTP) — from `0.0.0.0/0`

---

## Quick Deploy (Recommended)

### 1. Connect to your server

```bash
Create the deployment script


vim deploy.sh


Paste the following content into the file:

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


3. Make the script executable and run itBashchmod +x deploy.sh
./deploy.shWait 2–4 minutes. The script will:
Remove Apache (frees port 80)
Install Docker + Git
Clone the repository
Fix nginx configuration
Build and start all containers
Create the default admin user
After DeploymentAccess the applicationOpen your browser and go to:Texthttp://<YOUR_PUBLIC_IP>Default Admin Credentials
















FieldValueEmailexample@gmail.comPasswordExample@123