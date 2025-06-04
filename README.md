# Digital E-Gram Panchayat

A modern web application for digitizing Gram Panchayat services, built with the MERN stack (MongoDB, Express.js, React.js, Node.js).

## Features

### For Citizens
- **User Authentication**: Secure registration and login system
- **Service Applications**: Apply for various Gram Panchayat services
- **Document Upload**: Upload required documents for service applications
- **Application Tracking**: Track application status in real-time
- **Profile Management**: Manage personal information and view application history

### For Administrators
- **Dashboard**: Overview of applications and services
- **Application Management**: Process and update application statuses
- **User Management**: Manage citizen accounts
- **Service Management**: Add, edit, or remove available services
- **Document Verification**: View and verify uploaded documents

## Tech Stack

### Frontend
- React.js with Material-UI
- Framer Motion for animations
- Axios for API calls
- React Router for navigation
- Context API for state management

### Backend
- Node.js with Express.js
- MongoDB for database
- JWT for authentication
- Multer for file uploads
- Express Validator for input validation

## Installation

1. Clone the repository
```bash
git clone https://github.com/digital-e-gram-panchayat.git
cd digital-e-gram-panchayat
```

2. Install dependencies for both frontend and backend
```bash
# Install backend dependencies
npm install

# Install frontend dependencies
cd client
npm install
```

3. Create a .env file in the root directory with the following variables:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

4. Start the development servers
```bash
# Start backend server (from root directory)
npm run server

# Start frontend server (from client directory)
cd client
npm start
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Project Structure

```
digital-e-gram-panchayat/
├── client/                 # Frontend React application
│   ├── public/            # Static files
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── context/       # Context providers
│   │   ├── layouts/       # Layout components
│   │   ├── pages/        # Page components
│   │   ├── theme/        # MUI theme configuration
│   │   └── config/       # Configuration files
│   └── package.json
├── server/                # Backend Node.js application
│   ├── src/
│   │   ├── controllers/  # Route controllers
│   │   ├── middleware/   # Custom middleware
│   │   ├── models/       # MongoDB models
│   │   ├── routes/       # API routes
│   │   └── utils/        # Utility functions
│   └── package.json
├── uploads/              # Uploaded files directory
└── package.json
```

## Available Scripts

In the project directory, you can run:

### Backend
- `npm run server`: Starts the backend server
- `npm run dev`: Starts the backend server with nodemon

### Frontend
- `npm start`: Starts the frontend development server
- `npm run build`: Builds the frontend for production
- `npm test`: Runs frontend tests
- `npm run eject`: Ejects from Create React App

## User Roles

### Citizen
- Register and login
- Browse available services
- Submit service applications
- Upload required documents
- Track application status
- View application history
- Update profile information

### Administrator
- Manage service applications
- Update application status
- View and verify documents
- Manage available services
- Handle user accounts
- Access admin dashboard

## API Endpoints

### Auth Routes
- POST `/api/auth/register`: Register new user
- POST `/api/auth/login`: User login
- GET `/api/auth/profile`: Get user profile

### Application Routes
- GET `/api/applications`: Get all applications
- POST `/api/applications`: Create new application
- GET `/api/applications/:id`: Get application details
- PATCH `/api/applications/:id/status`: Update application status

### Service Routes
- GET `/api/services`: Get all services
- POST `/api/services`: Add new service
- GET `/api/services/:id`: Get service details
- PUT `/api/services/:id`: Update service
- DELETE `/api/services/:id`: Delete service

### User Routes
- GET `/api/users`: Get all users (admin only)
- GET `/api/users/:id`: Get user details
- PUT `/api/users/:id`: Update user
- DELETE `/api/users/:id`: Delete user

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Material-UI for the component library
- Framer Motion for animations
- The MERN stack community for resources and inspiration