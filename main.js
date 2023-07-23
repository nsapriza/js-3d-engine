let canvase     =   document.createElement("canvas");
canvase.width   =   window.innerWidth;
canvase.height  =   window.innerHeight;
document.body.appendChild(canvase);
let ctx         =   canvase.getContext("2d");


//--------------------------------------------------------------//
//                  funciones de uso general                    //
//--------------------------------------------------------------//



function drawPoint(x,y){
    ctx.fillRect(x-0.5, y-0.5, 0.5, 0.5);
    ctx.stroke();
}

function drawCross(x,y){
    for(let i = 0;i<=10;i++){
        drawPoint(x,y+i)
        drawPoint(x+i,y)
        drawPoint(x,y-i)
        drawPoint(x-i,y)
    }
}

function drawLine(a,b){
    ctx.beginPath();
    ctx.moveTo(a[0],a[1]);
    ctx.lineTo(b[0], b[1]);
    ctx.stroke();
}

function drawCircle(h,k,r){
    lastfx1 = 0
    lastfx2 = 0
    for(let x = h - r; x <= h + r; x += 1){
        c   =   (x**2 - 2*h*x + h**2 + k**2 - r**2);
        b   =   (-2*k)
        fx1 =   (-b + Math.sqrt(b**2 -4*c))/2;
        fx2 =   (-b - Math.sqrt(b**2 -4*c))/2;
        
        if((lastfx1 - fx1)<1.5){
            drawPoint(x,fx1);
            drawPoint(x,fx2);
        }else{
            drawLine([x - 1,lastfx1],[x - 1,fx1])
            drawLine([x - 1,lastfx2],[x - 1,fx2])
        }
        lastfx1 = fx1
        lastfx2 = fx2
        
    }
    
}

//--------------------------------------------------------------//
//                  funciones de sim 3d                         //
//--------------------------------------------------------------//

function rotateVectorXY(vector,rad){
    x = vector[0] * Math.sin(rad)      + vector[1] * Math.cos(rad)
    y = vector[0] * -Math.cos(rad)     + vector[1] * Math.sin(rad)
    z = vector[2] 
    return [x,y,z]
}

function rotateVectorZY(vector,rad){
    x = vector[0]
    y = vector[1]* Math.sin(rad) - vector[2] * Math.cos(rad)
    z = vector[1]* Math.cos(rad) + vector[2] * Math.sin(rad)
    return [x,y,z]
}

function rotateObjectZY(objectVerticies,rad=Math.PI/4){
    output = []
    for(let i = 0;i<=objectVerticies.length - 1;i++){
        output.push(rotateVectorZY(objectVerticies[i],rad))
    }
    return output
}

function rotateObjectXY(objectVerticies,rad){
    output = []    
    for(let i = 0;i<=objectVerticies.length - 1;i++){
        output.push(rotateVectorXY(objectVerticies[i],rad)) 
    }
    return output
}

//--------------------------------------------------------------//
//                         objetos                              //
//--------------------------------------------------------------//

class Point{
    constructor(name,x,y,z,displacement){
        this.name   = name
        this.x    = x
        this.y    = y
        this.z    = z
    }

}

class Line{
    constructor(name,p1,p2){
        this.name   = name
        this.point1 = p1
        this.point2 = p2
    }
    render(){
        let p1 = [this.point1.x,this.point1.y,this.point1.z]
        let p2 = [this.point2.x,this.point2.y,this.point2.z]
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
        
    }
    addVertice(x,y,z){
        let name = "v-" + this.vertices.length
        let p = new Point(name,this.x+x,this.y+y,this.z+z)
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
            let vect = [e.x,e.y,e.z]
            vect = rotateVectorXY(vect,rad)
            e.x  = vect[0]
            e.y  = vect[1]
            e.z  = vect[2]
        }) 
    }
    rotateZY(rad){
        this.vertices.forEach((e)=>{
            e = rotateVectorZY(e)
        })
    }

    render(){
        this.edges.forEach((v,i)=>v.render())
    }
}

class Cube extends Entity{
    constructor(pos,dim){
        if (!Array.isArray(dim)){console.error("")}
        else if (dim.length != 3){console.error("")}
        super(pos)
        this.dim = dim

        this.addVertice(-1,1,-1)
        this.addVertice(1,1,-1)
        this.addVertice(1,-1,-1)
        this.addVertice(-1,-1,-1)
        this.addVertice(-1,-1,1)
        this.addVertice(-1,1,1)
        this.addVertice(1,1,1)
        this.addVertice(-1,1,1)

        this.vertices.forEach((e)=>{
            e.x = e.x * (1/2) * dim[0]
            e.y = e.y * (1/2) * dim[1]
            e.z = e.z * (1/2) * dim[2]
        })
        this.addEdge("v-0","v-1")//1
        this.addEdge("v-1","v-2")//2
        this.addEdge("v-2","v-3")//3
        this.addEdge("v-3","v-4")//4
        this.addEdge("v-4","v-5")//5
        this.addEdge("v-5","v-6")//6
        this.addEdge("v-6","v-7")//7
        this.addEdge("v-7","v-0")//8
        this.addEdge("v-1","v-6")//9
        this.addEdge("v-2","v-5")//10
        this.addEdge("v-0","v-3")//11
        this.addEdge("v-4","v-7")//12
    }
}

function drawCube(cubeVerticies,x=600,y=300){
    drawLine([(cubeVerticies[0][0]+x),(cubeVerticies[0][1]+y),cubeVerticies[0][2]],[(cubeVerticies[1][0]+x),(cubeVerticies[1][1]+y),cubeVerticies[1][2]])
    drawLine([(cubeVerticies[0][0]+x),(cubeVerticies[0][1]+y),cubeVerticies[0][2]],[(cubeVerticies[3][0]+x),(cubeVerticies[3][1]+y),cubeVerticies[3][2]])
    drawLine([(cubeVerticies[0][0]+x),(cubeVerticies[0][1]+y),cubeVerticies[0][2]],[(cubeVerticies[5][0]+x),(cubeVerticies[5][1]+y),cubeVerticies[5][2]])
    drawLine([(cubeVerticies[2][0]+x),(cubeVerticies[2][1]+y),cubeVerticies[2][2]],[(cubeVerticies[1][0]+x),(cubeVerticies[1][1]+y),cubeVerticies[1][2]])
    drawLine([(cubeVerticies[2][0]+x),(cubeVerticies[2][1]+y),cubeVerticies[2][2]],[(cubeVerticies[3][0]+x),(cubeVerticies[3][1]+y),cubeVerticies[3][2]])
    drawLine([(cubeVerticies[2][0]+x),(cubeVerticies[2][1]+y),cubeVerticies[2][2]],[(cubeVerticies[7][0]+x),(cubeVerticies[7][1]+y),cubeVerticies[7][2]])
    drawLine([(cubeVerticies[6][0]+x),(cubeVerticies[6][1]+y),cubeVerticies[6][2]],[(cubeVerticies[1][0]+x),(cubeVerticies[1][1]+y),cubeVerticies[1][2]])
    drawLine([(cubeVerticies[6][0]+x),(cubeVerticies[6][1]+y),cubeVerticies[6][2]],[(cubeVerticies[5][0]+x),(cubeVerticies[5][1]+y),cubeVerticies[5][2]])
    drawLine([(cubeVerticies[6][0]+x),(cubeVerticies[6][1]+y),cubeVerticies[6][2]],[(cubeVerticies[7][0]+x),(cubeVerticies[7][1]+y),cubeVerticies[7][2]])
    drawLine([(cubeVerticies[5][0]+x),(cubeVerticies[5][1]+y),cubeVerticies[5][2]],[(cubeVerticies[4][0]+x),(cubeVerticies[4][1]+y),cubeVerticies[4][2]])
    drawLine([(cubeVerticies[4][0]+x),(cubeVerticies[4][1]+y),cubeVerticies[4][2]],[(cubeVerticies[3][0]+x),(cubeVerticies[3][1]+y),cubeVerticies[3][2]])
    drawLine([(cubeVerticies[4][0]+x),(cubeVerticies[4][1]+y),cubeVerticies[4][2]],[(cubeVerticies[7][0]+x),(cubeVerticies[7][1]+y),cubeVerticies[7][2]])
}
function drawPiramid(cubeVerticies,x=600,y=300){
    drawLine([(cubeVerticies[0][0]+x),(cubeVerticies[0][1]+y)],[(cubeVerticies[1][0]+x),(cubeVerticies[1][1]+y)])
    drawLine([(cubeVerticies[0][0]+x),(cubeVerticies[0][1]+y)],[(cubeVerticies[3][0]+x),(cubeVerticies[3][1]+y)])
    drawLine([(cubeVerticies[2][0]+x),(cubeVerticies[2][1]+y)],[(cubeVerticies[1][0]+x),(cubeVerticies[1][1]+y)])
    drawLine([(cubeVerticies[2][0]+x),(cubeVerticies[2][1]+y)],[(cubeVerticies[3][0]+x),(cubeVerticies[3][1]+y)])
    drawLine([(cubeVerticies[4][0]+x),(cubeVerticies[4][1]+y)],[(cubeVerticies[0][0]+x),(cubeVerticies[0][1]+y)])
    drawLine([(cubeVerticies[4][0]+x),(cubeVerticies[4][1]+y)],[(cubeVerticies[1][0]+x),(cubeVerticies[1][1]+y)])
    drawLine([(cubeVerticies[4][0]+x),(cubeVerticies[4][1]+y)],[(cubeVerticies[2][0]+x),(cubeVerticies[2][1]+y)])
    drawLine([(cubeVerticies[4][0]+x),(cubeVerticies[4][1]+y)],[(cubeVerticies[3][0]+x),(cubeVerticies[3][1]+y)])
}

//--------------------------------------------------------------//
//               instanciamiento de entidades                   //
//--------------------------------------------------------------//

function s1(cubo){
    i = 0
    setInterval(()=>{
        if(i<=5000){
            v = rotateObjectXY(cubo,i/100)
            v = rotateObjectZY(v)
            ctx.clearRect(0,0,1000,1000)
            drawCube(v,600,300)
            i += 1
        }
    },100)
}

function s2(cubo){
    i = 0
    setInterval(()=>{
        if(i<=5000){
            v = rotateObjectXY(cubo,i/100)
            v = rotateObjectZY(v,i/10)
            ctx.clearRect(0,0,1000,1000)
            drawPiramid(v,600,300)
            i += 1
        }
    },100)
}

piramide = [[100,-100,-100],[-100,-100,-100],[-100,100,-100],[100,100,-100],[0,0,100]]

cubo     = [[100,-100,100],[100,-100,-100],[-100,-100,-100],[-100,-100,100],[-100,100,100],[100,100,100],[100,100,-100],[-100,100,-100]]


//--------------------------------------------------------------//
//                         runtime                              //
//--------------------------------------------------------------//

document.addEventListener("click",(e)=>{console.log(e.clientX,e.clientY)})

//s1(cubo)

c = new Cube([10,10,0],[100,100,100])
console.log(c.vertices)
ctx.clearRect(0,0,1000,1000)
c.rotateXY(50)
c.render()
