pipeline {
    agent any
    environment {
        APP_NAME = "devops-portal"
        IMAGE_NAME = "vickytricky/devops-portal"
        IMAGE_TAG = "latest"
        CONTAINER_NAME = "devops-portal"
        PORT = "3000"
        EC2_HOST = "ubuntu@13.233.206.198"   // ← your EC2
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
                withDockerRegistry(credentialsId: 'dockerhub-creds', url: '') {
                    sh "docker push ${IMAGE_NAME}:${IMAGE_TAG}"
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                sshagent(['ec2-ssh']) {
                    sh """
                    ssh -o StrictHostKeyChecking=no ${EC2_HOST} '
                      docker stop ${CONTAINER_NAME} || true && 
                      docker rm ${CONTAINER_NAME} || true && 
                      docker pull ${IMAGE_NAME}:${IMAGE_TAG} && 
                      docker run -d -p ${PORT}:${PORT} --name ${CONTAINER_NAME} ${IMAGE_NAME}:${IMAGE_TAG}
                    '
                    """
                }
            }
        }
    }

    post {
        success { echo '✅ CI/CD Pipeline completed successfully' }
        failure { echo '❌ Pipeline failed. Check logs above.' }
    }
}