var playerStats = []
var enemyStats = []
//Name, Accuracy, Speed, Toughness, Score

var socket = io.connect('http://192.168.10.200:33336');
var action = "PENALTY"
var update = true
var gameEnd = false

var win = document.getElementById('win');
var ded = document.getElementById('ded');
var bang = document.getElementById('bang');

var delay = 3300

function loadData() {
	console.log("Uploading to UI")
	document.getElementById("playerName").innerHTML = playerStats[0];
	document.getElementById("playerAccuracy").innerHTML = playerStats[1];
	document.getElementById("playerSpeed").innerHTML = playerStats[2];
	document.getElementById("playerToughness").innerHTML = playerStats[3];
	document.getElementById("playerScore").innerHTML = playerStats[4];
	
	document.getElementById("enemyName").innerHTML = enemyStats[0];
	document.getElementById("enemyAccuracy").innerHTML = enemyStats[1];
	document.getElementById("enemySpeed").innerHTML = enemyStats[2];
	document.getElementById("enemyToughness").innerHTML = enemyStats[3];
	document.getElementById("enemyScore").innerHTML = enemyStats[4];

}



/*function sendData() {
	for(var d = 0; d < playerStats.length; d++){
		var asd = "'" + playerStats[d] + "'"
		socket.emit(
			'loadGuys', asd
		);
		
		console.log(d)
	}
	playerStats[5] += 1
	
	
}*/

function addToDB() {
	playerStats.push('add')
	enemyStats.push('add')
	
	socket.emit(
		'loadGuys', playerStats
	);
	
	socket.emit(
		'loadGuys', enemyStats
	);
	
	playerStats.pop()
	enemyStats.pop()
}

function updateDB() {
	playerStats.push('update')
	enemyStats.push('update')
	
	socket.emit(
		'loadGuys', playerStats
	);
	
	socket.emit(
		'loadGuys', enemyStats
	);
	
	playerStats.pop()
	enemyStats.pop()
}

function recieveData() {
	socket.emit(
		'sendData'
	);
}


/*window.onload = function() {	//waits for entire code to be downloaded

  

  //Check for socket connection

  /*document.getElementById('btn').addEventListener(
    'click',
    function() {
          socket.emit(
              'loadGuys', playerStats[5]
          );
		  console.log("sent command")
      }
  );
  
  
};*/

function start() {
	if(gameEnd == false){
		gameEnd = true
		socket.emit(
			'start'
		);
		update = true
		action = "PENALTY"
		document.getElementById("timer").innerHTML = "3";
		document.getElementById("pic").src = "images/3.png";
		setTimeout(function(){
			if(update == true){
				document.getElementById("timer").innerHTML = "2";
				document.getElementById("pic").src = "images/2.png";
			}
			
		}, 1000);
		setTimeout(function(){
			if(update == true){
				document.getElementById("timer").innerHTML = "1";
				document.getElementById("pic").src = "images/1.png";
			}
		}, 2000);
		setTimeout(function(){
			if(update == true){
				document.getElementById("timer").innerHTML = "SHOOT";
				document.getElementById("pic").src = "images/shoot.png";
				action = "P1"
			}
		}, 3000);
		setTimeout(function(){
			if(update == true && action != "PENALTY"){
				document.getElementById("timer").innerHTML = "Your enemy shot first!";
				document.getElementById("pic").src = "images/P2_shoot.png";
				bang.play();
				setTimeout(function(){
					document.getElementById("pic").src = "images/lose.png";
					ded.play();
				}, 600)
				action = "P2"
			}
			gameEnd = false
		}, delay);
	}
}

function shoot() {
	if(gameEnd == true){
		console.log("pew")
		socket.emit(
			'shoot'
		)
		if(action == "PENALTY"){
			document.getElementById("timer").innerHTML = "PENALTY";
			document.getElementById("pic").src = "images/penalty.png";
			update = false
		}
		else if(action == "P1"){
			document.getElementById("timer").innerHTML = "You shot first!";
			document.getElementById("pic").src = "images/P1_shoot.png";
			bang.play();
			setTimeout(function(){
				document.getElementById("pic").src = "images/win.png";
				win.play();
			}, 600)
			update = false
			delay -= 10
		}
		gameEnd = false
	}
}

socket.emit(
	'sendData'
);

socket.on('getData', function(DBdata){
	console.log("Recieved Data!")
	var playerStatsNew = playerStats
	
	playerStats[0] = DBdata[0].player_name
	playerStats[1] = DBdata[0].accuracy
	playerStats[2] = DBdata[0].speed
	playerStats[3] = DBdata[0].toughness
	playerStats[4] = DBdata[0].score
	
	enemyStats[0] = DBdata[1].player_name
	enemyStats[1] = DBdata[1].accuracy
	enemyStats[2] = DBdata[1].speed
	enemyStats[3] = DBdata[1].toughness
	enemyStats[4] = DBdata[1].score
	
	loadData();
})

socket.on('PENALTY', function(penalty){
	playerStats[4] += penalty
	updateDB()
})
