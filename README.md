# projectChatApp
This is a single page web application for chatting. You can send public/private messages and save messages in database. Also this app allows you to delete your saved messages. Enoy! @http://ec2-52-10-124-84.us-west-2.compute.amazonaws.com:7000/



/****User Manual**********************************************************
****Project: Chatting Single Page Application (Chat SPA) *****************
******************************************--by Jiyoon Seo(Author)*********
**************************************************************************/

1. User Manual
	a. Getting into the chatting web page and attempting enter unique user ID
	b. If a user is failed to enter the chatting room, due to duplicated user id, enter different one until he/she don't get a failure message.
	c. Once a user get into the chatting room, she/he can send PUBLIC messages by default.
	d. Enter '/p [recipient’s user name] [message]' to send private message to specific user in the room
	e. Click 'clear messages' to hide messages from chatting box
	f. Click 'Reload messages' to all messages from chatting database
	g. In order to delete messages from database permanently, please click 'Delete' button
	h. By default, users will save all public messages in database.
	i. In case of a bug, please contact the Author at s-jiyoon.seo@lwtech.edu


2. Short Description of the Project
	This is a single page chatting application. This application can be used by any internet user currently. Users can do 'real-time' communication with this app by sending and receiving private and public messages through chatting box. Users can save all the Public messages in database by default, and they can delete their own messages permanently. Users can temporally hide/show messages in the chatting room.

	A demo version is available at---------------------------------------------- http://ec2-52-10-124-84.us-west-2.compute.amazonaws.com:7000/ 
	OR
	http://52.10.124.84:7000/ --------------------------------------------------


3. User Interaction Scenario
	a. Assumption:
		- User should understand what the app will perform without reading manual
		- Additional functionalities are provided in the application so that user can easily understand features
	b. Dependencies:
		- This web application is built to perform after user log in/sign in.
	c. Once users can open the page where attempt entering their user name (also called 'chatting id'), they can use this application
	d. User can hide the chatting box, so that user can implement some other activities on the same page.
	e. Users can save messages in the chatting room, as long as other users don't delete messages
	f. Users can delete their own messages from database (permanently)
	g. Users can hide messages from the chatting box if it is too crowded
	h. Users can reload all the messages from database
