@echo off
title Graduation Photo Script - Vite Dev Server
set "PATH=D:\Program Files\nodejs;%PATH%"
cd /d "%~dp0"
"D:\Program Files\nodejs\npm.cmd" run dev -- --host 0.0.0.0
echo.
echo Dev server stopped. Press any key to close this window.
pause >nul
