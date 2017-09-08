def GIT_REPOSITORY_REPO = "http://gitlab.gec.io/gecscf/ui-service.git"
pipeline {
  agent { node { label 'gecscf-unix-001' } }
  triggers { pollSCM('H/3 * * * *') }
  stages {
    stage('[SCM] Checkout UI service') {
      steps {
        git branch: 'dev', credentialsId: '28413f37-4882-46c8-9b30-6530cc145bed', url: GIT_REPOSITORY_REPO
      }
    }
    stage('[MAVEN] Pack sources') {
      steps {
        sh 'mvn clean install'
      }
    }
    stage('[DOCKER] Build an image') {
      steps {
        sh 'docker build -t ui-service - < target/ui-service-0.1-SNAPSHOT-bin.tar.gz'
        sh "docker tag ui-service mantis-gecscf.gec.io:5000/ui-service"
        
      }
    }
    stage('[DOCKER] Shift an image to private registry') {
      steps {
        sh 'docker login mantis-gecscf.gec.io:5000 -u testuser -p testpassword'
        sh "docker push mantis-gecscf.gec.io:5000/ui-service"
      }
    }
  }
  post { 
    always { 
       junit 'target/surefire-reports/*.xml'
    }
    success {
       build 'Deploy/Deploy Dev.'
    }
  }
}