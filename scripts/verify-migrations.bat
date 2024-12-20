@echo off
echo Verifying Prisma migrations for all services...

echo.
echo === Auth Service ===
cd services/auth
call npx prisma migrate status

echo.
echo === Appointments Service ===
cd ../appointments
call npx prisma migrate status

echo.
echo === Patients Service ===
cd ../patients
call npx prisma migrate status

echo.
echo === Analytics Service ===
cd ../analytics
call npx prisma migrate status

echo.
echo Migration verification complete!
cd ../.. 