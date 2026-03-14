pipeline {
    agent any

    environment {
        APP_NAME       = "devops-portal"
        IMAGE_NAME     = "vickyterm/devops-portal"
        IMAGE_TAG      = "${BUILD_NUMBER}"
        CONTAINER_NAME = "devops-portal"
        PORT           = "3000"
        DOCKER_BUILDKIT = "0"
    }

    stages {

        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/VickyTerm/Devops-Website.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'USER',
                    passwordVariable: 'PASS'
                )]) {
                    sh """
                        echo "\$PASS" | docker login -u "\$USER" --password-stdin
                        docker build -t ${IMAGE_NAME}:${IMAGE_TAG} -t ${IMAGE_NAME}:latest .
                    """
                }
            }
        }

        stage('Push Image to DockerHub') {
            steps {
                sh """
                    docker push ${IMAGE_NAME}:${IMAGE_TAG}
                    docker push ${IMAGE_NAME}:latest
                """
            }
        }

        stage('Stop Old Container') {
            steps {
                sh """
                    echo "Stopping and removing old container if exists..."
                    docker stop ${CONTAINER_NAME} || true
                    docker rm ${CONTAINER_NAME} || true
                    echo "Waiting for port ${PORT} to be free..."
                    sleep 3
                    echo "Old container cleared."
                """
            }
        }

        stage('Run New Container') {
            steps {
                sh """
                    docker run -d \
                        --name ${CONTAINER_NAME} \
                        --restart unless-stopped \
                        -p ${PORT}:${PORT} \
                        ${IMAGE_NAME}:${IMAGE_TAG}

                    echo "Container started. Current running containers:"
                    docker ps
                """
            }
        }

        stage('Health Check') {
            steps {
                sh """
                    echo "Waiting for app to boot..."
                    sleep 8
                    echo "Checking application health..."
                    for i in 1 2 3 4 5; do
                        if curl -sf http://localhost:${PORT} > /dev/null; then
                            echo "✅ App is up and healthy!"
                            exit 0
                        fi
                        echo "Attempt \$i failed, retrying in 5s..."
                        sleep 5
                    done
                    echo "❌ Health check failed after 5 attempts"
                    docker logs ${CONTAINER_NAME}
                    exit 1
                """
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline completed successfully!"
            echo "🌐 Application running at: http://13.233.241.37"
        }
        failure {
            echo "❌ Pipeline failed. Cleaning up container..."
            sh "docker stop ${CONTAINER_NAME} || true"
            sh "docker rm ${CONTAINER_NAME} || true"
        }
        always {
            sh "docker logout || true"
            sh "docker image prune -f || true"
        }
    }
}
```

Key fixes made:
- `docker stop` **then** `docker rm` separately (more reliable than `rm -f`)
- Added `sleep 3` after stop to free the port
- Added `sleep 8` before health check so app has time to boot
- Added `docker logs` on health check failure so you can debug

---

## 🔗 Step 7 — Fix Jenkins URL (Critical for Webhooks)
```
Browser → http://13.233.241.37:8080
→ Manage Jenkins
→ System  
→ Jenkins URL → set to: http://13.233.241.37:8080/
→ Save
```

---

## 🪝 Step 8 — Fix GitHub Webhook

Go to your GitHub repo:
```
Settings → Webhooks → Edit existing webhook (or Add new)

Payload URL:   http://13.233.241.37:8080/github-webhook/
Content type:  application/json
Secret:        (leave blank)
Events:        Just the push event
→ Save
```

Then test it:
```
GitHub → Webhooks → Recent Deliveries → Redeliver
→ Should show green 200 ✅