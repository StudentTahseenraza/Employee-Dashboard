// pages/SalaryChart.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft } from 'react-icons/fi';
import { useTheme } from '../context/ThemeContext';
import { fetchEmployees } from '../services/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const SalaryChart = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [chartType, setChartType] = useState('bar');
  const { theme } = useTheme();
  const navigate = useNavigate();

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d', '#ffc658', '#8dd1e1', '#a4de6c', '#d0ed57'];

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchEmployees();
      setEmployees(Array.isArray(data) ? data.slice(0, 10) : []);
    } catch (error) {
      console.error('Error loading employees:', error);
      setError('Failed to load employee data. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const formatSalary = (salary) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(salary);
  };

  const calculateStats = () => {
    if (!employees.length) {
      return { total: 0, average: 0, max: 0, min: 0 };
    }
    
    const salaries = employees.map(e => Number(e.salary) || 0);
    return {
      total: salaries.reduce((a, b) => a + b, 0),
      average: salaries.reduce((a, b) => a + b, 0) / salaries.length,
      max: Math.max(...salaries),
      min: Math.min(...salaries)
    };
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading salary data...</p>
        </div>
      </div>
    );
  }

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

  if (!employees.length) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="bg-yellow-50 dark:bg-yellow-600/20 backdrop-blur-lg rounded-2xl p-8 max-w-md w-full text-center border border-yellow-200 dark:border-yellow-500/30">
          <h2 className="text-2xl font-bold text-yellow-800 dark:text-white mb-4">No Data</h2>
          <p className="text-yellow-600 dark:text-gray-300 mb-6">No employee data available for charts.</p>
          <button
            onClick={() => navigate('/employees')}
            className="btn-primary"
          >
            Go to Employees
          </button>
        </div>
      </div>
    );
  }

  const stats = calculateStats();

  return (
    <div className="main-container">
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
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
          >
            <FiArrowLeft size={20} />
            <span>Back</span>
          </motion.button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Salary Analytics</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setChartType('bar')}
              className={`px-4 py-2 rounded-lg transition ${
                chartType === 'bar' 
                  ? 'btn-primary' 
                  : 'btn-secondary'
              }`}
            >
              Bar Chart
            </button>
            <button
              onClick={() => setChartType('pie')}
              className={`px-4 py-2 rounded-lg transition ${
                chartType === 'pie' 
                  ? 'btn-primary' 
                  : 'btn-secondary'
              }`}
            >
              Pie Chart
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <StatCard title="Total Salary" value={formatSalary(stats.total)} icon="💰" />
          <StatCard title="Average Salary" value={formatSalary(stats.average)} icon="📊" />
          <StatCard title="Highest Salary" value={formatSalary(stats.max)} icon="⬆️" />
          <StatCard title="Lowest Salary" value={formatSalary(stats.min)} icon="⬇️" />
        </div>

        {/* Chart Container */}
        <motion.div
          key={chartType}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className="chart-container"
        >
          <div className="h-96 w-full" style={{ minHeight: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'bar' ? (
                <BarChart data={employees} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke={theme === 'dark' ? '#374151' : '#E5E7EB'} />
                  <XAxis 
                    dataKey="name" 
                    stroke={theme === 'dark' ? '#9CA3AF' : '#4B5563'} 
                    angle={-45} 
                    textAnchor="end" 
                    height={80}
                    interval={0}
                  />
                  <YAxis stroke={theme === 'dark' ? '#9CA3AF' : '#4B5563'} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                      border: `1px solid ${theme === 'dark' ? '#374151' : '#E5E7EB'}`,
                      borderRadius: '8px',
                      color: theme === 'dark' ? '#FFFFFF' : '#111827'
                    }}
                    formatter={(value) => formatSalary(value)}
                  />
                  <Legend />
                  <Bar dataKey="salary" fill="#8884d8" name="Salary">
                    {employees.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              ) : (
                <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <Pie
                    data={employees}
                    dataKey="salary"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    label={(entry) => entry.name}
                  >
                    {employees.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: theme === 'dark' ? '#1F2937' : '#FFFFFF',
                      border: `1px solid ${theme === 'dark' ? '#374151' : '#E5E7EB'}`,
                      borderRadius: '8px',
                      color: theme === 'dark' ? '#FFFFFF' : '#111827'
                    }}
                    formatter={(value) => formatSalary(value)}
                  />
                  <Legend />
                </PieChart>
              )}
            </ResponsiveContainer>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

const StatCard = ({ title, value, icon }) => (
  <motion.div
    whileHover={{ y: -5 }}
    className="stat-card"
  >
    <div className="flex items-center justify-between mb-2">
      <span className="text-gray-600 dark:text-gray-300 text-sm">{title}</span>
      <span className="text-2xl">{icon}</span>
    </div>
    <p className="text-2xl font-bold text-gray-800 dark:text-white">{value}</p>
  </motion.div>
);

export default SalaryChart;