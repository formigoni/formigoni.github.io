// adding new chat documents
// setting up a real-time listener to get new chats
// updating the username
// updating the room

class Chatroom {
	constructor(room, username) {
		this.room = room;
		this.username = username;
		this.chats = db_chats;
		this.unsub;
	}

	async addChat(message) {
		//format a chat object
		const now = new Date();
		const chat = {
			message,
			username: this.username,
			room: this.room,
			created_at: firebase.firestore.Timestamp.fromDate(now),
		};
		//save the document to database
		const response = await this.chats.add(chat);
		return response;
	}

	getChats(callback) {
		this.unsub = this.chats
			.where('room', '==', this.room) //complex query
			.orderBy('created_at')
			.onSnapshot((snapshot) => {
				snapshot.docChanges().forEach(change => {
					if (change.type === 'added') {
						callback(change.doc.data());
					}
				})
			});
	}

	updateName(username) {
		this.username = username;
		localStorage.chatUserName = username;
	}

	updateRoom(room) {
		this.room = room;
		localStorage.chatRoomName = room;
		console.log(`room updated to ${this.room}`);
		if (this.unsub) {
			this.unsub();
		}
	}
}


// chatroom.addChat("zup, mates.")
// 	.then((data) => {
// 		console.log(data);
// 	})
// 	.catch((err) => {
// 		console.log("error adding: ", err);
// 	});

// chatroom.getChats((data) => {
// 	console.log(data);
// });

// setTimeout(() => {
// 	chatroom.updateRoom('gaming');
// 	chatroom.updateName('yoshi');
// 	chatroom.getChats((data) => {
// 		console.log(data);
// 	});
// 	chatroom.addChat('hello');
// }, 3000);