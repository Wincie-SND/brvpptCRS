from flask import Flask, render_template, request
from api.chatbot import ask_chatbot

app = Flask(__name__)

chat_history = []

@app.route("/")
def home():
    return render_template(
        "chats.html", 
        chat_history=chat_history)

@app.route("/chat", methods=["POST"])
def chat():

    message = request.form.get("message")

    if message:

        reply = ask_chatbot(message)

        chat_history.append({
            "sender":"user",
            "text":message
        })

        chat_history.append({
            "sender":"bot",
            "text":reply
        })

    return render_template(
        "chats.html",
        chat_history=chat_history
    )

if __name__=="__main__":
    app.run(debug=True)