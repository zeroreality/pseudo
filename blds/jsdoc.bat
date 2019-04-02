@echo off
setlocal ENABLEDELAYEDEXPANSION

set /p build=Enter filename of build (leave blank for full build):
if [!build!] == [] set build=pseudo3
echo Building !build!.

rem ### concat files together from build
set merge="_header.txt"
for /f "usebackq tokens=3" %%a in (`"findstr path= !build!.js"`) do (
set file=%%a
set merge=!merge! + !file:~5,100!
rem echo !file!
)
set merge=!merge! + "_footer.txt"
rem ### copy temp file to output folder
copy !merge! "..\out\tmp"

rem ### run JSDoc
node "..\path\to\jsdoc.js" ^
          "..\out\tmp" ^
          --verbose ^
          --private ^
          --template "..\path\to\template" ^
          --destination "console" ^
          > "..\out\pseudo3.md" ^
          2> "..\out\pseudo3.md.log"

rem ### cleanup temp file
del "..\out\tmp"