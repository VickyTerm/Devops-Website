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