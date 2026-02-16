# Use Maven image to build
FROM maven:3.9-eclipse-temurin-17 AS build
WORKDIR /app
COPY backend/pom.xml .
COPY backend/src ./src
RUN mvn clean package -DskipTests

# Use JRE image to run
FROM eclipse-temurin:17-jre-alpine

# Install Python and Tesseract OCR
RUN apk add --no-cache python3 py3-pip tesseract-ocr tesseract-ocr-data-eng py3-pillow

# Install Python dependencies
RUN pip3 install --break-system-packages pytesseract

WORKDIR /app
COPY --from=build /app/target/backend-1.0.0.jar app.jar
COPY ocr_service.py /app/ocr_service.py

ENV PORT=8080
ENV OCR_PYTHON_PATH=python3
ENV OCR_SCRIPT_PATH=/app/ocr_service.py

EXPOSE ${PORT}
ENTRYPOINT ["sh", "-c", "java -Xmx350m -Dserver.port=${PORT} -jar app.jar"]
