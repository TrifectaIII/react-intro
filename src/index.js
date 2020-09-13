import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square (props) {
    return (
        <button 
            style = {(props.winner ? {backgroundColor: 'yellow'} : {})}
            className="square" 
            onClick = {props.onClick}
        >
            {props.value}
        </button>
    );
}

function Toggle (props) {
    let text = (props.descend ? "Ascending Order" : "Descending Order");
    return (
        <button
            onClick = {props.onClick}  
        >
            {text}
        </button>
    )
}
  
class Board extends React.Component {

    renderSquare(i) {
        return (
            <Square 
                value = {this.props.squares[i]}
                onClick = {() => {this.props.onClick(i)}}
                winner = {this.props.winner.squares.includes(i)}
            />
        );
    }

    render() {
        let result;
        for (let i=0; i < 3; i++) {
            let row;
            for (let j=0; j < 3; j++) {
                const square = this.renderSquare(i*3 + j);
                if (row) {
                    row = <>{row}{square}</>
                }
                else {
                    row = square;
                }
            }
            row = <div className="board-row">{row}</div>
            if (result) {
                result = <>{result}{row}</>
            }
            else {
                result = row;
            }
        }
        return (
            <div>
                {result};
            </div>
        );
    }
}
  
class Game extends React.Component {
    constructor (props) {
        super(props);

        this.state = {
            history:[
                {
                    squares: Array(9).fill(null),
                    spot: null,
                },
            ],
            stepNumber: 0,
            xTurn: true,
            descend: true,
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0,this.state.stepNumber + 1);
        const current = history[history.length -1];
        if (calculateWinner(current.squares).symbol || current.squares[i]){
            return;
        }
        const squaresCopy = [...current.squares];
        squaresCopy[i] = this.state.xTurn ? 'X' : 'O';
        this.setState({
            history: history.concat([{
                squares:squaresCopy,
                spot: i,
            }]),
            xTurn: !this.state.xTurn,
            stepNumber: history.length,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xTurn: step%2 === 0,
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const currentIndex = this.state.stepNumber;

        //render moves
        let moves = history.map((step, move) => {
            const desc = move ?
                'Go to move #'+move+':' :
                'Go to game start';

            let coords = '';

            if (typeof step.spot === 'number') {
                const row = Math.floor(step.spot/3)+1;
                const col = (step.spot)%3 + 1;
                coords = (move%2 !== 0? 'X': 'O') + ' @ '+row + ', ' + col; 
            }


            if (move === currentIndex) {
                return (
                    <li key={move}>
                        <button onClick={() => {this.jumpTo(move)}}><b>{desc} {coords}</b></button>
                    </li>
                );
            }
            
            return (
                <li key={move}>
                    <button onClick={() => {this.jumpTo(move)}}>{desc} {coords}</button>
                </li>
            );
        });

        if (!this.state.descend) {
            moves = moves.reverse();
        }  

        let status;
        if (winner.symbol) {
            status = 'Winner: '+ winner.symbol;
        }
        else if (this.state.stepNumber === 9) {
            status = 'Draw'
        }
        else {
            status = 'Next player: ' + (this.state.xTurn ? 'X' : 'O');
        }
        return (
            <div className="game">
                <div className="game-board">
                <Board 
                    squares = {current.squares}
                    onClick = {(i) => {this.handleClick(i)}}
                    winner = {winner}
                />
                </div>
                <div className="game-info">
                <div>{status}</div>
                <ol>{moves}</ol>
                <Toggle
                    descend = {this.state.descend}
                    onClick = {() => {this.setState({descend: !this.state.descend})}} 
                />
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


function calculateWinner (squares) {
    const lines = [
        [0,1,2],
        [3,4,5],
        [6,7,8],
        [0,3,6],
        [1,4,7],
        [2,5,8],
        [0,4,8],
        [2,4,6],
    ];

    for (let i=0; i< lines.length; i++) {
        const [a,b,c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {
                symbol: squares[a],
                squares: lines[i],
            };
        }
    }
    return {
        symbol: null,
        squares: [],
    };
}