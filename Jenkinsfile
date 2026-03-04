pipeline {
    agent any

    environment {
        APP_NAME = "devops-portal"
        IMAGE_NAME = "devops-portal"
        IMAGE_TAG = "latest"
        CONTAINER_NAME = "devops-portal"
        PORT = "3000"
    }

    stages {

        stage('Checkout Source') {
            steps {
                git branch: 'main',
                    url: 'https://github.com/VickyTerm/Devops-Website.git'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh '''
                  docker build -t $IMAGE_NAME:$IMAGE_TAG .
                '''
            }
        }

        stage('Stop Old Container') {
            steps {
                sh '''
                  docker stop $CONTAINER_NAME || true
                  docker rm $CONTAINER_NAME || true
                '''
            }
        }

        stage('Run Container') {
            steps {
                sh '''
                  docker run -d \
                  -p $PORT:3000 \
                  --name $CONTAINER_NAME \
                  $IMAGE_NAME:$IMAGE_TAG
                '''
            }
        }

        stage('Health Check') {
            steps {
                sh '''
                  sleep 10
                  curl --fail http://localhost:3000/health
                '''
            }
        }

        stage('Deploy to EC2') {
            steps {
                sshagent(['ec2-ssh']) {
                    sh '''
                    ssh -o StrictHostKeyChecking=no ubuntu@13.127.36.148 << EOF

                    cd Devops-Website

                    docker stop devops-portal || true
                    docker rm devops-portal || true

                    docker build -t devops-portal .

                    docker run -d -p 3000:3000 --name devops-portal devops-portal

                    EOF
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '✅ CI/CD Pipeline completed successfully'
        }
        failure {
            echo '❌ CI/CD Pipeline failed'
        }
    }
}
