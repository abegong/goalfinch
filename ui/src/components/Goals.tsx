import React from 'react';
import { slideData } from '../data/slide_data';

const Goals: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Goals</h1>
      <pre className="bg-gray-100 p-4 rounded-lg overflow-auto">
        {JSON.stringify(slideData, null, 2)}
      </pre>
    </div>
  );
};

export default Goals;
