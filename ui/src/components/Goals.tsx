import React from 'react';
import { slideData } from '../data/slide_data';
import ReactJson from 'react-json-view';

const Goals: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Goals</h1>
      <div className="bg-gray-100 p-4 rounded-lg">
        <ReactJson 
          src={slideData}
          theme="summerfruit:inverted"
          collapsed={1}
          displayDataTypes={false}
          enableClipboard={false}
          style={{
            backgroundColor: 'transparent',
            fontFamily: 'monospace'
          }}
        />
      </div>
    </div>
  );
};

export default Goals;
