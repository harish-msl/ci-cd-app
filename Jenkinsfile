pipeline {
    agent any

    environment {
        NODE_ENV = 'production'
    }

    stages {
        stage('Checkout') {
            steps {
                // Pull the code from the GitHub repository
                git branch: 'main', url: 'https://github.com/harish-msl/ci-cd-app.git'
            }
        }

        stage('Install Dependencies') {
            steps {
                // Install the Node.js dependencies
                sh 'npm install'
            }
        }

        stage('Run Tests') {
            steps {
                // Run the tests
                sh 'npm test'
            }
        }

        stage('Build') {
            steps {
                // Build the application
                sh 'npm run build'
            }
        }

        stage('Deploy') {
            steps {
                // Here you would deploy your application
                // This could be an SCP command, or using a deployment tool like PM2, Docker, etc.
                echo 'Deploying the application...'
            }
        }
    }

    post {
        always {
            // Clean up workspace after build
            cleanWs()
        }
        success {
            // Notify success
            echo 'Build and deployment successful!'
        }
        failure {
            // Notify failure
            echo 'Build or deployment failed!'
        }
    }
}
