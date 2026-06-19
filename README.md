# KrushiSetu
KrushiSetu is a farmer-focused digital platform for discovering, applying for, and tracking government agricultural subsidies. The system connects farmers, subsidy providers, and officers through a React frontend and Django REST backend, with support for document uploads, application review, grievance handling, notifications, news updates, and AI-assisted subsidy recommendations.

## Key Features

- Farmer registration and login with email OTP verification, JWT authentication, Google OAuth support, password reset, logout, and password change.
- Role-based flows for farmers, officers, subsidy providers, and admins.
- Farmer dashboard for profile details, land information, bank details, document management, subsidy discovery, applications, reviews, and support.
- Subsidy listing, details, required documents, ratings, reviews, and application tracking.
- AI-powered subsidy recommendations based on farmer profile, income, land size, crop, region, and available schemes.
- Subsidy application workflow with document upload, officer assignment, officer review, document verification, and status updates.
- Officer dashboard for reviewing assigned subsidy applications and grievances.
- Subsidy provider dashboard for managing provider-created subsidies, viewing applications, posting news, and generating reports.
- News/articles module for agriculture and subsidy updates.
- Grievance and support module with officer remarks and status tracking.
- Notification center with read/unread status and user notification preferences.
- Multi-language and responsive frontend experience.

## Tech Stack

### Frontend

- React 18
- Vite
- React Router
- Axios
- Tailwind CSS
- Vitest and React Testing Library
- Selenium GUI tests

### Backend

- Django 5
- Django REST Framework
- Simple JWT with cookie-based authentication support
- SQLite for local development
- PostgreSQL/NeonDB support for production through `DATABASE_URL`
- Cloudinary for production file storage
- Groq, LangChain, and LangGraph for AI subsidy recommendations
- Twilio and email OTP utilities
- Pytest and pytest-django

## Project Structure

```text
KrushiSetu/
|-- src/                         # React frontend
|   |-- Components/
|   |   |-- HomePage/            # Landing, news, FAQ, multi-language views
|   |   |-- Signup_And_Login/    # Auth screens and auth API helpers
|   |   |-- User_Profile/        # Farmer dashboard, documents, subsidies, support
|   |   |-- Officer_profile/     # Officer dashboard and grievance review
|   |   `-- Subsidy_Provider/    # Provider dashboard, news, reports
|   |-- config/                  # Frontend API base URL configuration
|   `-- utils/                   # Shared frontend helpers
|-- back/                        # Django backend
|   |-- back/                    # Django project settings and root URLs
|   |-- loginSignup/             # Users, auth, OTP, Google login
|   |-- app/                     # Subsidy catalog and user profile API
|   |-- dashboard/               # Farmer cloud profile details
|   |-- photo/                   # User document CRUD
|   |-- subsidy/                 # Subsidy applications and officer review
|   |-- subsidy_provider/        # Provider-specific subsidy/application APIs
|   |-- support/                 # Grievance APIs
|   |-- news_post/               # News/article APIs
|   |-- notifications/           # Notification APIs
|   `-- SubsidyRecommandation/   # AI recommendation service
|-- tests/                       # Frontend and backend tests
|-- GUI_Testing/                 # Selenium GUI test specs
|-- Diagram/                     # Use case and sequence diagrams
|-- Mid_Evaluation/              # Mid-evaluation assets and report
`-- Final Submission/            # Final project reports and testing artifacts
```

## Prerequisites

- Node.js 18 or later
- Python 3.10 or later
- pip
- Git

## Local Setup

### 1. Clone and install frontend dependencies

```bash
git clone <repository-url>
cd KrushiSetu
npm install
```

### 2. Create the environment file

Create `.env` in the project root. The backend loads environment variables from the project root `.env`, `back/.env`, or `/etc/secrets/.env`.

For local development, this minimal configuration is enough:

```env
DEBUG=True
SECRET_KEY=replace-with-a-local-secret
ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://localhost:5174
CSRF_TRUSTED_ORIGINS=http://localhost:5173,http://localhost:5174
VITE_BASE_URL=http://127.0.0.1:8000
SEND_REAL_EMAIL=false
DEFAULT_FROM_EMAIL=noreply@localhost
```

Optional integrations:

```env
DATABASE_URL=postgresql://user:password@host:5432/database
GROQ_API_KEY=your-groq-api-key
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
EMAIL_HOST_USER=your-email@example.com
EMAIL_HOST_PASSWORD=your-email-app-password
BREVO_API_KEY=your-brevo-api-key
GOOGLE_CLIENT_ID=your-google-client-id
TWILIO_ACCOUNT_SID=your-twilio-account-sid
TWILIO_AUTH_TOKEN=your-twilio-auth-token
TWILIO_PHONE_NUMBER=your-twilio-phone-number
```

Do not commit real `.env` secrets.

### 3. Install backend dependencies

```bash
cd back
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.local.txt
```

On macOS/Linux, activate the virtual environment with:

```bash
source .venv/bin/activate
```

### 4. Run database migrations

```bash
python manage.py migrate
```

Optional local admin user:

```bash
python manage.py createsuperuser
```

The backend uses SQLite locally when `DEBUG=True` and no `DATABASE_URL` is provided.

### 5. Start the backend

```bash
python manage.py runserver
```

Backend URL:

```text
http://127.0.0.1:8000
```

### 6. Start the frontend

Open a second terminal from the project root:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

In development, Vite proxies API routes such as `/api`, `/profile`, `/photo`, `/support`, `/subsidy`, `/news`, and `/notify` to Django.

## Main Routes

### Frontend Routes

- `/` - Home page
- `/login` - Signup and login flow
- `/learn-more` - Project information page
- `/news/:id` - News details
- `/sidebar` - Farmer dashboard
- `/officer_sidebar` - Officer dashboard
- `/sub` - Subsidy provider dashboard
- `/apply/:id` - Apply for a subsidy
- `/viewdetails/:id` - View subsidy/application details
- `/subsidy-list` - Subsidy list
- `/rate-review/:id` - Rate and review a subsidy

### Backend API Areas

- `/api/signup/`, `/api/verify-email/`, `/api/token/`, `/api/token/refresh/` - Authentication
- `/api/subsidies/` - Subsidy catalog
- `/api/recommend-subsidies/` - Basic subsidy recommendations
- `/api/subsidy-recommendations/` - AI-powered recommendations
- `/profile/profile/` - Farmer profile
- `/profile/user/photo/` - User photo
- `/photo/documents/` - Document management
- `/subsidy/apply/` - Subsidy application submission
- `/subsidy/applications/` - Subsidy application API
- `/subsidy/officer/dashboard/` - Officer application dashboard
- `/support/grievances/` - Grievance management
- `/news/articles/` - Public news articles
- `/news/create/` - Provider news creation
- `/api/subsidy_provider/subsidies/my/` - Provider subsidies
- `/notify/` - Notifications
- `/admin/` - Django admin

## Testing

### Frontend unit tests

```bash
npm test
```

Coverage:

```bash
npm run test:coverage
```

### Backend tests

From `KrushiSetu/back`:

```bash
pytest
```

### GUI tests

Selenium GUI test specs are available in `GUI_Testing/` and `tests/Frontend/GUI_Testing/`. Start both the Django backend and Vite frontend before running GUI tests.

## Build

Create a production frontend build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Deployment Notes

- Frontend deployment is configured for Vercel through `vercel.json`.
- Backend deployment expects production environment variables, especially `DATABASE_URL`.
- In production, Django requires PostgreSQL through `DATABASE_URL`; SQLite is only used for local development with `DEBUG=True`.
- Static files use WhiteNoise in production.
- Uploaded media uses Cloudinary when `DATABASE_URL` is configured.
- Configure `ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, and `CSRF_TRUSTED_ORIGINS` for deployed frontend and backend domains.

## Team Artifacts

The repository includes project reports, diagrams, UI/UX documents, testing reports, load/stress testing artifacts, vulnerability testing documents, and mutation testing outputs under:

- `Diagram/`
- `Mid_Evaluation/`
- `Final Submission/`
- `tests/`
- `GUI_Testing/`

## Summary

KrushiSetu aims to simplify access to agricultural subsidies by giving farmers one place to discover relevant schemes, manage documents, apply online, receive updates, raise grievances, and track progress while allowing officers and subsidy providers to manage the subsidy lifecycle from the same platform.
