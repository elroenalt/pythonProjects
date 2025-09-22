const size = {'w': 400, 'h': 400}
canvas = document.createElement('canvas')
canvas.style.background = "black"
canvas.width = size.w
canvas.height = size.h
document.body.appendChild(canvas)
const ctx = canvas.getContext('2d')

ctx.strokeStyle = 'white'
ctx.fillStyle = 'red'

drawDot(200,200)


class Object {
    constructor(x,y,z,scaleX = 1,scaleY = 1,scaleZ = 1,rotX = 0,rotY = 0,rotZ = 0,color = 'red') {
        this.x = x;
        this.y = y;
        this.z = z;
        this.color = color;
        
        this.scale = {'x': scaleX,'y': scaleY,'z': scaleZ}
        this.rot = {'x': rotX,'y': rotY,'z': rotZ}
        this.vert = [];
        this.faces = [];
        this.createTransMatrix()
    }
    createTransMatrix() {

    }
}
class Cube extends Object {
    constructor(x,y,z,scaleX = 1,scaleY = 1,scaleZ = 1,rotX = 0,rotY = 0,rotZ = 0,color = 'red') {
        super(x, y, z, color, scaleX, scaleY, scaleZ, rotX, rotY, rotZ);
        this.vert = [
            // 8 vertices of a cube
        ];
        this.faces = [
            // 6 faces, each with 2 triangles
        ];

    }
}
function createIdentityMatrix(size = 4) {
    const Matrix = createMatrix(size,size);
    for(let i = 0; i < size; i++) {
        Matrix[i] = 1
    }
    return Matrix;
}
function createMatrix(rows = 4,cols = 4,fill = 0) {
    return Array.from({ length: rows }, () => Array(cols).fill(fill));
}
function drawDot(x,y,radius = 3,color) {
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
    const MatrixC = Array.from({lenght: rowsA}, () => Array(colsB).fill(0))
    for(let i = 0; i < rowsA; i++) {
        for(let j = 0; i < colsB; i++) {
            for(let k = 0; k < colsA; k++) {
                MatrixC[i][j] += MatrixA[i][j] * MatrixB[k][j]
            }
        }
    }
    return MatrixC
}