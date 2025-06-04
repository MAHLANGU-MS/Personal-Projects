@echo off
setlocal enabledelayedexpansion

cd /d C:\Users\spha6\Downloads\Projects\Personal-Projects

REM Create project directories if they don't exist
if not exist TheCoolWebsite mkdir TheCoolWebsite
if not exist "TO-DO LIST" mkdir "TO-DO LIST"
if not exist TVTracker mkdir TVTracker

REM Function to copy selected files from a project
:CopyProject
echo.
echo Preparing to copy files from %~1 project...
echo.

REM Create a list of files/folders in the source directory
set "sourceDir=C:\Users\spha6\Downloads\Projects\%~1"
set "destDir=C:\Users\spha6\Downloads\Projects\Personal-Projects\%~1"

REM First, list all available files and directories
echo Files and directories in %~1:
echo -----------------------------------
dir /b "%sourceDir%" | findstr /V /C:"node_modules" /C:".git"
echo -----------------------------------
echo.

:SelectFilesPrompt
echo Select files/folders to copy (separate by commas, or type 'all' for all files except node_modules):
set /p "selection="

REM Process the selection
if "%selection%"=="all" (
    echo Copying all files except node_modules and .git...
    xcopy "%sourceDir%" "%destDir%" /E /Y /I /EXCLUDE:C:\Users\spha6\Downloads\Projects\exclude_list.txt
) else (
    REM Split the comma-separated list
    for %%i in (%selection%) do (
        if exist "%sourceDir%\%%i" (
            if "%%i"=="node_modules" (
                echo Skipping node_modules folder...
            ) else (
                echo Copying %%i...
                if exist "%sourceDir%\%%i\" (
                    REM It's a directory
                    xcopy "%sourceDir%\%%i" "%destDir%\%%i\" /E /Y /I
                ) else (
                    REM It's a file
                    xcopy "%sourceDir%\%%i" "%destDir%\" /Y
                )
            )
        ) else (
            echo Warning: %%i not found in %sourceDir%
        )
    )
)

echo.
echo Files from %~1 have been copied to the repository.
goto :EOF

REM Main program
echo **************************************************
echo *       Project Files Selection for Git Repo     *
echo **************************************************
echo.
echo This script will help you select which files to include in the git repository.
echo For each project, you'll be able to choose specific files or copy all files.
echo.

REM Initialize git if not already initialized
if not exist .git (
  echo Initializing git repository...
  git init
  git remote add origin https://github.com/MAHLANGU-MS/Personal-Projects.git
)

REM Copy TheCoolWebsite files
call :CopyProject TheCoolWebsite

REM Copy TO-DO LIST files
call :CopyProject "TO-DO LIST"

REM Copy TVTracker files
call :CopyProject TVTracker

echo.
echo All projects have been processed.
echo.

REM Create commit script
echo @echo off > commit_changes.bat
echo cd /d C:\Users\spha6\Downloads\Projects\Personal-Projects >> commit_changes.bat
echo git add . >> commit_changes.bat
echo git status >> commit_changes.bat
echo set /p commit_msg="Enter commit message (default: Add local projects): " >> commit_changes.bat
echo if "%%commit_msg%%"=="" set commit_msg=Add local projects >> commit_changes.bat
echo git commit -m "%%commit_msg%%" >> commit_changes.bat
echo set /p should_push="Push to remote? (y/n): " >> commit_changes.bat
echo if "%%should_push%%"=="y" git push -u origin master >> commit_changes.bat
echo echo Done! >> commit_changes.bat
echo pause >> commit_changes.bat

echo A commit script has been created: commit_changes.bat
echo Run this script to commit your changes and push them to the repository.
echo.
echo Press any key to exit...
pause > nul
