var playerStats = ["test", 1, 1, 1, 1]
var enemyStats = ["broken", 2, 2, 2, 2]
//Name, Accuracy, Speed, Toughness, Score

var socket = io.connect('http://192.168.10.200:33336');
var action = "PENALTY"
var update = true

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
	socket.emit(
		'start'
	);
	update = true
	
	document.getElementById("timer").innerHTML = "3";
	setTimeout(function(){
		if(update == true){
			document.getElementById("timer").innerHTML = "2";
		}
        
    }, 1000);
	setTimeout(function(){
        if(update == true){
			document.getElementById("timer").innerHTML = "1";
		}
    }, 2000);
	setTimeout(function(){
        if(update == true){
			document.getElementById("timer").innerHTML = "SHOOT";
			action = "P1"
		}
    }, 3000);
	setTimeout(function(){
		if(update == true){
			document.getElementById("timer").innerHTML = "Your enemy shot first!";
			action = "P2"
		}
		
    }, 3100);
}

function shoot() {
	console.log("pew")
	socket.emit(
		'shoot'
	)
	if(action == "PENALTY"){
		document.getElementById("timer").innerHTML = "PENALTY";
		update = false
	}
	else if(action == "P1"){
		document.getElementById("timer").innerHTML = "You shot first!";
		update = false
	}
	
}

socket.emit(
	'sendData'
);

socket.on('getData', function(DBdata){
	console.log("Recieved Data!")
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
