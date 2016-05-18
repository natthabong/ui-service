FROM frolvlad/alpine-oraclejdk8:slim
RUN echo "http://dl-4.alpinelinux.org/alpine/v3.3/main" > /etc/apk/repositories 
RUN apk update
RUN apk add tzdata
RUN cp /usr/share/zoneinfo/Asia/Bangkok /etc/localtime
RUN echo "Asia/Bangkok" >  /etc/timezone
RUN apk del tzdata
VOLUME /tmp
ADD target/ui-service-0.1-SNAPSHOT.jar app.jar
RUN sh -c 'touch /app.jar'
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]