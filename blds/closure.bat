@echo off
java -jar "closure.jar" --charset UTF-8 ^
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
                        --js_output_file "..\out\pseudo3.js" ^
                        "..\src\_include.js" ^
                        "..\src\objects\pseudo.js" ^
                        "..\src\objects\Boolean.js" ^
                        "..\src\objects\Number.js" ^
                        "..\src\objects\Object.js" ^
                        "..\src\objects\Array.js" ^
                        "..\src\objects\Date.js" ^
                        "..\src\objects\String.js" ^
                        "..\src\objects\Function.js" ^
                        "..\src\dom\_include.js" ^
                        "..\src\dom\query.js" ^
                        "..\src\dom\tree.js" ^
                        "..\src\dom\events.js" ^
                        "..\src\util\cookie.js" ^
                        "..\src\util\css.js" ^
                        "..\src\util\forms.js" ^
                        "..\src\util\keyboard.js" ^
                        "..\src\util\processor.js" ^
                        "..\src\util\json.js" ^
                        "..\src\util\protocol.js"