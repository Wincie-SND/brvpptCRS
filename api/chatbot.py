from openai import OpenAI
from dotenv import load_dotenv
import os

load_dotenv()

print("API KEY LOADED:", os.getenv("OPENAI_API_KEY") is not None)

client = OpenAI(
    api_key=os.getenv("OPENAI_API_KEY")
)

def ask_chatbot(message):

    if not message:
        return "Please enter a message."

    try:

        response = client.responses.create(
            model="gpt-4.1-mini",
            input=f"""
You are DriveLink AI Assistant.

Help users with:
- vehicle rentals
- bookings
- account concerns
- support questions

Keep replies short and helpful.

User: {message}
"""
        )

        return response.output_text

    except Exception as e:

        print("Chatbot Error:", e)

        return "Sorry, chatbot unavailable."