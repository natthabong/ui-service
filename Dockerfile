FROM frolvlad/alpine-oraclejdk8:slim
VOLUME /tmp
ADD target/ui-service-0.1-SNAPSHOT.jar app.jar
RUN sh -c 'touch /app.jar'
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]