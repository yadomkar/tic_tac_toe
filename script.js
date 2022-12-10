const Player = (sign) => {
  let playerSign = sign;
  let playerPoint = playerSign === 'X' ? 1 : -1;
  let playerHandler = 'HUMAN';

  const getSign = () => {
    return playerSign;
  };

  const getPlayerPoint = () => {
    return playerPoint;
  };

  const setHandler = (handler) => {
    playerHandler = handler;
  };

  const getHandler = () => {
    return playerHandler;
  };

  return { getSign, getPlayerPoint, setHandler, getHandler };
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

const displayController = (() => {
  const boardCells = document.querySelectorAll('#boardCell');
  const message = document.querySelector('#message');
  const clearButton = document.querySelector('#clear');
  const aiButton1 = document.querySelector('#aiButton1');
  const aiButton2 = document.querySelector('#aiButton2');
  const easyButton1 = document.querySelector('#easyButton1');
  const easyButton2 = document.querySelector('#easyButton2');
  const humanButton1 = document.querySelector('#humanButton1');
  const humanButton2 = document.querySelector('#humanButton2');
  const startButton = document.querySelector('#startButton');
  const menu = document.querySelector('#menu');
  const game = document.querySelector('#game');
  const header = document.querySelector('#header');

  header.addEventListener('click', () => {
    window.location.reload();
  });

  aiButton1.addEventListener('click', () => {
    humanButton1.classList.remove('selected');
    easyButton1.classList.remove('selected');
    aiButton1.classList.add('selected');
    gameController.getPlayerX().setHandler('GOD');
  });

  easyButton1.addEventListener('click', () => {
    humanButton1.classList.remove('selected');
    aiButton1.classList.remove('selected');
    easyButton1.classList.add('selected');
    gameController.getPlayerX().setHandler('EASY');
  });

  humanButton1.addEventListener('click', () => {
    aiButton1.classList.remove('selected');
    easyButton1.classList.remove('selected');
    humanButton1.classList.add('selected');
    gameController.getPlayerX().setHandler('HUMAN');
  });

  aiButton2.addEventListener('click', () => {
    humanButton2.classList.remove('selected');
    easyButton2.classList.remove('selected');
    aiButton2.classList.add('selected');
    gameController.getPlayerY().setHandler('GOD');
  });

  easyButton2.addEventListener('click', () => {
    humanButton2.classList.remove('selected');
    aiButton2.classList.remove('selected');
    easyButton2.classList.add('selected');
    gameController.getPlayerY().setHandler('EASY');
  });

  humanButton2.addEventListener('click', () => {
    aiButton2.classList.remove('selected');
    easyButton2.classList.remove('selected');
    humanButton2.classList.add('selected');
    gameController.getPlayerY().setHandler('HUMAN');
  });

  const startRoutine = () => {
    if (
      !(gameController.getCurrentPlayer().getHandler() === 'HUMAN') &&
      !(
        gameController
          .getOppositePlayer(gameController.getCurrentPlayer())
          .getHandler() === 'HUMAN'
      )
    ) {
      (myLoop = (i) => {
        setTimeout(() => {
          const index =
            gameController.getCurrentPlayer().getHandler() === 'GOD'
              ? gameController.minimax(
                  gameBoard.getBoard(),
                  gameController.getCurrentPlayer(),
                  true
                ).index
              : gameController.getRandom(gameBoard.getBoard());
          if (
            !gameController.getIsWin() &&
            gameBoard.getSign(index) === index
          ) {
            gameController.play(index);
          }
          if (--i) myLoop(i);
        }, 1000);
      })(9);
    } else if (!(gameController.getCurrentPlayer().getHandler() === 'HUMAN')) {
      if (!gameController.getIsWin()) {
        setTimeout(
          (i) => {
            gameController.play(i);
          },
          1000,
          gameController.getRandom(gameBoard.getBoard())
        );
      }
    }
  };

  startButton.addEventListener('click', () => {
    menu.classList.add('inactive');
    game.classList.add('active');
    startRoutine();
  });

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
      if (
        gameController.getCurrentPlayer().getHandler() === 'HUMAN' &&
        gameBoard.getSign(index) === index &&
        !gameController.getIsWin()
      ) {
        gameController.play(index);
        if (
          !(gameController.getCurrentPlayer().getHandler() === 'HUMAN') &&
          !gameController.getIsWin()
        ) {
          const index =
            gameController.getCurrentPlayer().getHandler() === 'GOD'
              ? gameController.minimax(
                  gameBoard.getBoard(),
                  gameController.getCurrentPlayer(),
                  true
                ).index
              : gameController.getRandom(gameBoard.getBoard());
          if (gameBoard.getSign(index) === index) {
            setTimeout(
              (i) => {
                gameController.play(i);
              },
              1000,
              index
            );
          }
        }
      }
    });
  }

  clearButton.addEventListener('click', () => {
    gameController.resetGameController();
    startRoutine();
  });

  return { updateBoard, updateMessage, lightUp, lightDown };
})();

const gameController = (() => {
  const playerX = Player('X');
  const playerY = Player('O');
  playerX.setHandler('HUMAN');
  playerY.setHandler('EASY');
  let turn = 1;
  let currentPlayer = playerX;
  displayController.updateMessage('Player ' + currentPlayer.getSign());

  const getTurn = () => {
    return turn;
  };

  const getPlayerX = () => {
    return playerX;
  };

  const getPlayerY = () => {
    return playerY;
  };

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

    if (currentPlayer === playerX) currentPlayer = playerY;
    else currentPlayer = playerX;
    displayController.updateMessage('Player ' + currentPlayer.getSign());

    if (turn >= 10) {
      displayController.updateMessage('Draw');
    }
  };

  const getIsWin = () => {
    return isWin;
  };

  const resetGameController = () => {
    gameBoard.resetBoard();
    displayController.updateBoard();
    turn = 1;
    isWin = false;
    currentPlayer = playerX;
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

  const getRandom = (gameBoard) => {
    var availableSpots = getEmptyIndices(gameBoard);
    return availableSpots[Math.floor(Math.random() * availableSpots.length)];
  };

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
    if (player === playerX) return playerY;
    return playerX;
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
    getTurn,
    getPlayerX,
    getPlayerY,
    getRandom,
  };
})();
