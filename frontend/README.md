# ShoeBay Frontend

A modern, responsive e-commerce web application frontend for ShoeBay - your ultimate destination for premium footwear from the world's leading brands.

## Features

### Core Functionality
- **User Authentication**: Secure registration and login system with JWT tokens
- **Product Browsing**: Browse and search extensive shoe collections
- **Shopping Cart**: Add/remove items with persistent cart storage
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices
- **Real-time Cart Updates**: Dynamic cart counter and sidebar

### User Interface
- **Modern Design**: Clean, stylish interface using Tailwind CSS
- **Interactive Components**: Smooth animations and transitions
- **Dark/Light Themes**: Built-in theme support
- **Accessibility**: WCAG-compliant design patterns

### Pages Included
- **Home Page**: Hero section, featured products, brand showcase
- **Products Page**: Full catalog with filtering and sorting
- **Login/Register**: Secure authentication forms
- **Product Details**: Detailed product information (coming soon)
- **Shopping Cart**: Cart management interface
- **User Profile**: Profile management (coming soon)
- **Admin Panel**: Product and user management (coming soon)

## Tech Stack

- **React 19** - Latest React with hooks and context
- **Vite** - Fast build tool and development server
- **React Router Dom** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Axios** - HTTP client for API calls
- **Headless UI** - Unstyled accessible UI components

## Getting Started

### Prerequisites
- Node.js 18+ and npm
- Backend API server running on port 5000 (optional for demo)

### Installation

1. Clone the repository
```bash
git clone <repository-url>
cd shoebay/frontend
```

2. Install dependencies
```bash
npm install
```

3. Start the development server
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:5173`

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:5000/api
```

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.jsx       # Navigation header
│   ├── Footer.jsx       # Site footer
│   └── ShoppingCart.jsx # Cart sidebar
├── context/             # React context providers
│   ├── AuthContext.jsx  # User authentication
│   └── CartContext.jsx  # Shopping cart state
├── pages/               # Route components
│   ├── Home.jsx         # Homepage
│   ├── Products.jsx     # Product listing
│   ├── Login.jsx        # Login form
│   └── Register.jsx     # Registration form
├── services/            # API service layer
│   ├── api.js           # Axios configuration
│   ├── authService.js   # Authentication APIs
│   └── productService.js # Product APIs
├── hooks/               # Custom React hooks
├── utils/               # Utility functions
└── assets/              # Static assets
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Features in Development

- [ ] Product detail pages with size selection
- [ ] User profile management
- [ ] Order history and tracking
- [ ] Wishlist functionality
- [ ] Admin dashboard
- [ ] Payment integration
- [ ] Advanced search and filters
- [ ] Product reviews and ratings
- [ ] Email notifications
- [ ] Social media integration

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

