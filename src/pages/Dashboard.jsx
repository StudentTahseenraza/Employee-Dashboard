// pages/Dashboard.jsx (New Page)
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiUsers, FiDollarSign, FiMapPin, FiCamera, FiActivity, FiTrendingUp } from 'react-icons/fi';
import axios from 'axios';
import ActivityFeed from '../components/ActivityFeed';
import ComparisonChart from '../components/ComparisonChart';
import WeatherWidget from '../components/WeatherWidget';
import ExportButton from '../components/ExportButton';

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await axios.post('https://backend.jotish.in/backend_dev/gettabledata.php', {
        username: "test",
        password: "123456"
      });
      setEmployees(response.data);
      calculateStats(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateStats = (data) => {
    const totalEmployees = data.length;
    const totalSalary = data.reduce((sum, emp) => sum + emp.salary, 0);
    const avgSalary = totalSalary / totalEmployees;
    const uniqueCities = [...new Set(data.map(emp => emp.city))].length;
    const topDepartment = getTopDepartment(data);

    setStats({
      totalEmployees,
      totalSalary,
      avgSalary: avgSalary.toFixed(0),
      uniqueCities,
      topDepartment
    });
  };

  const getTopDepartment = (data) => {
    const deptCount = data.reduce((acc, emp) => {
      acc[emp.department] = (acc[emp.department] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(deptCount).reduce((a, b) => deptCount[a] > deptCount[b] ? a : b);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto"
      >
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <ExportButton data={employees} filename="employee_data" />
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
          <StatCard
            icon={<FiUsers />}
            label="Total Employees"
            value={stats.totalEmployees}
            color="blue"
            onClick={() => navigate('/employees')}
          />
          <StatCard
            icon={<FiDollarSign />}
            label="Total Salary"
            value={`$${stats.totalSalary.toLocaleString()}`}
            color="green"
          />
          <StatCard
            icon={<FiTrendingUp />}
            label="Avg Salary"
            value={`$${stats.avgSalary}`}
            color="purple"
          />
          <StatCard
            icon={<FiMapPin />}
            label="Cities"
            value={stats.uniqueCities}
            color="yellow"
            onClick={() => navigate('/city-map')}
          />
          <StatCard
            icon={<FiActivity />}
            label="Top Dept"
            value={stats.topDepartment}
            color="red"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          {/* Quick Actions */}
          <div className="lg:col-span-1 bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
            <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <QuickActionButton
                icon={<FiUsers />}
                label="View All Employees"
                onClick={() => navigate('/employees')}
                color="blue"
              />
              <QuickActionButton
                icon={<FiDollarSign />}
                label="Salary Analytics"
                onClick={() => navigate('/salary-chart')}
                color="green"
              />
              <QuickActionButton
                icon={<FiMapPin />}
                label="City Distribution"
                onClick={() => navigate('/city-map')}
                color="purple"
              />
              <QuickActionButton
                icon={<FiCamera />}
                label="Capture Photo"
                onClick={() => navigate('/capture')}
                color="yellow"
              />
            </div>

            {/* Weather Widgets for Top Cities */}
            <div className="mt-6">
              <h4 className="text-sm font-medium text-gray-400 mb-3">Weather in Top Cities</h4>
              <div className="space-y-2">
                {[...new Set(employees.map(e => e.city))].slice(0, 3).map(city => (
                  <WeatherWidget key={city} city={city} />
                ))}
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="lg:col-span-2">
            <ActivityFeed />
          </div>
        </div>

        {/* Comparison Chart */}
        <ComparisonChart employees={employees} />
      </motion.div>
    </div>
  );
};

const StatCard = ({ icon, label, value, color, onClick }) => (
  <motion.div
    whileHover={{ y: -5, scale: 1.02 }}
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className={`bg-white/10 backdrop-blur-lg rounded-xl p-4 border border-white/20 cursor-pointer
                hover:bg-white/15 transition-all ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
  >
    <div className={`text-${color}-400 text-2xl mb-2`}>{icon}</div>
    <p className="text-sm text-gray-400">{label}</p>
    <p className="text-xl font-bold text-white">{value}</p>
  </motion.div>
);

const QuickActionButton = ({ icon, label, onClick, color }) => (
  <motion.button
    whileHover={{ x: 5 }}
    onClick={onClick}
    className={`w-full p-3 bg-${color}-600/20 hover:bg-${color}-600/30 
               rounded-lg flex items-center gap-3 transition-colors`}
  >
    <span className={`text-${color}-400`}>{icon}</span>
    <span className="text-sm">{label}</span>
  </motion.button>
);

export default Dashboard;