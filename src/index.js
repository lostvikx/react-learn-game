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
    />;
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
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
    };

    this.jumpTo = this.jumpTo.bind(this);
  }

  handleClick(i) {
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
    this.setState({
      // used concat instead of push, because it doesn't mutate the array.
      history: history.concat([{
        squares: squares,
        loc: location,
        squareIndexClicked: curHist.squareIndexClicked.concat(i),
      }]),
      stepNum: history.length,
      xIsNext: !this.state.xIsNext,
    });

    // setTimeout(() => console.log(this.state), 2000);
  }

  jumpTo(step) {
    console.log("jumped");
    // Only properties mentioned in setState method gets updated, leaving the remaining state properties as they were.
    this.setState({
      stepNum: step,
      xIsNext: (step % 2) === 0,
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

      const locIndex = squareIndexClicked.slice(-1)[0];
      
      const text = move 
        ? `Go to move #${move} Loc: (${loc[locIndex].col}, ${loc[locIndex].row})`
        : "Go to start";

        // Always assign proper keys whenever you build dynamic lists.
        return (
          <li key={move}>
            <button 
              onClick={() => this.jumpTo(move)}
              className="move-btn"
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
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
