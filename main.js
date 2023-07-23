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

function drawLine(a,b){
    ctx.beginPath();
    ctx.moveTo(a[0],a[1]);
    ctx.lineTo(b[0], b[1]);
    ctx.stroke();
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
        let x = this.x * Math.round(Math.cos(rad)*1000)/1000   - this.y * Math.round(Math.sin(rad))
        let y = this.x * Math.round(Math.sin(rad)*1000)/1000   + this.y * Math.round(Math.cos(rad)*1000)/1000
        let z = this.z
        this.update(x,y,z) 
    }
    rotateZY(rad=Math.PI/4){
        let x = this.x
        let y = this.y * Math.round(Math.cos(rad)*1000)/1000 - this.z * Math.round(Math.sin(rad)*1000)/1000
        let z = this.y * Math.round(Math.sin(rad)*1000)/1000 + this.z * Math.round(Math.cos(rad)*1000)/1000
        this.update(x,y,z)
    }
    rotateZX(rad=Math.PI/4){
        //console.log([this.x,this.y,this.z])
        let x = this.x * Math.round(Math.cos(rad)*1000)/1000 - this.z * Math.round(Math.sin(rad)*1000)/1000
        let y = this.y
        let z = this.x * Math.round(Math.sin(rad)*1000)/1000 + this.z * Math.round(Math.cos(rad)*1000)/1000
        this.update(x,y,z)
        //console.log([this.x,this.y,this.z])
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

        this.x        = pos[0]/2
        this.y        = pos[1]/2
        this.z        = pos[2]/2
        this.vertices = []
        this.edges    = []
        this.faces    = []
        
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
    }
    rotateZY(rad){
        this.vertices.forEach((e)=>{
            e.rotateZY(rad)
        })
    }
    rotateZX(rad){
        this.vertices.forEach((e)=>{
            e.rotateZX(rad)
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


//--------------------------------------------------------------//
//               instanciamiento de entidades                   //
//--------------------------------------------------------------//

//fffffffffffffffffffffffffffffffffffffffffffffffffffff
/* c1  = new Cube([500,1150,100],[100,100,100])
c2  = new Cube([500,950,100],[100,100,100])
c3  = new Cube([500,750,100],[100,100,100])
c4  = new Cube([500,550,100],[100,100,100])
c5  = new Cube([500,350,100],[100,100,100])
c6  = new Cube([700,350,100],[100,100,100])
c7  = new Cube([900,350,100],[100,100,100])
c8  = new Cube([1100,350,100],[100,100,100])
c9  = new Cube([700,750,100],[100,100,100])
c10 = new Cube([900,750,100],[100,100,100]) */

c1  = new Cube([500,700,100],[50,600,50])

c2  = new Cube([700,700,100],[150,50,50])

c3  = new Cube([850,150,100],[300,50,50])

//eeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
c4  = new Cube([1500,700,100],[50,600,50])

c5  = new Cube([1850,700,100],[300,50,50])

c6  = new Cube([1850,150,100],[300,50,50])

c7  = new Cube([1850,1250,100],[300,50,50])

//l
c8  = new Cube([500,700,100],[50,600,50])

c9  = new Cube([850,1250,100],[300,50,50])

//I

c10 = new Cube([1500,800,100],[50,500,50])

c11 = new Cube([1500,200,100],[50,50,50])

//z

c12 = new Cube([1200,1250,100],[600,50,50])

c13 = new Cube([1200,750,100],[600,50,50])
c13.rotateXY(-Math.PI/4)

c14 = new Cube([1200,250,100],[600,50,50])

//-

c15 = new Cube([1200,750,100],[600,50,50])

//d
let c16 = new Cube([800,450,100],[400,50,50])
c16.rotateXY(Math.PI/4)

c17 = new Cube([800,950,100],[400,50,50])
c17.rotateXY(-Math.PI/4)

//a
c18 = new Cube([1000,650,100],[600,50,50])
c18.rotateXY(-Math.PI/3)
c19 = new Cube([1400,650,100],[600,50,50])
c19.rotateXY(Math.PI/3)
c20 = new Cube([1200,700,100],[150,50,50])


cubes = [c1,c2,c3,c4,c5,c6,c7]

cubos=[[c1,c2,c3,c4,c5,c6,c7],[c8,c9,c10,c11],[c12,c13,c14],[c15],[c1,c16,c17,c10,c11],[c18,c19,c20]]



//--------------------------------------------------------------//
//                         runtime                              //
//--------------------------------------------------------------//

document.addEventListener("click",(e)=>{console.log(e.clientX,e.clientY)})

ctx.clearRect(0,0,1000,1000)


i   = 1
j   = 1

setInterval(()=>{
    cubes = cubos[j]
    cubes.forEach((e)=>{e.rotateZX(-Math.PI/2)})
    if(j!=cubos.length-1){
        j++
    }
},5000)

cubes.forEach((e)=>{e.rotateZX(-Math.PI/2)})
setInterval(()=>{
    if(i<1000000){
        ctx.clearRect(0,0,10000,1000)
        cubes.forEach((e)=>{
            e.rotateZX(0.05)
            e.render()
        })
        i+=1
    }

},100)  





// c1.rotateXY()
// c1.rotateZY()
// c1.render()

/* c2.rotateXY()
c2.rotateZY()
c2.render()

c3.rotateXY()
c3.rotateZY()
c3.render()

c4.rotateXY()
c4.rotateZY()
c4.render()

c5.rotateXY()
c5.rotateZY()
c5.render()

c6.rotateXY()
c6.rotateZY()
c6.render()

c7.rotateXY()
c7.rotateZY()
c7.render()

c8.rotateXY()
c8.rotateZY()
c8.render()

c9.rotateXY()
c9.rotateZY()
c9.render()

c10.rotateXY()
c10.rotateZY()
c10.render() */


// c5.rotateZX()
// c5.rotateZY()
// c5.render()