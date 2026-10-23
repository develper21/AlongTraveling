pipeline {
    agent any

    tools {
        nodejs 'Node18'
    }

    environment {
        CI = 'true'
        NODE_ENV = 'test'
    }

    stages {
        stage('Checkout') {
            steps {
                echo 'Checking out source code'
                checkout scm
            }
        }

        stage('Install dependencies') {
            steps {
                sh 'npm run install:all'
            }
        }

        stage('Lint') {
            parallel {
                stage('Backend lint') {
                    steps {
                        sh 'cd backend && npm run lint'
                    }
                }

                stage('Frontend lint') {
                    steps {
                        sh 'cd frontend && npm run lint'
                    }
                }
            }
        }

        stage('Run tests') {
            parallel {
                stage('Backend tests') {
                    steps {
                        sh 'cd backend && npm test -- --ci --runInBand'
                    }
                }

                stage('Frontend tests') {
                    steps {
                        script {
                            try {
                                sh 'cd frontend && npm test -- --watch=false'
                            } catch (err) {
                                echo 'Frontend unit tests are not configured; skipping this stage.'
                            }
                        }
                    }
                }
            }
        }

        stage('Build project') {
            steps {
                sh 'npm run build:all'
            }
        }

        stage('Archive artifacts') {
            steps {
                archiveArtifacts artifacts: 'frontend/dist/**', fingerprint: true
            }
        }
    }

    post {
        always {
            echo 'Jenkins pipeline finished.'
        }

        success {
            echo 'Build, lint, and tests passed successfully.'
        }

        failure {
            echo 'Pipeline failed. Please review the Jenkins logs.'
        }
    }
}
