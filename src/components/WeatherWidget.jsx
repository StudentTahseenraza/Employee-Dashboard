// components/WeatherWidget.jsx
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiCloud, FiSun, FiCloudRain, FiCloudSnow, FiCloudLightning } from 'react-icons/fi';
import axios from 'axios';

const WeatherWidget = ({ city }) => {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchWeather();
  }, [city]);

  const fetchWeather = async () => {
    try {
      // Using OpenWeatherMap API (you'll need to add your API key)
      const API_KEY = 'YOUR_API_KEY'; // Replace with actual API key
      const response = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?q=${city},IN&appid=${API_KEY}&units=metric`
      );
      setWeather(response.data);
    } catch (err) {
      setError('Weather data unavailable');
    } finally {
      setLoading(false);
    }
  };

  const getWeatherIcon = (condition) => {
    switch (condition) {
      case 'Clear':
        return <FiSun className="text-yellow-400" />;
      case 'Clouds':
        return <FiCloud className="text-gray-400" />;
      case 'Rain':
        return <FiCloudRain className="text-blue-400" />;
      case 'Snow':
        return <FiCloudSnow className="text-white" />;
      case 'Thunderstorm':
        return <FiCloudLightning className="text-purple-400" />;
      default:
        return <FiCloud className="text-gray-400" />;
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse bg-gray-700 h-16 rounded-lg"></div>
    );
  }

  if (error || !weather) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 p-3 rounded-lg flex items-center justify-between"
    >
      <div className="flex items-center gap-3">
        <div className="text-2xl">
          {getWeatherIcon(weather.weather[0].main)}
        </div>
        <div>
          <p className="text-sm font-medium">{city}</p>
          <p className="text-xs text-gray-400">{weather.weather[0].description}</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-lg font-bold">{Math.round(weather.main.temp)}°C</p>
        <p className="text-xs text-gray-400">Feels like {Math.round(weather.main.feels_like)}°C</p>
      </div>
    </motion.div>
  );
};

export default WeatherWidget;