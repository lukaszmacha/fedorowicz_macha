# CarBid - Car Auction Platform

A real-time car auction platform built with Django REST Framework and React.

## 🚀 Quick Start

1. **Set up environment variables**

```bash
# Create .env file in root directory
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret
```

2. **Start with Docker**

```bash
docker-compose up --build
docker-compose exec web python manage.py migrate # init database
```

Access the application:

-   Frontend: http://localhost:3000
-   Backend API: http://localhost:1331/api/
-   Database: http://localhost:5432

## 🛠️ Local Development Setup

### Backend (Django)

```bash
# Create virtual environment
python -m venv venv
.\venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run migrations
python manage.py migrate

# Start development server
python manage.py runserver
```

### Frontend (React)

```bash
# Install dependencies
cd frontend
npm install

# Start development server
npm start
```

## 📡 API Endpoints

### Authentication

-   `POST /api/token/` - Get JWT token
-   `POST /api/token/refresh/` - Refresh token
-   `POST /api/register/` - Register user

### Offers

-   `GET /api/offers/` - List offers
-   `GET /api/offers/:id/` - Get offer details
-   `POST /api/offer/create/` - Create offer
-   `DELETE /api/offer/:id/` - Delete offer

### Bidding

-   `POST /api/offer/:id/bid/` - Place bid

## 🔌 WebSocket

Bidding updates are handled through WebSocket:

```
ws://localhost:8000/ws/auction/{auction_id}/
```

## ⚙️ Configuration

### Media Files

-   Max file size: 5MB
-   Total upload limit: 10MB
-   Supported formats: All web images

### Auction Rules

-   Min bid increment: $100
-   Time extension: 10s after bid

## 🌐 Tech Stack

-   **Frontend**: React, Bootstrap
-   **Backend**: Django REST Framework
-   **Database**: PostgreSQL
-   **Payment**: Stripe
-   **Container**: Docker

## 📦 Project Structure

```
carbid/
├── api/                # Django REST API
│   ├── models/        # Database models
│   ├── views/         # API endpoints
│   └── tests/         # Backend tests
├── frontend/          # React frontend
│   ├── src/          # Source files
│   └── public/       # Static files
├── proxy/            # Nginx configuration
├── backend/          # Django settings
└── docker-compose.yml
```

## 🔧 Troubleshooting

### Common Issues

1. **Port Conflicts**

    ```bash
    # Check ports in use
    netstat -ano | findstr "1331"
    netstat -ano | findstr "3000"
    ```

2. **Database Connection**

    ```bash
    # Verify PostgreSQL connection
    python manage.py dbshell
    ```

3. **Media Files**
    - Check `/media` directory permissions
    - Verify Nginx configuration
