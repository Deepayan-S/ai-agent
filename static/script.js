
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
    }

function speechSynthesis(message){
    const voices = [];
    const synth = window.speechSynthesis;
    voices = synth.getVoices();
    const utterThis = new SpeechSynthesisUtterance(message);
    for (const voice of voices){
        if (voice.name === "Microsoft Mark - English (United States)"){
            utterThis.voice = voice;
        }
    }
    synth.speak(utterThis);
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