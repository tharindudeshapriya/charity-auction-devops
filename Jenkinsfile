pipeline {
    agent any
    
    environment {
        DOCKER_USER = "tmdeshapriya"
        APP_REPO = "charity-auction-devops"
        MANIFEST_REPO = "charity-auction-gitops-manifests"
        GITHUB_USER = "tharindudeshapriya"
        MASTER_IP = "3.239.192.96" // API URL for frontend
    }

    stages {
        stage('Build & Push Backend') {
            steps {
                script {
                    dir('backend') {
                        // Build backend image
                        def backendImage = docker.build("${DOCKER_USER}/charity-backend:${env.BUILD_NUMBER}", ".")
                        docker.withRegistry('', 'docker-hub-creds') {
                            backendImage.push()
                            backendImage.push('latest')
                        }
                    }
                }
            }
        }

        stage('Build & Push Frontend') {
            steps {
                script {
                    dir('frontend') {
                        // Build frontend image with API URL build-arg
                        def frontendImage = docker.build(
                            "${DOCKER_USER}/charity-frontend:${env.BUILD_NUMBER}", 
                            "--build-arg NEXT_PUBLIC_API_URL=http://${MASTER_IP}/api ."
                        )
                        docker.withRegistry('', 'docker-hub-creds') {
                            frontendImage.push()
                            frontendImage.push('latest')
                        }
                    }
                }
            }
        }

        stage('Update Manifests') {
            steps {
                withCredentials([usernamePassword(credentialsId: 'github-token', passwordVariable: 'GIT_TOKEN', usernameVariable: 'GIT_USER')]) {
                    sh """
                        # Clone manifest repo securely
                        git clone https://\$GIT_USER:\$GIT_TOKEN@github.com/\$GITHUB_USER/\$MANIFEST_REPO.git
                        cd \$MANIFEST_REPO
                        
                        # Update backend image tag
                        sed -i "s|image: ${DOCKER_USER}/charity-backend:.*|image: ${DOCKER_USER}/charity-backend:\$BUILD_NUMBER|g" backend-deployment.yaml
                        
                        # Update frontend image tag
                        sed -i "s|image: ${DOCKER_USER}/charity-frontend:.*|image: ${DOCKER_USER}/charity-frontend:\$BUILD_NUMBER|g" frontend-deployment.yaml
                        
                        git config user.email "jenkins@gitops.com"
                        git config user.name "Jenkins CI"
                        git add .
                        git commit -m "chore: update images to build \$BUILD_NUMBER"
                        git push origin main
                    """
                }
            }
        }
    }
}