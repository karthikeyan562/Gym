@echo off
title WORKOUT MASTERS - Launcher
echo ===================================================
echo     STARTING WORKOUT MASTERS APPLICATION
echo ===================================================
echo.

echo [1/2] Starting Spring Boot Backend (Port 8080)...
start "WORKOUT MASTERS Backend (Port 8080)" cmd /k "java -jar backend\target\gym-management-backend-1.0.0.jar --spring.profiles.active=dev"

echo Waiting 5 seconds for backend to initialize...
timeout /t 5 /nobreak > nul

echo [2/2] Starting Vite Frontend (Port 5173)...
start "WORKOUT MASTERS Frontend (Port 5173)" cmd /k "cd frontend && npm run dev"

echo.
echo ===================================================
echo  WORKOUT MASTERS is running!
echo  Frontend URL: http://localhost:5173
echo  Backend URL:  http://localhost:8080/api
echo ===================================================
echo.
timeout /t 3 > nul
start http://localhost:5173
