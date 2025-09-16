# Jay Jalaram Electricals - Business Management System

A comprehensive web application for managing electrical services business operations, including client management, invoice generation, bill tracking, and administrative functions.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Features](#features)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [User Roles](#user-roles)
- [Screenshots](#screenshots)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Project Overview

Jay Jalaram Electricals Business Management System is a full-stack web application designed to streamline electrical services business operations. The system provides separate interfaces for administrators and clients, enabling efficient management of services, billing, and client relationships.

### Key Objectives
- Digitize business operations and reduce paperwork
- Provide real-time dashboard analytics for business insights
- Automate invoice generation and bill management
- Enable secure client portal for service tracking
- Implement role-based access control for different user types

## ✨ Features

### 🔐 Authentication & Authorization
- Secure JWT-based authentication
- Role-based access control (Admin, Client, User)
- Protected routes and API endpoints
- Session management

### 👨‍💼 Admin Dashboard
- **Real-time Analytics**: Total clients, invoices, revenue, pending payments
- **Client Management**: Add, edit, delete, and manage client information
- **Invoice Management**: Create, view, download, and track invoices
- **Bill Generation**: Automated bill creation with GST calculations
- **Payment Tracking**: Monitor payment status and due dates
- **User Role Management**: Assign and modify user permissions

### 👤 Client Portal
- **Personal Dashboard**: View service history and pending bills
- **Invoice Access**: Download and view detailed invoices
- **Bill Tracking**: Monitor payment status and due dates
- **Profile Management**: Update contact and company information

### 📊 Bill & Invoice System
- **Professional Invoice Generation**: Formatted according to Indian GST standards
- **Multi-item Support**: Add multiple products/services per invoice
- **HSN Code Integration**: Proper tax classification
- **GST Calculations**: Automatic CGST/SGST calculations (9% each)
- **PDF/HTML Export**: Download invoices in multiple formats
- **Payment Status Tracking**: Real-time status updates

### 🏢 Service Management
- **Service Categories**: 
  - Industrial Setup
  - Proactive Maintenance
  - Wiring Excellence
  - Havells Service Center
- **Work Portfolio**: Showcase completed projects
- **Client Testimonials**: Customer feedback management

## 🛠 Technology Stack

### Frontend
- **React 19.1.0** - Modern UI library
- **Vite** - Fast build tool and development server
- **React Router Dom 7.7.0** - Client-side routing
- **Tailwind CSS 3.4.17** - Utility-first CSS framework
- **Axios 1.11.0** - HTTP client for API calls
- **Lucide React** - Modern icon library
- **HTML2Canvas & jsPDF** - PDF generation capabilities

### Backend
- **Node.js** - JavaScript runtime
- **Express.js 4.18.2** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose 7.0.3** - MongoDB object modeling
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing

### Development Tools
- **ESLint** - Code linting
- **Nodemon** - Development server auto-restart
- **PostCSS & Autoprefixer** - CSS processing

## 📁 Project Structure

```
SEM5-SGP-64-78-83/
├── backend/                    # Node.js backend
│   ├── controllers/           # Request handlers
│   │   ├── billController.js
│   │   ├── clientController.js
│   │   ├── contactController.js
│   │   └── userController.js
│   ├── middleware/            # Authentication middleware
│   │   └── auth.js
│   ├── models/               # MongoDB schemas
│   │   ├── Bill.js
│   │   ├── ClientDetails.js
│   │   ├── Contact.js
│   │   └── User.js
│   ├── routes/               # API routes
│   │   ├── billRoutes.js
│   │   ├── clientRoutes.js
│   │   ├── contactRoutes.js
│   │   └── userRoutes.js
│   ├── scripts/              # Utility scripts
│   │   └── createAdmin.js
│   ├── package.json
│   └── server.js
├── src/                      # React frontend
│   ├── Components/           # Reusable components
│   │   ├── AdminLayout.jsx
│   │   ├── Footer.jsx
│   │   ├── Header.jsx
│   │   ├── Sidebar.jsx
│   │   └── UserMenu.jsx
│   ├── context/              # React context
│   │   └── auth-context.jsx
│   ├── Pages/                # Page components
│   │   ├── Admin/           # Admin pages
│   │   │   ├── AdminPanel.jsx
│   │   │   ├── AddClient.jsx
│   │   │   ├── BillGeneration.jsx
│   │   │   ├── InvoiceList.jsx
│   │   │   ├── PaymentManagement.jsx
│   │   │   └── UserRoleManagement.jsx
│   │   ├── About.jsx
│   │   ├── ClientDashboard.jsx
│   │   ├── ContactForm.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── Profile.jsx
│   │   ├── Register.jsx
│   │   └── Works.jsx
│   ├── services/             # API service layer
│   │   └── api.js
│   ├── utils/               # Utility functions
│   │   └── invoiceGenerator.js
│   ├── App.jsx
│   └── main.jsx
├── public/                   # Static assets
│   └── Images/              # Image gallery
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

### Backend Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/cs-cspit/SEM5-SGP-64-78-83.git
   cd SEM5-SGP-64-78-83
   ```

2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Environment Configuration**
   Create a `.env` file in the backend directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/jje-database
   JWT_SECRET=your_jwt_secret_key
   PORT=5000
   ```

4. **Create Admin User**
   ```bash
   npm run create-admin
   ```

5. **Start backend server**
   ```bash
   npm run dev
   ```
   Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Install frontend dependencies**
   ```bash
   cd ..
   npm install
   ```

2. **Start development server**
   ```bash
   npm run dev
   ```
   Frontend will run on `http://localhost:5173`

### Production Build

```bash
# Build frontend
npm run build

# Preview production build
npm run preview

# Start backend in production
cd backend
npm start
```

## 🔧 Usage

### Admin Access
1. Access the application at `http://localhost:5173`
2. Login with admin credentials
3. Navigate to Admin Dashboard for full system access

### Client Access
1. Register as a new client or use existing credentials
2. Access client dashboard for personalized features
3. View and download invoices, track payments

### Key Workflows

#### Creating a New Bill
1. Admin → Bill Generation
2. Add client details and products/services
3. System automatically calculates GST and totals
4. Generate and send invoice to client

#### Managing Clients
1. Admin → Client Management
2. Add new clients with company details
3. Assign user roles and permissions
4. Track client service history

#### Viewing Reports
1. Admin Dashboard displays real-time analytics
2. Monitor revenue, pending payments, collection rates
3. Export data and generate reports

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/verify` - Token verification

### Bills Management
- `GET /api/bills` - Get all bills (Admin)
- `POST /api/bills` - Create new bill (Admin)
- `GET /api/bills/:id` - Get specific bill
- `PUT /api/bills/:id` - Update bill (Admin)
- `GET /api/bills/my/bills` - Get client's bills
- `GET /api/bills/admin/dashboard-stats` - Admin analytics

### User Management
- `GET /api/users/all` - Get all users (Admin)
- `PUT /api/users/:id/role` - Update user role (Admin)
- `DELETE /api/users/:id` - Delete user (Admin)

### Client Management
- `GET /api/clients` - Get all clients (Admin)
- `POST /api/clients` - Add new client (Admin)
- `PUT /api/clients/:id` - Update client details

## 👥 User Roles

### Administrator
- Full system access
- Client and user management
- Bill generation and tracking
- Analytics and reporting
- System configuration

### Client
- Personal dashboard access
- View own invoices and bills
- Download invoices
- Update profile information
- Track payment status

### User
- Basic access level
- Limited functionality
- Can be upgraded to Client or Admin

## 🎨 Screenshots

*Add screenshots of your application here showing:*
- Home page
- Admin dashboard
- Client dashboard
- Invoice generation
- Bill management
- User management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is developed as part of SGP-III (Software Group Project) for educational purposes.

## 👨‍💻 Development Team

- **Project ID**: SEM5-SGP-64-78-83
- **Institution**: Charotar University of Science and Technology (CHARUSAT)
- **Course**: Computer Science & Engineering - Semester 5

## 📞 Contact

For any queries or support, please contact the development team through the project repository.

---

**Note**: This is an educational project developed for learning purposes. Please ensure proper testing before using in production environments.
