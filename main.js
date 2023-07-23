let canvase     =   document.createElement("canvas");
canvase.width   =   window.innerWidth;
canvase.height  =   window.innerHeight;
document.body.appendChild(canvase);
let ctx         =   canvase.getContext("2d");
let baseReal    = [[1,0],[0,1]]
let baseVirtual = [[window.innerWidth,0],[0,window.innerHeight]]

//--------------------------------------------------------------//
//                  funciones de uso general                    //
//--------------------------------------------------------------//



function drawPoint(x,y){
    ctx.fillRect(x-0.5, y-0.5, 0.5, 0.5);
    ctx.stroke();
}

function drawLine(a,b){
    ctx.beginPath();
    ctx.moveTo(a[0],a[1]);
    ctx.lineTo(b[0], b[1]);
    ctx.stroke();
}

function coordsRealAVirtual(x,y){

}
function coordsVirtualAReal(x,y){

}

//--------------------------------------------------------------//
//                  funciones de sim 3d                         //
//--------------------------------------------------------------//

/* nada */

//--------------------------------------------------------------//
//                         objetos                              //
//--------------------------------------------------------------//

class Vector{
    constructor(name,x,y,z,displacement){
        this.name   = name
        this.x      = x
        this.y      = y
        this.z      = z
    }
    rotateXY(rad=Math.PI/4){
        let x = this.x * Math.cos(rad)   - this.y * Math.sin(rad)
        let y = this.x * Math.sin(rad)+ this.y * Math.cos(rad)
        let z = this.z
        this.update(x,y,z)
    }
    rotateZY(rad=Math.PI/4){
        let x = this.x
        let y = this.y * Math.cos(rad)- this.z * Math.sin(rad)
        let z = this.y * Math.sin(rad) + this.z * Math.cos(rad)
        this.update(x,y,z)
    }
    rotateZX(rad=Math.PI/4){
        let x = this.x * Math.cos(rad) - this.z * Math.sin(rad)
        let y = this.y
        let z = this.x * Math.sin(rad)+ this.z * Math.cos(rad)
        this.update(x,y,z)
    }
    update(x,y,z){
        this.x = x
        this.y = y
        this.z = z
    }

}
class Line{
    constructor(name,p1,p2){
        this.name   = name
        this.vector1 = p1
        this.vector2 = p2
    }
    render(xOfset,yOfset,zOfset){
        let p1 = [this.vector1.x+xOfset,this.vector1.y+yOfset]
        let p2 = [this.vector2.x+xOfset,this.vector2.y+yOfset]
        drawLine(p1,p2)
    }
}
class Entity{
    constructor(pos){
        if (!Array.isArray(pos)){console.error("")}
        else if (pos.length != 3){console.error("")}

        this.x        = pos[0]
        this.y        = pos[1]
        this.z        = pos[2]
        this.vertices = []
        this.edges    = []
        this.faces    = []
        this.currentRotationXY = 0
        this.currentRotationZY = 0
        this.currentRotationZY = 0
       
    }
    addVertice(x,y,z){
        let name = "v-" + this.vertices.length
        let p = new Vector(name,x,y,z)
        this.vertices.push(p)
    }
    addEdge(p1Name,p2Name){
        if(!this.vertices.indexOf(p1Name) || !this.vertices.indexOf(p2Name)){
            console.error("vertice not found")
            return
        }
        let p1
        let p2
        this.vertices.forEach((e)=>{
            if (e.name == p1Name){p1 = e}
            if (e.name == p2Name){p2 = e}
        })
        let name    = "e-"+this.edges.length
        let edge    = new Line(name,p1,p2)
        this.edges.push(edge)
    }
    rotateXY(rad){
        this.vertices.forEach((e)=>{
            e.rotateXY(rad)
        })
        this.currentRotationXY += rad
    }
    rotateZY(rad){
        this.vertices.forEach((e)=>{
            e.rotateZY(rad)
        })
        this.currentRotationZY += rad
    }
    rotateZX(rad){
        this.vertices.forEach((e)=>{
            e.rotateZX(rad)
        })
        this.currentRotationZX += rad
    } 
    render(){
        this.edges.forEach((e,i)=>{
            e.render(this.x,this.y,this.z)})
    }
}

class Cubes extends Entity{
    constructor(pos,dim){
        if (!Array.isArray(dim)){console.error("")}
        else if (dim.length != 3){console.error("")}
        super(pos)
        this.dim = dim

        this.addVertice(-1,  1,  -1)//v-0
        this.addVertice(1,   1,  -1)//v-1
        this.addVertice(1,  -1,  -1)//v-2
        this.addVertice(-1, -1,  -1)//v-3
        this.addVertice(-1,  1,   1)//v-4
        this.addVertice(1,   1,   1)//v-5
        this.addVertice(1,  -1,   1)//v-6
        this.addVertice(-1, -1,   1)//v-7
       
        this.vertices.forEach((e)=>{
            e.x = e.x * (1/2) * dim[0]
            e.y = e.y * (1/2) * dim[1]
            e.z = e.z * (1/2) * dim[2]
        })

        this.addEdge("v-0","v-1")//1
        this.addEdge("v-1","v-2")//2
        this.addEdge("v-2","v-3")//3
        this.addEdge("v-3","v-0")//4
        this.addEdge("v-4","v-5")//5
        this.addEdge("v-5","v-6")//6
        this.addEdge("v-6","v-7")//7
        this.addEdge("v-7","v-4")//8
        this.addEdge("v-0","v-4")//9
        this.addEdge("v-1","v-5")//10
        this.addEdge("v-2","v-6")//11
        this.addEdge("v-3","v-7")//12
    }
}
class Piramid extends Entity{
    constructor(pos,dim){
        if (!Array.isArray(dim)){console.error("")}
        else if (dim.length != 3){console.error("")}
        super(pos)
        this.dim = dim

        this.addVertice(-1,  1,  -1)//v-0
        this.addVertice(1,   1,  -1)//v-1
        this.addVertice(1,  -1,  -1)//v-2
        this.addVertice(-1, -1,  -1)//v-3
        this.addVertice(0,   0,   1)//v-4

       
        this.vertices.forEach((e)=>{
            e.x = e.x * (1/2) * dim[0]
            e.y = e.y * (1/2) * dim[1]
            e.z = e.z * (1/2) * dim[2]
        })

        this.addEdge("v-0","v-1")//1
        this.addEdge("v-1","v-2")//2
        this.addEdge("v-2","v-3")//3
        this.addEdge("v-3","v-0")//4
        this.addEdge("v-0","v-4")//5
        this.addEdge("v-1","v-4")//6
        this.addEdge("v-2","v-4")//7
        this.addEdge("v-3","v-4")//8
    }
}
class Hexagon extends Entity{
    constructor(pos,dim){
        if (!Array.isArray(dim)){console.error("")}
        else if (dim.length != 3){console.error("")}
        super(pos)
        this.dim = dim

        this.addVertice(-1/2,  Math.sqrt(3)/2,  -1)//v-0
        this.addVertice(1/2,   Math.sqrt(3)/2,  -1)//v-1
        this.addVertice(1,          0,          -1)//v-2
        this.addVertice(1/2,  -Math.sqrt(3)/2,  -1)//v-3
        this.addVertice(-1/2, -Math.sqrt(3)/2   -1)//v-4
        this.addVertice(-1,         0,          -1)//v-5
        this.addVertice(-1/2,  Math.sqrt(3)/2,   1)//v-6
        this.addVertice(1/2,   Math.sqrt(3)/2,   1)//v-7
        this.addVertice(1,          0,           1)//v-8
        this.addVertice(1/2,  -Math.sqrt(3)/2,   1)//v-9
        this.addVertice(-1/2, -Math.sqrt(3)/2,   1)//v-10
        this.addVertice(-1,         0,           1)//v-11
       
        this.vertices.forEach((e)=>{
            e.x = e.x * (1/2) * dim[0]
            e.y = e.y * (1/2) * dim[1]
            e.z = e.z * (1/2) * dim[2]
        })

        this.addEdge("v-0","v-1")   //1
        this.addEdge("v-1","v-2")   //2
        this.addEdge("v-2","v-3")   //3
        this.addEdge("v-3","v-4")   //4
        this.addEdge("v-4","v-5")   //5
        this.addEdge("v-6","v-7")   //6
        this.addEdge("v-8","v-9")   //7
        this.addEdge("v-10","v-11") //8
        this.addEdge("v-11","v-6")  //9
        this.addEdge("v-5","v-0")   //10
        this.addEdge("v-0","v-6")   //11
        this.addEdge("v-1","v-7")   //12
        this.addEdge("v-2","v-8")   //13
        this.addEdge("v-3","v-9")   //14
        this.addEdge("v-4","v-10")  //15
        this.addEdge("v-5","v-11")  //16
        this.addEdge("v-7","v-8")   //17
        this.addEdge("v-9","v-10")  //18
    }
}
class Cube extends Entity{
    constructor(pos,dim){
        if (!Array.isArray(dim)){console.error("")}
        else if (dim.length != 3){console.error("")}
        super(pos)
        this.dim = dim

        this.addVertice(0.3433,0,0.9392)        //
        this.addVertice(0.1061,0.3265,0.9392)   //
        this.addVertice(-0.2777,0.2018,0.9392)  //
        this.addVertice(-0.2777,-0.2018,0.9392) //
        this.addVertice(0.1061,-0.3265,0.9392)  //
        this.addVertice(0.6866,0,0.7271)        //
        this.addVertice(0.2122,0.653,0.7271)    //
        this.addVertice(-0.5554,0.4035,0.7271)  //
        this.addVertice(-0.5554,-0.4035,0.7271) //
        this.addVertice(0.2122,-0.653,0.7271)   //
        this.addVertice(0.7926,-0.3265,0.5149)  //
        this.addVertice(0.7926,0.3265,0.5149)   //
        this.addVertice(0.5554,0.653,0.5149)    //
        this.addVertice(-0.0656,0.8547,0.5149)  //
        this.addVertice(-0.4494,0.73,0.5149)    //
        this.addVertice(-0.8332,0.2018,0.5149)  //
        this.addVertice(-0.8332,-0.2018,0.5149) //
        this.addVertice(-0.4494,-0.73,0.5149)   //
        this.addVertice(-0.0656,-0.8547,0.5149) //
        this.addVertice(0.5554,-0.653,0.5149)   //
        this.addVertice(0.9643,-0.2018,0.1716)  //
        this.addVertice(0.9643,0.2018,0.1716)   //
        this.addVertice(0.4899,0.8547,0.1716)   //
        this.addVertice(0.1061,0.9794,0.1716)   //
        this.addVertice(-0.6615,0.73,0.1716)    //
        this.addVertice(-0.8987,0.4035,0.1716)  //
        this.addVertice(-0.8987,-0.4035,0.1716) //
        this.addVertice(-0.6615,-0.73,0.1716)   //
        this.addVertice(0.1061,-0.9794,0.1716)  //
        this.addVertice(0.4899,-0.8547,0.1716)  //
       
        this.vertices.forEach((e)=>{
            e.x = e.x * (1/2) * dim[0]
            e.y = e.y * (1/2) * dim[1]
            e.z = e.z * (1/2) * dim[2]
        })

        this.addEdge("v-0","v-1")//1
        this.addEdge("v-1","v-2")//2
        this.addEdge("v-2","v-3")//3
        this.addEdge("v-3","v-4")//4
        this.addEdge("v-4","v-9")//5
        this.addEdge("v-0","v-5")//
        this.addEdge("v-1","v-6")//
        this.addEdge("v-2","v-7")//
        this.addEdge("v-3","v-8")//
        this.addEdge("v-4","v-9")//
        this.addEdge("v-4","v-0")//
        this.addEdge("v-5","v-10")//
        this.addEdge("v-5","v-11")//
        this.addEdge("v-6","v-12")//
        this.addEdge("v-6","v-13")//
        this.addEdge("v-7","v-14")//
        this.addEdge("v-7","v-15")//
        this.addEdge("v-8","v-16")//
        this.addEdge("v-8","v-17")//
        this.addEdge("v-9","v-18")//
        this.addEdge("v-9","v-19")//
        this.addEdge("v-11","v-12")//
        this.addEdge("v-13","v-14")//
        this.addEdge("v-15","v-16")//
        this.addEdge("v-17","v-18")//
        this.addEdge("v-19","v-10")//
        this.addEdge("v-21","v-22")//
        this.addEdge("v-23","v-24")//
        this.addEdge("v-25","v-26")//
        this.addEdge("v-27","v-28")//
        this.addEdge("v-29","v-20")//
        this.addEdge("v-10","v-20")//
        this.addEdge("v-11","v-21")//
        this.addEdge("v-12","v-22")//
        this.addEdge("v-13","v-23")//
        this.addEdge("v-14","v-24")//
        this.addEdge("v-15","v-25")//
        this.addEdge("v-16","v-26")//
        this.addEdge("v-17","v-27")//
        this.addEdge("v-18","v-28")//
        this.addEdge("v-19","v-29")//
        this.addEdge("v-20","v-21")//
        this.addEdge("v-22","v-23")//
        this.addEdge("v-24","v-25")//
        this.addEdge("v-26","v-27")//
        this.addEdge("v-28","v-29")//
    }
}

//--------------------------------------------------------------//
//               instanciamiento de entidades                   //
//--------------------------------------------------------------//

let entities    = []
let isTouching  = false
let active      = 0


document.addEventListener("click", (e) => {
    let en = new Cube([e.clientX, e.clientY, 0], [100, 100, 100])
    entities.push(en)
     active += 1
})

//--------------------------------------------------------------//
//                         runtime                              //
//--------------------------------------------------------------//

i=1
setInterval(()=>{
    entities.forEach((e)=>{
        if(e instanceof Cube){
            if (e.currentRotationZY != -Math.PI/4){
                //e.rotateZY(-Math.PI/4)
            }
        }else{
            if (e.currentRotationZY != Math.PI/2){
                //e.rotateZY(Math.PI/4)
            }
        }        
    })
    if(i<100000000000000000){
        ctx.clearRect(0,0,10000,10000)
        entities.forEach((e)=>e.render())
        i+=1
    }

},100)

document.addEventListener("keydown",(e)=>{
    if(e.key == "ArrowUp"){
        entities.forEach((e)=>{e.rotateZY(0.1)})
    }
    if(e.key == "ArrowLeft"){
        entities.forEach((e)=>{e.rotateZX(0.1)})
    }
    if(e.key == "ArrowRight"){
        entities.forEach((e)=>{e.rotateZX(-0.1)})
    }
    if(e.key == "ArrowDown"){
        entities.forEach((e)=>{e.rotateZY(-0.1)})
    }
    if(e.key == "w"){
        entities.forEach((e)=>{e.y -= 5})
    }
    if(e.key == "a"){
        entities.forEach((e)=>{e.x -= 5})
    }
    if(e.key == "d"){
        entities.forEach((e)=>{e.x += 5})
    }
    if(e.key == "s"){
        entities.forEach((e)=>{e.y += 5})
    }
})
/* let str     = "0.3433;0;0.9392;0.1061;0.3265;0.9392;-0.2777;0.2018;0.9392;-0.2777;-0.2018;0.9392;0.1061;-0.3265;0.9392;0.6866;0;0.7271;0.2122;0.653;0.7271;-0.5554;0.4035;0.7271;-0.5554;-0.4035;0.7271;0.2122;-0.653;0.7271;0.7926;-0.3265;0.5149;0.7926;0.3265;0.5149;0.5554;0.653;0.5149;-0.0656;0.8547;0.5149;-0.4494;0.73;0.5149;-0.8332;0.2018;0.5149;-0.8332;-0.2018;0.5149;-0.4494;-0.73;0.5149;-0.0656;-0.8547;0.5149;0.5554;-0.653;0.5149;0.9643;-0.2018;0.1716;0.9643;0.2018;0.1716;0.4899;0.8547;0.1716;0.1061;0.9794;0.1716;-0.6615;0.73;0.1716;-0.8987;0.4035;0.1716;-0.8987;-0.4035;0.1716;-0.6615;-0.73;0.1716;0.1061;-0.9794;0.1716;0.4899;-0.8547;0.1716"
let x       = []
let y       = []
let z       = []
let pstr    = ""
let counter = 0
for(let i = 0;i<=str.length;i++){
    if(str[i]==";"){
        if(counter%3==0){
            z.push(pstr)
        }
        else if(counter%2==0){
            y.push(pstr)
        }
        else{
            x.push(pstr)
        }
        counter++
        pstr = ""
    }else{
        pstr += str[i]
    }
}
x.forEach((e,im)=>{
    console.log("this.addVertice("+x[im]+","+y[im]+","+z[im]+")")
}) */
