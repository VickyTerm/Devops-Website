pipeline {
    agent any
    environment {
        APP_NAME       = "devops-portal"
        IMAGE_NAME     = "vickytricky/devops-portal"
        IMAGE_TAG      = "latest"
        CONTAINER_NAME = "devops-portal"
        PORT           = "3000"
        EC2_HOST       = "ubuntu@16.112.131.103"
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
                withCredentials([usernamePassword(credentialsId: 'dockerhub-creds',
                                                  usernameVariable: 'USER',
                                                  passwordVariable: 'PASS')]) {
                    sh """
                    echo \$PASS | docker login -u \$USER --password-stdin
                    docker push ${IMAGE_NAME}:${IMAGE_TAG}
                    """
                }
            }
        }
        stage('Deploy to EC2') {
            steps {
                sshagent(['ec2-ssh']) {
                    sh '''
                    ssh -o StrictHostKeyChecking=no ubuntu@16.112.131.103 \
                      "docker stop devops-portal || true && \
                       docker rm devops-portal || true && \
                       docker pull vickytricky/devops-portal:latest && \
                       docker run -d -p 3000:3000 --name devops-portal vickytricky/devops-portal:latest"
                    '''
                }
            }
        }
    }
    post {
        success { echo '✅ CI/CD Pipeline completed successfully' }
        failure { echo '❌ Pipeline failed. Check logs above.' }
    }
}