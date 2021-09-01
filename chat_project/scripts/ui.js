// render chat templates to the DOM

// clear the list of chats (when the room changes)

class ChatUI {
	constructor(list) {
		this.list = list;
	}

	clear() {
		this.list.innerHTML = "";
	}

	renderSingleChat(data) {
		const when = dateFns.distanceInWordsToNow(
			data.created_at.toDate(),
			{
				addSuffix: true
			}
		);
		const html =
			`	<span class="username-chat">${data.username}</span>:
				<span class="message-chat">${data.message}</span>
				<div class="time-chat">${when}</div>
			`;
		const li = document.createElement('li');
		li.classList.add("list-group-item");
		li.innerHTML = html;
		this.list.appendChild(li);
	}
}