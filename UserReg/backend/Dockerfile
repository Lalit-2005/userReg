FROM eclipse-temurin:17-jdk-alpine
ARG JAR_FILE=UserReg/backend/target/*.jar
COPY ${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
