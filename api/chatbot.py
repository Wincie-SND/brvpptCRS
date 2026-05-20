import google.generativeai as genai
from dotenv import load_dotenv
import os

load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

print("GEMINI KEY LOADED:", api_key is not None)

genai.configure(
    api_key=api_key
)

model = genai.GenerativeModel(
    "gemini-2.5-flash"
)

def ask_chatbot(message):

    if not message:
        return "Please enter a message."

    try:

        prompt = f"""
You are DriveLink AI Assistant.

Help users with:
- vehicle rentals
- bookings
- account concerns
- support questions

Keep replies short and helpful.

User: {message}
"""

        response = model.generate_content(
            prompt
        )

        return response.text

    except Exception as e:

        print("Gemini Error:", e)

        return "Sorry, chatbot unavailable."