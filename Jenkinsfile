pipeline {
    agent any

    environment {
        APP_NAME      = "devops-portal"
        IMAGE_NAME    = "vickyterm/devops-portal"
        IMAGE_TAG     = "${BUILD_NUMBER}"   // ✅ Better than 'latest' - unique per build
        CONTAINER_NAME = "devops-portal"
        PORT          = "3000"
        EC2_HOST      = "ubuntu@13.233.206.198"
    }

    stages {

        stage('Checkout Source') {
            steps {
                git branch: 'main', url: 'https://github.com/VickyTerm/Devops-Website.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME}:${IMAGE_TAG} ."
            }
        }

        stage('Push to DockerHub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-creds',
                    usernameVariable: 'USER',
                    passwordVariable: 'PASS'
                )]) {
                    sh """
                        echo "\$PASS" | docker login -u "\$USER" --password-stdin
                        docker push ${IMAGE_NAME}:${IMAGE_TAG}
                        docker logout
                    """
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                sshagent(['ec2-ssh']) {
                    sh """
                        ssh -o StrictHostKeyChecking=no ${EC2_HOST} '
                            set -e

                            echo ">>> Logging into DockerHub..."
                            echo "${DOCKER_PASS}" | docker login -u "${DOCKER_USER}" --password-stdin || true

                            echo ">>> Stopping old container..."
                            docker stop ${CONTAINER_NAME} 2>/dev/null || true
                            docker rm   ${CONTAINER_NAME} 2>/dev/null || true

                            echo ">>> Pulling latest image..."
                            docker pull ${IMAGE_NAME}:${IMAGE_TAG}

                            echo ">>> Starting new container..."
                            docker run -d \\
                                --name ${CONTAINER_NAME} \\
                                --restart unless-stopped \\
                                -p ${PORT}:${PORT} \\
                                ${IMAGE_NAME}:${IMAGE_TAG}

                            echo ">>> Container status:"
                            docker ps | grep ${CONTAINER_NAME}
                        '
                    """
                }
            }
        }
    }

    post {
        success {
            echo '✅ CI/CD Pipeline completed successfully!'
            echo "🌐 App running at: http://13.233.206.198:${PORT}"
        }
        failure {
            echo '❌ Pipeline failed. Check logs above.'
        }
        always {
            // Clean up local Docker images to save disk space
            sh "docker rmi ${IMAGE_NAME}:${IMAGE_TAG} || true"
        }
    }
}