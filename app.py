from flask import Flask
from api.chatbot import ask_chatbot

app = Flask(__name__)

@app.route("/")
def home():
    return "DriveLink API running"

@app.route("/test")
def test():
    reply = ask_chatbot("Hello")
    return reply

if __name__ == "__main__":
    app.run(debug=True)