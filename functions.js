function init() {
	var rouletteTable = document.getElementById("id_RouletteTable");
	var trtags = rouletteTable.getElementsByTagName("tr");
	var tdtag = null;

	for (var i=0; i<trtags.length; i++)
	{
	    tdtag = trtags[i].getElementsByTagName("td");
	    for (var n=0; n<tdtag.length;n++)
	    {
			tdtag[n].onclick = setBet;
			tdtag[n].oncontextmenu = removeBet;
			if(tdtag[n].innerHTML == '0')
				tdtag[n].style.backgroundColor = 'green';
			else if(isRed(tdtag[n].innerHTML))
				tdtag[n].style.backgroundColor = 'red';
			//else if (Number.isInteger(tdtag[n].innerHTML))
			//	tdtag[n].style.backgroundColor = 'black';
	    }
	}
	// define global array to store which cells have been pressed
	cellArray = [];
	// define a global array to store bets (37 numbers + 7 buttons)
	betArray = new Array(37+7);
	betArray.fill(0);
	// define button constants
	BUTTON_THIRD_1 	= 37;
	BUTTON_THIRD_2 	= 38;
	BUTTON_THIRD_3 	= 39;
	BUTTON_ODD 		= 40;
	BUTTON_RED 		= 41;
	BUTTON_BLACK 	= 42;
	BUTTON_EVEN 	= 43;

}

onload = init;

function clearBets() {
	cellArray = [];
	// clear bet array
	betArray.fill(0);
	// clear bet display list
	document.getElementById("id_YourBet").innerHTML = "";
	// clear coin images
	document.getElementById("id_Coins").innerHTML = "";
}

function displayBetArray() {
	var total = 0;

	document.getElementById("id_YourBet").innerHTML = "";
	for (var i = 0; i < betArray.length; i++) {
		if(betArray[i] != 0) {
			var id;
			if(i >= 0 && i <= 36) 			id = i;
			else if(i == BUTTON_THIRD_1) 	id = "1st 12";
			else if(i == BUTTON_THIRD_2) 	id = "2nd 12";
			else if(i == BUTTON_THIRD_3) 	id = "3rd 12";
			else if(i == BUTTON_ODD) 		id = "Odd";
			else if(i == BUTTON_RED) 		id = "Red";
			else if(i == BUTTON_BLACK) 		id = "Black";
			else if(i == BUTTON_EVEN) 		id = "Even";
			else {
				alert("Error: Unknown id!");
				return;
			}
			total += betArray[i];
			document.getElementById("id_YourBet").innerHTML += id + " @ " + betArray[i] + "<br>";
		}
	}
	if(total > 0)
		document.getElementById("id_YourBet").innerHTML += "Total: " + total;
}

function addBetToBetArray(id, bet) {
	var i;
	if(id >= 0 && id <= 36) i = id;
	else if(id == "1st12") 	i = BUTTON_THIRD_1;
	else if(id == "2nd12") 	i = BUTTON_THIRD_2;
	else if(id == "3rd12") 	i = BUTTON_THIRD_3;
	else if(id == "odd") 	i = BUTTON_ODD;
	else if(id == "red") 	i = BUTTON_RED;
	else if(id == "black") 	i = BUTTON_BLACK;
	else if(id == "even") 	i = BUTTON_EVEN;
	else {
		alert("Error: Unknown id!");
		return;
	}
	betArray[i] += bet;
	if(betArray[i] < 0) betArray[i] = 0;

}

function displayBets() {
	
	// clear bet array
	betArray.fill(0);

	for (var i = 0; i < cellArray.length; i++) {
		// split up id to determine which bets were made
		var res = cellArray[i].cell.id.split(":");
		// e.g. if we click 2 items, bet is halved
		var bet = cellArray[i].val / res.length;
		for (var j = 0; j < res.length; j++) {
			addBetToBetArray(res[j], bet);
		}
	}
	/* DEBUG - view betArray
	document.getElementById("id_YourBet").innerHTML = "";
	for(var i=0; i<betArray.length; i++)
		document.getElementById("id_YourBet").innerHTML += i + " = " + betArray[i] + "<br>";
	*/
	displayBetArray();
}

function displayCoins() {
	// dimensions of coin
	var w = 25;
	var h = 25;

	document.getElementById("id_Coins").innerHTML = "";

	for (var i = 0; i < cellArray.length; i++) {
		var cell = cellArray[i].cell;
		var rect = cell.getBoundingClientRect();
		var top = Math.floor(rect.top + rect.height/2 - h/2);
		var left = Math.floor(rect.left + rect.width/2 - w/2);

		document.getElementById("id_Coins").innerHTML += "<img src=\"img\\coin_small.png\" width=\"" + w + "\" height=\"" + h + "\" style=\"position: absolute; top: " + top + "px; left: " + left + "px; pointer-events: none;\">";
	}
}

function addCell(cell) {
	let bet = { "cell": cell, "val": getBetSize() }
	cellArray.push(bet);
	displayCoins();
}


function removeCell(cell) {
	for (var i = 0; i < cellArray.length; i++) {
		if(cellArray[i].cell == cell) {
			cellArray.splice(i, 1);
			i--;
		}
	}
	displayCoins();
}

function setBet() {
	// update display (ignore any cells with no id)
	if(this.id != "") {
		// add to list of cells that have been clicked
		addCell(this);
		displayBets();
	}
}

function removeBet() {
	// (ignore any cells with no id)
	if(this.id != "") {
		// remove from list of cells that have been clicked
		removeCell(this);
		displayBets();
	}
	// return false to prevent right click menu from showing
	return false;
}

function setBetSize(val) {
	document.getElementById("id_BetSize").innerHTML = val;
}

function getBetSize() {
	return document.getElementById("id_BetSize").innerHTML;
}




function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}
function isOdd(val) {
	return val % 2;
}
function isRed(val) {
	if(val == 1 || val == 3 || val == 5 || val == 7 || val == 9 || val == 12 || val == 14 || val == 16 || val == 18 
	|| val == 19 || val == 21 || val == 23 || val == 25 || val == 27 || val == 30 || val == 32 || val == 34 || val == 36)
		return true;
	else
		return false;
}

function spinWheel() {

	var currentBalance = parseFloat(document.getElementById("id_Balance").innerHTML);

	winningMessage = document.getElementById("id_Winnings");
	winningMessage.innerHTML = "";

	var spent = 0;
	for (var i = 0; i < betArray.length; i++) {
		spent += betArray[i];
	}

	if(spent > currentBalance) {
		winningMessage.innerHTML = "You don't have enough moolahs!";
		return;
	}

	const WINNINGS_NUMBER 		= 36; 	// 36:1
	const WINNINGS_THIRDS 		= 3; 	// 3:1
	const WINNINGS_HALF 		= 2; 	// 2:1

	var winningNum = getRandomInt(36+1);
	document.getElementById("id_SpinWheelVal").innerHTML = "And the winning number is...<br><h1>" + winningNum.toString() + "</h1>";
	
	
	var winnings = 0;
	
	// 0-36
	if(betArray[winningNum] > 0) {
		var won = betArray[winningNum] * WINNINGS_NUMBER;
		winnings += won;
		winningMessage.innerHTML += "<br>You win " + won + "! It landed on your number";
	}
	// 1st third
	if(betArray[BUTTON_THIRD_1] > 0) {
		if(winningNum >= 1 && winningNum <= 12) {
			var won = betArray[BUTTON_THIRD_1] * WINNINGS_THIRDS;
			winnings += won;
			winningMessage.innerHTML += "<br>You win " + won + "! It landed in the first 12";
		}
	}
	// 2nd third
	if(betArray[BUTTON_THIRD_2] > 0) {
		if(winningNum >= 13 && winningNum <= 24) {
			var won = betArray[BUTTON_THIRD_2] * WINNINGS_THIRDS;
			winnings += won;
			winningMessage.innerHTML += "<br>You win " + won + "! It landed in the second 12";
		}
	}
	// 3rd third
	if(betArray[BUTTON_THIRD_3] > 0) {
		if(winningNum >= 25 && winningNum <= 36) {
			var won = betArray[BUTTON_THIRD_3] * WINNINGS_THIRDS;
			winnings += won;
			winningMessage.innerHTML += "<br>You win " + won + "! It landed in the third 12";
		}
	}
	// Odd
	if(betArray[BUTTON_ODD] > 0) {
		if(winningNum > 0 && isOdd(winningNum)) {
			var won = betArray[BUTTON_ODD] * WINNINGS_HALF;
			winnings += won;
			winningMessage.innerHTML += "<br>You win " + won + "! It landed on an odd number";
		}
	}
	// Even
	if(betArray[BUTTON_EVEN] > 0) {
		if(winningNum > 0 && !isOdd(winningNum)) {
			var won = betArray[BUTTON_EVEN] * WINNINGS_HALF;
			winnings += won;
			winningMessage.innerHTML += "<br>You win " + won + "! It landed on an even number";
		}
	}
	// Red
	if(betArray[BUTTON_RED] > 0) {
		if(winningNum > 0 && isRed(winningNum)) {
			var won = betArray[BUTTON_RED] * WINNINGS_HALF;
			winnings += won;
			winningMessage.innerHTML += "<br>You win " + won + "! It landed on a red number";
		}
	}
	// Black
	if(betArray[BUTTON_BLACK] > 0) {
		if(winningNum > 0 && !isRed(winningNum)) {
			var won = betArray[BUTTON_BLACK] * WINNINGS_HALF;
			winnings += won;
			winningMessage.innerHTML += "<br>You win " + won + "! It landed on a black number";
		}
	}
	var total = winnings - spent;
	winningMessage.innerHTML += "<h6>Winnings = " + winnings + "<br>Spent = " + spent + "</h6><h1>Total = ";
	// make sure it includes the + symbol
	if (total > 0) winningMessage.innerHTML += '+';
	winningMessage.innerHTML += total + "</h1>";
	
	document.getElementById("id_Balance").innerHTML = currentBalance + total;
	

}



	//localStorage.setItem("bets", JSON.stringify(res));
/*
	if(localStorage.getItem("bets" === null))
		return false;
	
	localStorage.removeItem("bets");
*/