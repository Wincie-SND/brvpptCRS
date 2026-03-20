class ChatSystem:
    @staticmethod
    def send_message(messages, sender, receiver):
        msg = input("Message: ")
        messages.append(ChatMessage(sender, receiver, msg))

    @staticmethod
    def view_messages(messages, user):
        print("\n--- CHAT ---")

        for m in messages:
            if m.receiver == user or m.sender == user:
                print(f"{m.sender} -> {m.receiver}: {m.message}")



class ChatMessage:
    def __init__(self, sender, receiver, message):
        self.sender = sender
        self.receiver = receiver
        self.message = message


    messages = []