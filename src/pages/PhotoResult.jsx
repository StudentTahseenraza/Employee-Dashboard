// pages/PhotoResult.jsx
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FiDownload, FiHome, FiCamera } from 'react-icons/fi';

const PhotoResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { image, employeeName } = location.state || {};

  if (!image) {
    navigate('/employees');
    return null;
  }

  const downloadImage = () => {
    const link = document.createElement('a');
    link.download = `${employeeName}_photo.png`;
    link.href = image;
    link.click();
  };

  return (
    <div className="min-h-screen p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-2xl mx-auto"
      >
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-8"
          >
            <div className="w-20 h-20 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <FiCamera size={40} className="text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Photo Captured!</h1>
            <p className="text-gray-300">Your photo has been successfully captured</p>
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="bg-gray-900 rounded-xl overflow-hidden mb-6 border-2 border-white/10"
          >
            <img src={image} alt="Captured" className="w-full" />
          </motion.div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="space-y-4"
          >
            <div className="bg-white/5 rounded-lg p-4">
              <p className="text-gray-300">Employee: <span className="text-white font-semibold">{employeeName}</span></p>
              <p className="text-gray-300">Date: <span className="text-white">{new Date().toLocaleDateString()}</span></p>
              <p className="text-gray-300">Time: <span className="text-white">{new Date().toLocaleTimeString()}</span></p>
            </div>

            <div className="flex gap-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={downloadImage}
                className="flex-1 bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition"
              >
                <FiDownload />
                <span>Download</span>
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigate('/employees')}
                className="flex-1 bg-purple-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-purple-700 transition"
              >
                <FiHome />
                <span>Home</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default PhotoResult;