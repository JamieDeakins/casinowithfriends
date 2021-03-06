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
			tdtag[n].onmouseover = hoverTrue;
			tdtag[n].onmouseout = hoverFalse;
	    }
	}
	// set all default colours
	hoverFalse();
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
	// define a global flag for when wheel is spinning
	window.wheelSpinning = false;

	init_WheelImage();
}

onload = init;

function init_WheelImage() {
	var r = document.querySelector(':root');
	var rs = getComputedStyle(r);

	// centre of wheel
	var xWheel = parseInt(rs.getPropertyValue('--Wheel_Left'));
	var yWheel = parseInt(rs.getPropertyValue('--Wheel_Top'));
	// ball dimensions
	var wWheel = parseInt(rs.getPropertyValue('--Wheel_W'));
	var hWheel = parseInt(rs.getPropertyValue('--Wheel_H'));

	r.style.setProperty('--Wheel_Centre_X', xWheel + wWheel/2 + "px");
	r.style.setProperty('--Wheel_Centre_Y', yWheel + hWheel/2 + "px");
	r.style.setProperty('--Ball_PosRadius', hWheel/4 + 1 + "px");

	setBallPos(0);
}

function hoverFalse() {
	
	var rouletteTable = document.getElementById("id_RouletteTable");
	var trtags = rouletteTable.getElementsByTagName("tr");
	var tdtag = null;

	for (var i=0; i<trtags.length; i++)
	{
	    tdtag = trtags[i].getElementsByTagName("td");
	    for (var n=0; n<tdtag.length;n++)
	    {
			var name = tdtag[n].innerHTML;
			if(name == '0') {
				tdtag[n].style.backgroundColor = 'OliveDrab';
			}
			else if(isRed(name) || name == "Red") {
				tdtag[n].style.backgroundColor = 'crimson';
			}
			else if(tdtag[n].classList.contains("cell_1") || name == "Black") {
				tdtag[n].style.backgroundColor = 'black';
			}
			else if(tdtag[n].classList.contains("cell_2V") || tdtag[n].classList.contains("cell_2H") || tdtag[n].classList.contains("cell_4")) {
				tdtag[n].style.backgroundColor = 'OliveDrab';
			}
			else if(tdtag[n].classList.contains("cell_thirds") || name == "Odd" || name == "Even") {
				tdtag[n].style.backgroundColor = 'OliveDrab';
			}
			tdtag[n].style.color = 'white';
			
		}
	}

}

function hoverThis(cell) {
	cell.style.backgroundColor = "rgba(255, 255, 255, 0.5)";
	cell.style.color = 'black';
}

function hoverTrue() {
	// update display (ignore any cells with no id)
	if(this.id != "") {
		hoverThis(this);

		/* highlight any numbers corrosponding to edge bets */ 
		var name = this.innerHTML;
		if(name == "1st 12") {
			for(var i = 1; i <= 12; i++) {
				hoverThis(document.getElementById(i.toString()))
			}
		}
		else if(name == "2nd 12") {
			for(var i = 13; i <= 24; i++) {
				hoverThis(document.getElementById(i.toString()))
			}
		}
		else if(name == "3rd 12") {
			for(var i = 25; i <= 36; i++) {
				hoverThis(document.getElementById(i.toString()))
			}
		}
		else if(name == "Odd") {
			for(var i = 1; i <= 36; i+=2) {
				hoverThis(document.getElementById(i.toString()))
			}
		}
		else if(name == "Even") {
			for(var i = 2; i <= 36; i+=2) {
				hoverThis(document.getElementById(i.toString()))
			}
		}
		else if(name == "Red") {
			for(var i = 1; i <= 36; i++) {
				if(isRed(i))
					hoverThis(document.getElementById(i.toString()))
			}
		}
		else if(name == "Black") {
			for(var i = 1; i <= 36; i++) {
				if(!isRed(i))
					hoverThis(document.getElementById(i.toString()))
			}
		}
	}
}

function clearBets() {
	cellArray = [];
	// clear bet array
	betArray.fill(0);
	// clear bet display list
	document.getElementById("id_YourBet").innerHTML = "";
	document.getElementById("id_SpinWheelMsg").innerHTML = "";
	document.getElementById("id_SpinWheelVal").innerHTML = "";
	document.getElementById("id_Winnings").innerHTML = "";
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
			document.getElementById("id_YourBet").innerHTML += betArray[i] +" @ " + id + "<br>";
		}
	}
	if(total > 0)
		document.getElementById("id_YourBet").innerHTML += "Total Spend: " + total;
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

function getNumberOfBets() {

}

function displayCoins() {
	// dimensions of coin
	var w = 25;
	var h = 25;

	document.getElementById("id_Coins").innerHTML = "";

	for (var i = 0; i < cellArray.length; i++) {
		var cell = cellArray[i].cell;

		// see how many coins we should draw
		var count = 0;
		for(var j = 0; j < i; j++) {
			if(cell === cellArray[j].cell)
				count++;
		}
		
		var rect = cell.getBoundingClientRect();
		//top dynamic ensures it moves when scrolling or if entire table moves for some reason
		var topDynamic = cell.offsetTop + document.getElementById('id_RouletteTable').offsetTop;
		var top = Math.floor(topDynamic + rect.height/2 - h/2) - count;
		var left = Math.floor(rect.left + rect.width/2 - w/2);
		// get coin image
		if(cellArray[i].val == 100)
			var coin = "coin_1pound.png";
		else if(cellArray[i].val == 10)
			var coin = "coin_10p.png";
		else
			var coin = "coin_1p.png";

		document.getElementById("id_Coins").innerHTML += "<img src=\"img\\" + coin + "\" width=\"" + w + "\" height=\"" + h + "\" style=\"position: absolute; top: " + top + "px; left: " + left + "px; pointer-events: none;\">";
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
	// dont allow bets to be placed whilst wheel is running
	if(wheelSpinning)
		return;
	// update display (ignore any cells with no id)
	if(this.id != "") {
		// add to list of cells that have been clicked
		addCell(this);
		displayBets();
	}
}

function removeBet() {
	// dont allow bets to be placed whilst wheel is running
	if(wheelSpinning)
		return;
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
function isBlack(val) {
	if(val >= 1 && val <= 36 && !isRed(val))
		return true;
	else 
		return false;
}

function getSpend() {
	var spent = 0;
	for (var i = 0; i < betArray.length; i++) {
		spent += betArray[i];
	}
	return spent;
}


function setBallPos(ang) {

	var r = document.querySelector(':root');
	var rs = getComputedStyle(r);

	// get ball dimensions
	var xBall = parseInt(rs.getPropertyValue('--Ball_X'));
	var yBall = parseInt(rs.getPropertyValue('--Ball_Y'));
	// get centre of wheel
	var xCentre = parseInt(rs.getPropertyValue('--Wheel_Centre_X'));
	var yCentre = parseInt(rs.getPropertyValue('--Wheel_Centre_Y'));
	// get ball dimensions
	var wBall = parseInt(rs.getPropertyValue('--Ball_W'));
	var hBall = parseInt(rs.getPropertyValue('--Ball_H'));
	// get ball radius to centre of wheel
	var rBall = parseInt(rs.getPropertyValue('--Ball_PosRadius'));

	// calculate x/y position of ball from angle
	var x = rBall * -Math.sin(ang);
	var y = rBall * Math.cos(ang);
	// set x/y position of ball
	r.style.setProperty('--Ball_X', xCentre - wBall/2 - x + "px");
	r.style.setProperty('--Ball_Y', yCentre - hBall/2 - y + "px");
}

function getWheelAngle(val) {
	// angle between each number
	dAng = 2 * Math.PI / 37;
	
	switch (val) {
		case 0: 	return 0;
		case 32: 	return 1*dAng;
		case 15: 	return 2*dAng;
		case 19: 	return 3*dAng;
		case 4: 	return 4*dAng;
		case 21: 	return 5*dAng;
		case 2: 	return 6*dAng;
		case 25: 	return 7*dAng;
		case 17: 	return 8*dAng;
		case 34: 	return 9*dAng;
		case 6: 	return 10*dAng;
		case 27: 	return 11*dAng;
		case 13: 	return 12*dAng;
		case 36: 	return 13*dAng;
		case 11: 	return 14*dAng;
		case 30: 	return 15*dAng;
		case 8: 	return 16*dAng;
		case 23: 	return 17*dAng;
		case 10: 	return 18*dAng;

		case 5: 	return 19*dAng;
		case 24: 	return 20*dAng;
		case 16: 	return 21*dAng;
		case 33: 	return 22*dAng;
		case 1: 	return 23*dAng;
		case 20: 	return 24*dAng;
		case 14: 	return 25*dAng;
		case 31: 	return 26*dAng;
		case 9: 	return 27*dAng;
		case 22: 	return 28*dAng;
		case 18: 	return 29*dAng;
		case 29: 	return 30*dAng;
		case 7: 	return 31*dAng;
		case 28: 	return 32*dAng;
		case 12: 	return 33*dAng;
		case 35: 	return 34*dAng;
		case 3: 	return 35*dAng;
		case 26: 	return 36*dAng;

		default:
			return 0;
	}
}

function stopWheel(winningNum) {
	// stop rotating wheel
	document.getElementById("id_WheelInner").classList.remove("rotateWheel");
}

function stopBall(winningNum) {

	var DEBUG = false;
	// stop rotating Ball
	document.getElementById("id_Ball").classList.remove("rotateBall");

	setBallPos(getWheelAngle(winningNum));
	
	// check player has enough balance
	var currentBalance = parseFloat(document.getElementById("id_Balance").innerHTML);
	var spent = getSpend();

	const WINNINGS_NUMBER 		= 36; 	// 36:1
	const WINNINGS_THIRDS 		= 3; 	// 3:1
	const WINNINGS_HALF 		= 2; 	// 2:1

	document.getElementById("id_SpinWheelMsg").innerHTML = "And the winning number is...";
	document.getElementById("id_SpinWheelVal").innerHTML = winningNum.toString();
	var winnings = 0;
	
	winningMessage = document.getElementById("id_Winnings");
	winningMessage.innerHTML = "";

	// 0-36
	if(betArray[winningNum] > 0) {
		var won = betArray[winningNum] * WINNINGS_NUMBER;
		winnings += won;
		if(DEBUG) winningMessage.innerHTML += "<br>You win " + won + "! It landed on your number";
	}
	// 1st third
	if(betArray[BUTTON_THIRD_1] > 0) {
		if(winningNum >= 1 && winningNum <= 12) {
			var won = betArray[BUTTON_THIRD_1] * WINNINGS_THIRDS;
			winnings += won;
			if(DEBUG) winningMessage.innerHTML += "<br>You win " + won + "! It landed in the first 12";
		}
	}
	// 2nd third
	if(betArray[BUTTON_THIRD_2] > 0) {
		if(winningNum >= 13 && winningNum <= 24) {
			var won = betArray[BUTTON_THIRD_2] * WINNINGS_THIRDS;
			winnings += won;
			if(DEBUG) winningMessage.innerHTML += "<br>You win " + won + "! It landed in the second 12";
		}
	}
	// 3rd third
	if(betArray[BUTTON_THIRD_3] > 0) {
		if(winningNum >= 25 && winningNum <= 36) {
			var won = betArray[BUTTON_THIRD_3] * WINNINGS_THIRDS;
			winnings += won;
			if(DEBUG) winningMessage.innerHTML += "<br>You win " + won + "! It landed in the third 12";
		}
	}
	// Odd
	if(betArray[BUTTON_ODD] > 0) {
		if(winningNum > 0 && isOdd(winningNum)) {
			var won = betArray[BUTTON_ODD] * WINNINGS_HALF;
			winnings += won;
			if(DEBUG) winningMessage.innerHTML += "<br>You win " + won + "! It landed on an odd number";
		}
	}
	// Even
	if(betArray[BUTTON_EVEN] > 0) {
		if(winningNum > 0 && !isOdd(winningNum)) {
			var won = betArray[BUTTON_EVEN] * WINNINGS_HALF;
			winnings += won;
			if(DEBUG) winningMessage.innerHTML += "<br>You win " + won + "! It landed on an even number";
		}
	}
	// Red
	if(betArray[BUTTON_RED] > 0) {
		if(winningNum > 0 && isRed(winningNum)) {
			var won = betArray[BUTTON_RED] * WINNINGS_HALF;
			winnings += won;
			if(DEBUG) winningMessage.innerHTML += "<br>You win " + won + "! It landed on a red number";
		}
	}
	// Black
	if(betArray[BUTTON_BLACK] > 0) {
		if(winningNum > 0 && !isRed(winningNum)) {
			var won = betArray[BUTTON_BLACK] * WINNINGS_HALF;
			winnings += won;
			if(DEBUG) winningMessage.innerHTML += "<br>You win " + won + "! It landed on a black number";
		}
	}
	if(DEBUG) winningMessage.innerHTML += "<h6>Winnings = " + winnings + "<br>Spent = " + spent + "</h6>";

	var total = winnings - spent;
	if(total < 0)
		winningMessage.innerHTML += "<h1>You lose " + total + "</h1><h2>Better luck next time!</h2>";
	
	// make sure it includes the + symbol
	if (total > 0)
		winningMessage.innerHTML += "<h1>You win " + total + "!</h1><h2>Congratulations!</h2>";
	
	// make sure it includes the + symbol
	if (spent > 0 && total == 0)
		winningMessage.innerHTML += "<h1>You broke even!</h1><h2>Try again!</h2>";
	
	document.getElementById("id_Balance").innerHTML = currentBalance + total;
	wheelSpinning = false;
}

function spinWheel() {

	if(wheelSpinning) 
		return;
	// check player has enough balance
	var currentBalance = parseFloat(document.getElementById("id_Balance").innerHTML);

	if(getSpend() > currentBalance) {
		winningMessage = document.getElementById("id_Winnings");
		winningMessage.innerHTML = "You don't have enough moolahs!";
		return;
	}


	var r = document.querySelector(':root');
	var rs = getComputedStyle(r);

	// calculate x/y position of ball from angle
	var prevWinningNumber = parseInt(document.getElementById("id_SpinWheelVal").innerHTML);
	var prevAngle = getWheelAngle(prevWinningNumber);
	

	// get ball dimensions
	var wBall = parseInt(rs.getPropertyValue('--Ball_W'));
	var hBall = parseInt(rs.getPropertyValue('--Ball_H'));
	// get ball radius to centre of wheel
	var rBall = parseInt(rs.getPropertyValue('--Ball_PosRadius'));
	
	var x = rBall * -Math.sin(prevAngle);
	var y = rBall * Math.cos(prevAngle);

	r.style.setProperty('--Ball_RotateOrig_X', wBall/2 + x + "px");
	r.style.setProperty('--Ball_RotateOrig_Y', hBall/2 + y + "px");
	



	var winningNum = getRandomInt(36+1);

	// set end angle of animation
	var ang = getWheelAngle(winningNum);
	r.style.setProperty('--Ball_EndAngle', -ang + prevAngle + "rad");


	// animate wheel
	wheelSpinning = true;
	document.getElementById("id_WheelInner").classList.add("rotateWheel");
	document.getElementById("id_Ball").classList.add("rotateBall");
	setTimeout(stopWheel.bind(null, winningNum), 3000);
	setTimeout(stopBall.bind(null, winningNum), 4000);
}

	//localStorage.setItem("bets", JSON.stringify(res));
/*
	if(localStorage.getItem("bets" === null))
		return false;
	
	localStorage.removeItem("bets");
*/