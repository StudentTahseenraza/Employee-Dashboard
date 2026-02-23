// pages/CityMap.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiMapPin } from 'react-icons/fi';
import { fetchEmployees } from '../services/api';

const CityMap = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchEmployees();
      
      // Ensure we have an array
      const employeeArray = Array.isArray(data) ? data : [];
      setEmployees(employeeArray);
      
    } catch (error) {
      console.error('Error loading employees:', error);
      setError('Failed to load employee data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Group employees by city
  const cityGroups = employees.reduce((acc, emp) => {
    if (!emp || !emp.city) return acc;
    
    const city = emp.city;
    if (!acc[city]) {
      acc[city] = [];
    }
    acc[city].push(emp);
    return acc;
  }, {});

  const getCityCount = (city) => {
    return cityGroups[city]?.length || 0;
  };

  const getTotalSalary = (city) => {
    return cityGroups[city]?.reduce((sum, emp) => sum + (Number(emp.salary) || 0), 0) || 0;
  };

  const cities = Object.keys(cityGroups);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-300">Loading city data...</p>
        </div>
      </div>
    );
  }

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

  if (!employees.length || cities.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-yellow-600/20 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full text-center border border-yellow-500/30">
          <h2 className="text-2xl font-bold text-white mb-4">No Data</h2>
          <p className="text-gray-300">No employee data available for cities.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <motion.button
            whileHover={{ x: -5 }}
            onClick={() => navigate('/employees')}
            className="flex items-center gap-2 text-gray-300 hover:text-white transition"
          >
            <FiArrowLeft />
            <span>Back</span>
          </motion.button>
          <h1 className="text-2xl font-bold text-white">Employee Distribution by City</h1>
          <div className="w-20" />
        </div>

        {/* City Grid Visualization */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Visual Map Representation */}
          <div className="lg:col-span-2 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4">City Distribution</h2>
            
            {cities.length === 0 ? (
              <p className="text-center text-gray-400 py-8">No cities found</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {cities.map((city, index) => {
                  const count = getCityCount(city);
                  
                  return (
                    <motion.div
                      key={city}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: index * 0.1, type: "spring" }}
                      whileHover={{ scale: 1.05 }}
                      onMouseEnter={() => setSelectedCity(city)}
                      onMouseLeave={() => setSelectedCity(null)}
                      onClick={() => setSelectedCity(city)}
                      className="relative cursor-pointer"
                    >
                      <div className="aspect-square bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg p-4 flex flex-col items-center justify-center text-center">
                        <FiMapPin className="text-white mb-2" size={24} />
                        <h3 className="text-white font-semibold text-sm">{city}</h3>
                        <p className="text-blue-200 text-xs mt-1">{count} employees</p>
                        <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center text-xs font-bold">
                          {count}
                        </div>
                      </div>
                      
                      {selectedCity === city && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          className="absolute -bottom-20 left-1/2 transform -translate-x-1/2 bg-gray-800 p-2 rounded-lg shadow-xl z-10 w-40 text-center"
                        >
                          <p className="text-xs">Total Salary:</p>
                          <p className="text-sm font-bold text-green-400">${getTotalSalary(city).toLocaleString()}</p>
                        </motion.div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            )}

            {/* Legend */}
            <div className="mt-8 flex items-center justify-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                <span className="text-gray-300 text-sm">Cities with employees</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                <span className="text-gray-300 text-sm">Employee count</span>
              </div>
            </div>
          </div>

          {/* City Details Panel */}
          <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h2 className="text-xl font-semibold text-white mb-4">City Details</h2>
            
            {selectedCity ? (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={selectedCity}
              >
                <div className="bg-blue-600/20 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <FiMapPin className="text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">{selectedCity}</h3>
                  </div>
                  <div className="space-y-2">
                    <p className="text-gray-300">
                      Employees: <span className="text-white font-semibold">{getCityCount(selectedCity)}</span>
                    </p>
                    <p className="text-gray-300">
                      Total Salary: <span className="text-green-400 font-semibold">${getTotalSalary(selectedCity).toLocaleString()}</span>
                    </p>
                    <p className="text-gray-300">
                      Average Salary: <span className="text-blue-400 font-semibold">
                        ${getCityCount(selectedCity) > 0 ? (getTotalSalary(selectedCity) / getCityCount(selectedCity)).toFixed(0) : 0}
                      </span>
                    </p>
                  </div>
                </div>

                <h4 className="text-white font-semibold mb-3">Employees in {selectedCity}</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {cityGroups[selectedCity]?.map((emp, index) => (
                    <motion.div
                      key={emp.id || index}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="bg-white/5 rounded-lg p-3 cursor-pointer hover:bg-white/10 transition"
                      onClick={() => navigate(`/employee/${emp.id}`, { state: { employee: emp } })}
                    >
                      <p className="text-white font-medium">{emp.name || 'Unknown'}</p>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-400">{emp.department || 'N/A'}</span>
                        <span className="text-green-400">${Number(emp.salary || 0).toLocaleString()}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ) : (
              <div className="text-center text-gray-400 py-8">
                <FiMapPin size={48} className="mx-auto mb-4 opacity-50" />
                <p>Click on a city to see details</p>
              </div>
            )}
          </div>
        </div>

        {/* City Statistics Table */}
        {cities.length > 0 && (
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="mt-6 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
          >
            <h2 className="text-xl font-semibold text-white mb-4">City-wise Statistics</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 text-gray-300">City</th>
                    <th className="text-left py-3 text-gray-300">Employees</th>
                    <th className="text-right py-3 text-gray-300">Total Salary</th>
                    <th className="text-right py-3 text-gray-300">Average Salary</th>
                  </tr>
                </thead>
                <tbody>
                  {cities.map((city, index) => (
                    <motion.tr
                      key={city}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="border-b border-white/10 hover:bg-white/5 transition cursor-pointer"
                      onClick={() => setSelectedCity(city)}
                    >
                      <td className="py-3 text-white font-medium">{city}</td>
                      <td className="py-3 text-gray-300">{getCityCount(city)}</td>
                      <td className="py-3 text-right text-green-400">${getTotalSalary(city).toLocaleString()}</td>
                      <td className="py-3 text-right text-blue-400">
                        ${getCityCount(city) > 0 ? (getTotalSalary(city) / getCityCount(city)).toFixed(0) : 0}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
};

export default CityMap;