
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
    const utterThis = new SpeechSynthesisUtterance(message);
    for (const voice in voices){
        if (voice.name === "en-GB-Journey-D"){
            utterThis.voice = voice;
        }
    }
    utterThis.pitch = 1;
    utterThis.rate = 1;
    speechSynthesis.speak(utterThis);
    }
    //console.log(message);

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