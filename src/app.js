import { Conversation } from '@11labs/client';

let conversation = null;

async function requestMicrophonePermission() {
    try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        return true;
    } catch (error) {
        console.error('Microphone permission denied:', error);
        return false;
    }
}

async function getSignedUrl() {
    try {
        const response = await fetch('/api/signed-url');
        if (!response.ok) throw new Error('Failed to get signed URL');
        const data = await response.json();
        return data.signedUrl;
    } catch (error) {
        console.error('Error getting signed URL:', error);
        throw error;
    }
}

async function getAgentId() {
    const response = await fetch('/api/getAgentId');
    const { agentId } = await response.json();
    return agentId;
}

async function startButtonClick() {
    if (conversation) {
        await conversation.endSession();
        conversation = null;
    }
    else {
    try {
        const hasPermission = await requestMicrophonePermission();
        if (!hasPermission) {
            alert('Microphone permission is required for the conversation.');
            return;
        }

        const signedUrl = await getSignedUrl();

        conversation = await Conversation.startSession({
            signedUrl: signedUrl,
            onConnect: () => {
            },
            onDisconnect: () => {
            },
            onError: (error) => {
                console.error('Conversation error:', error);
                alert('An error occurred during the conversation.');
            },
            onModeChange: (mode) => {
                updateButton();
            }
        });
    } catch (error) {
        console.error('Error starting conversation:', error);
        alert('Failed to start conversation. Please try again.');
    }
    }

    updateButton();
}

function updateButton() {
  const startBtn = document.getElementById('start-btn')
  if (conversation) {
    startBtn.textContent = "Finish";
    startBtn.style.backgroundImage = "url('/static/stop_ai_background.png')";
  } else {
    startBtn.textContent = "Ask Leo";
    startBtn.style.backgroundImage = "url('/static/ask_ai_background.png')";
  }
  startBtn.style.width = '320px';
  startBtn.style.height = '106px';
  startBtn.style.backgroundSize = 'cover';
  startBtn.style.backgroundRepeat = 'no-repeat';
  startBtn.style.backgroundPosition = 'center';
  startBtn.style.color = "white";
  startBtn.style.fontSize = '48px';
  startBtn.style.border = 'none';
  startBtn.style.cursor = 'pointer';
}

document.getElementById('start-btn').addEventListener('click', startButtonClick);
updateButton();

window.addEventListener('error', function(event) {
    console.error('Global error:', event.error);
});