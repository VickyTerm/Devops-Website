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
                sh 'docker rm -f ${CONTAINER_NAME} || true'
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

                    docker ps
                """
            }
        }

        stage('Health Check') {
            steps {
                sh """
                    echo "Checking application health..."
                    for i in 1 2 3 4 5; do
                        curl -sf http://localhost:${PORT} && echo "App is up!" && exit 0
                        echo "Attempt \$i failed, retrying in 5s..."
                        sleep 5
                    done
                    echo "Health check failed after 5 attempts"
                    exit 1
                """
            }
        }
    }

    post {
        success {
            echo "Pipeline completed successfully!"
            echo "Application running at: http://13.233.241.37:3000"
        }
        failure {
            echo "Pipeline failed. Check logs."
            sh "docker rm -f ${CONTAINER_NAME} || true"
        }
        always {
            sh "docker logout || true"
            sh "docker image prune -f || true"
        }
    }
}