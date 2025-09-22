const size = {'w': 400, 'h': 400}
canvas = document.createElement('canvas')
canvas.style.background = "black"
canvas.width = size.w
canvas.height = size.h
document.body.appendChild(canvas)
const ctx = canvas.getContext('2d')

ctx.strokeStyle = 'white'
ctx.fillStyle = 'red'

const fov = 0.4*Math.PI
const aspectRatio = size.w / size.h
const Znear = 0.1
const Zfar = 10000

const ModelSpace = []

const camera = {'x': 0,'y': 0,'z': 0}
const PerspectiveMatrix = createPerspektiveMatrix()
let CameraMatrix

document.addEventListener('DOMContentLoaded', () => { 
    ModelSpace.push(new Cube(0,0,-20,5,5,5))
    renderingPipeline()
})
function renderingPipeline() {
    ctx.clearRect(0,0,size.w,size.h)
    CameraMatrix = createCameraMatrix()
    for(let model of ModelSpace) {
        model.render()
    }
}

class Object {
    constructor(x,y,z,scaleX = 1,scaleY = 1,scaleZ = 1,rotX = 0,rotY = 0,rotZ = 0,color = 'red') {
        this.t = {'x': x,'y': y,'z': z}
        this.color = color;
        
        this.scale = {'x': scaleX,'y': scaleY,'z': scaleZ}
        this.rot = {'x': rotX,'y': rotY,'z': rotZ}
        this.vert = [];
        this.faces = [];
        this.TransMatrix = this.createTransMatrix()
    }
    render() {
        let vectors = []
        for(let vert of this.vert) {
            console.log([vert])
            const PCM = multiplyMatrices(multiplyMatrices(multiplyMatrices([vert],this.TransMatrix),CameraMatrix),PerspectiveMatrix)
            const clipSpace = PCM
            // NDC (NormalizedDeviceCoordinates)
            const NDCx = clipSpace[0][0] / clipSpace[0][3];
            const NDCy = clipSpace[0][1] / clipSpace[0][3];
            const NDCz = clipSpace[0][2] / clipSpace[0][3]; 
            //Vieport Transform (the actual Pixel)
            const screenX = size.w / 2 *(NDCx + 1)
            const screenY = size.h / 2 *(1 - NDCy)
            vectors.push([screenX,screenY,NDCz])
            console.log(screenX + " : " + screenY)
            drawDot(screenX,screenY)
        }
    }
    createTransMatrix() {
        
        const cX = Math.cos(this.rot.x);
        const sX = Math.sin(this.rot.x);
        const cY = Math.cos(this.rot.y);
        const sY = Math.sin(this.rot.y);
        const cZ = Math.cos(this.rot.z);
        const sZ = Math.sin(this.rot.z);

        const Rx = createIdentityMatrix(4);
        Rx[1][1] = cX; Rx[1][2] = -sX;
        Rx[2][1] = sX; Rx[2][2] = cX;

        const Ry = createIdentityMatrix(4);
        Ry[0][0] = cY; Ry[0][2] = sY;
        Ry[2][0] = -sY; Ry[2][2] = cY;

        const Rz = createIdentityMatrix(4);
        Rz[0][0] = cZ; Rz[0][1] = -sZ;
        Rz[1][0] = sZ; Rz[1][1] = cZ;
        
        const S = createIdentityMatrix(4);
        S[0][0] = this.scale.x; 
        S[1][1] = this.scale.y; 
        S[2][2] = this.scale.z; 

        const T = createIdentityMatrix(4);
        T[0][3] = this.t.x; 
        T[1][3] = this.t.y; 
        T[2][3] = this.t.z;

        const R = multiplyMatrices(multiplyMatrices(Rz, Ry), Rx);
        return multiplyMatrices(T, multiplyMatrices(R, S));
    }
}
class Cube extends Object {
    constructor(x,y,z,scaleX = 1,scaleY = 1,scaleZ = 1,rotX = 0,rotY = 0,rotZ = 0,color = 'red') {
        super(x, y, z, scaleX, scaleY, scaleZ, rotX, rotY, rotZ, color)
        this.vert = [
            [ -0.5, -0.5, -0.5, 1 ], // 0
            [  0.5, -0.5, -0.5, 1 ], // 1
            [  0.5,  0.5, -0.5, 1 ], // 2
            [ -0.5,  0.5, -0.5, 1 ], // 3
            [ -0.5, -0.5,  0.5, 1 ], // 4
            [  0.5, -0.5,  0.5, 1 ], // 5
            [  0.5,  0.5,  0.5, 1 ], // 6
            [ -0.5,  0.5,  0.5, 1 ]  // 7
        ];
        this.faces = [
            // 6 faces, each with 2 triangles
        ];

    }
}
function createIdentityMatrix(size = 4) {
    const Matrix = newMatrix(size,size);
    for(let i = 0; i < size; i++) {
        Matrix[i][i] = 1
    }
    return Matrix;
}
function newMatrix(rows = 4,cols = 4,fill = 0) {
    return Array.from({ length: rows }, () => Array(cols).fill(fill));
}
function drawDot(x,y,radius = 5,color) {
    ctx.beginPath()
    ctx.arc(x,y,radius,0,2*Math.PI)
    ctx.fill()
}
function drawLine(x1,y1,x2,y2,color) {
    ctx.beginPath()
    ctx.moveTo(50,50)
    ctx.lineTo(200,200)
    ctx.stroke()
}
function multiplyMatrices(MatrixA,MatrixB){
    const rowsA = MatrixA.length
    const colsA = MatrixA[0].length
    const rowsB = MatrixB.length
    const colsB = MatrixB[0].length
    if(colsA != rowsB) {
        console.log('Mismatxhing Matrices')
        return null
    }
    const MatrixC = newMatrix(rowsA, colsB, 0);
    for(let i = 0; i < rowsA; i++) {
        for(let j = 0; j < colsB; j++) {
            for(let k = 0; k < colsA; k++) {
                MatrixC[i][j] += MatrixA[i][k] * MatrixB[k][j]
            }
        }
    }
    return MatrixC
}
function createCameraMatrix() {
    const Matrix = createIdentityMatrix(4);
    Matrix[0][3] = -camera.x
    Matrix[1][3] = -camera.y
    Matrix[2][3] = -camera.z
    return Matrix
}
function createPerspektiveMatrix() {
    const Matrix = newMatrix()
    const tanFOV2 = Math.tan(fov/2)
    const ZnZf = Znear - Zfar
    Matrix[0][0] = 1 / (aspectRatio * tanFOV2)
    Matrix[1][1] = 1 / tanFOV2
    Matrix[2][2] = (Zfar + Znear) / (ZnZf)
    Matrix[2][3] = (2 * Zfar * Znear) / (ZnZf)
    Matrix[3][2] = -1
    return Matrix
}