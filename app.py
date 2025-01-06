from flask import Flask , render_template ,jsonify,request
import google.generativeai as genai
from google.ai.generativelanguage_v1beta.types import content

genai.configure(api_key="AIzaSyBJRmoZEAeGVgKwE5e_q5UJdZ1W6_ExCMQ")

# Create the model
generation_config = {
  "temperature": 1,
  "top_p": 0.95,
  "top_k": 40,
  "max_output_tokens": 8192,
  "response_mime_type": "text/plain",
}
model = genai.GenerativeModel(
    model_name="gemini-1.5-flash-8b",
    generation_config=generation_config,
    system_instruction="You are an ai butler named travis who will assist the user with common tasks like answering questions, remembering something for the user and more try to assist the user in any way possible"
    )

    
chat_session = model.start_chat(
  history=[
  ]
)

def give_response(question):
    response = chat_session.send_message(question)
    print(chat_session)
    return response.text
 

app = Flask(__name__)

@app.route('/')
def hello_world():
    return render_template('index.html')

@app.route('/ask', methods=['POST'])
def ask():
    question = request.get_json()['prompt']
    response = give_response(question)
    return jsonify(response= response)

if __name__ == '__main__':
    app.run(debug=True)