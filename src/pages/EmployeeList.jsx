// pages/EmployeeList.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLogOut, FiBarChart2, FiMap, FiMail, FiPhone, FiMapPin, FiUser, FiCalendar, FiDollarSign } from 'react-icons/fi';
import { fetchEmployees } from '../services/api';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const { logout } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchEmployees();
      console.log('Employees loaded:', data);
      setEmployees(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error loading employees:', error);
      setError('Failed to load employees. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Get unique cities for filter
  const cities = ['all', ...new Set(employees
    .filter(emp => emp && emp.city && emp.city !== 'N/A')
    .map(emp => emp.city)
  )];

  // Filter employees based on search and city
  const filteredEmployees = employees.filter(emp => {
    if (!emp) return false;
    
    const matchesSearch = (emp.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (emp.position?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (emp.department?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (emp.city?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesCity = selectedCity === 'all' || emp.city === selectedCity;
    
    return matchesSearch && matchesCity;
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const formatSalary = (salary) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(salary);
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading employees...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-50 dark:bg-red-600/20 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full text-center border border-red-200 dark:border-red-500/30">
          <h2 className="text-2xl font-bold text-red-800 dark:text-white mb-4">Error</h2>
          <p className="text-red-600 dark:text-gray-300 mb-6">{error}</p>
          <button
            onClick={loadEmployees}
            className="btn-primary"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="main-container">
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="glass-card p-6 mb-6"
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Employee Dashboard</h1>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/salary-chart')}
              className="btn-primary"
            >
              <FiBarChart2 className="inline mr-2" />
              <span className="hidden md:inline">Salary Chart</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/city-map')}
              className="btn-primary"
            >
              <FiMap className="inline mr-2" />
              <span className="hidden md:inline">City Map</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="btn-secondary"
            >
              <FiLogOut className="inline mr-2" />
              <span className="hidden md:inline">Logout</span>
            </motion.button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by name, position, or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="input-field"
          />
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="select-field"
          >
            {cities.map(city => (
              <option key={city} value={city}>
                {city === 'all' ? 'All Cities' : city}
              </option>
            ))}
          </select>
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-gray-500 dark:text-gray-400">
          {employees.length > 0 ? (
            <>Showing {filteredEmployees.length} of {employees.length} employees</>
          ) : (
            <>No employees found</>
          )}
        </div>
      </motion.div>

      {/* Employee Grid */}
      {employees.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <FiUser className="text-6xl text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400 text-lg">No employees found</p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">Try refreshing the page</p>
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-gray-600 dark:text-gray-400 text-lg">No matching employees</p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">Try adjusting your search or filter</p>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredEmployees.map((employee, index) => (
              <motion.div
                key={employee.id || index}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5 }}
                className="employee-card"
                onClick={() => navigate(`/employee/${employee.id}`, { state: { employee } })}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {employee.name?.charAt(0) || '?'}
                  </div>
                  <span className="salary-badge">
                    {formatSalary(employee.salary)}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                  {employee.name || 'Unknown'}
                </h3>
                
                <p className="text-sm text-blue-600 dark:text-blue-400 mb-3">{employee.position || 'N/A'}</p>
                
                <div className="space-y-2">
                  <p className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <FiMapPin className="flex-shrink-0 text-gray-400" />
                    <span>{employee.city || 'N/A'}</span>
                  </p>
                  <p className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <FiCalendar className="flex-shrink-0 text-gray-400" />
                    <span>Started: {employee.startDate || 'N/A'}</span>
                  </p>
                  <p className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
                    <FiDollarSign className="flex-shrink-0 text-gray-400" />
                    <span>{formatSalary(employee.salary)}</span>
                  </p>
                </div>
                
                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-white/10 flex justify-between items-center">
                  <span className="text-xs text-gray-500 dark:text-gray-500">ID: {employee.code || 'N/A'}</span>
                  <span className="badge">
                    {employee.department || 'N/A'}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default EmployeeList;