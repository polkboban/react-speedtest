import React, { useState } from 'react';

interface AttemptHistoryProps {
  attempts: number[];
}

const AttemptHistory: React.FC<AttemptHistoryProps> = ({ attempts }) => {
  const [showAttempts, setShowAttempts] = useState(false);

  const toggleAttempts = () => {
    setShowAttempts(!showAttempts);
  };

  const calculateAverage = () => {
    const validAttempts = attempts.filter(attempt => attempt !== -1);
    const sum = validAttempts.reduce((acc, attempt) => acc + attempt, 0);
    return validAttempts.length > 0 ? (sum / validAttempts.length).toFixed(2) : 'N/A';
  };

  return (
    <div className="mt-6 pt-4 border-t border-gray-200">
      <button
        onClick={toggleAttempts}
        className="w-full py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-colors"
      >
        {showAttempts ? 'Hide Attempts' : 'Show Last 5 Attempts'}
      </button>
      {showAttempts && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold text-gray-700">Last 5 Attempts</h2>
          <ul className="space-y-2">
            {attempts.map((attempt, index) => (
              <li key={index} className="text-gray-600">
                Attempt {index + 1}: {attempt === -1 ? 'Too early' : `${attempt}ms`}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-lg font-semibold text-gray-700">
            Average Time: {calculateAverage()}ms
          </p>
        </div>
      )}
    </div>
  );
};

export default AttemptHistory;