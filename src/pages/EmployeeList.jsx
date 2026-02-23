// pages/EmployeeList.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FiLogOut, FiBarChart2, FiMap, FiMail, FiPhone, FiMapPin, FiUser } from 'react-icons/fi';
import { fetchEmployees } from '../services/api';

const EmployeeList = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCity, setSelectedCity] = useState('all');
  const { logout } = useAuth();
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
    .filter(emp => emp && emp.city)
    .map(emp => emp.city)
  )];

  // Filter employees based on search and city
  const filteredEmployees = employees.filter(emp => {
    if (!emp) return false;
    
    const matchesSearch = (emp.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (emp.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                         (emp.department?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    
    const matchesCity = selectedCity === 'all' || emp.city === selectedCity;
    
    return matchesSearch && matchesCity;
  });

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading employees...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-red-600/20 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full text-center border border-red-500/30">
          <h2 className="text-2xl font-bold text-white mb-4">Error</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={loadEmployees}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      {/* Header */}
      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 mb-6 border border-white/20"
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-bold text-white">Employee Dashboard</h1>
          <div className="flex gap-3">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/salary-chart')}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-purple-700 transition"
            >
              <FiBarChart2 />
              <span className="hidden md:inline">Salary Chart</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate('/city-map')}
              className="bg-green-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-green-700 transition"
            >
              <FiMap />
              <span className="hidden md:inline">City Map</span>
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700 transition"
            >
              <FiLogOut />
              <span className="hidden md:inline">Logout</span>
            </motion.button>
          </div>
        </div>

        {/* Filters */}
        <div className="mt-6 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search employees..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
          >
            {cities.map(city => (
              <option key={city} value={city} className="bg-gray-800">
                {city === 'all' ? 'All Cities' : city}
              </option>
            ))}
          </select>
        </div>

        {/* Results count */}
        <div className="mt-4 text-sm text-gray-400">
          {employees.length > 0 ? (
            <>Showing {filteredEmployees.length} of {employees.length} employees</>
          ) : (
            <>No employees found</>
          )}
        </div>
      </motion.div>

      {/* Employee Grid */}
      {employees.length === 0 ? (
        <div className="text-center py-12 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/20">
          <FiUser className="text-6xl text-gray-500 mx-auto mb-4" />
          <p className="text-gray-400 text-lg">No employees found</p>
          <p className="text-gray-500 text-sm mt-2">Try refreshing the page</p>
        </div>
      ) : filteredEmployees.length === 0 ? (
        <div className="text-center py-12 bg-white/5 backdrop-blur-lg rounded-2xl border border-white/20">
          <p className="text-gray-400 text-lg">No matching employees</p>
          <p className="text-gray-500 text-sm mt-2">Try adjusting your search or filter</p>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence>
            {filteredEmployees.map((employee, index) => (
              <motion.div
                key={employee?.id || index}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ y: -5, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.5)" }}
                className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20 cursor-pointer group"
                onClick={() => navigate(`/employee/${employee.id}`, { state: { employee } })}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {employee.name?.charAt(0) || '?'}
                  </div>
                  <span className="px-3 py-1 bg-blue-600/30 text-blue-300 rounded-full text-sm">
                    ${Number(employee.salary || 0).toLocaleString()}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition">
                  {employee.name || 'Unknown'}
                </h3>
                
                <div className="space-y-2 text-gray-300">
                  <p className="flex items-center gap-2 text-sm">
                    <FiMail className="flex-shrink-0" />
                    <span className="truncate">{employee.email || 'N/A'}</span>
                  </p>
                  <p className="flex items-center gap-2 text-sm">
                    <FiPhone className="flex-shrink-0" />
                    <span>{employee.phone || 'N/A'}</span>
                  </p>
                  <p className="flex items-center gap-2 text-sm">
                    <FiMapPin className="flex-shrink-0" />
                    <span>{employee.city || 'N/A'}</span>
                  </p>
                </div>
                
                <div className="mt-4 pt-4 border-t border-white/10">
                  <p className="text-sm text-gray-400">{employee.department || 'N/A'}</p>
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