@echo off
cd /d C:\Users\spha6\Downloads\Projects\Personal-Projects

REM Initialize git if not already initialized
if not exist .git (
  echo Initializing git repository...
  git init
  git remote add origin https://github.com/MAHLANGU-MS/Personal-Projects.git
)

echo Creating project directories...
mkdir TheCoolWebsite
mkdir "TO-DO LIST"
mkdir TVTracker

echo Creating temporary script to copy files...
echo @echo off > copy_files.bat
echo echo Copying TheCoolWebsite files... >> copy_files.bat
echo xcopy /E /Y /EXCLUDE:..\\exclude_list.txt ..\\TheCoolWebsite TheCoolWebsite\\ >> copy_files.bat
echo echo Copying TO-DO LIST files... >> copy_files.bat
echo xcopy /E /Y /EXCLUDE:..\\exclude_list.txt "..\\TO-DO LIST" "TO-DO LIST\\" >> copy_files.bat
echo echo Copying TVTracker files... >> copy_files.bat
echo xcopy /E /Y /EXCLUDE:..\\exclude_list.txt ..\\TVTracker TVTracker\\ >> copy_files.bat

echo Creating commit script...
echo @echo off > commit_files.bat
echo cd /d C:\Users\spha6\Downloads\Projects\Personal-Projects >> commit_files.bat
echo git add . >> commit_files.bat
echo git status >> commit_files.bat
echo set /p commit_msg="Enter commit message (default: Add local projects): " >> commit_files.bat
echo if "%%commit_msg%%"=="" set commit_msg=Add local projects >> commit_files.bat
echo git commit -m "%%commit_msg%%" >> commit_files.bat
echo set /p should_push="Push to remote? (y/n): " >> commit_files.bat
echo if "%%should_push%%"=="y" git push -u origin master >> commit_files.bat
echo echo Done! >> commit_files.bat
echo pause >> commit_files.bat

echo Files created successfully.
echo Please run copy_files.bat to copy the project files.
echo Then run commit_files.bat to commit and push the changes.
echo.
echo Press any key to exit...
pause > nul