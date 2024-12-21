@echo off
echo Initializing Prisma for all services...

echo.
echo === Auth Service ===
cd services/auth
call npm install
call npx prisma generate
call npx prisma migrate dev --name init

echo.
echo === Appointments Service ===
cd ../appointments
call npm install
call npx prisma generate
call npx prisma migrate dev --name init

echo.
echo === Patients Service ===
cd ../patients
call npm install
call npx prisma generate
call npx prisma migrate dev --name init

echo.
echo === Analytics Service ===
cd ../analytics
call npm install
call npx prisma generate
call npx prisma migrate dev --name init

echo.
echo All services initialized successfully!
cd ../.. 