import React, { useState, useEffect } from 'react';
import api from '../services/api';
import env from '../config/env';
import './HealthCheck.css';

const HealthCheck = () => {
  const [status, setStatus] = useState('checking');
  const [message, setMessage] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkHealth = async () => {
      try {
        setStatus('checking');
        const response = await api.checkHealth();
        setStatus('success');
        setMessage(response.message || 'API is healthy');
      } catch (err) {
        setStatus('error');
        setError(err.message || 'Failed to connect to API');
        console.error('Health check error:', err);
      }
    };

    checkHealth();
  }, []);

  return (
    <div className="health-check">
      <h3>System Status</h3>
      <div className={`status-indicator ${status}`}>
        {status === 'checking' && <span>Checking API connection...</span>}
        {status === 'success' && <span>✅ API Connected</span>}
        {status === 'error' && <span>❌ API Connection Failed</span>}
      </div>
      
      {message && <p className="message">{message}</p>}
      {error && <p className="error">{error}</p>}
      
      <div className="connection-details">
        <p><strong>Frontend URL:</strong> {env.FRONTEND_URL}</p>
        <p><strong>API URL:</strong> {env.API_URL}</p>
        <p><strong>Environment:</strong> {process.env.NODE_ENV}</p>
      </div>
    </div>
  );
};

export default HealthCheck; 