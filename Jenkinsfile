pipeline {
    agent any

    environment {
        IMAGE_NAME = 'next-app'
        CONTAINER_NAME = 'next-container'
        PORT = '3000'
    }

    stages {
        stage('Checkout Code') {
            steps {
                git 'https://github.com/harsh-mahobia/Image-Filtering-WebApp.git'
            }
        }


        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE_NAME} ."
            }
        }

        stage('Deploy Container') {
            steps {
                sh """
                    docker stop ${CONTAINER_NAME} || true
                    docker rm ${CONTAINER_NAME} || true
                 """
                 sh('docker run -d --name ${CONTAINER_NAME} -p 80:${PORT} ${IMAGE_NAME}')
                   
               
            }
        }
    }

    post {
        always {
            cleanWs()
        }
    }
}
