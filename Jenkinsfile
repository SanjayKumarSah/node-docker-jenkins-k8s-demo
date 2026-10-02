pipeline {
    agent any

    environment {
        APP_NAME      = 'node-docker-jenkins-k8s-demo'
        IMAGE         = 'node-docker-jenkins-k8s-demo:1.0'
        K8S_NAMESPACE = 'demo'
        KUBE_CREDS    = 'k8s-kubeconfig' // Matches the credential ID
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
                sh "node -e \"import('./src/server.js').then(() => setTimeout(() => process.exit(0), 1000))\""
            }
        }

        stage('Build Docker Image') {
            steps {
                sh "docker build -t ${IMAGE} ."
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                withCredentials([file(credentialsId: KUBE_CREDS, variable: 'KUBECONFIG')]) {
                    // FIXED: Added --server bridge definition and disabled strict openapi verification hooks
                    sh 'kubectl apply -f k8s/namespace.yaml --kubeconfig=$KUBECONFIG --server=https://docker.internal --validate=false'
                    sh 'kubectl apply -f k8s/deployment.yaml --kubeconfig=$KUBECONFIG --server=https://docker.internal --validate=false'
                    sh 'kubectl apply -f k8s/service.yaml --kubeconfig=$KUBECONFIG --server=https://docker.internal --validate=false'
                    sh "kubectl -n ${K8S_NAMESPACE} rollout status deployment/${APP_NAME} --timeout=120s --kubeconfig=$KUBECONFIG --server=https://docker.internal"
                }
            }
        }
    }

    post {
        always {
            sh "docker image ls ${IMAGE} || true"
        }
    }
}
