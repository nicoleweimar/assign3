import { useState } from 'react';

function Square({value, onSquareClick}) {
  return (
    <button className="square" onClick={onSquareClick}>
      {value}
    </button>
  );
}

export default function Board() {
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [selectedSquare, setSelectedSquare] = useState(null);

  function handleClick(i) {
  const player = xIsNext ? 'X' : 'O';
  const playerCount = countPieces(squares, player);
  
  if (calculateWinner(squares)) {
  return;
  }

  if (playerCount < 3) {
    if (squares[i]) {
      return;
    }

    const nextSquares = squares.slice();
    nextSquares[i] = player;

    setSquares(nextSquares);
    setXIsNext(!xIsNext);
    return;
  }
  if (selectedSquare === null) { //if we have not selected a square (first click)
    if (squares[i] !== player) { //return if the square selected is not current players square
      return;
    }
    setSelectedSquare(i); //otherwise we will set the selectedsquare
    return;
  }
  else { //second click we have selected a square
    if (squares[i] !== null) { //if destination is not empty reset to first click
      setSelectedSquare(null);
      return; 
    }
    if (!isAdjacent(selectedSquare, i)) {
      setSelectedSquare(null);
      return;
    }
    const nextSquares = squares.slice();
    nextSquares[selectedSquare] = null; // remove piece from old spot
    nextSquares[i] = player; //place in new spot
    //here we will add logic for moing the middle piece
    if (squares[4] === player && selectedSquare !== 4 && calculateWinner(nextSquares) !== player) {
      setSelectedSquare(null);
      return;
    } //if the player has center and doesnt select it and there move doesnt win then we wont let them do it
    setSquares(nextSquares); //update board
    setSelectedSquare(null); //reset selection
    setXIsNext(!xIsNext); //next players turn
  }
}

  const winner = calculateWinner(squares);
  let status;
  if (winner) {
    status = 'Winner: ' + winner;
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <>
      <div className="status">{status}</div>
      <div className="board-row">
        <Square value={squares[0]} onSquareClick={() => handleClick(0)} />
        <Square value={squares[1]} onSquareClick={() => handleClick(1)} />
        <Square value={squares[2]} onSquareClick={() => handleClick(2)} />
      </div>
      <div className="board-row">
        <Square value={squares[3]} onSquareClick={() => handleClick(3)} />
        <Square value={squares[4]} onSquareClick={() => handleClick(4)} />
        <Square value={squares[5]} onSquareClick={() => handleClick(5)} />
      </div>
      <div className="board-row">
        <Square value={squares[6]} onSquareClick={() => handleClick(6)} />
        <Square value={squares[7]} onSquareClick={() => handleClick(7)} />
        <Square value={squares[8]} onSquareClick={() => handleClick(8)} />
      </div>
    </>
  );
}

function countPieces(squares, player) {
  let count = 0;
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] === player) {
      count++;
    }
  }
  return count;
}

function isAdjacent(a, b) {
  const rowA = Math.floor(a / 3);
  const colA = a % 3;

  const rowB = Math.floor(b / 3);
  const colB = b % 3;

  const rowDiff = Math.abs(rowA - rowB);
  const colDiff = Math.abs(colA - colB);

  return rowDiff <= 1 && colDiff <= 1 && !(rowDiff === 0 && colDiff === 0);
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}
