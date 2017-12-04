def GIT_REPOSITORY_REPO = "http://gitlab.gec.io/gecscf/ui-service.git"
pipeline {
  agent { node { label 'gecscf-unix-001' } }
  stages {
    stage('[SCM] Checkout UI service') {
      steps {
        git branch: '${git_branch}', credentialsId: '28413f37-4882-46c8-9b30-6530cc145bed', url: GIT_REPOSITORY_REPO
      }
    }
    stage('[MAVEN] Pack sources') {
      steps {
        sh 'mvn clean generate-resources'
        sh 'mvn process-resources install'
      }
    }
    stage('[DOCKER] Build an image') {
      steps {
        sh "docker build -t ui-service:${image_tag} - < target/ui-service-0.1-SNAPSHOT-bin.tar.gz"
        sh "docker tag ui-service:${image_tag} registry-gecscf.gec.io:5000/ui-service:${image_tag}"
        
      }
    }
    stage('[DOCKER] Shift an image to private registry') {
      steps {
        sh 'docker login registry-gecscf.gec.io:5000 -u gecscf -p gecscf123!'
        sh "docker push registry-gecscf.gec.io:5000/ui-service:${image_tag}"
      }
    }
  }
  post { 
    success {
        build "${downstream_job}"
    }
  }
}