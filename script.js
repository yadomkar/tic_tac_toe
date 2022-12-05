const Player = (sign) => {
  let playerSign = sign;
  let playerPoint = playerSign === 'X' ? 1 : -1;

  const getSign = () => {
    return playerSign;
  };

  const getPlayerPoint = () => {
    return playerPoint;
  };

  return { getSign, getPlayerPoint };
};

const gameBoard = (() => {
  let board = [0, 1, 2, 3, 4, 5, 6, 7, 8];

  const setSign = (index, sign) => {
    if (index > board.length) return;
    board[index] = sign;
  };

  const getSign = (index) => {
    if (index > board.length) return;
    return board[index];
  };

  const resetBoard = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = i;
    }
  };

  const getBoard = () => {
    return board;
  };

  return { setSign, getSign, resetBoard, getBoard };
})();

// currentPlayer = player2;

const displayController = (() => {
  const boardCells = document.querySelectorAll('#boardCell');
  const message = document.querySelector('#message');
  const clearButton = document.querySelector('button');

  const updateBoard = () => {
    for (let i = 0; i < boardCells.length; i++) {
      const curSign = gameBoard.getSign(i);
      boardCells[i].textContent = isNaN(curSign) ? curSign : '';
    }
  };

  const updateMessage = (text) => {
    message.textContent = text;
  };

  const lightUp = () => {
    message.classList.add('active');
  };

  const lightDown = () => {
    message.classList.remove('active');
  };

  for (let i = 0; i < boardCells.length; i++) {
    let cell = boardCells[i];
    cell.addEventListener('click', (e) => {
      const index = parseInt(e.target.getAttribute('index'));
      if (gameBoard.getSign(index) === index && !gameController.getIsWin()) {
        gameController.play(index);
      }
    });
  }

  clearButton.addEventListener('click', () => {
    gameController.resetGameController();
  });

  return { updateBoard, updateMessage, lightUp, lightDown };
})();

const gameController = (() => {
  const player1 = Player('X');
  const player2 = Player('O');
  let turn = 1;
  let currentPlayer = player1;
  displayController.updateMessage('Player ' + currentPlayer.getSign());

  let isWin = false;

  const play = (index) => {
    gameBoard.setSign(index, currentPlayer.getSign());
    displayController.updateBoard();
    turn++;

    if (checkWinner(gameBoard.getBoard(), currentPlayer)) {
      displayController.updateMessage(
        'Player ' + currentPlayer.getSign() + ' won!'
      );
      isWin = true;
      displayController.lightUp();
      return;
    }

    if (currentPlayer === player1) currentPlayer = player2;
    else currentPlayer = player1;
    displayController.updateMessage('Player ' + currentPlayer.getSign());

    if (turn === 10) {
      displayController.updateMessage('Draw');
    }
  };

  // const updateScore = (index) => {
  //   const row = index < 3 ? 0 : index < 6 ? 1 : 2;
  //   const col = index % 3;
  //   rowScore[row] += currentPlayer.getPlayerPoint();
  //   columnScore[col] += currentPlayer.getPlayerPoint();
  //   if (row === col) {
  //     majorDiagonalScore += currentPlayer.getPlayerPoint();
  //   }
  //   if (row + col === 2) {
  //     minorDiagonalScore += currentPlayer.getPlayerPoint();
  //   }

  //   if (
  //     Math.abs(rowScore[row]) === 3 ||
  //     Math.abs(columnScore[col]) === 3 ||
  //     Math.abs(majorDiagonalScore) === 3 ||
  //     Math.abs(minorDiagonalScore) === 3
  //   ) {
  //     isWin = true;
  //   }
  // };
  const getIsWin = () => {
    return isWin;
  };

  const resetGameController = () => {
    gameBoard.resetBoard();
    displayController.updateBoard();
    turn = 1;
    isWin = false;
    currentPlayer = player1;
    displayController.updateMessage('Player ' + currentPlayer.getSign());
    displayController.lightDown();
  };

  const checkWinner = (board, player) => {
    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (var i = 0; i < winConditions.length; i++) {
      var all_true = true;
      for (var j = 0; j < winConditions[0].length; j++) {
        if (board[winConditions[i][j]] !== player.getSign()) {
          all_true = false;
          break;
        }
      }
      if (all_true) return true;
    }

    return false;
  };

  // var availableSpots = getEmptyIndices(gameBoard.getBoard());

  const minimax = (inputBoard, player, maxPlayer) => {
    // debugger;
    board = [...inputBoard];
    // base case
    var availableSpots = getEmptyIndices(board);
    if (checkWinner(board, player)) {
      return { score: maxPlayer ? 10 : -10 };
    } else if (checkWinner(board, getOppositePlayer(player))) {
      return { score: maxPlayer ? -10 : 10 };
    } else if (availableSpots.length === 0) {
      return { score: 0 };
    }
    var bestMove = {};

    if (maxPlayer) {
      bestMove.score = Number.NEGATIVE_INFINITY;
      bestMove.index = -1;
      for (var i = 0; i < availableSpots.length; i++) {
        board[availableSpots[i]] = player.getSign();
        var eval = minimax(board, getOppositePlayer(player), false);
        board[availableSpots[i]] = availableSpots[i];

        if (bestMove.score < eval.score) {
          bestMove.score = eval.score;
          bestMove.index = availableSpots[i];
        }
      }
    } else {
      bestMove.score = Number.POSITIVE_INFINITY;
      bestMove.index = -1;
      for (var i = 0; i < availableSpots.length; i++) {
        board[availableSpots[i]] = player.getSign();
        var eval = minimax(board, getOppositePlayer(player), true);
        board[availableSpots[i]] = availableSpots[i];

        if (bestMove.score > eval.score) {
          bestMove.score = eval.score;
          bestMove.index = availableSpots[i];
        }
      }
    }

    return bestMove;
  };

  const getEmptyIndices = (board) => {
    const indices = [];
    for (var i = 0; i < board.length; i++) {
      if (board[i] === i) indices.push(i);
    }

    return indices;
  };

  const getOppositePlayer = (player) => {
    if (player === player1) return player2;
    return player1;
  };

  const getCurrentPlayer = () => {
    return currentPlayer;
  };

  return {
    getIsWin,
    play,
    resetGameController,
    getEmptyIndices,
    getOppositePlayer,
    minimax,
    getCurrentPlayer,
  };
})();
