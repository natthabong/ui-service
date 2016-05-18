FROM frolvlad/alpine-oraclejdk8:slim
echo "http://dl-4.alpinelinux.org/alpine/v3.3/main" > /etc/apk/repositories 
apk update
apk add tzdata
cp /usr/share/zoneinfo/Asia/Bangkok /etc/localtime
echo "Asia/Bangkok" >  /etc/timezone
apk del tzdata
VOLUME /tmp
ADD target/ui-service-0.1-SNAPSHOT.jar app.jar
RUN sh -c 'touch /app.jar'
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/app.jar"]