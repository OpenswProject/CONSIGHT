# Stage 1: Build the application using Gradle
FROM gradle:8-jdk17 AS builder
WORKDIR /app

# Gradle wrapper와 빌드 설정 파일을 먼저 복사합니다.
COPY gradlew ./
COPY gradle ./gradle
COPY build.gradle settings.gradle ./

# Gradle wrapper에 실행 권한을 부여합니다.
RUN chmod +x ./gradlew

# 의존성을 먼저 다운로드하여 Docker 캐시를 활용합니다.
# (build.gradle이 변경될 때만 이 단계가 다시 실행됩니다.)
RUN ./gradlew dependencies --no-daemon

# 나머지 소스 코드를 복사합니다.
COPY src ./src

# 애플리케이션을 빌드합니다. (CI/CD 환경에서는 테스트를 생략하여 빌드 속도 향상)
RUN ./gradlew bootJar -x test --no-daemon

# Stage 2: Create the final, lightweight runtime image
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app

# Render가 PORT 환경 변수를 자동으로 설정해줍니다.
# EXPOSE는 문서화 목적이며, 실제 앱은 $PORT로 실행됩니다.
EXPOSE 8080

# 빌드 스테이지에서 생성된 .jar 파일을 복사합니다.
COPY --from=builder /app/build/libs/*.jar app.jar

# 애플리케이션을 실행합니다.
ENTRYPOINT ["java", "-jar", "/app/app.jar"]