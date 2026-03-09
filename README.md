# DevOps CI/CD Pipeline Project

This project demonstrates a complete DevOps lifecycle for deploying a Node.js web application using modern DevOps tools and cloud infrastructure.

## Project Overview

The application is containerized using Docker and deployed to an AWS EC2 instance. Jenkins automates the build and deployment pipeline, ensuring that every code update can be automatically deployed.

The system uses Nginx as a reverse proxy to expose the application through port 80.

## Live Demo

http://13.127.36.148

## Architecture

Developer → GitHub → Jenkins CI/CD → Docker Container → AWS EC2 → Nginx Reverse Proxy → Users

## CI/CD Pipeline

<img width="990" height="862" alt="Screenshot from 2026-03-09 09-39-36" src="https://github.com/user-attachments/assets/b6866dbd-7763-444c-bedd-2694fcd6b194" />

1. Developer pushes code to GitHub
2. GitHub webhook triggers Jenkins
3. Jenkins pulls the latest source code
4. Jenkins builds the Docker image
5. Jenkins deploys the container to EC2
6. Nginx serves the updated application

Developer
   │
   │ push code
   ▼
GitHub Repository
   │
   │ webhook trigger
   ▼
Jenkins CI/CD Pipeline
   │
   ├── Checkout Source
   ├── Build Docker Image
   ├── Stop Old Container
   ├── Run New Container
   └── Health Check
   │
   ▼
Deploy to AWS EC2
   │
   ▼
Docker Container
   │
   ▼
Nginx Reverse Proxy
   │
   ▼
Users access website

## Technologies Used

* Node.js
* Docker
* Jenkins
* AWS EC2
* Nginx
* GitHub
* Linux

## Project Structure

app.js – main Node.js application
Dockerfile – container build configuration
Jenkinsfile – CI/CD pipeline definition
public/ – frontend UI
routes/ – application routes
monitoring/ – monitoring configurations

## Future Improvements

* Custom domain integration
* HTTPS with Let's Encrypt
* Prometheus metrics collection
* Grafana monitoring dashboard
* Automated Selenium testing