const synth = window.speechSynthesis;

let inputField = document.getElementById("main");
let ttsEnabled = true;
let availableVoices = [];

// Initialize voices when available
function loadVoices() {
    availableVoices = synth.getVoices() || [];
}
loadVoices();
if (typeof speechSynthesis !== 'undefined') {
    speechSynthesis.onvoiceschanged = loadVoices;
}

const ttsToggleBtn = document.getElementById("tts-toggle");
if (ttsToggleBtn) {
    ttsToggleBtn.addEventListener('click', function(){
        ttsEnabled = !ttsEnabled;
        if (!ttsEnabled) {
            synth.cancel();
        }
        ttsToggleBtn.textContent = `TTS: ${ttsEnabled ? 'On' : 'Off'}`;
        ttsToggleBtn.classList.toggle('btn-outline-light', ttsEnabled);
        ttsToggleBtn.classList.toggle('btn-outline-secondary', !ttsEnabled);
    });
}

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
    speechSynthesisAI(message);
    }


    
function speechSynthesisAI(message) {
    if (!ttsEnabled) {
        return;
    }
    const voices = availableVoices;
    const utterThis = new SpeechSynthesisUtterance(message);
    // Prefer a non-null voice if available
    if (voices && voices.length > 0) {
        // Try to pick a reasonable default; fall back gracefully
        utterThis.voice = voices[3] || voices.find(v => /English|en/i.test(v.lang)) || voices[0];
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