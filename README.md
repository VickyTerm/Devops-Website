DevOps Project Architecture

This project demonstrates a complete DevOps workflow for deploying and managing a Node.js application using modern DevOps tools and practices.

System Architecture

Developer pushes code to GitHub.
Jenkins detects changes and triggers a CI/CD pipeline.
The pipeline builds a Docker image and deploys the container to an AWS EC2 instance.
The application becomes accessible to user through the server's public IP address.

Architecture Flow

Developer --> GitHub --> Jenkins CI/CD --> Docker Build --> AWS EC2 --> Web Application.

Current Features

Node.js DevOps themed web application
Docker containerized deployment
jenkins CI/CD pipeline automation
Health monitoring endpoint /health
AWS EC2 cloud deployment
Modular frontend structure (components)

Upcoming Improvements

Nginx reverse proxy for port 80 access
Domain name configuration
HTTPS with SSL (Let's Encrypt)
Prometheus metrics collection
Grafana monitoring dashboard
Selenium automated testing in CI pipeline

