// components/ComparisonChart.jsx
import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts';

const ComparisonChart = ({ employees }) => {
  const [comparisonType, setComparisonType] = useState('salary');
  const [selectedEmployees, setSelectedEmployees] = useState([]);

  const handleEmployeeToggle = (employee) => {
    setSelectedEmployees(prev => {
      if (prev.find(e => e.id === employee.id)) {
        return prev.filter(e => e.id !== employee.id);
      }
      if (prev.length < 5) {
        return [...prev, employee];
      }
      return prev;
    });
  };

  const getComparisonData = () => {
    return selectedEmployees.map(emp => ({
      name: emp.name.split(' ')[0],
      salary: emp.salary,
      department: emp.department,
      city: emp.city,
      experience: Math.floor(Math.random() * 10) + 1, // Mock data
      projects: Math.floor(Math.random() * 15) + 5 // Mock data
    }));
  };

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
      <h3 className="text-xl font-semibold mb-4">Employee Comparison</h3>

      <div className="flex gap-4 mb-6">
        <select
          value={comparisonType}
          onChange={(e) => setComparisonType(e.target.value)}
          className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-white"
        >
          <option value="salary">Salary</option>
          <option value="experience">Experience</option>
          <option value="projects">Projects</option>
        </select>

        <p className="text-sm text-gray-400 self-center">
          Select up to 5 employees to compare
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 mb-6">
        {employees.slice(0, 10).map(emp => (
          <motion.button
            key={emp.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => handleEmployeeToggle(emp)}
            className={`p-2 rounded-lg text-sm transition ${
              selectedEmployees.find(e => e.id === emp.id)
                ? 'bg-blue-600 text-white'
                : 'bg-white/5 text-gray-300 hover:bg-white/10'
            }`}
          >
            {emp.name.split(' ')[0]}
          </motion.button>
        ))}
      </div>

      {selectedEmployees.length > 0 ? (
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            {comparisonType === 'salary' ? (
              <BarChart data={getComparisonData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Bar dataKey="salary" fill="#8884d8" name="Salary ($)" />
              </BarChart>
            ) : (
              <LineChart data={getComparisonData()}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis dataKey="name" stroke="#9CA3AF" />
                <YAxis stroke="#9CA3AF" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1F2937',
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey={comparisonType}
                  stroke="#8884d8"
                  name={comparisonType.charAt(0).toUpperCase() + comparisonType.slice(1)}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="text-center text-gray-400 py-12">
          <p>Select employees to compare</p>
        </div>
      )}
    </div>
  );
};

export default ComparisonChart;