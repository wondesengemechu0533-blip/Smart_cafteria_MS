@echo off
REM Smart Cafeteria Backend dev runner (cmd wrapper -> start-dev.ps1)
REM Cleanly frees port 5000, then starts the backend under nodemon with
REM debounced watching that excludes logs/ and node_modules/.
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0start-dev.ps1" %*