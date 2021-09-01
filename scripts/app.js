//dom queries
const chatList = document.querySelector(".chat-list");
const newChatForm = document.querySelector(".new-chat");
const newNameForm = document.querySelector(".new-name");
const updateMsg = document.querySelector(".update-mssg");
const chatRooms = document.querySelector(".chat-rooms");

// class instance
const initialUsername = localStorage.chatUserName
	? localStorage.chatUserName
	: "noname";
const chatroom = new Chatroom("", initialUsername);
const chatUI = new ChatUI(chatList);

// set class active to button with given ID, removes active from other buttons
activateButtonById = (id) => {
	const buttons = chatRooms.querySelectorAll("button");
	buttons.forEach((button) => {
		if (button.id === id) {
			if (!button.classList.contains("active")) {
				button.classList.add("active");
			}
		} else {
			button.classList.remove("active");
		}
	});
}
// update chat room and marks button as active
updateChatRoom = (chatRoomName) => {
	chatUI.clear();
	chatroom.updateRoom(chatRoomName);
	chatroom.getChats((data) => chatUI.renderSingleChat(data));
	activateButtonById(chatRoomName);
};

// update the chat room
chatRooms.addEventListener("click", (e) => {
	e.preventDefault();
	//console.log(e.target);
	if (e.target.tagName === "BUTTON") {
		updateChatRoom(e.target.id);
	}
});

// add a new chat
newChatForm.addEventListener("submit", (e) => {
	e.preventDefault();
	const message = newChatForm.message.value.trim();
	chatroom
		.addChat(message)
		.then(() => {
			newChatForm.reset();
		})
		.catch((err) => {
			console.log("error", err);
		});
});

// update username
newNameForm.addEventListener("submit", (e) => {
	e.preventDefault();
	const newUsername = newNameForm.name.value.trim();
	chatroom.updateName(newUsername);
	//update placeholder for username
	newNameForm.name.placeholder = newUsername;
	//reset the form
	newNameForm.reset();
	//show then hide the update message
	updateMsg.innerHTML = `Your name was updated to ${newUsername}`;
	setTimeout(() => {
		updateMsg.innerHTML = "";
	}, 3000);
});

// get chats and render
updateChatRoom(
	localStorage.chatRoomName ? localStorage.chatRoomName : "geral"
);

//update placeholder for username
newNameForm.name.placeholder = chatroom.username;
