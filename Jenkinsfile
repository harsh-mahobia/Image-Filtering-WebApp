pipeline {
    agent any 

    environment {
        IMAGE_NAME = 'next-app'
        CONTAINER_NAME = 'next-container'
        API_ACCESS_KEY = credentials('upsplash_key')
        PORT = '3000'
    }

    stages {
        stage('Checkout Code') {
            steps {
                checkout scm  // More reliable than git in declarative pipeline
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    sh "docker build -t ${IMAGE_NAME} ."
                }
            }
        }

        stage('Deploy Container') {
            steps {
                script {
                    sh """
                        docker stop ${CONTAINER_NAME} || true
                        docker rm ${CONTAINER_NAME} || true
                        docker run -d --name ${CONTAINER_NAME} -e UNSPLASH_ACCESS_KEY=${API_ACCESS_KEY} -p 80:${PORT} ${IMAGE_NAME}
                    """
                }
            }
        }
    }

}
