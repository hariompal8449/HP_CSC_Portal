// बोलकर वेलकम करने वाला फंक्शन (Text-to-Speech)
function speakText(textToSpeak) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const speech = new SpeechSynthesisUtterance(textToSpeak);
        speech.lang = 'hi-IN';
        speech.rate = 1.0;
        window.speechSynthesis.speak(speech);
    }
}

// चैटबॉट खोलने और बंद करने का ग्लोबल फंक्शन
window.toggleChatbot = function() {
    const chatWin = document.getElementById('chatbot-window');
    if (!chatWin) return;
    
    const isOpen = chatWin.style.display === 'flex';
    chatWin.style.display = isOpen ? 'none' : 'flex';

    if (!isOpen) {
        const chatBody = document.getElementById('chat-body');
        if (chatBody && chatBody.children.length === 0) {
            const welcomeMsg = "नमस्कार! मैं आपका CSC AI सहायक हूँ। आप मुझसे सेवाओं के बारे में बोलकर या लिखकर पूछ सकते हैं।";
            addMessage(welcomeMsg, 'bot-msg');
            speakText(welcomeMsg);
        }
        const inputField = document.getElementById('user-input');
        if (inputField) inputField.focus();
    }
};

window.handleKeyPress = function(e) {
    if (e.key === 'Enter') {
        window.sendMessage();
    }
};

window.sendMessage = function() {
    const input = document.getElementById('user-input');
    if (!input) return;
    
    const query = input.value.trim();
    if (!query) return;

    addMessage(query, 'user-msg');
    input.value = '';

    setTimeout(() => {
        const reply = getAIResponse(query);
        addMessage(reply, 'bot-msg');
    }, 300);
};

function addMessage(text, className) {
    const body = document.getElementById('chat-body');
    if (!body) return;
    
    const msgDiv = document.createElement('div');
    msgDiv.className = className;
    msgDiv.innerHTML = text;
    body.appendChild(msgDiv);
    body.scrollTop = body.scrollHeight;
}

function getAIResponse(text) {
    const query = text.toLowerCase().trim();
    let responseText = "";
    
    if (query.includes('आधार') || query.includes('aadhaar') || query.includes('adhar')) {
        responseText = 'आधार सेवाओं के लिए यहाँ क्लिक करें:<br><br><a href="pages/aadhaar.html" target="_blank" style="background: #0284c7; color: #ffffff; padding: 8px 14px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">🔗 Aadhaar Page खोलें</a>';
    } 
    else if (query.includes('पैन') || query.includes('pan')) {
        responseText = 'पैन कार्ड सेवाओं के लिए यहाँ क्लिक करें:<br><br><a href="pages/pan.html" target="_blank" style="background: #0284c7; color: #ffffff; padding: 8px 14px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">🔗 PAN Page खोलें</a>';
    } 
    else if (query.includes('किसान') || query.includes('pm kisan') || query.includes('pmkisan')) {
        responseText = 'पीएम किसान योजना के लिए यहाँ क्लिक करें:<br><br><a href="pages/pmkisan.html" target="_blank" style="background: #0284c7; color: #ffffff; padding: 8px 14px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">🔗 PM-Kisan Page खोलें</a>';
    } 
    else if (query.includes('वोटर') || query.includes('voter')) {
        responseText = 'वोटर आईडी सेवाओं के लिए यहाँ क्लिक करें:<br><br><a href="pages/voter.html" target="_blank" style="background: #0284c7; color: #ffffff; padding: 8px 14px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">🔗 Voter ID Page खोलें</a>';
    } 
    else if (query.includes('फॉर्म') || query.includes('form') || query.includes('pdf')) {
        responseText = 'फॉर्म डाउनलोड करने के लिए यहाँ क्लिक करें:<br><br><a href="pages/forms.html" target="_blank" style="background: #0284c7; color: #ffffff; padding: 8px 14px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;">🔗 Forms Page खोलें</a>';
    } 
    else {
        // Yahan ab humne ek general link bhi add kar diya hai taaki button hamesha dikhe
        responseText = "माफ़ कीजिए, मैं पूरी तरह समझ नहीं पाया। आप हमारी सभी सेवाओं की सूची यहाँ देख सकते हैं:<br><br><a href='index.html' style='background: #0284c7; color: #ffffff; padding: 8px 14px; border-radius: 6px; text-decoration: none; font-weight: bold; display: inline-block;'>🔗 सभी सेवाएं देखें</a>";
    }

    // आवाज़ बोलते समय HTML टैग्स को हटाने के लिए
    const plainTextForSpeech = responseText.replace(/<[^>]*>?/gm, '');
    speakText(plainTextForSpeech);

    return responseText;
}


window.startVoiceRecognition = function() {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
        alert("आपका ब्राउज़र वॉइस रिकग्निशन सपोर्ट नहीं करता।");
        return;
    }
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'hi-IN';
    
    recognition.onresult = function(event) {
        const inputField = document.getElementById('user-input');
        if (inputField) {
            inputField.value = event.results[0][0].transcript;
            window.sendMessage();
        }
    };
    
    recognition.onerror = function() {
        alert("आवाज़ पहचानने में समस्या आई। कृपया लिखकर कोशिश करें।");
    };
    
    recognition.start();
};
