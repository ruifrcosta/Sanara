\c sanara;

-- Auth Service Tables
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('users', 'clinics');

-- Appointments Service Tables
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('appointments', 'reminders');

-- Patients Service Tables
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('patients', 'medical_records');

-- Analytics Service Tables
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_schema = 'public' 
AND table_name IN ('clinic_metrics', 'doctor_metrics', 'patient_feedback'); 