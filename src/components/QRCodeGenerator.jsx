// components/QRCodeGenerator.jsx
import { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { QRCodeCanvas } from 'qrcode.react';
import { HiOutlineQrCode } from 'react-icons/hi2';
import { FiDownload, FiX } from 'react-icons/fi';

const QRCodeGenerator = ({ employee }) => {
  const [showQR, setShowQR] = useState(false);
  const qrRef = useRef(null);

  const downloadQR = () => {
    const canvas = qrRef.current;
    if (!canvas) return;

    const url = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = `${employee.name}-qr.png`;
    link.href = url;
    link.click();
  };

  return (
    <>
      {/* QR Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowQR(true)}
        className="p-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition text-white"
      >
        <HiOutlineQrCode size={20} />
      </motion.button>

      <AnimatePresence>
        {showQR && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
            onClick={() => setShowQR(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="bg-gray-800 text-white p-6 rounded-2xl max-w-sm w-full mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">
                  {employee.name}'s QR Code
                </h3>
                <button onClick={() => setShowQR(false)}>
                  <FiX size={22} />
                </button>
              </div>

              {/* QR Code */}
              <div className="bg-white p-4 rounded-lg flex justify-center mb-4">
                <QRCodeCanvas
                  ref={qrRef}
                  value={JSON.stringify({
                    id: employee.id,
                    name: employee.name,
                    email: employee.email,
                    phone: employee.phone,
                  })}
                  size={200}
                  level="H"
                  includeMargin
                />
              </div>

              {/* Details */}
              <div className="text-sm text-gray-400 mb-4 space-y-1">
                <p>ID: {employee.id}</p>
                <p>Name: {employee.name}</p>
                <p>Email: {employee.email}</p>
                <p>Phone: {employee.phone}</p>
              </div>

              {/* Download Button */}
              <button
                onClick={downloadQR}
                className="w-full bg-blue-600 text-white py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-blue-700 transition"
              >
                <FiDownload size={18} />
                <span>Download QR Code</span>
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default QRCodeGenerator;