// pages/PhotoCapture.jsx
import { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiCamera, FiRefreshCw, FiCheck, FiX, FiArrowLeft, FiAlertCircle } from 'react-icons/fi';

const PhotoCapture = () => {
  const [stream, setStream] = useState(null);
  const [capturedImage, setCapturedImage] = useState(null);
  const [error, setError] = useState('');
  const [cameraActive, setCameraActive] = useState(false);
  const [loading, setLoading] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  
  const navigate = useNavigate();
  const location = useLocation();
  const employeeName = location.state?.employeeName || 'Employee';

  // Cleanup function
  const stopCameraStream = () => {
    if (streamRef.current) {
      const tracks = streamRef.current.getTracks();
      tracks.forEach(track => {
        track.stop();
        console.log('Track stopped:', track.kind);
      });
      streamRef.current = null;
    }
    
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    
    setStream(null);
    setCameraActive(false);
  };

  // Initialize camera
  const initCamera = async () => {
    setLoading(true);
    setError('');
    
    try {
      // First check if browser supports getUserMedia
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Your browser does not support camera access');
      }

      console.log('Requesting camera permission...');
      
      // Simple constraints for better compatibility
      const constraints = {
        video: {
          width: { ideal: 1280 },
          height: { ideal: 720 },
          facingMode: 'user' // Use front camera by default
        },
        audio: false
      };

      // Request camera access
      const mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
      
      console.log('Camera permission granted:', mediaStream);
      
      // Store stream in ref and state
      streamRef.current = mediaStream;
      setStream(mediaStream);
      setPermissionGranted(true);
      
      // Set up video element
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.setAttribute('playsinline', 'true'); // Required for iOS
        
        // Wait for video to be ready
        await new Promise((resolve) => {
          videoRef.current.onloadedmetadata = () => {
            videoRef.current.play()
              .then(() => {
                console.log('Video playing successfully');
                setCameraActive(true);
                resolve();
              })
              .catch(playError => {
                console.error('Error playing video:', playError);
                throw new Error('Could not start video playback');
              });
          };
        });
      }
    } catch (err) {
      console.error('Camera initialization error:', err);
      
      // Handle specific errors
      if (err.name === 'NotAllowedError' || err.message.includes('permission')) {
        setError('Camera access denied. Please allow camera permissions and try again.');
      } else if (err.name === 'NotFoundError' || err.message.includes('not found')) {
        setError('No camera found on this device.');
      } else if (err.name === 'NotReadableError' || err.message.includes('in use')) {
        setError('Camera is already in use by another application.');
      } else if (err.name === 'OverconstrainedError') {
        setError('Camera cannot meet requirements. Try a different camera.');
      } else {
        setError(`Unable to access camera: ${err.message || 'Unknown error'}`);
      }
      
      setPermissionGranted(false);
      setCameraActive(false);
    } finally {
      setLoading(false);
    }
  };

  // Start camera
  const startCamera = () => {
    stopCameraStream(); // Clean up any existing stream
    initCamera();
  };

  // Stop camera
  const stopCamera = () => {
    stopCameraStream();
    setPermissionGranted(false);
  };

  // Capture photo
  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current && cameraActive) {
      try {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 480;
        
        // Draw video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert to base64
        const imageData = canvas.toDataURL('image/jpeg', 0.95);
        setCapturedImage(imageData);
        
        // Stop camera after capture
        stopCamera();
        
        console.log('Photo captured successfully');
      } catch (err) {
        console.error('Error capturing photo:', err);
        setError('Failed to capture photo. Please try again.');
      }
    } else {
      setError('Camera is not active. Please start the camera first.');
    }
  };

  // Retake photo
  const retakePhoto = () => {
    setCapturedImage(null);
    startCamera();
  };

  // Save and navigate
  const savePhoto = () => {
    if (capturedImage) {
      navigate('/photo-result', { 
        state: { 
          image: capturedImage, 
          employeeName,
          timestamp: new Date().toISOString()
        } 
      });
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopCameraStream();
    };
  }, []);

  return (
    <div className="min-h-screen p-4 md:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-2xl mx-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <motion.button
            whileHover={{ x: -5 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition"
          >
            <FiArrowLeft size={20} />
            <span className="hidden sm:inline">Back</span>
          </motion.button>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">Capture Photo</h1>
          <div className="w-10 sm:w-20" />
        </div>

        {/* Camera Container */}
        <div className="bg-white/90 dark:bg-white/10 backdrop-blur-lg rounded-2xl p-4 sm:p-6 border border-gray-200 dark:border-white/20 shadow-xl">
          {/* Video/Camera Preview */}
          <div className="relative aspect-video bg-gray-900 rounded-xl overflow-hidden mb-6">
            {!capturedImage ? (
              <>
                {/* Video element - always present but hidden until camera active */}
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className={`w-full h-full object-cover transition-opacity duration-300 ${
                    cameraActive ? 'opacity-100' : 'opacity-0'
                  }`}
                />
                
                {/* Placeholder when camera is off */}
                {!cameraActive && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-800">
                    <FiCamera size={64} className="text-gray-600 mb-4" />
                    <p className="text-gray-400 text-lg">Camera is off</p>
                    <p className="text-gray-500 text-sm mt-2">Click "Start Camera" to begin</p>
                  </div>
                )}

                {/* Loading overlay */}
                {loading && (
                  <div className="absolute inset-0 bg-black/70 flex flex-col items-center justify-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-white">Starting camera...</p>
                  </div>
                )}
              </>
            ) : (
              // Captured image preview
              <img
                src={capturedImage}
                alt="Captured"
                className="w-full h-full object-contain bg-gray-800"
              />
            )}
            
            {/* Hidden canvas for capturing */}
            <canvas ref={canvasRef} className="hidden" />
          </div>

          {/* Error Message */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-2 bg-red-100 dark:bg-red-600/20 border border-red-300 dark:border-red-500/30 text-red-700 dark:text-red-400 p-3 rounded-lg mb-4"
              >
                <FiAlertCircle className="flex-shrink-0" size={20} />
                <p className="text-sm">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Controls */}
          <div className="flex flex-wrap justify-center gap-3">
            {!cameraActive && !capturedImage && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startCamera}
                disabled={loading}
                className="flex-1 min-w-[140px] bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiCamera size={20} />
                <span>{loading ? 'Starting...' : 'Start Camera'}</span>
              </motion.button>
            )}

            {cameraActive && !capturedImage && (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={capturePhoto}
                  className="flex-1 min-w-[140px] bg-green-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition"
                >
                  <FiCamera size={20} />
                  <span>Capture</span>
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={stopCamera}
                  className="flex-1 min-w-[140px] bg-red-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-red-700 transition"
                >
                  <FiX size={20} />
                  <span>Stop</span>
                </motion.button>
              </>
            )}

            {capturedImage && (
              <>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={retakePhoto}
                  className="flex-1 min-w-[140px] bg-yellow-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-yellow-700 transition"
                >
                  <FiRefreshCw size={20} />
                  <span>Retake</span>
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={savePhoto}
                  className="flex-1 min-w-[140px] bg-green-600 text-white px-6 py-3 rounded-lg flex items-center justify-center gap-2 hover:bg-green-700 transition"
                >
                  <FiCheck size={20} />
                  <span>Save Photo</span>
                </motion.button>
              </>
            )}
          </div>

          {/* Camera Status */}
          {permissionGranted && cameraActive && (
            <div className="mt-4 text-center">
              <span className="inline-flex items-center gap-2 text-sm text-green-600 dark:text-green-400">
                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                Camera active
              </span>
            </div>
          )}

          {/* Instructions */}
          {!cameraActive && !capturedImage && !loading && (
            <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
              <p>Make sure you're using HTTPS or localhost</p>
              <p className="mt-1">Click "Allow" when your browser asks for camera permission</p>
              <p className="mt-2 text-xs opacity-75">If camera doesn't work, check your browser settings</p>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default PhotoCapture;