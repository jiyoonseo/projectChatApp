
//Scroll down to the bottom when the chatting messages are too long
function updateScroll(){
    var element = document.getElementById("chat");
    element.scrollTop = element.scrollHeight;
}
setInterval("updateScroll",1000);


//JQuery functions -- UI options to show/hide data
$(document).ready(function(){
	$("#xButton").click(function(){
	        $("#chatWrap").slideUp();
	        $("#privateOption").slideUp();
	        

	});
	$("#openButton").click(function(){
	        $("#chatWrap").slideDown();
	        $("#privateOption").slideDown();
	});
	/*
	$('#deleteDB').click(function(){
		alert("Do you really want to delete your messages from database?");
	});
	*/
});