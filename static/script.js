
let inputField = document.getElementById("main");

inputField.addEventListener('keydown', function(e){
    if (e.key =="Enter"){
        const text = inputField.value;
        if (text != ""){
            createMessageBubble(text);
            getResponse(text);
        }
        inputField.value="";        
    }
})

function createMessageBubble(message){
    const newChat = document.getElementById("chat-area"); 
    const chatRow = document.createElement('div');
    chatRow.className = 'chat-row';
    chatRow.innerHTML = `<pre class="chat-bubble pre-wrap" style="overflow: visible;">${message}</pre>`;
    newChat.appendChild(chatRow);
    newChat.scrollTop = newChat.scrollHeight;
    //console.log(message);
}

function createAIResponse(message){
    const newChat = document.getElementById("chat-area"); 
    const chatRow = document.createElement('div');
    chatRow.className = 'chat-ai-row';
    chatRow.innerHTML = `<pre class="chat-ai-response pre-wrap">${message}</pre>`;
    newChat.appendChild(chatRow);
    newChat.scrollTop = newChat.scrollHeight;
    convertTextToSpeech(message);
    }
    //console.log(message);


    const textToSpeech = require('@https://texttospeech.googleapis.com/v1/voices');

    const fs = require('fs');
    
    const util = require('util');
    
    async function convertTextToSpeech(message) {
    
    const client = new textToSpeech.TextToSpeechClient();
    
    const request = {
    
    input: { text: message },
    
    voice: { languageCode: 'en-GB',name: "en-GB-Neural2-D", ssmlGender: 'MALE' },
    
    audioConfig: { audioEncoding: 'MP3' },
    
    };
    
    const [response] = await client.synthesizeSpeech(request);
    
    const writeFile = util.promisify(fs.writeFile);
    
    await writeFile('output.mp3', response.audioContent, 'binary');
    
    console.log('Audio content written to file "output.mp3"');
    
    }  

function getResponse(prompt){
    $.ajax({
        url: '/ask',
        type: 'POST',
        contentType: 'application/json',
        data: JSON.stringify({ 'prompt' : prompt}),
        success: function(response){
            createAIResponse(response.response);
        },
        error: function(error){
            console.log(error);
        }
    });
}