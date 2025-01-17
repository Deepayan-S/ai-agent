from flask import Flask , render_template ,jsonify,request
import google.generativeai as genai
from google.ai.generativelanguage_v1beta.types import content
import os

api_key=os.getenv("GEMINI_KEY")

genai.configure(api_key=api_key)

# Create the model
generation_config = {
  "temperature": 0.4,
  "top_p": 0.95,
  "top_k": 40,
  "max_output_tokens": 8192,
  "response_mime_type": "text/plain",
}

model = genai.GenerativeModel(
  model_name="gemini-1.5-pro",
  generation_config=generation_config,
  system_instruction="You are travis an AI lawyer who is supposed to help the user in any legal matter.",
)

#tools = [
#    genai.protos.Tool(
#      google_search_retrieval = genai.protos.GoogleSearchRetrieval(
#        dynamic_retrieval_config = genai.protos.DynamicRetrievalConfig(
#          mode = genai.protos.DynamicRetrievalConfig.Mode.MODE_DYNAMIC,
#          dynamic_threshold = 0.4,
#        ),
#      ),
#    ),
#  ],


    
chat_session = model.start_chat(
  history=[
  ]
)

def give_response(question):
    response = chat_session.send_message(question)
    print(response)
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