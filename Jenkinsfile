pipeline {
    agent any
    
    environment {
        DOCKER_USER = "tmdeshapriya"
        APP_REPO = "charity-auction-devops"
        MANIFEST_REPO = "charity-auction-gitops-manifests"
        GITHUB_USER = "tharindudeshapriya"
        // This will be used to inject the API URL into the frontend build
        MASTER_IP = "3.239.192.96" 
    }

    stages {
        stage('Build & Push Backend') {
            steps {
                script {
                    dir('backend') {
                        def backendImage = docker.build("${DOCKER_USER}/charity-backend:${env.BUILD_NUMBER}")
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
                        // Injecting the Master IP as the API URL for the Next.js build
                        def frontendImage = docker.build("${DOCKER_USER}/charity-frontend:${env.BUILD_NUMBER}", "--build-arg NEXT_PUBLIC_API_URL=http://${env.MASTER_IP}/api")
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
                        git clone https://${GIT_USER}:${GIT_TOKEN}@[github.com/$](https://github.com/$){GITHUB_USER}/${MANIFEST_REPO}.git
                        cd ${MANIFEST_REPO}
                        
                        # Update Backend Image Tag
                        sed -i "s|image: ${DOCKER_USER}/charity-backend:.*|image: ${DOCKER_USER}/charity-backend:${env.BUILD_NUMBER}|g" backend-deployment.yaml
                        
                        # Update Frontend Image Tag
                        sed -i "s|image: ${DOCKER_USER}/charity-frontend:.*|image: ${DOCKER_USER}/charity-frontend:${env.BUILD_NUMBER}|g" frontend-deployment.yaml
                        
                        git config user.email "jenkins@gitops.com"
                        git config user.name "Jenkins CI"
                        git add .
                        git commit -m "chore: update images to build ${env.BUILD_NUMBER}"
                        git push origin main
                    """
                }
            }
        }
    }
}
