const video = document.querySelector('#webcam');
const canvas = document.querySelector('#canvas');
const ctx = canvas.getContext('2d');
const startBtn = document.querySelector('#start-btn'); // Get the new button
const statusDiv = document.querySelector('#status'); // Get the status div
const diagnostic = document.querySelector('#output'); // Get the output div

// 1. Object Detection Logic (Kept mostly as is)
// (Your object detection code is fine, but it needs to be combined with the speech logic)

// async function startWebcam() {
//     const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//     video.srcObject = stream;
// }

// async function runObjectDetection() {
//     const model = await cocoSsd.load();
//     console.log("Object Detection Model loaded!");

//     setInterval(async () => {
//         const prediction = await model.detect(video);

//         ctx.clearRect(0, 0, canvas.width, canvas.height);
//         prediction.forEach(pred => {
//             ctx.beginPath();
//             ctx.rect(...pred.bbox);
//             ctx.lineWidth = 2;
//             ctx.strokeStyle = "red";
//             ctx.fillStyle = "red";
//             ctx.stroke();
//             // Text for the class name
//             ctx.fillText(pred.class, pred.bbox[0], pred.bbox[1] > 10 ? pred.bbox[1] - 5 : 10);
//         });
//     }, 200);
// }

// 2. Speech Recognition Setup

const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const specificWords = ['hello', 'tie', 'chance']; // Define specific words here

if (typeof SpeechRecognition === 'undefined') {
    statusDiv.textContent = 'Speech Recognition is NOT supported in this browser.';
    startBtn.disabled = true;
} else {
    const recognition = new SpeechRecognition();
    recognition.continuous = false; // Capture a single phrase/sentence at a time
    recognition.interimResults = false;
    recognition.lang = 'en-US';
    recognition.start()

    recognition.onstart = () => {
        statusDiv.textContent = 'Listening... Speak now.';
        startBtn.disabled = true; // Disable button while listening
    };

    recognition.onend = () => {
        statusDiv.textContent = 'Click "Start Listening"';
        startBtn.disabled = false; // Enable button to listen again
        console.log('Speech recognition service disconnected.');
    };

    recognition.onerror = (event) => {
        statusDiv.textContent = `Error: ${event.error}`;
        startBtn.disabled = false;
        console.error('Speech recognition error:', event.error);
    };

    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        
        console.log(`User said: ${transcript}`);
        diagnostic.textContent = `Result: ${transcript}`;

        let matchFound = false;
        
        for (const word of specificWords) {
            if (transcript.includes(word.toLowerCase())) {
                console.log(`Detected specific word: ${word}`);
                diagnostic.textContent += ` - MATCH on "${word}"!`;
                matchFound = true;
                break; // Stop checking once a match is found
            }
        }

        if (!matchFound) {
            console.log('No specific words detected.');
        }
        
        // No need to call recognition.stop() here as continuous is false,
        // it stops automatically and then triggers onend.
    };

    // 3. Attach the start function to the button
    startBtn.addEventListener('click', () => {
        try {
            recognition.start();
        } catch (e) {
            // Handle error if start is called while already listening
            console.error("Recognition start failed (maybe already listening):", e);
        }
    });
}

// Initial application startup
// startWebcam().then(runObjectDetection);