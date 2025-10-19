const video = document.querySelector('#webcam')
const canvas = document.querySelector('#canvas')
const ctx = canvas.getContext('2d')

async function startWebcam() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    video.srcObject = stream
}
async function runObjectDetection() {
    const model = await cocoSsd.load()
    console.log("Model loaded!")

    setInterval(async () => {
        const prediction = await model.detect(video)

        ctx.clearRect(0,0,canvas.width,canvas.height)
        prediction.forEach(pred => {
            ctx.beginPath()
            ctx.rect(...pred.bbox)
            ctx.lineWidth = 2
            ctx.strokeStyle = "red"
            ctx.fillStyle = "red"
            ctx.stroke()
            ctx.fillText(pred.class,pred.bbox[0],pred.bbox[1] > 10 ? pred.bbox[1] -5 : 10)
        });
    },200)
}
startWebcam().then(runObjectDetection)