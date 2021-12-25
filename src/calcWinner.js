// squares are array of the 9 boxes, their values ["X", "O"]
const calcWinner = (squares) => {
  let winIndices = [];
  const sqWinIndices = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];

  for (let i = 0; i < sqWinIndices.length; i++) {
    const [a, b, c] = sqWinIndices[i];

    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      // console.log(sqWinIndices[i]);
      if (winIndices.length < 3) {
        sqWinIndices[i].forEach(i => winIndices.push(i));
      }
      // console.log(winIndices);
      return [squares[a], winIndices];
    }
  }
  return null;
};

export {calcWinner};