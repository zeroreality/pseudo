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

rem ### run Closure (update this path to compile)
java -jar "..path\to\closure.jar" ^
                        --charset UTF-8 ^
                        --env BROWSER ^
                        --strict_mode_input ^
                        --language_in ECMASCRIPT5_STRICT ^
                        --language_out ECMASCRIPT5_STRICT ^
                        --warning_level VERBOSE ^
                        --use_types_for_optimization ^
                        --assume_function_wrapper ^
                        --compilation_level ADVANCED ^
                        --formatting PRETTY_PRINT ^
                        --formatting SINGLE_QUOTES ^
				    --jscomp_off deprecatedAnnotations ^
                        --js_output_file "..\out\pseudo3.js" ^
                        "..\out\tmp" 2> "..\out\pseudo3.js.log"

rem ### cleanup temp file
del "..\out\tmp"