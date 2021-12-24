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
      },],
      xIsNext: true,
    };
  }

  handleClick(i) {
    const history = this.state.history;
    const curHist = history[history.length - 1];
    // Immutability is important
    const squares = curHist.squares.slice();

    // If we have a winner or square is filled, return early and don't setState.
    if (calcWinner(squares)) {
      console.log("Game Over!");
      return;
    } else if (squares[i]) {
      console.log("Already filled!");
      return;
    }

    squares[i] = this.state.xIsNext ? "X" : "O";
    // setState is asynchronous
    this.setState({
      // used concat instead of push, because it doesn't mutate the array.
      history: history.concat([{
        squares: squares,
      }]),
      xIsNext: !this.state.xIsNext,
    });
  }

  render() {
    const history = this.state.history;
    const curHist = history[history.length - 1];

    const winner = calcWinner(curHist.squares);

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
          <div>{status}</div>
          <ol>{/* TODO */}</ol>
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
