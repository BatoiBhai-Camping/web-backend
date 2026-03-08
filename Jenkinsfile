pipeline {
    agent any

    environment {
        APP_NAME = "batoibhai-dev"
        IMAGE_NAME = "batoibhai-backend-dev"
        PORT = "3000"
    }

    stages {

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t $IMAGE_NAME .'
            }
        }

        stage('Stop Old Container') {
            steps {
                sh '''
                docker stop $APP_NAME || true
                docker rm $APP_NAME || true
                '''
            }
        }

        stage('Run Dev Container') {
            steps {
                withCredentials([file(credentialsId: 'env-dev', variable: 'ENV_FILE')]) {
                    sh '''
                    docker run -d \
                    --env-file $ENV_FILE \
                    -p $PORT:$PORT \
                    --name $APP_NAME \
                    $IMAGE_NAME
                    '''
                }
            }
        }

    }
}