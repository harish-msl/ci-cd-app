pipeline {
    agent any

    environment {
        DOCKER_IMAGE = 'ci-cd-app/backend:latest'
        ECR_REPO_URI = '851725538406.dkr.ecr.ap-southeast-2.amazonaws.com/ci-cd-app/backend'
        AWS_REGION = 'ap-southeast-2'
        INSTANCE_ID = 'i-03f0d71decab318d5' // Replace with your EC2 instance ID
        AWS_CREDENTIALS_ID = 'aws-credentials-id' // Replace with the Jenkins credentials ID for AWS
    }

    stages {
        stage('Checkout') {
            steps {
                // Clone the GitHub repository
                git branch: 'main', url: 'https://github.com/harish-msl/ci-cd-app.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                // Install Node.js dependencies
                sh 'npm install'
            }
        }

        stage('Build Docker Image') {
            steps {
                script {
                    // Build the Docker image
                    sh "docker build -t ${DOCKER_IMAGE} ."
                }
            }
        }

        stage('Push Docker Image to ECR') {
            steps {
                script {
                    // Log in to AWS ECR and push the Docker image
                    withCredentials([usernamePassword(credentialsId: AWS_CREDENTIALS_ID, usernameVariable: 'AWS_ACCESS_KEY_ID', passwordVariable: 'AWS_SECRET_ACCESS_KEY')]) {
                        sh """
                        aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REPO_URI}
                        docker tag ${DOCKER_IMAGE} ${ECR_REPO_URI}:latest
                        docker push ${ECR_REPO_URI}:latest
                        """
                    }
                }
            }
        }

        stage('Deploy to EC2') {
            steps {
                script {
                    // Deploy Docker container to EC2 instance using AWS SSM
                    withCredentials([usernamePassword(credentialsId: AWS_CREDENTIALS_ID, usernameVariable: 'AWS_ACCESS_KEY_ID', passwordVariable: 'AWS_SECRET_ACCESS_KEY')]) {
                        sh """
                        aws ssm send-command \
                            --document-name "AWS-RunShellScript" \
                            --targets "Key=instanceIds,Values=${INSTANCE_ID}" \
                            --parameters 'commands=[
                                "aws ecr get-login-password --region ${AWS_REGION} | docker login --username AWS --password-stdin ${ECR_REPO_URI}",
                                "docker pull ${ECR_REPO_URI}:latest",
                                "docker stop ci-cd-app-api-container || true",
                                "docker rm ci-cd-app-api-container || true",
                                "docker run -d --name ci-cd-app-api-container -p 8080:3000 ${ECR_REPO_URI}:latest"
                            ]' \
                            --region ${AWS_REGION}
                        """
                    }
                }
            }
        }
    }
    
    post {
        always {
            // Clean up the workspace after the pipeline
            cleanWs()
        }
        success {
            // Notification on success
            echo 'Build, test, and deployment successful!'
        }
        failure {
            // Notification on failure
            echo 'Build, test, or deployment failed!'
        }
    }
}
