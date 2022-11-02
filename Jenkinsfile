pipeline {
    agent none
    environment {
        CI = 'true'
        HOME = '.'
        GITHUB_PKG_TOKEN = credentials('GITHUB_PKG_TOKEN')
        DOCKER_REGISTRY = '753707732315.dkr.ecr.eu-west-1.amazonaws.com/experience/service-haven-activities-capacity'
        HELM_REGISTRY = 'http://chartmuseum.chartmuseum.svc:8080'
        HELM_S3_BUCKET_DEV = 'aw-blg-sandbox-dev-chartmuseum'
        HELM_S3_BUCKET_PROD = 'aws-shared-chartmuseum-s3'
        APP_NAME = 'service-haven-activities-capacity'
        BRAND = 'haven'
        PRODUCT = 'activities'
    }
    stages {
        stage("dind stage"){
            agent {
                label 'dind-agent'
            }
            stages {
                stage('Set IMAGE_TAG and update displayName'){
                    steps {
                        script {
                            def now = new Date()
                            IMAGE_TAG = now.format("yyMMdd.HHmm", TimeZone.getTimeZone('Europe/London'))
                            currentBuild.displayName = "${IMAGE_TAG}"
                        }
                    }
                }
                stage('Docker image build & push') {
                    when {
                        allOf {
                            not {
                                branch pattern: "helm/*", comparator: "GLOB"
                            }
                            branch "master"
                        }
                        beforeAgent true
                    }
                    steps {
                        container('dind') {
                            script {
                                def now = new Date()
                                IMAGE_TAG = now.format("yyMMdd.HHmm", TimeZone.getTimeZone('Europe/London'))
                                sh "apk add gettext"
                                sh "envsubst '\${GITHUB_PKG_TOKEN}' < .npmrc_ci > .npmrc"
                                // login to both the dev (base image) and shared (built image) account registries
                                sh "aws ecr get-login-password --region eu-west-1 | docker login --username AWS --password-stdin 753707732315.dkr.ecr.eu-west-1.amazonaws.com"
                                sh "docker build -t ${DOCKER_REGISTRY}:${IMAGE_TAG} ."
                                sh "docker push ${DOCKER_REGISTRY}:${IMAGE_TAG}"
                            }
                        }
                    }
                }
                stage('Package & publish HELM chart') {
                    when {
                        branch pattern: "helm/*", comparator: "GLOB"
                        beforeAgent true
                    }
                    steps {
                        container('dind') {
                            sh "helm repo add chartmuseum ${HELM_REGISTRY}"
                            sh "helm package -d ./infrastructure/helm/ ./infrastructure/helm/"
                            sh "helm push ./infrastructure/helm/ chartmuseum"
                        }
                    }
                }
                stage('Update Helm values.yaml files') {
                    when {
                        allOf {
                            not {
                                branch pattern: "helm/*", comparator: "GLOB"
                            }
                            branch "master"
                        }
                        beforeAgent true
                    }
                    steps {
                        container('dind') {
                            script {
                                // Update values file with image tag
                                sh "sed -i 's/    tag:.*/    tag: \"${IMAGE_TAG}\"/' ./infrastructure/helm/dev-values.yaml"
                                sh "sed -i 's/    tag:.*/    tag: \"${IMAGE_TAG}\"/' ./infrastructure/helm/staging-values.yaml"
                                sh "sed -i 's/    tag:.*/    tag: \"${IMAGE_TAG}\"/' ./infrastructure/helm/prod-values.yaml"
                                sh "sed -i 's/    tags.datadoghq.com\\/version:.*/    tags.datadoghq.com\\/version: \"${IMAGE_TAG}\"/' ./infrastructure/helm/dev-values.yaml"
                                sh "sed -i 's/    tags.datadoghq.com\\/version:.*/    tags.datadoghq.com\\/version: \"${IMAGE_TAG}\"/' ./infrastructure/helm/staging-values.yaml"
                                sh "sed -i 's/    tags.datadoghq.com\\/version:.*/    tags.datadoghq.com\\/version: \"${IMAGE_TAG}\"/' ./infrastructure/helm/prod-values.yaml"
                                // Push values.yaml to S3
                                sh "aws s3 cp ./infrastructure/helm/dev-values.yaml s3://${HELM_S3_BUCKET_DEV}/${BRAND}/${PRODUCT}/${APP_NAME}/${IMAGE_TAG}/"
                                sh "aws s3 cp ./infrastructure/helm/staging-values.yaml s3://${HELM_S3_BUCKET_PROD}/${BRAND}/${PRODUCT}/${APP_NAME}/${IMAGE_TAG}/"
                                sh "aws s3 cp ./infrastructure/helm/prod-values.yaml s3://${HELM_S3_BUCKET_PROD}/${BRAND}/${PRODUCT}/${APP_NAME}/${IMAGE_TAG}/"
                            }
                        }
                    }
                }
                stage('Trigger Spinnaker Release Pipeline') {
                    when {
                        allOf {
                            not {
                                branch pattern: "helm/*", comparator: "GLOB"
                            }
                            branch "master"
                        }
                        beforeAgent true
                    }
                    environment {
                        // Get Chart version to use in triggering Spinnaker pipeline
                        CHART_VERSION = sh (
                            script: "sed -n 's/version: \\(.*\\).*/\\1/p' ./infrastructure/helm/Chart.yaml", returnStdout: true
                        ).trim()
                    }
                    steps {
                        container('dind') {
                            sh "curl -L -vvv -X POST -H\"Content-Type: application/json\" http://spin-gate.spinnaker.svc:8084/webhooks/webhook/${APP_NAME} -d '{\"artifacts\": [{ \"type\": \"helm/chart\", \"name\": \"${APP_NAME}\", \"version\": \"${env.CHART_VERSION}\", \"artifactAccount\": \"chartmuseum\" }], \"parameters\": { \"image_tag\": \"${IMAGE_TAG}\", \"jenkins_build_number\": \"${BUILD_NUMBER}\" }}'"
                        }
                    }
                }
            }
        }
    }
}