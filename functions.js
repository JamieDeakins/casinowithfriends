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
	    }
	}


}



function setBet() {
	
	var w = 25;
	var h = 25;

	var rect = this.getBoundingClientRect();
	var top = Math.floor(rect.top + rect.height/2 - h/2);
	var left = Math.floor(rect.left + rect.width/2 - w/2);

	coins = document.getElementById("id_Coins"); 
	//"&ltimg src&equals&quotimg&solcoin&lowbarsmall&periodpng&quot&gt";// width="25" height="25" style="position: absolute; top: 200px; left: 80px; pointer-events: none;">"
	coins.innerHTML += "<img src=\"img\\coin_small.png\" width=\"" + w + "\" height=\"" + h + "\" style=\"position: absolute; top: " + top + "px; left: " + left + "px; pointer-events: none;\">";

	//var encodedStr = rawStr.replace(/[\u00A0-\u9999<>\&]/g, function(i) { return '&#'+i.charCodeAt(0)+';'; });

	var rawid = this.id;
	var res = rawid.split(":");
	// e.g. if we click 2 items, bet is halved
	var bet = 1*getBetSize() / res.length;
	// clear
	document.getElementById("id_YourBet").innerHTML = "";
	// add bets
	for (var i = 0; i < res.length; i++) {
		document.getElementById("id_YourBet").innerHTML += res[i] + " @ " + bet + "<br>";
	}
}

function setBetSize(val) {
	document.getElementById("id_BetSize").innerHTML = val;
}

function getBetSize() {
	return document.getElementById("id_BetSize").innerHTML;
}

// function removeName() {
// 	if(localStorage.getItem("name") === null) return false;
// 	localStorage.removeItem("name");
// 	document.getElementById("yourname").value = "";
// };
//
/*
function drawTable() {

	var content = document.getElementById("id_RouletteTable").innerHTML;
	content += "<tbody>";
	content += "<tr>";
	content += "<td id="3">3</td>";
	content += "<td id="3:6"></td>";
	content += "</tr>";
	content += "</tbody>";
	
	document.getElementById("id_RouletteTable").innerHTML = "<tbody>";
	document.getElementById("id_RouletteTable").innerHTML = "<tr>";


	for (var i = 3; i < 12; i+=3) {
		document.getElementById("id_RouletteTable").innerHTML = 
	}
}*/
/*
;</script>
						<!--<tr>
							<td id="3">3</td>
							<td id="3:6"></td>
							<td id="6">6</td>
							<td id="6:9"></td>	

*/

onload = init;



function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

function spinWheel() {
	var val = getRandomInt(36+1);
	document.getElementById("id_SpinWheelVal").innerHTML = "Lucky number: " + val.toString();
}