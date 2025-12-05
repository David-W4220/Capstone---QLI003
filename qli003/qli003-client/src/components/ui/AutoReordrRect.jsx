import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const AutoReodrRect = ({ API_BASE_URL }) => {
  const [intervalInput, setIntervalInput] = useState('');
  const [currentInterval, setCurrentInterval] = useState(null);
  const [statusMessage, setStatusMessage] = useState({ message: '', type: '' });
  const [loading, setLoading] = useState(false);

  //fetch current interval from backend
  const fetchCurrentInterval = useCallback(async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/AutoReodrSetting/get-interval`);
      const intervalDays = response.data?.intervalDays ?? response.data;
      setCurrentInterval(intervalDays);
      setIntervalInput(intervalDays?.toString() ?? '');
    } catch (error) {
      console.error('Failed to fetch current interval:', error);
      setStatusMessage({ message: 'Error loading current interval.', type: 'error' });
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchCurrentInterval();
  }, [fetchCurrentInterval]);

  //Auto-clear status message after 5 sec
  useEffect(() => {
    if (!statusMessage.message) return;

    const timer = setTimeout(() => {
      setStatusMessage({ message: '', type: '' });
    }, 5000);

    return () => clearTimeout(timer);
  }, [statusMessage]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setStatusMessage({ message: '', type: '' });

    const days = parseInt(intervalInput, 10);
    if (isNaN(days) || days < 1) {
      setStatusMessage({ message: 'ERROR: Input must be a positive integer!', type: 'error' });
      return;
    }

    setLoading(true);
    try {
      const apiUrl = `${API_BASE_URL}/api/AutoReodrSetting/set-interval`;
      const response = await axios.post(apiUrl, days, {
        headers: { 'Content-Type': 'application/json' },
      });

      const respMsg =
        response.data?.message ??
        (typeof response.data === 'string' ? response.data : 'Interval updated.');

      setStatusMessage({ message: respMsg, type: 'success' });
      setCurrentInterval(days);
    } catch (error) {
      const errMsg =
        error.response?.data?.message ||
        error.response?.data ||
        error.message ||
        'An unknown API error occurred.';
      setStatusMessage({ message: String(errMsg), type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const getStatusClasses = () => {
    if (statusMessage.type === 'success')
      return 'bg-green-50 border border-green-200 text-green-800';
    if (statusMessage.type === 'error')
      return 'bg-red-50 border border-red-200 text-red-800';
    return 'invisible';
  };

  return (
    <div className="bg-white border border-gray-200 shadow-sm rounded-lg p-4 mb-6">
      <form
        onSubmit={handleSubmit}
        className="flex items-center space-x-3 whitespace-nowrap overflow-hidden"
      >
        <span className="font-semibold text-gray-900">
          Mail The Reorder Suggestion List Every
        </span>

        <input
          id="reorder-days"
          type="text"
          value={intervalInput}
          onChange={(e) => setIntervalInput(e.target.value)}
          placeholder="Integer"
          className="w-20 py-1 px-2 border border-gray-300 rounded-md 
             focus:outline-none focus:ring-2 focus:ring-blue-400"
        />

        <span className="font-medium text-gray-700">Days</span>

        <button
          type="submit"
          disabled={loading}
          className="px-3 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 
             disabled:opacity-60"
        >
          {loading ? 'Resetting...' : 'Set'}
        </button>

        <span className="text-sm text-gray-600">
          {currentInterval !== null
            ? `(Current: ${currentInterval} Day(s))`
            : '(Loading...)'}
        </span>
      </form>

      {/* Status message */}
      <div className={`mt-3 p-2 rounded-md text-sm ${getStatusClasses()}`} role="status">
        {statusMessage.message || ''}
      </div>
    </div>
  );
};

export default AutoReodrRect;