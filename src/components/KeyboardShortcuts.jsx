// components/KeyboardShortcuts.jsx
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MdKeyboard } from 'react-icons/md';

const KeyboardShortcuts = ({ onShortcut }) => {
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey || e.metaKey) {
        switch (e.key.toLowerCase()) {
          case '1':
            e.preventDefault();
            onShortcut('employees');
            break;
          case '2':
            e.preventDefault();
            onShortcut('salary-chart');
            break;
          case '3':
            e.preventDefault();
            onShortcut('city-map');
            break;
          case 'c':
            e.preventDefault();
            onShortcut('capture');
            break;
          case 'e':
            e.preventDefault();
            onShortcut('export');
            break;
          case '?':
            e.preventDefault();
            setShowHelp((prev) => !prev);
            break;
        }
      }

      if (!e.ctrlKey && !e.metaKey) {
        switch (e.key.toLowerCase()) {
          case 'escape':
            setShowHelp(false);
            break;
          case 'h':
            onShortcut('home');
            break;
          case 'b':
            onShortcut('back');
            break;
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onShortcut]);

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowHelp(!showHelp)}
        className="fixed bottom-6 right-6 p-4 bg-gray-800 text-white rounded-full shadow-lg z-50 hover:bg-gray-700 transition"
      >
        <MdKeyboard size={24} />
      </motion.button>

      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-24 right-6 bg-gray-800 text-white p-6 rounded-lg shadow-xl z-50 max-w-sm border border-gray-700"
          >
            <h3 className="text-lg font-semibold mb-4">Keyboard Shortcuts</h3>

            <div className="space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-400 mb-2">
                  Navigation
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-gray-300">Ctrl/Cmd + 1</span>
                  <span className="text-blue-400">Employee List</span>

                  <span className="text-gray-300">Ctrl/Cmd + 2</span>
                  <span className="text-blue-400">Salary Chart</span>

                  <span className="text-gray-300">Ctrl/Cmd + 3</span>
                  <span className="text-blue-400">City Map</span>

                  <span className="text-gray-300">H</span>
                  <span className="text-blue-400">Home</span>

                  <span className="text-gray-300">B</span>
                  <span className="text-blue-400">Back</span>
                </div>
              </div>

              <div>
                <p className="text-sm font-medium text-gray-400 mb-2">
                  Actions
                </p>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <span className="text-gray-300">Ctrl/Cmd + C</span>
                  <span className="text-blue-400">Capture Photo</span>

                  <span className="text-gray-300">Ctrl/Cmd + E</span>
                  <span className="text-blue-400">Export Data</span>

                  <span className="text-gray-300">Ctrl/Cmd + ?</span>
                  <span className="text-blue-400">Show/Hide Help</span>

                  <span className="text-gray-300">Escape</span>
                  <span className="text-blue-400">Close Help</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default KeyboardShortcuts;