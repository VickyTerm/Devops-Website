pipeline {
    agent any
    environment {
        APP_NAME        = "devops-portal"
        IMAGE_NAME      = "vickyterm/devops-portal"
        IMAGE_TAG       = "${BUILD_NUMBER}"
        CONTAINER_NAME  = "devops-portal"
        PORT            = "3000"
        EC2_HOST        = "ubuntu@13.233.206.198"
        DOCKER_BUILDKIT = "0"
    }

    stages {
        stage('Checkout Source') {
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
                docker build -t ${IMAGE_NAME}:${IMAGE_TAG} .
            """
        }
    }
}
        stage('Push to DockerHub') {
            steps {
                withCredentials([usernamePassword(
                    credentialsId: 'dockerhub-credentials',
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
                            docker stop ${CONTAINER_NAME} 2>/dev/null || true
                            docker rm   ${CONTAINER_NAME} 2>/dev/null || true
                            docker pull ${IMAGE_NAME}:${IMAGE_TAG}
                            docker run -d \
                                --name ${CONTAINER_NAME} \
                                --restart unless-stopped \
                                -p ${PORT}:${PORT} \
                                ${IMAGE_NAME}:${IMAGE_TAG}
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
            sh "docker rmi ${IMAGE_NAME}:${IMAGE_TAG} || true"
        }
    }
}
