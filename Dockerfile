FROM node:lts-alpine AS frontend-build

WORKDIR /workspace/frontend

COPY frontend/package*.json ./
RUN if [ -f package-lock.json ]; then npm ci; else npm install; fi

COPY frontend/ ./
RUN npm run build


FROM eclipse-temurin:21-jdk-alpine AS backend-build

WORKDIR /workspace/backend

COPY backend/.mvn ./.mvn
COPY backend/mvnw backend/pom.xml ./
RUN chmod +x ./mvnw
RUN ./mvnw -B dependency:go-offline

COPY backend/src ./src
COPY --from=frontend-build /workspace/frontend/dist ./src/main/resources/static
RUN ./mvnw -B clean package -DskipTests


FROM eclipse-temurin:21-jre-alpine

WORKDIR /app

RUN addgroup -S app && adduser -S app -G app

COPY --from=backend-build /workspace/backend/target/*.jar app.jar

ENV SERVER_PORT=8080
EXPOSE 8080

USER app

ENTRYPOINT ["java", "-jar", "/app/app.jar"]
