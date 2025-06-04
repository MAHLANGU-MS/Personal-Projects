@echo off
echo *******************************************************
echo *     Personal Projects Repository Setup Script       *
echo *******************************************************
echo.

cd /d C:\Users\spha6\Downloads\Projects\Personal-Projects

REM Initialize git if not already initialized
if not exist .git (
  echo Initializing git repository...
  git init
  git remote add origin https://github.com/MAHLANGU-MS/Personal-Projects.git
  
  REM Create .gitignore file
  echo Creating .gitignore file...
  echo # Node.js dependencies > .gitignore
  echo node_modules/ >> .gitignore
  echo npm-debug.log >> .gitignore
  echo yarn-debug.log >> .gitignore
  echo yarn-error.log >> .gitignore
  echo package-lock.json >> .gitignore
  echo. >> .gitignore
  echo # Environment variables >> .gitignore
  echo .env >> .gitignore
  echo config.env >> .gitignore
  echo *.env.local >> .gitignore
  echo *.env.development >> .gitignore
  echo *.env.test >> .gitignore
  echo *.env.production >> .gitignore
  echo. >> .gitignore
  echo # IDE files >> .gitignore
  echo .idea/ >> .gitignore
  echo .vscode/ >> .gitignore
  echo *.swp >> .gitignore
  echo *.swo >> .gitignore
  echo. >> .gitignore
  echo # Build outputs >> .gitignore
  echo dist/ >> .gitignore
  echo build/ >> .gitignore
  echo out/ >> .gitignore
  echo. >> .gitignore
  echo # System files >> .gitignore
  echo .DS_Store >> .gitignore
  echo Thumbs.db >> .gitignore
  echo. >> .gitignore
  echo # Logs >> .gitignore
  echo logs/ >> .gitignore
  echo *.log >> .gitignore
)

REM Create project directories if they don't exist
if not exist TheCoolWebsite mkdir TheCoolWebsite
if not exist "TO-DO LIST" mkdir "TO-DO LIST"
if not exist TVTracker mkdir TVTracker

REM Copy relevant files from TheCoolWebsite
echo Copying TheCoolWebsite files...
xcopy "C:\Users\spha6\Downloads\Projects\TheCoolWebsite\.gitignore" "TheCoolWebsite\" /Y
xcopy "C:\Users\spha6\Downloads\Projects\TheCoolWebsite\package.json" "TheCoolWebsite\" /Y
xcopy "C:\Users\spha6\Downloads\Projects\TheCoolWebsite\backend" "TheCoolWebsite\backend\" /E /Y /EXCLUDE:C:\Users\spha6\Downloads\Projects\exclude_list.txt
xcopy "C:\Users\spha6\Downloads\Projects\TheCoolWebsite\frontend" "TheCoolWebsite\frontend\" /E /Y /EXCLUDE:C:\Users\spha6\Downloads\Projects\exclude_list.txt

REM Copy relevant files from TO-DO LIST
echo Copying TO-DO LIST files...
xcopy "C:\Users\spha6\Downloads\Projects\TO-DO LIST\.gitignore" "TO-DO LIST\" /Y
xcopy "C:\Users\spha6\Downloads\Projects\TO-DO LIST\backend" "TO-DO LIST\backend\" /E /Y /EXCLUDE:C:\Users\spha6\Downloads\Projects\exclude_list.txt
xcopy "C:\Users\spha6\Downloads\Projects\TO-DO LIST\frontend" "TO-DO LIST\frontend\" /E /Y /EXCLUDE:C:\Users\spha6\Downloads\Projects\exclude_list.txt
xcopy "C:\Users\spha6\Downloads\Projects\TO-DO LIST\mongodb.txt" "TO-DO LIST\" /Y

REM Copy relevant files from TVTracker
echo Copying TVTracker files...
xcopy "C:\Users\spha6\Downloads\Projects\TVTracker\*" "TVTracker\" /E /Y /EXCLUDE:C:\Users\spha6\Downloads\Projects\exclude_list.txt

REM Add README.md if it doesn't exist
if not exist README.md (
  echo Creating README.md...
  echo # Personal Projects Repository > README.md
  echo. >> README.md
  echo This repository contains the following personal projects: >> README.md
  echo. >> README.md
  echo - TheCoolWebsite >> README.md
  echo - TO-DO LIST >> README.md
  echo - TVTracker >> README.md
  echo. >> README.md
  echo ## Projects Description >> README.md
  echo. >> README.md
  echo ### TheCoolWebsite >> README.md
  echo A web application project with frontend and backend components. >> README.md
  echo. >> README.md
  echo ### TO-DO LIST >> README.md
  echo A task management application. >> README.md
  echo. >> README.md
  echo ### TVTracker >> README.md
  echo A tool for tracking TV shows and movies. >> README.md
)

REM Commit the changes
echo Adding files to git...
git add .
echo.
echo Current git status:
git status
echo.
set /p commit_msg="Enter commit message (default: Add local projects): "
if "%commit_msg%"=="" set commit_msg=Add local projects

REM Commit with the provided message
echo Committing changes...
git commit -m "%commit_msg%"

REM Ask if user wants to push changes
set /p should_push="Push to remote repository? (y/n): "
if /i "%should_push%"=="y" (
  echo Pushing to remote repository...
  git push -u origin master
)

echo.
echo Script completed successfully!
echo.
pause
