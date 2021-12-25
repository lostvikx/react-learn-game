import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import calcWinner from "./calcWinner.js"

// Square is a controlled component, Board has full control over it.
const Square = (props) => {
  return (
    <button
      className="square"
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
};

class Board extends React.Component {
  renderSquare(i) {
    return <Square 
      value={this.props.squares[i]} 
      onClick={() => this.props.onClick(i)}
      key={`square_${i}`}
    />;
  }

  render() {
    const board = [];
    
    for (let r=0; r < 9; r+=3) {
      const row = [];

      for (let i=r; i < r+3; i++) {
        row.push(this.renderSquare(i));
      }

      board.push(row);
    }

    // console.log(board);
    
    const fullBoard = board.map((squares, index) => {
      return (
        <div 
          className="board-row" 
          key={`row_${index}`}
        >
          {squares}
        </div>
      );
    });

    // console.log(fullBoard);

    return (
      <div>
        {fullBoard}
      </div>
    );
  }
}

const SortBtn = (props) => {
  return (
    <button 
      className="sort-btn"
      onClick={props.handleSort}
    >
      View Reverse Moves      
    </button>
  );
}

class Game extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      history: [{
        squares: Array(9).fill(null),
        loc: Array(9).fill({col: null, row: null}),
        squareIndexClicked: [],
      },],
      stepNum: 0,
      xIsNext: true,
      reverse: false,
    };

    this.jumpTo = this.jumpTo.bind(this);
  }

  handleClick(i) {
    if (this.state.reverse) {
      console.log("Reverse Baby, can't do shit!");
      return;
    }

    const history = this.state.history.slice(0, this.state.stepNum + 1);

    const curHist = history[history.length - 1];
    // Immutability is important
    const squares = curHist.squares.slice();
    const location = curHist.loc.slice();

    // If we have a winner or square is filled, return early and don't setState.
    if (calcWinner(squares)) {
      console.log("Game Over!");
      return;
    } else if (squares[i]) {
      console.log("Already filled!");
      return;
    }

    squares[i] = this.state.xIsNext ? "X" : "O";

    const colRowMap = [];

    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        colRowMap.push({ col: j + 1, row: i + 1 });
      }
    }

    location[i] = colRowMap[i];

    // console.log(colRowMap);

    // setState is asynchronous
    if (!this.state.reverse) {
      this.setState({
        // used concat instead of push, because it doesn't mutate the array.
        history: history.concat([{
          squares: squares,
          loc: location,
          squareIndexClicked: curHist.squareIndexClicked.concat([i]),
        }]),
        stepNum: history.length,
        xIsNext: !this.state.xIsNext,
      });
    }
    // setTimeout(() => console.log(this.state), 2000);
  }

  jumpTo(step) {
    console.log("Jumped");
    // Only properties mentioned in setState method gets updated, leaving the remaining state properties as they were.
    this.setState({
      stepNum: step,
      xIsNext: (step % 2) === 0,
    });

    // setTimeout(() => console.log(this.state), 2000);
  }

  handleSort() {
    // console.log(this.state.history);
    const revHistory = this.state.history
      .slice()
      .reverse();
    
    this.setState({
      history: revHistory,
      reverse: !this.state.reverse,
    });

    // setTimeout(() => console.log(this.state), 2000);
  }

  render() {
    const history = this.state.history;
    const curHist = history[this.state.stepNum];

    const winner = calcWinner(curHist.squares);

    // _step: {squares:[...]}
    // move: index of step {}
    const moves = history.map(({squares, loc, squareIndexClicked}, move) => {

      let locIndex = squareIndexClicked.slice(-1)[0];

      let text = null;
      try {
        text = `Go to move #${move} Loc: (${loc[locIndex].col}, ${loc[locIndex].row})`
      } catch(err) {
        // console.error(err);
        text = "Go to start"
      }

      // Always assign proper keys whenever you build dynamic lists.
      return (
        <li key={move}>
          <button 
            onClick={() => this.jumpTo(move)}
            className={`move-btn ${(move === this.state.stepNum) ? "bold-txt" : ""}`}
          >
            {text}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = `Next player: ${this.state.xIsNext ? "X" : "O"}`;
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board 
            squares={curHist.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div className="status">{status}</div>
          <ul>{moves}</ul>
        </div>
        <div className="other-options"><SortBtn handleSort={() => this.handleSort()}/></div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
