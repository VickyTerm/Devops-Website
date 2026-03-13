pipeline {
    agent any

    environment {
        APP_NAME       = "devops-portal"
        IMAGE_NAME     = "vickyterm/devops-portal"
        IMAGE_TAG      = "${BUILD_NUMBER}"
        CONTAINER_NAME = "devops-portal"
        PORT           = "3000"
    }

    stages {

        stage('Clone Repository') {
            steps {
                git branch: 'main', url: 'https://github.com/VickyTerm/Devops-Website.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh """
                    docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .
                """
            }
        }

        stage('Login to DockerHub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
                    usernameVariable: 'USER',
                    passwordVariable: 'PASS'
                )]) {
                    sh """
                        echo "\$PASS" | docker login -u "\$USER" --password-stdin
                    """
                }
            }
        }

        stage('Push Image to DockerHub') {
            steps {
                sh """
                    docker push ${IMAGE_NAME}:${IMAGE_TAG}
                """
            }
        }

        stage('Stop Old Container') {
            steps {
                sh """
                    docker stop ${CONTAINER_NAME} || true
                    docker rm -f ${CONTAINER_NAME} || true
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

                    docker ps
                """
            }
        }

        stage('Health Check') {
            steps {
                sh """
                    echo "Checking application health..."
                    sleep 10
                    curl -f http://localhost:${PORT} || exit 1
                """
            }
        }
    }

    post {

        success {
            echo "✅ CI/CD Pipeline completed successfully!"
            echo "🌐 Application running at: http://3.110.131.39"
        }

        failure {
            echo "❌ Pipeline failed. Check logs."
        }

        always {
            sh "docker logout || true"
        }
    }
}