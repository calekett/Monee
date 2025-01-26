
import google.generativeai as genai

# Configure the API key
genai.configure(api_key="AIzaSyChHP77xq7HiprzAOQd9Qjro-A8jpb6-iU")

# Initialize the model and start a new chat with some financial context
model = genai.GenerativeModel("gemini-1.5-flash")
chat = model.start_chat(
    history=[
        {"role": "user", "parts": "Hello, I need help managing my finances."},
        {"role": "model", "parts": "Sure! I'd be happy to help. What financial advice are you looking for? Budgeting, saving, or investing?"}
    ]
)

# Store user financial profile
user_profile = {
    "income": None,
    "expenses": None,
    "savings": None,
    "debt": None,
    "goals": []
}

# Financial advice helper functions
def give_budgeting_advice():
    return "Budgeting is key! Start by tracking your income and expenses. Try to allocate 50% of your income to necessities, 30% to discretionary expenses, and 20% to savings."

def give_savings_advice():
    return "Having an emergency fund is important! Aim to save at least 3-6 months' worth of expenses. A high-yield savings account can help you grow your savings."

def give_investment_advice():
    return "Investing in index funds is a great way to start. It provides diversification and low fees. Have you considered starting a retirement account like an IRA?"
def get_response(user_input):
  response = chat.send_message(user_input)
  """
  # Save user financial info if mentioned
  if "income" in user_input.lower():
    user_profile["income"] = input("What is your monthly income? ")
  elif "expenses" in user_input.lower():
    user_profile["expenses"] = input("What are your monthly expenses? ")
  elif "savings" in user_input.lower():
    user_profile["savings"] = input("How much do you have saved? ")
  elif "debt" in user_input.lower():
    user_profile["debt"] = input("How much debt do you have? ")
    """
    
  # Provide specific advice based on the user's query
  # Check for generic greetings or inquiries
  if any(greeting in user_input.lower() for greeting in ["hello", "hey", "hlo"]):
      advice = "Do you need help with your finances? I can assist with budgeting, saving, or investing!"
  elif user_input.lower() == "yes":
      advice = "Great! Are you more focused on saving, budgeting, or investing? Tell me more so I can assist you better."
  else:
      # Send the user input to Gemini
      
      # Provide specific advice based on the user's query
      if "budget" in user_input.lower():
          advice = give_budgeting_advice()
      elif "save" in user_input.lower():
          advice = give_savings_advice()
      elif "invest" in user_input.lower():
          advice = give_investment_advice()
      else:
          # Remove markdown syntax from the model's response
          advice = response.text.replace("**", "")

    
  chat.history.append({"role": "user", "parts": user_input})
  chat.history.append({"role": "model", "parts": advice})
  return advice
"""
# Loop for continuous chat
# commenting out for other implementation
while True:
    user_input = input("You: ")  # Get user input from the console
    if user_input.lower() == 'exit':
        print("Ending the chat.")
        break  # Exit the loop if the user types 'exit'

    # Save user financial info if mentioned
    if "income" in user_input.lower():
        user_profile["income"] = input("What is your monthly income? ")
    elif "expenses" in user_input.lower():
        user_profile["expenses"] = input("What are your monthly expenses? ")
    elif "savings" in user_input.lower():
        user_profile["savings"] = input("How much do you have saved? ")
    elif "debt" in user_input.lower():
        user_profile["debt"] = input("How much debt do you have? ")

    # Send the user input to Gemini
    advice = get_response(user_input)

    # Print the model's response and personalized advice
    print("Finbot:", advice)

    # Add the user and model messages to the chat history to maintain context
    chat.history.append({"role": "user", "parts": user_input})
    chat.history.append({"role": "model", "parts": advice})
while True:
    user_input = input("You: ")  # Get user input from the console
    if user_input.lower() == 'exit':
        print("Ending the chat.")
        break  # Exit the loop if the user types 'exit'

    # Save user financial info if mentioned
    if "income" in user_input.lower():
        user_profile["income"] = input("What is your monthly income? ")
    elif "expenses" in user_input.lower():
        user_profile["expenses"] = input("What are your monthly expenses? ")
    elif "savings" in user_input.lower():
        user_profile["savings"] = input("How much do you have saved? ")
    elif "debt" in user_input.lower():
        user_profile["debt"] = input("How much debt do you have? ")

    # Check for generic greetings or inquiries
    if any(greeting in user_input.lower() for greeting in ["hello", "hey", "hlo"]):
        advice = "Do you need help with your finances? I can assist with budgeting, saving, or investing!"
    elif user_input.lower() == "yes":
        advice = "Great! Are you more focused on saving, budgeting, or investing? Tell me more so I can assist you better."
    else:
        # Send the user input to Gemini
        response = chat.send_message(user_input)

        # Provide specific advice based on the user's query
        if "budget" in user_input.lower():
            advice = give_budgeting_advice()
        elif "save" in user_input.lower():
            advice = give_savings_advice()
        elif "invest" in user_input.lower():
            advice = give_investment_advice()
        else:
            # Remove markdown syntax from the model's response
            advice = response.text.replace("**", "")

    # Make responses plain and print
    print("MoneeBot", advice)

    # Add the user and model messages to the chat history to maintain context
    chat.history.append({"role": "user", "parts": user_input})
    chat.history.append({"role": "model", "parts": advice})
    """