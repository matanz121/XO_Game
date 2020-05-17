var currentPlayer = "o";
var downloadTimer;
var xMax = 0;
var oMax = 0;
var rows;
var cols;

function buildBoard()
{
	rows=document.getElementById("selRowNum").value;
	cols=document.getElementById("selColNum").value;
    var board = document.getElementById("board");
    var xname = document.getElementById("xname").value;
    var oname = document.getElementById("oname").value;
    if(rows == "" || cols == "")
    {
        alert('please insert rows and cols');
        return
    }
    if(xname == "" || oname == "")
    {
		alert('Please insert X-Name & O-Name')
		return
    }
	//clear board
	if (board.hasChildNodes() )
	{
		document.getElementById('oscore').value = 0
		document.getElementById('xscore').value = 0
		board.removeChild(board.firstChild); 
    }
	board.style.display = "block";
	sayHello(xname, oname);

	disableInput();

	//create new table
	var table=document.createElement("table");
	board.appendChild(table);
	//add rows and columns
	var rowNum;
	var colNum;
	for (rowNum=0;rowNum<rows;rowNum++)
	{
		var row = document.createElement("tr");
		table.appendChild(row);
		for(colNum=0;colNum<cols;colNum++)
		{
			var cell = document.createElement("td");
			row.appendChild(cell);
			cell.innerHTML = "";
			cell.onclick=function() {dosomething()};
		}
	}
	turn() // start the game
}

function disableInput()
{
	inp = document.getElementsByTagName('input')
	for (var i = 0; i < inp.length; i++)
	{
		inp[i].disabled = true;
	}
}

function dosomething()
{
 var cell=event.srcElement;
  if (cell.innerHTML == "")
  {
	  cell.innerHTML = currentPlayer.toUpperCase();
	  cell.style.background = document.getElementsByName(currentPlayer + 'color')[0].value
	  if(checkTheBoard()) return;
	  turn()
  }
  else
  {
	  alert('this cell already taken!')
	  return;
  }
}

function turn()
{
	clearInterval(downloadTimer); // stop the timer & clear
	document.getElementById("countdown" + currentPlayer).innerHTML = "";
	document.getElementById(currentPlayer + "Box").classList.remove("turn");
	currentPlayer == "x" ? currentPlayer = "o" : currentPlayer = "x";
	document.getElementById(currentPlayer + "Box").classList.add("turn");
	Timer();
}


function sayHello(xname, oname)
// Say hello to the players
{
	var time_in_day = "night";
	var time = new Date();
	var hour = time.getHours();
	if (hour > 4) time_in_day = "morning";
    if (hour > 11) time_in_day = "afternoon"
	if (hour > 17) time_in_day = "evening"
	var hello = "Good " + time_in_day + " " + xname + " and " + oname + ", its : ";
	hello += time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', second: 'numeric', hour12: true });
	document.getElementById("say_hello").innerHTML = hello;
	toggleShow('boardsize');
	toggleShow('say_hello');
}


function toggleShow(elmentid) {
    // toggle display of elements by id
    var x = document.getElementById(elmentid);
	if (x.style.display === "none") 
	{
        x.style.display = "block";
	} 
	else 
	{
        x.style.display = "none";
    }
}

function checkTheBoard() {
    var board = document.getElementsByTagName('td');
    var gamefull = true;
    // check [-]
    var combo = [];
	for (var i = 0; i < rows; i++) 
	{
		for (var y = 0; y < cols; y++) 
		{
            //check if the cell match the player
			if (board[i * cols + y].innerHTML == currentPlayer.toUpperCase()) 
			{
                // add to combo array
                combo.push(board[i * cols + y]);
			} else 
			{
                combo = [];
            }
            // check if there is a free cell
			if(board[i * cols + y].innerHTML == "")
			{
                gamefull = false;
            }
            if (combo.length >= 4) {
                markAsCombo(combo, 3)
            }
        }
        combo = [];
    }

    // check [|]
	for (var i = 0; i < cols; i++) 
	{
		for (var y = 0; y < rows; y++) 
		{
            //check if the cell match the player
			if (board[i + cols * y].innerHTML == currentPlayer.toUpperCase()) 
			{
                combo.push(board[i + cols * y]);
			} 
			else 
			{
                combo = [];
            }
            if (combo.length >= 4) {
                markAsCombo(combo, 4)
            }
        }
        combo = [];
    }

    // check [\]
	for (var i = 0; i < rows; i++) 
	{
		for (var y = 0; y < cols; y++) 
		{
            //check if the cell match the player & check if the \ is longer then 3
            var long = Math.min(rows - i, cols - y);
			if (board[i * cols + y].innerHTML == currentPlayer.toUpperCase() && long >= 4) 
			{
                combo.push(board[i * cols + y]);
                // run for rest of \
				for (var z = 1; z < long; z++) 
				{
					if (board[(i + z) * cols + y + z].innerHTML == currentPlayer.toUpperCase()) 
					{
                        combo.push(board[(i + z) * cols + y + z]);
                    }
					else 
					{
                        combo = [];
                    }
					if (combo.length >= 4) 
					{
                        markAsCombo(combo, 5)
                    }
                }
            } else {
                combo = [];
            }
        }
        combo = [];
    }

    // check [/]
	for (var i = rows - 1; i >= 0; i--) 
	{
		for (var y = 0; y < cols; y++) 
		{
            //check if the cell match the player & check if the \ is longer then 3
            var long = Math.min(i + 1, cols - y);
			if (board[i * cols + y].innerHTML == currentPlayer.toUpperCase() && long >= 4) 
			{
                combo.push(board[i * cols + y]);
                // run for rest of \
				for (var z = 1; z < long; z++) 
				{
					if (board[(i - z) * cols + y + z].innerHTML == currentPlayer.toUpperCase()) 
					{
                        combo.push(board[(i - z) * cols + y + z]);
                    }
					else 
					{
                        combo = [];
                    }
					if (combo.length >= 4) 
					{
                        markAsCombo(combo, 6)
                    }
                }
            } else {
                combo = [];
            }
        }
        combo = [];
    }

	if(gamefull)
	{
        gameOver();
        return true;
    }
    return false;
}

function markAsCombo(comboArray, type)
{
	newScore = true;
	for (var i = 0; i < comboArray.length; i++)
	{
		if(comboArray[i].style.boxShadow == "rgb(255, 235, 59) 0px 0px 5." + type + "px 5px inset")
		{
			newScore = false;
		}
		else
		{
			comboArray[i].style.boxShadow = "rgb(255, 235, 59) 0px 0px 5." + type + "px 5px inset";
		}
	}
	if (newScore == true)
	{
		// add 1 point + show to the player
		alert(document.getElementById(currentPlayer + "name").value + ' won 1 point :)')
		document.getElementById(currentPlayer + 'score').value = parseInt(document.getElementById(currentPlayer + 'score').value) + 1;
	}

}

function Timer()
{
	var timer = 10;
	downloadTimer = setInterval(function() {
		document.getElementById("countdown" + currentPlayer).innerHTML = timer + " seconds remaining";
		timer -= 1;
		if(timer < 0)
		{
			clearInterval(downloadTimer);
			turn();
		}
    }, 1000);
}

function gameOver()
{
	// clear the timer
	clearInterval(downloadTimer);
	document.getElementById("countdown" + currentPlayer).innerHTML = "";
	// remove the highlight of the turn 
	document.getElementById(currentPlayer + "Box").classList.remove("turn");
	var tmpPlayer; // in order to save the score of the other player
	currentPlayer == "x" ? tmpPlayer = "o" : tmpPlayer = "x";
	if(document.getElementById(currentPlayer + 'score').value == document.getElementById(tmpPlayer + 'score').value)
	{
		alert('The game ended in a draw')
	}
	else if(document.getElementById(currentPlayer + 'score').value > document.getElementById(tmpPlayer + 'score').value)
	{
		alert(currentPlayer.toLocaleUpperCase() + ' Win the game :)')
	}
	else
	{
		alert(tmpPlayer.toLocaleUpperCase() + ' Win the game :)')
	}

	toggleShow('boardsize'); // remove the board
	toggleShow('say_hello'); // remove the hello and change to the menu list

	x = document.getElementById('start');
    x.value = "Restart game";
	x.disabled = false;

}