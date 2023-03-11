const cell = document.getElementsByClassName("cell");
var board =
  [['', '', ''],
  ['', '', ''],
  ['', '', '']];

var choice, choice_comp;
var selected_box;
let game_ended = false;
[choice_human, choice_comp] = ["O", "X"];


function update_board(entered, choice) {
  var i, j, update;

  i = (parseInt)(entered / 3);
  j = (entered % 3);

  if (board[i][j] === "X" || board[i][j] === "O") {
    return -1;
  }
  board[i][j] = choice;
}

humanTurn = false
function fill_position(mark) {
  for (let x = 0; x < 9; x++) {
    cell[x].addEventListener('click', function (e) {
      if (game_ended){
        return;
      }
      if (humanTurn && mark === choice_human) {
        // document.getElementById("turn").innerHTML= "Your Turn(O)"
        cell[x].style.backgroundColor = "#232d38";
        if (cell[x].innerHTML != 'X' && cell[x].innerHTML != 'O') {
          cell[x].innerHTML = mark;
          cell[x].style.cursor = "default";
          update_board(x, mark);
          cell[x].removeEventListener('click', arguments.callee);
          humanTurn = false;
          if (display_win_status() !== 0) {
            var message = display_win_status()
            document.getElementById("winStatus").innerHTML = message
            
            game_ended=true;

            for (let x = 0; x < 9; x++) {
              cell[x].style.pointer = 'default'
              cell[x].disabled = true;
            }
          }
        }
        // setTimeout(computer(), 1000); // wait 1 second before computer turn
      }

      if (!humanTurn && mark === choice_comp) {
        document.getElementById("turn").innerHTML= "Computer's Turn(X)"
        document.getElementById("turn").style.color = "#b6f245"
        setTimeout(()=>{
          computer();
          humanTurn = true;
          if (display_win_status() !== 0) {
            var message = display_win_status()
            document.getElementById("winStatus").innerHTML = message
            
            game_ended = true;

            for (let x = 0; x < 9; x++) {
              cell[x].disabled = true;
            }

          }
          document.getElementById("turn").innerHTML= "Your's Turn(O)"
          document.getElementById("turn").style.color = "#3aee70"
        },1000);
        
      }
    });
  }
}

function tie_status() {
  var fill;
  fill = 0;

  for (var i = 0; i < 3; i += 1) {
    for (var j = 0; j < 3; j += 1) {
      if (board[i][j] === "X" || board[i][j] === "O") {
        fill += 1;
      }
    }
  }

  if (fill === 9) {
    return true;
  }

  return ;
}

function win_status(mark) {
  for (var i = 0; i < 3; i += 1) {
    if (board[i][0] === board[i][1] && board[i][1] === board[i][2] && board[i][2] === mark) {
      return true;
    }
  }

  for (var j = 0; j < 3; j += 1) {
    if (board[0][j] === board[1][j] && board[1][j] === board[2][j] && board[2][j] === mark) {
      return true;
    }
  }

  if (board[0][0] === board[1][1] && board[1][1] === board[2][2] && board[2][2] === mark) {
    return true;
  }

  if (board[0][2] === board[1][1] && board[1][1] === board[2][0] && board[2][0] === mark) {
    return true;
  }

  return;
}


function display_win_status() {
  if (win_status(choice_comp)) {
    return "Computer won!";
  }
  if (win_status(choice_human)) {
    return "Congrats!";
  }
  if (tie_status()) {
    return "It's Tie!";
  }
  else {
    return 0
  }
}

const reset = document.getElementById("reset");
reset.addEventListener('click', function (e) {
  window.load()
})




function minimax(board, depth, isMaximizing) {
  var best_score, position, score;

  if (win_status(choice_comp)) {
    return 1;
  } else {
    if (win_status(choice_human)) {
      return -1;
    } else {
      if (tie_status()) {
        return 0;
      }
    }
  }

  if (isMaximizing) {
    best_score = -1000;

    for (var i = 0; i < 3; i += 1) {
      for (var j = 0; j < 3; j += 1) {
        if (board[i][j] !== "X" && board[i][j] !== "O") {
          position = board[i][j];
          board[i][j] = "X";
          score = minimax(board, depth + 1, false);
          board[i][j] = position;
          best_score = Math.max(score, best_score);
        }
      }
    }

    return best_score;
  } else {
    best_score = 1000;

    for (var i = 0; i < 3; i += 1) {
      for (var j = 0; j < 3; j += 1) {
        if (board[i][j] !== "X" && board[i][j] !== "O") {
          position = board[i][j];
          board[i][j] = "O";
          score = minimax(board, depth + 1, true);
          board[i][j] = position;
          best_score = Math.min(score, best_score);
        }
      }
    }
    return best_score;
  }
}

function computer() {
  var best_move, best_score, position, score;
  best_move = [0, 0];
  best_score = -1000;

  for (var i = 0; i < 3; i += 1) {
    for (var j = 0; j < 3; j += 1) {
      if (board[i][j] !== "X" && board[i][j] !== "O") {
        position = board[i][j];
        board[i][j] = "X";
        score = minimax(board, 0, false);
        board[i][j] = position;

        if (score > best_score) {
          best_score = score;
          best_move = [i, j];
        }
      }
    }
  }

  board[best_move[0]][best_move[1]] = "X";
  var x = 3 * best_move[0] + best_move[1]
  cell[x].innerHTML = 'X'
  cell[x].style.color="#b6f245";
  return 0;
}


for (var i = 0; i < 3; i += 1) {
  for (var j = 0; j < 3; j += 1) {
    x = 3 * i + j
    cell[x].innerHTML = board[i][j]
  }
}

fill_position(choice_human);
fill_position(choice_comp);
