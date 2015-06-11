//server-side
// location: C:\Users\j\Documents\A_mySTUDY\spa\chat_sochet
// 

var express = require('express'),
	app = express(),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server),
	mongoose = require('mongoose'),
	users = {} ;


var port = 3030;
server.listen(port); 
console.log('Listening on port', port);


mongoose.connect('mongodb://localhost/chat', function(err){
	if(err){
		console.log(err);

	}else{
		console.log("Good @ Connected to mongoDB!");
	}
});

//Binary JSON (called.. BSON)
//Store data in 'Documents' with special format (BSON) -> MongoDB
var chatSchema = mongoose.Schema({
	userid: String ,
	msg: String ,
	current_hour: String,
	current_min: String
});

var Chat = mongoose.model('Message', chatSchema);




app.get('/', function(req, res){
	//res.sendFile(__dirname + '/index.html'); //tester 
	res.sendFile(__dirname + '/spa-ui.html');
});

//include static css directory...
app.use("/css", express.static(__dirname + '/css')); 
app.use("/js", express.static(__dirname + '/js')); 
//app.use("/bootstrap", express.static(__dirname + '/bootstrap')); //connect bootstrap from online
app.use("/img", express.static(__dirname + '/img')); 




//receive server-side
io.sockets.on('connection', function(socket){
	
	Chat.find({}, function(err, docs){
		if(err) throw err;
		socket.emit('load prev msgs', docs); //pass 'docs' to the new user who entered the room
	});

	socket.on('new user', function(data, callback){
		if(data in users){ //check if the same nickname is already taken
			callback(false);

		}else{
			callback(true);
			socket.nickname = data; //each user has individual socket
			
			users[socket.nickname] = socket;
			//userIdList.push(socket.nickname);
			
			updateNicknames();
		}
	});





	function updateNicknames(){
		io.sockets.emit('usernames', Object.keys(users) );
	}
	



	socket.on('send message', function(data){
		var date = new Date();

		var trimmedMsg = data.trim();


		// when the first 3 characters are '/w ' forwardslash-w-and-space,
		// treat the message as PRIVATE
		if(data.substring(0,3) === '/p '){ //private message
			trimmedMsg = trimmedMsg.substring(3); //remove first three chars
			
			var privateMsgTo = trimmedMsg.substr(0, trimmedMsg.indexOf(' ')); //take recepient
			trimmedMsg = trimmedMsg.substr(trimmedMsg.indexOf(' ')+1);
			console.log('this is private msg to: ' + privateMsgTo); //test 


			if(privateMsgTo in users){
				io.sockets.emit('private message', {msg: trimmedMsg,
												 userid: socket.nickname,
												 recepient: privateMsgTo,
												 recepientInRoom: true,
												 current_hour: date.getHours(),
												 current_min: date.getMinutes()
												});  //send including me
			}else{
				io.sockets.emit('private message', {msg: trimmedMsg,
												 userid: socket.nickname,
												 recepient: privateMsgTo,
												 recepientInRoom: false,
												 current_hour: date.getHours(),
												 current_min: date.getMinutes()
												});  //send including me
			}





		}else{ //public message
			console.log('this is public msg'); 
			

			var newMsg = new Chat({msg: trimmedMsg,
									 userid: socket.nickname,
									 current_hour: date.getHours(),
									 current_min: date.getMinutes()									
									});
			newMsg.save(function(err){
				if(err) throw err;
				io.sockets.emit('new message', {msg: trimmedMsg,
												 userid: socket.nickname,
												 current_hour: date.getHours(),
												 current_min: date.getMinutes()
												});  //send including me	
			});

		}

/*
		io.sockets.emit('new message', {msg: data,
										 userid: socket.nickname,
										 current_hour: date.getHours(),
										 current_min: date.getMinutes()
										});  //send including me


*/
		// socket.broadcast.emit('new message', data); //send except me
	});




	//when the user exit the chatting
	socket.on('disconnect', function(data){
		if(!socket.nickname) return;
		delete users[socket.nickname];
		//userIdList.splice(userIdList.indexOf(socket.nickname), 1);
		updateNicknames();
	});


});