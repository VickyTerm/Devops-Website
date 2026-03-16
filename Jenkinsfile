pipeline {
    agent any

    environment {
        APP_NAME        = "devops-portal"
        IMAGE_NAME      = "vickyterm/devops-portal"
        IMAGE_TAG       = "${BUILD_NUMBER}"
        CONTAINER_NAME  = "devops-portal"
        PORT            = "3000"
        DOCKER_BUILDKIT = "0"
    }

    stages {

        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/VickyTerm/Devops-Website.git'
                sh 'git log --oneline -3'
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
                        docker build --no-cache \
                            -t ${IMAGE_NAME}:${IMAGE_TAG} \
                            -t ${IMAGE_NAME}:latest .
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
                    echo "Stopping and removing old container..."
                    docker stop ${CONTAINER_NAME} || true
                    docker rm ${CONTAINER_NAME} || true
                    echo "Removing old local image..."
                    docker rmi ${IMAGE_NAME}:latest || true
                    sleep 3
                    echo "Cleanup complete."
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

                    echo "Container started:"
                    docker ps
                """
            }
        }

        stage('Health Check') {
            steps {
                sh """
                    echo "Waiting for app to boot..."
                    sleep 8
                    for i in 1 2 3 4 5; do
                        if curl -sf http://localhost:${PORT} > /dev/null; then
                            echo "✅ App is up!"
                            exit 0
                        fi
                        echo "Attempt \$i failed, retrying in 5s..."
                        sleep 5
                    done
                    echo "❌ Health check failed"
                    docker logs ${CONTAINER_NAME}
                    exit 1
                """
            }
        }
    }

    post {
        success {
            echo "✅ Pipeline completed successfully!"
            echo "🌐 Live at: http://98.130.95.84"
        }
        failure {
            echo "❌ Pipeline failed. Cleaning up..."
            sh "docker stop ${CONTAINER_NAME} || true"
            sh "docker rm ${CONTAINER_NAME} || true"
        }
        always {
            sh "docker logout || true"
            sh "docker image prune -f || true"
        }
    }
}