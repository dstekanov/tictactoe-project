import React from 'react';

const ScoreBoard = ({ humanScore, aiScore, drawScore }) => {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 w-48">
      <h2 className="text-lg font-semibold text-teal-800 mb-4 text-center">Score</h2>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-teal-600">Human:</span>
          <span className="font-bold">{humanScore}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-teal-600">AI:</span>
          <span className="font-bold">{aiScore}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-teal-600">Draws:</span>
          <span className="font-bold">{drawScore}</span>
        </div>
      </div>
    </div>
  );
};

export default ScoreBoard;