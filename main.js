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

//--------------------------------------------------------------//
//                         objetos                              //
//--------------------------------------------------------------//

class Point{
    constructor(name,x,y,z,displacement){
        this.name   = name
        this.x      = x
        this.y      = y
        this.z      = z
    }

}

class Line{
    constructor(name,p1,p2){
        this.name   = name
        this.point1 = p1
        this.point2 = p2
    }
    render(xOfset,yOfset,zOfset){
        let p1 = [this.point1.x+xOfset,this.point1.y+yOfset,this.point1.z+zOfset]
        let p2 = [this.point2.x+xOfset,this.point2.y+yOfset,this.point2.z+zOfset]
        drawLine(p1,p2)
    }
}

class Entity{
    constructor(pos){
        if (!Array.isArray(pos)){console.error("")}
        else if (pos.length != 3){console.error("")}

        this.x        = pos[0]/2
        this.y        = pos[1]/2
        this.z        = pos[2]/2
        this.vertices = []
        this.edges    = []
        this.faces    = []
        
    }
    addVertice(x,y,z){
        let name = "v-" + this.vertices.length
        let p = new Point(name,x,y,z)
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
        this.edges.forEach((e,i)=>{
            e.render(this.x,this.y,this.z)})
    }
}

class Cube extends Entity{
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
        
        let a = this.vertices
        console.log(a)
        this.vertices.forEach((e)=>{
            console.log(e)
            e.x = e.x * (1/2) * dim[0]
            e.y = e.y * (1/2) * dim[1]
            e.z = e.z * (1/2) * dim[2]
            console.log(e,(1/2) * dim[1])
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


//--------------------------------------------------------------//
//               instanciamiento de entidades                   //
//--------------------------------------------------------------//

c = new Cube([400,200,100],[100,100,100])


//--------------------------------------------------------------//
//                         runtime                              //
//--------------------------------------------------------------//

document.addEventListener("click",(e)=>{console.log(e.clientX,e.clientY)})

//s1(cubo)

console.log(c.vertices)
ctx.clearRect(0,0,1000,1000)
c.rotateXY(1)
c.rotateZY(5)
c.render()
