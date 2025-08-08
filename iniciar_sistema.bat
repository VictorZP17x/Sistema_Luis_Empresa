@echo off
cd /d "%~dp0"
echo ============================
echo Iniciando Sistema Luis Empresa
echo ============================

:: Iniciar MySQL desde instalación de XAMPP
echo Iniciando MySQL desde C:\xampp...
start "" "C:\xampp\mysql_start.bat"

:: Esperar unos segundos para que MySQL inicie
timeout /t 5 /nobreak

:: Activar entorno virtual
echo Activando entorno virtual de Python...
call company-env\Scripts\activate.bat

:: Ir al proyecto Django
cd company_app

:: Aplicar migraciones (por si acaso)
echo Aplicando migraciones...
python manage.py migrate

:: Iniciar servidor Django
echo Iniciando servidor de Django...
start "" python manage.py runserver 127.0.0.1:8000

:: Abrir navegador
timeout /t 3
start http://127.0.0.1:8000