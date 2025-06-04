@echo off
echo Checking if Git is installed...
where git >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
  echo Git is not installed or not in your PATH.
  echo Please install Git from https://git-scm.com/downloads
  echo After installation, you may need to restart your computer.
  echo.
  echo Once Git is installed, you can run the setup_repository.bat script.
  pause
  exit /b 1
)

echo Git is installed! You can proceed with the repository setup.
echo.
echo Please run setup_repository.bat to set up the repository.
pause
