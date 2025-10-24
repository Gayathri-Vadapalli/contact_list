# Contact Management App

A modern, feature-rich contact management application built with React and Vite. This application provides a comprehensive interface for managing contacts with advanced features like bulk operations, search, filtering, and responsive design.

## 🚀 Live Demo

**Deployed Application:** [Link will be provided here]

## ✨ Notable Features

### Core Functionality
- **Complete CRUD Operations**: Add, view, edit, and delete contacts with full form validation
- **Dual View Modes**: Switch between grid and list views for optimal data visualization
- **Advanced Search**: Real-time search across contact names, phone numbers, and email addresses
- **Smart Filtering**: Filter contacts by tags with an intuitive dropdown interface
- **Bulk Operations**: Select multiple contacts for batch operations (edit single contact, bulk delete)

### User Experience
- **Responsive Design**: Fully responsive interface that works seamlessly on desktop and mobile devices
- **Interactive Contact Details**: Expandable contact panel with detailed information display
- **Custom Modals**: Professional modal dialogs for adding, editing, and confirming deletions
- **Smooth Animations**: Subtle animations and transitions for enhanced user experience
- **Intuitive Navigation**: Easy-to-use pagination controls with smart page navigation

### Data Management
- **Tag System**: Organize contacts with color-coded tags (Family, Friends, Job, Sports, Gaming, etc.)
- **Relation Categories**: Categorize contacts by relationship type (Family, Friend, Colleague, Business, Other)
- **Contact Avatars**: Automatically generated colorful avatars with initials
- **Data Persistence**: Local state management with JSON data structure

### Advanced Features
- **Select Mode**: Toggle selection mode for bulk operations with visual feedback
- **Context Menus**: Three-dots dropdown menus for quick contact actions
- **Form Validation**: Real-time form validation with required field indicators
- **Keyboard Navigation**: Accessible interface with proper focus management
- **Loading States**: Smooth state transitions and user feedback

## 🛠️ Setup and Installation

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn package manager

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone [repository-url]
   cd Tria
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to view the application

### Build for Production

```bash
npm run build
# or
yarn build
```

### Preview Production Build

```bash
npm run preview
# or
yarn preview
```

## 🏗️ Project Structure

```
src/
├── components/
│   ├── ContactScreen.jsx      # Main contact management component
│   ├── ContactScreen.css      # Comprehensive styling
│   └── contact_list.json      # Sample contact data
├── assets/                    # Static assets
├── App.jsx                    # Root application component
├── App.css                    # Global application styles
├── main.jsx                   # Application entry point
└── index.css                  # Global CSS reset and base styles
```

## 📚 Libraries and Technologies

### Core Technologies
- **React 18+**: Modern React with hooks for state management and component logic
- **Vite**: Fast build tool and development server for optimal developer experience
- **FontAwesome**: Comprehensive icon library for consistent UI elements

### Key Dependencies
- **@fortawesome/react-fontawesome**: React integration for FontAwesome icons
- **@fortawesome/free-solid-svg-icons**: Solid icon set for UI elements

### Why These Libraries?

- **React**: Chosen for its component-based architecture, excellent state management with hooks, and large ecosystem
- **Vite**: Selected over Create React App for faster build times, better development experience, and modern tooling
- **FontAwesome**: Provides a consistent, professional icon set with excellent React integration
- **CSS Modules**: Used native CSS for full control over styling and better performance than CSS-in-JS solutions

## 🎨 Design Choices and Assumptions

### Design Philosophy
- **Clean and Modern**: Inspired by modern contact management applications with a focus on usability
- **Color Scheme**: Purple-based theme (#7C3AED) for a professional yet friendly appearance
- **Typography**: System fonts for optimal readability and performance across platforms

### Key Assumptions
- **Data Structure**: Contacts include name, phone, email, address, relation, and tags
- **Browser Support**: Modern browsers with ES6+ support
- **Screen Sizes**: Responsive design for mobile (320px+) to desktop (1920px+)
- **User Behavior**: Users prefer visual feedback and intuitive interfaces over complex features

### Technical Decisions
- **State Management**: Used React's built-in useState and useCallback hooks instead of external state management for simplicity
- **Data Persistence**: Implemented local state management suitable for demo purposes (can be easily extended to API integration)
- **Component Architecture**: Single main component with modular sub-components for maintainability
- **CSS Architecture**: Custom CSS with BEM-inspired naming for clarity and maintainability

## 🔧 Configuration

### Environment Variables
Currently, no environment variables are required for local development.

### Build Configuration
The project uses Vite's default configuration optimized for React development.

## 🚀 Deployment

The application is ready for deployment on any static hosting service:
- Netlify
- Vercel
- GitHub Pages
- AWS S3 + CloudFront

Build the project with `npm run build` and deploy the `dist` folder.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is available for educational and demonstration purposes.

---

*Built with ❤️ using React and Vite*
