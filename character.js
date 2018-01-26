var playerStats = []
var enemyStats = []
//Name, Accuracy, Speed, Toughness, Score, Username
//Input Doesnt work
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
	console.log(playerStats)
	socket.emit(
		'loadGuys', playerStats
	);
	
	socket.emit(
		'loadGuys', enemyStats
	);
	
	setTimeout(function(){
		playerStats.pop()
		enemyStats.pop()
	}, 500);
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
		'sendData', login
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

function start(login) {
	console.log(login)
	if(gameEnd == false){
		gameEnd = true
		socket.emit(
			'start', login
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

function shoot(login) {
	console.log(login)
	if(gameEnd == true){
		console.log("pew")
		socket.emit(
			'shoot', login
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

function user_login(){
	var question = prompt("Do you have an account? Yes/No")
	question.toLowerCase();
	
	switch(question){
		case "yes":
			var login = prompt("Input Username:")
			socket.emit(
				'sendData', login
			);
		case "no":
			var names = [
			"Clint Eastwood", "Marty", "Doc", "Dead-eye", "Pinhead", 
			"Dirty Dan", "Woody", "Optimus", "Wild Bob", "Shades"]
			var rand = Math.random();
			rand *= names.length;
			rand = Math.floor(rand);
			
			var limit = 3
			var roll = "yes"
			var avaliable;
			var atext = "Username:"
			
			while(avaliable == "no"){
				playerStats[5] = undefined
				playerStats[5] = prompt(atext)
				
				if(playerStats[5] != undefined){
					var asd = [playerStats[5], "check"]
					socket.emit(
						'sendData', asd
					)
					socket.on('empty', function(){
						avaliable = "yes"
						break;
					})
					socket.on('filled', function(){
						atext = "Username Taken. Input a differnet one:"
					})
				}
			}
			
			playerStats[0] = prompt("Character's Name:")
			while(roll == "yes" && limit != 0){
				playerStats[1] = Math.floor((Math.random() * 100) + 1);
				playerStats[2] = Math.floor((Math.random() * 100) + 1);
				playerStats[3] = Math.floor((Math.random() * 10) + 1);
				roll = prompt("Accuracy: " + playerStats[1] + 
							  " | Speed: " + playerStats[2] + 
							  " | Toughness: " + playerStats[3] + 
							  " | " + limit + " Rerolls left. Reroll? Yes/No:")
				roll.toLowerCase();
				limit -= 1
			}
			playerStats[4] = 0
			
			
			enemyStats[0] = names[rand];
			enemyStats[1] = Math.floor((Math.random() * 100) + 1);
			enemyStats[2] = Math.floor((Math.random() * 100) + 1);
			enemyStats[3] = Math.floor((Math.random() * 10) + 1);
			enemyStats[4] = 0
			enemyStats[5] = playerStats[5]
			addToDB();
			loadData();
			login = playerStats[5]
	}
}

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


user_login();