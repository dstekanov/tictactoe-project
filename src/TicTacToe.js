import React, { useState, useEffect } from 'react';

// Game logic functions
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
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (s[a] && s[a] === s[b] && s[a] === s[c]) {
      return true;
    }
  }
  return s.every(cell => cell !== null);
};
const UTILITY = (s) => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  for (let line of lines) {
    const [a, b, c] = line;
    if (s[a] && s[a] === s[b] && s[a] === s[c]) {
      return s[a] === 'X' ? 1 : -1;
    }
  }
  return 0;
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

function TicTacToe() {
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
    <button className="w-16 h-16 border border-gray-400 text-2xl font-bold" onClick={() => handleClick(i)}>
      {board[i]}
    </button>
  );

  return (
    <div className="flex flex-col items-center">
      <div className="text-xl font-bold mb-4">{status}</div>
      <div className="grid grid-cols-3 gap-1">
        {board.map((_, i) => renderSquare(i))}
      </div>
    </div>
  );
}

export default TicTacToe;