
import React from 'react';
import { cn } from '@/lib/utils';

interface BoardProps {
  board: string[][];
}

const COLOR_CLASSES = {
  Red: 'bg-red-500 text-white',
  Blue: 'bg-blue-500 text-white',
  Green: 'bg-green-500 text-white',
  Yellow: 'bg-yellow-500 text-black',
  Purple: 'bg-purple-500 text-white',
};

const COLOR_SYMBOLS = {
  Red: 'R',
  Blue: 'B',
  Green: 'G',
  Yellow: 'Y',
  Purple: 'P',
};

const Board: React.FC<BoardProps> = ({ board }) => {
  if (!board || board.length === 0) {
    return (
      <div className="grid grid-cols-5 gap-2 p-4">
        {Array.from({ length: 25 }).map((_, index) => (
          <div
            key={index}
            className="w-12 h-12 bg-gray-700 rounded-lg flex items-center justify-center border-2 border-gray-600"
          >
            <span className="text-gray-400">?</span>
          </div>
        ))}
      </div>
    );
  }

  const isDiagonal = (row: number, col: number) => row === col;

  return (
    <div className="grid grid-cols-5 gap-2 p-4">
      {board.map((row, rowIndex) =>
        row.map((color, colIndex) => (
          <div
            key={`${rowIndex}-${colIndex}`}
            className={cn(
              "w-12 h-12 rounded-lg flex items-center justify-center font-bold text-lg transition-all duration-300 hover:scale-110",
              COLOR_CLASSES[color as keyof typeof COLOR_CLASSES] || 'bg-gray-500',
              isDiagonal(rowIndex, colIndex) && "ring-2 ring-yellow-400 ring-opacity-70 shadow-lg"
            )}
          >
            {COLOR_SYMBOLS[color as keyof typeof COLOR_SYMBOLS] || '?'}
          </div>
        ))
      )}
    </div>
  );
};

export default Board;
