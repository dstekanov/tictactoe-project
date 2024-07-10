import React, { useState, useEffect } from 'react';

// Initial state of the game: an empty 3x3 board represented as an array
const S0 = Array(9).fill(null);

const PLAYER = (s) => s.filter(cell => cell !== null).length % 2 === 0 ? 'X' : 'O';

const ACTIONS = (s) => s.reduce((acc, cell, index) => cell === null ? [...acc, index] : acc, []);

const RESULT = (s, a) => {
  const newState = [...s];
  newState[a] = PLAYER(s);
  return newState;
};

const TERMINAL = (s) => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (s[a] && s[a] === s[b] && s[a] === s[c]) {
      return true; // We have a winner
    }
  }
  return s.every(cell => cell !== null); // Draw if all cells are filled
};

const UTILITY = (s) => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
    [0, 4, 8], [2, 4, 6]             // Diagonals
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (s[a] && s[a] === s[b] && s[a] === s[c]) {
      return s[a] === 'X' ? 1 : -1;
    }
  }
  return 0; // Draw
};

const minimax = (s, depth, isMaximizing) => {
  if (TERMINAL(s)) {
    return UTILITY(s);
  }
  
  const actions = ACTIONS(s);
  
  if (isMaximizing) {
    let bestScore = -Infinity;
    for (let a of actions) {
      let score = minimax(RESULT(s, a), depth + 1, false);
      bestScore = Math.max(score, bestScore);
    }
    return bestScore;
  } else {
    let bestScore = Infinity;
    for (let a of actions) {
      let score = minimax(RESULT(s, a), depth + 1, true);
      bestScore = Math.min(score, bestScore);
    }
    return bestScore;
  }
};

const findBestMove = (s) => {
  const player = PLAYER(s);
  const actions = ACTIONS(s);
  let bestScore = player === 'X' ? -Infinity : Infinity;
  let bestMove;

  for (let a of actions) {
    const score = minimax(RESULT(s, a), 0, player === 'O');
    if ((player === 'X' && score > bestScore) || (player === 'O' && score < bestScore)) {
      bestScore = score;
      bestMove = a;
    }
  }

  return bestMove;
};

const TicTacToe = () => {
  const [board, setBoard] = useState(S0);
  const [status, setStatus] = useState('Next player: X');

  useEffect(() => {
    if (TERMINAL(board)) {
      const utility = UTILITY(board);
      if (utility === 1) setStatus('X wins!');
      else if (utility === -1) setStatus('O wins!');
      else setStatus('Draw!');
    } else {
      setStatus(`Next player: ${PLAYER(board)}`);
      if (PLAYER(board) === 'O') {
        setTimeout(() => {
          const bestMove = findBestMove(board);
          setBoard(RESULT(board, bestMove));
        }, 500);
      }
    }
  }, [board]);

  const handleClick = (i) => {
    if (TERMINAL(board) || board[i] || PLAYER(board) === 'O') return;
    setBoard(RESULT(board, i));
  };

  const renderSquare = (i) => (
    <button 
      className="w-20 h-20 bg-teal-100 hover:bg-teal-200 text-3xl font-bold rounded-lg shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-teal-400"
      onClick={() => handleClick(i)}
    >
      {board[i]}
    </button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-teal-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-xl p-8 max-w-md w-full">
        <h1 className="text-4xl font-bold text-teal-600 mb-6 text-center">Tic-Tac-Toe</h1>
        <div className="text-xl font-semibold text-teal-800 mb-6 text-center">{status}</div>
        <div className="grid grid-cols-3 gap-4 mb-6">
          {board.map((_, i) => renderSquare(i))}
        </div>
        <div className="text-center text-teal-600 text-sm">
          Play against an unbeatable AI!
        </div>
      </div>
    </div>
  );
};

export default TicTacToe;