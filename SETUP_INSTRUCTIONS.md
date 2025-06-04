# Repository Setup Instructions

This folder contains several scripts to help you set up the repository with your local projects. Here's a guide on how to use them:

## Option 1: Automated Setup (Recommended)

1. Run `setup_repository.bat`:
   - This script will automatically initialize the git repository
   - Copy all relevant files from your local projects (excluding node_modules and other unnecessary files)
   - Create a .gitignore file
   - Commit the changes
   - Optionally push to the remote repository

## Option 2: Manual File Selection

1. Run `select_files.bat`:
   - This script will guide you through selecting which files to include for each project
   - After selecting files, it will create a `commit_changes.bat` script
   - Run `commit_changes.bat` to commit and push your changes

## Option 3: Basic Setup and Manual File Management

1. Run `setup_repo.bat`:
   - This script will create the necessary project directories
   - Create `copy_files.bat` to copy the project files
   - Create `commit_files.bat` to commit and push the changes
   - Run both scripts as needed

## Notes

- All scripts exclude node_modules and other unnecessary files by default
- Make sure git is installed on your system
- You may need to authenticate with GitHub when pushing changes

Choose the option that best suits your needs. Option 1 is the most straightforward and recommended for most users.
