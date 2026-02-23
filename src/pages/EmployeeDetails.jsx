// pages/EmployeeDetails.jsx
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiArrowLeft, FiCamera, FiUser, FiMail, FiPhone, FiMapPin, FiBriefcase, FiDollarSign, FiCalendar } from 'react-icons/fi';

const EmployeeDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const employee = location.state?.employee;

  if (!employee) {
    navigate('/employees');
    return null;
  }

  return (
    <div className="min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto"
      >
        {/* Back Button */}
        <motion.button
          whileHover={{ x: -5 }}
          onClick={() => navigate('/employees')}
          className="mb-6 flex items-center gap-2 text-gray-300 hover:text-white transition"
        >
          <FiArrowLeft />
          <span>Back to List</span>
        </motion.button>

        {/* Employee Card */}
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl border border-white/20 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8">
            <div className="flex items-center gap-6">
              <div className="w-24 h-24 bg-white rounded-full flex items-center justify-center text-4xl font-bold text-blue-600">
                {employee.name.charAt(0)}
              </div>
              <div>
                <h1 className="text-3xl font-bold text-white mb-2">{employee.name}</h1>
                <p className="text-blue-100">{employee.department}</p>
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <DetailCard icon={<FiMail />} label="Email" value={employee.email} />
              <DetailCard icon={<FiPhone />} label="Phone" value={employee.phone} />
              <DetailCard icon={<FiMapPin />} label="City" value={employee.city} />
              <DetailCard icon={<FiBriefcase />} label="Department" value={employee.department} />
              <DetailCard icon={<FiDollarSign />} label="Salary" value={`$${employee.salary}`} />
              <DetailCard icon={<FiCalendar />} label="Join Date" value={employee.join_date || '2024-01-01'} />
            </div>

            {/* Additional Info */}
            <div className="mt-8 p-6 bg-white/5 rounded-xl">
              <h3 className="text-xl font-semibold text-white mb-4">Additional Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <InfoCard label="Projects" value={employee.projects || '8'} />
                <InfoCard label="Tasks Completed" value={employee.tasks || '124'} />
                <InfoCard label="Performance" value={employee.performance || 'A'} />
              </div>
            </div>

            {/* Capture Photo Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate('/capture', { state: { employeeName: employee.name } })}
              className="mt-8 w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-4 rounded-xl font-semibold flex items-center justify-center gap-3 text-lg hover:from-green-700 hover:to-emerald-700 transition"
            >
              <FiCamera size={24} />
              <span>Capture Photo</span>
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

const DetailCard = ({ icon, label, value }) => (
  <motion.div
    whileHover={{ x: 5 }}
    className="flex items-start gap-3 p-4 bg-white/5 rounded-lg"
  >
    <div className="text-blue-400 mt-1">{icon}</div>
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-white font-medium">{value}</p>
    </div>
  </motion.div>
);

const InfoCard = ({ label, value }) => (
  <div className="text-center p-3 bg-white/5 rounded-lg">
    <p className="text-2xl font-bold text-white">{value}</p>
    <p className="text-sm text-gray-400">{label}</p>
  </div>
);

export default EmployeeDetails;