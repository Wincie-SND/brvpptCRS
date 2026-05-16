class ChatMessage:
    def __init__(self, sender, message):
        self.sender = sender
        self.message = message


class ChatSystem:
    def __init__(self):
        self.messages = []

    def send_message(self, sender, message):
        chat = ChatMessage(sender, message)
        self.messages.append(chat)

    def display_messages(self):
        print("\n==== CHAT MESSAGES ====")

        for msg in self.messages:
            print(f"{msg.sender}: {msg.message}")