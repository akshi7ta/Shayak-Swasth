# Healthcare Management System - Startup Guide

## Overview
This is a comprehensive healthcare management platform built with:
- **Frontend**: React + TypeScript + Vite + Tailwind CSS
- **Backend**: FastAPI + PostgreSQL + SQLAlchemy

## Data Storage Architecture

### Database: PostgreSQL with pgvector
All data is stored in PostgreSQL database with the following tables:

1. **users** - User authentication (email, phone, password)
2. **user_roles** - Role assignments (patient, doctor, hospital_manager, admin)
3. **patients** - Patient demographic and medical information
   - Links to users via `user_id`
   - Stores: medical_id, name, DOB, gender, blood_type, emergency_contact, address
4. **records** - Medical records and files
   - Links to patients via `patient_id`
   - Stores: file metadata, upload info, status
5. **record_text** - Extracted text from medical records (for AI search)
6. **embeddings** - Vector embeddings for semantic search
7. **shared_access** - Access permissions for records
8. **access_logs** - Audit trail of all actions
9. **manager_action_otp** - OTPs for sensitive manager actions

## Starting the Application

### Prerequisites
- Python 3.9+
- Node.js 18+
- PostgreSQL 14+ (with pgvector extension)
- Docker (optional, recommended)

### Option 1: Using Docker Compose (Recommended)

```bash
# Navigate to backend directory
cd backend

# Start PostgreSQL and API
docker-compose up -d

# View logs
docker-compose logs -f
```

The backend will be available at `http://localhost:8000`
API docs at `http://localhost:8000/docs`

### Option 2: Manual Setup

#### 1. Setup Database

```bash
# Install PostgreSQL with pgvector
# On Ubuntu/Debian:
sudo apt-get install postgresql-14 postgresql-14-pgvector

# On macOS with Homebrew:
brew install postgresql@14
brew install pgvector

# Create database
psql -U postgres
CREATE DATABASE healthcare_db;
\c healthcare_db
CREATE EXTENSION vector;
\q
```

#### 2. Setup Backend

```bash
cd backend

# Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create .env file
cp .env.example .env

# Edit .env with your settings:
# DATABASE_URL=postgresql://postgres:your_password@localhost:5432/healthcare_db
# SECRET_KEY=your-secret-key-here
# AWS_ACCESS_KEY_ID=your-aws-key
# AWS_SECRET_ACCESS_KEY=your-aws-secret
# S3_BUCKET_NAME=your-bucket
# OPENAI_API_KEY=your-openai-key

# Run database migrations (tables will be created automatically on first run)
python main.py
```

#### 3. Setup Frontend

```bash
# Open a new terminal
cd ..  # Go to project root

# Install dependencies
npm install

# Create .env file
echo "VITE_API_URL=http://localhost:8000" > .env

# Start development server
npm run dev
```

The frontend will be available at `http://localhost:8080`

## First Time Setup

### 1. Create Admin User (Optional)
Run this SQL in your database to create an admin user:

```sql
-- Insert admin user
INSERT INTO users (id, email, password_hash, email_verified)
VALUES (
  gen_random_uuid(),
  'admin@healthcare.com',
  '$2b$12$...',  -- Use bcrypt to hash your password
  true
);

-- Get the user ID
SELECT id FROM users WHERE email = 'admin@healthcare.com';

-- Assign admin role (replace <user_id> with actual ID)
INSERT INTO user_roles (user_id, role)
VALUES ('<user_id>', 'admin');
```

### 2. Register as Patient
- Go to http://localhost:8080/signup
- Fill in all required patient information
- This will create both user account and patient profile

### 3. Test the System
- Login at http://localhost:8080/auth
- Upload medical records (Patient Dashboard)
- Test AI search functionality
- Check audit logs (Admin Dashboard)

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new patient with full info
- `POST /api/auth/login` - Email/password login
- `POST /api/auth/send-otp` - Send phone OTP
- `POST /api/auth/verify-otp` - Verify OTP and login

### Patients
- `GET /api/patients/me` - Get current patient profile
- `POST /api/patients/` - Create patient profile
- `GET /api/patients/search` - Search patients (doctors/managers)

### Records
- `GET /api/records/` - List patient's records
- `POST /api/records/upload` - Upload new record
- `GET /api/records/{id}` - Get specific record

### AI Features
- `POST /api/ai/search` - Semantic search across records
- `POST /api/ai/ask/{record_id}` - Ask questions about specific record

## Environment Variables

### Backend (.env)
```env
DATABASE_URL=postgresql://user:pass@localhost:5432/healthcare_db
SECRET_KEY=your-secret-key-minimum-32-characters
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
S3_BUCKET_NAME=your-s3-bucket-name
AWS_REGION=us-east-1
OPENAI_API_KEY=sk-your-openai-api-key
```

### Frontend (.env)
```env
VITE_API_URL=http://localhost:8000
```

## Troubleshooting

### Database Connection Issues
```bash
# Check PostgreSQL is running
sudo systemctl status postgresql

# Check if database exists
psql -U postgres -l | grep healthcare_db

# Check pgvector extension
psql -U postgres -d healthcare_db -c "SELECT * FROM pg_extension WHERE extname = 'vector';"
```

### Backend Not Starting
```bash
# Check Python version
python --version  # Should be 3.9+

# Reinstall dependencies
pip install -r requirements.txt --force-reinstall

# Check database connection
python -c "from database import engine; print(engine.connect())"
```

### Frontend Build Issues
```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install

# Check Node version
node --version  # Should be 18+
```

## Production Deployment

See `backend/DEPLOYMENT.md` for detailed deployment instructions for:
- AWS (EC2, RDS, S3)
- Railway
- Render
- DigitalOcean

## Security Notes

⚠️ **IMPORTANT**: Before deploying to production:

1. Change `SECRET_KEY` to a strong random string
2. Set `echo=False` in database.py
3. Enable HTTPS/SSL
4. Configure CORS properly in main.py
5. Set up proper AWS IAM roles
6. Enable rate limiting
7. Implement proper logging and monitoring
8. Use environment-specific configuration
9. Enable database backups
10. Set up proper error handling

## Support

For issues or questions:
1. Check API documentation: http://localhost:8000/docs
2. Check logs: `docker-compose logs -f` or check `backend/logs/`
3. Review database schema: `backend/models.py`
4. Check database directly: `psql -U postgres -d healthcare_db`
