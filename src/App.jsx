// App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import Login from './pages/Login';
import EmployeeList from './pages/EmployeeList';
import EmployeeDetails from './pages/EmployeeDetails';
import PhotoCapture from './pages/PhotoCapture';
import PhotoResult from './pages/PhotoResult';
import SalaryChart from './pages/SalaryChart';
import CityMap from './pages/CityMap';
import Dashboard from './pages/Dashboard';
import VoiceCommand from './components/VoiceCommand';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import { motion, AnimatePresence } from 'framer-motion';
import { FiSun, FiMoon } from 'react-icons/fi';
import './App.css';

function AppContent() {
  const { theme, toggleTheme } = useTheme();

  const handleVoiceCommand = (command) => {
    if (command.includes('go to employees') || command.includes('show employees')) {
      window.location.href = '/employees';
    } else if (command.includes('salary chart')) {
      window.location.href = '/salary-chart';
    } else if (command.includes('city map')) {
      window.location.href = '/city-map';
    } else if (command.includes('take photo')) {
      window.location.href = '/capture';
    } else if (command.includes('go back')) {
      window.history.back();
    } else if (command.includes('dashboard')) {
      window.location.href = '/dashboard';
    }
  };

  const handleKeyboardShortcut = (action) => {
    switch (action) {
      case 'employees':
        window.location.href = '/employees';
        break;
      case 'salary-chart':
        window.location.href = '/salary-chart';
        break;
      case 'city-map':
        window.location.href = '/city-map';
        break;
      case 'capture':
        window.location.href = '/capture';
        break;
      case 'home':
        window.location.href = '/dashboard';
        break;
      case 'back':
        window.history.back();
        break;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      theme === 'dark' 
        ? 'dark bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900' 
        : 'light bg-gradient-to-br from-blue-50 via-white to-gray-50'
    }`}>
      {/* Theme Toggle Button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 180 }}
        whileTap={{ scale: 0.9 }}
        onClick={toggleTheme}
        className={`fixed top-6 right-6 p-3 rounded-full z-50 shadow-lg transition-all
          ${theme === 'dark' 
            ? 'bg-yellow-400 text-gray-900 hover:bg-yellow-300' 
            : 'bg-gray-800 text-white hover:bg-gray-700'
          }`}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={theme}
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {theme === 'dark' ? <FiSun size={24} /> : <FiMoon size={24} />}
          </motion.div>
        </AnimatePresence>
      </motion.button>

      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/employees" element={<EmployeeList />} />
        <Route path="/employee/:id" element={<EmployeeDetails />} />
        <Route path="/capture" element={<PhotoCapture />} />
        <Route path="/photo-result" element={<PhotoResult />} />
        <Route path="/salary-chart" element={<SalaryChart />} />
        <Route path="/city-map" element={<CityMap />} />
      </Routes>

      <VoiceCommand onCommand={handleVoiceCommand} />
      <KeyboardShortcuts onShortcut={handleKeyboardShortcut} />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <Router>
          <AppContent />
        </Router>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;