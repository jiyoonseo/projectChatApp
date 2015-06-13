jQuery(function($){

  //bootstrapt tooltip option
  $('[data-toggle="tooltip"]').tooltip();   

  var socket = io.connect();
  
  //nickname form handle
  var $nickForm=$('#setNick');
  var $nickError = $('#nickError');
  var $nickBox = $('#nickname');
  var $users = $('#users');
  
  //message box handle
  var $messageForm = $('#send-message');
  var $messageBox = $('#message');
  var $chat = $('#chat');
  
  var $deleteMsgs = $('#deleteMsgs');
  var $clearMsgs = $('#clearChat');
  var $reloadMsgs = $('#reloadMsgs');
  


  //nickname form handler
  $nickForm.submit(function(e){
    e.preventDefault(); //prevent the default behavior
    socket.emit('new user', $nickBox.val(), function(data){
      if(data){
        $('#nickWrap').hide();
        $('#contentWrap').show();
      }else{
        $nickError.html('The user name you entered was taken. Try again.');
      }
      
    });
    //$nickBox.val('');
  });
  
  //show user name list 
  socket.on('usernames', function(data){
    //show the array
    var userlist= '';
    for(var i = 0 ; i<data.length; i++){
      if($nickBox.val() === data[i]){
        userlist += '<span id="myID">'+ data[i] + '(ME)</span><br/>';
      }else{
        userlist += data[i] + '<br/>';  
      }
      
    }

    $users.html(userlist);

  });


  //message box handler
  $messageForm.submit(function(e){
    e.preventDefault(); //no need to refresh the page
    socket.emit('send message', $messageBox.val());
    $messageBox.val('');
  });
  

  //diaplay public messages
  function displayMsgs(data){
      $chat.append("<b><span id='userIDline'>" + data.userid + ":</span></b> " + "<span id='myMsg'>" +data.msg + "</span>" + " <div id='time'>&nbsp;&nbsp;&nbsp;&nbsp; " + data.currentT +"</div> <br/>");
  }

  //receive from client-side (show nickname and message)
  socket.on('new message', function(data){
    //display the message
    displayMsgs(data);

  });

  //prevent refresh page after submit the form & empty chatting messages
  $clearMsgs.submit(function(e){
    e.preventDefault();
    $chat.empty();
  })

  //prevent refresh page after submit the form & send server a signal 're-load'
  $reloadMsgs.submit(function(e){
    e.preventDefault();
    socket.emit('re-reload', function(data){

    });

  });

  //receive signal 'loading again' from server so that chatting messages are loaded
  socket.on('loading again', function(docs){
    $chat.empty();
    for(var i = 0 ; i<docs.length; i++){
      displayMsgs(docs[i]);  
    }
  });


  // DELETE DB START ********************************
  $deleteMsgs.submit(function(e){
    e.preventDefault(); //no need to refresh the page
    //$chat.empty();
    //$chat.append('good!<br>'); //test - ok

    socket.emit('delete all msgs', $nickBox.val(), function(data){
      
    });    


  });

  socket.on('refresh', function(docs){
    //display the message    
    $chat.empty();
    for(var i = 0 ; i<docs.length; i++){
      displayMsgs(docs[i]);  
    }
  });
  // END OF DELETE DB********************************


  //diaplay messages from MongoDB (Preveously made messages)
  socket.on('load prev msgs', function(docs){
    //display the message    
    for(var i = 0 ; i<docs.length; i++){
      displayMsgs(docs[i]);  
    }


  });    



  //*******************************************************
  //private message
  socket.on('private message', function(data){

    //receive receipient name (case sensitive)
    //if data.recepientInRoom doesn't exist in the room
    if(data.recepientInRoom == false){

      if($nickBox.val() === data.userid){ //message to sender (failed to send the private msg)
        $chat.append("<b><span id='userPrivateIDline'>" + data.userid + "(Private):</span></b> " + "<span id='notDelivered'>" + data.msg + "</span>" + " <div id='time'>&nbsp;&nbsp;&nbsp;&nbsp; " + data.currentT + "</div> <br/>");   
        $chat.append("<span id='err'><b>PLEASE CHECK RECEPIENT NAME.(case-sensitive)<Br>Your message has not been delivered successfully.</b><br></span>");             
      }




    }else{ //if data.recepientInRoom exist in the room.

      if($nickBox.val() === data.recepient ){ //recepient will receive this message
        //display the private message
        $chat.append("<b><span id='userPrivateIDline'>" + data.userid + " (Private to me):</span></b> " + "<span id='myMsg'>" +data.msg + "</span>" + " <div id='time'>&nbsp;&nbsp;&nbsp;&nbsp; " + data.currentT +"</div> <br/>");

      }else if($nickBox.val() === data.userid){ //sender will view this message
        //display the private message
        $chat.append("<b><span id='userPrivateIDline'>" + data.userid + " (Private to <span id='recepientName'>" + data.recepient + "</span>):</span></b> " + "<span id='myMsg'>" +data.msg + "</span>" + " <div id='time'>&nbsp;&nbsp;&nbsp;&nbsp; " + data.currentT  +"</div> <br/>");
      }
    }


  });

});
