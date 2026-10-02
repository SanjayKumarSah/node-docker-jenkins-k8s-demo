pipeline {
    agent any

    environment {
        APP_NAME = 'node-docker-jenkins-k8s-demo'
        IMAGE = 'node-docker-jenkins-k8s-demo:1.0'
        K8S_NAMESPACE = 'demo'
    }

    stages {
        stage('Checkout') {
            steps {
                checkout scm
            }
        }

        stage('Install Dependencies') {
            steps {
                sh 'npm install'
            }
        }

        stage('Test') {
            steps {
                sh 'node --check src/server.js'
                sh 'node -e "import(\"./src/server.js\").then(() => setTimeout(() => process.exit(0), 1000))"'
            }
        }

        stage('Build Docker Image') {
            steps {
                sh 'docker build -t ${IMAGE} .'
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                sh 'kubectl apply -f k8s/namespace.yaml'
                sh 'kubectl apply -f k8s/deployment.yaml'
                sh 'kubectl apply -f k8s/service.yaml'
                sh 'kubectl -n ${K8S_NAMESPACE} rollout status deployment/${APP_NAME} --timeout=120s'
            }
        }
    }

    post {
        always {
            sh 'docker image ls ${IMAGE} || true'
        }
    }
}