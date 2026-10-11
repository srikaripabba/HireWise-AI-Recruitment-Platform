# HireWise AI — AI-Powered Recruitment Platform

HireWise AI is an AI-assisted recruitment platform designed to help HR teams manage job openings, organize candidate records, and screen resumes more efficiently.

## Features

- HR Dashboard: A centralized interface for recruitment activities.
- Job Management: Create and manage job openings.
- Candidate Management: Add and organize candidate records.
- Resume Upload and Screening: Upload resumes and analyze candidate profiles.
- AI-Powered Candidate Ranking: Review candidate match scores and rankings to support shortlisting.
- Secure Authentication: Login for HR users.

## Technology Stack

**Frontend**
- React
- Vite
- JavaScript

**Backend**
- Python
- Django
- Django REST Framework

**AI and Resume Processing**
- Scikit-learn
- PyMuPDF

**Database**
- SQLite for local development

## Project Structure

```text
HireWise-AI-Recruitment-Platform/
├── backend/
│   ├── accounts/
│   ├── jobs/
│   ├── resumes/
│   ├── screening/
│   ├── config/
│   └── requirements.txt
├── frontend/
└── .gitignore
```

## Local Development

### Backend

1. Navigate to the backend directory:

   bash
   cd backend
   

2. Create and activate a Python virtual environment.

3. Install dependencies:

   bash
   pip install -r requirements.txt
   

4. Apply database migrations:

   bash
   python manage.py migrate
   

5. Start the Django server:

   bash
   python manage.py runserver
   

### Frontend

1. Open a second terminal and navigate to the frontend directory:

   bash
   cd frontend
   

2. Install dependencies:

   bash
   npm install
   

3. Start the development server:

   bash
   npm run dev
   

Configure `VITE_API_BASE_URL` if your backend API is running at a different address.

## Purpose

HireWise AI is designed as an HR-facing decision-support tool. Its candidate rankings and match scores are intended to assist human review, not replace recruiter judgment.

## Status

The source code is available in this repository. Deployment and production configuration may be required before running the application online.

## Author

**Srikari Pabba**

GitHub: [@srikaripabba](https://github.com/srikaripabba)
