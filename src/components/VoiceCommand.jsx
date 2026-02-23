// components/VoiceCommand.jsx
import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiMic, FiMicOff, FiHelpCircle } from 'react-icons/fi';

const VoiceCommand = ({ onCommand }) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [supported, setSupported] = useState(true);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      setSupported(false);
    }
  }, []);

  const startListening = useCallback(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
      setTranscript('');
    };

    recognition.onresult = (event) => {
      const command = event.results[0][0].transcript.toLowerCase();
      setTranscript(command);
      onCommand(command);
    };

    recognition.onerror = () => {
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  }, [onCommand]);

  if (!supported) {
    return null;
  }

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={startListening}
        className={`fixed bottom-24 right-6 p-4 rounded-full shadow-lg z-50 transition-all ${
          isListening 
            ? 'bg-red-500 animate-pulse' 
            : 'bg-gradient-to-r from-blue-600 to-purple-600'
        }`}
      >
        {isListening ? <FiMicOff size={24} /> : <FiMic size={24} />}
      </motion.button>

      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setShowHelp(!showHelp)}
        className="fixed bottom-24 right-24 p-4 bg-gray-800 rounded-full shadow-lg z-50"
      >
        <FiHelpCircle size={24} />
      </motion.button>

      <AnimatePresence>
        {showHelp && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: -20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: 20, x: -20 }}
            className="fixed bottom-40 right-6 bg-gray-200 p-6 rounded-lg shadow-xl z-50 max-w-sm"
          >
            <h3 className="text-lg font-semibold mb-3">Voice Commands</h3>
            <ul className="space-y-2 text-sm">
              <li>• "Go to employees" - Navigate to employee list</li>
              <li>• "Show salary chart" - Open salary analytics</li>
              <li>• "Show city map" - Open city distribution map</li>
              <li>• "Take photo" - Open camera</li>
              <li>• "Go back" - Previous page</li>
              <li>• "Logout" - Sign out</li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isListening && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-40 right-6 bg-gray-800 p-4 rounded-lg shadow-xl z-50"
          >
            <p className="text-sm">Listening...</p>
            {transcript && (
              <p className="text-sm mt-2 text-blue-400">"{transcript}"</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VoiceCommand;