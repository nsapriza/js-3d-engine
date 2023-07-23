let canvase     =   document.createElement("canvas");
canvase.width   =   window.innerWidth;
canvase.height  =   window.innerHeight;
document.body.appendChild(canvase);
let ctx         =   canvase.getContext("2d");


function drawPoint(x,y){
    ctx.fillRect(x-0.5, y-0.5, 0.5, 0.5);
    ctx.stroke();
}

function drawCross(x,y){
    for(let i = 0;i<=10;i++){
        drawPoint(x,y+i)
    }
    for(let i = 0;i<=10;i++){
        drawPoint(x+i,y)
    }
    for(let i = 0;i<=10;i++){
        drawPoint(x,y-i)
    }
    for(let i = 0;i<=10;i++){
        drawPoint(x-i,y)
    }
}

function drawLine(a,b){
    if (!Array.isArray(a)  || !Array.isArray(b)){
        console.error("drawLine() was not given suficient data, arrays expected")
        console.table(a,b)
        return
    }
    if(a.length != 2 || b.length != 2){
        console.error("array size more than expected")
        console.table(a,b)
        return
    }
    if(a[0]>b[0]){
        c = a
        a = b
        b = c
    }
    if(a[0]!==b[0]){
        slope = (a[1] - b[1]) / (a[0] - b[0])
        for (let delta = a[0];b[0]>delta;delta+=0.5){
            lineFunction = slope * (delta - b[0]) + b[1]
            drawPoint(delta,lineFunction)
            //console.warn(a[0],lineFunction)
        } 
    }else{
        if(a[1]>b[1]){
            c = a
            a = b
            b = c
        }
        for(let y = a[1] ; b[1]>y ; y+=0.5){
            drawPoint(b[0],y)
            //console.warn(y)
        }
    }
}
function drawCircle(h,k,r){
    /* drawPoint(x-r,y); */
    //"h" y "k" a son las coords del centro de la circ
    lastfx1 = 0
    lastfx2 = 0
    for(let x = h - r; x <= h + r; x += 1){
        // la ecuacion general de la circunferencia es: x**2 - 2*h*x + h**2 + k**2 - r**2 - 2*k*y + y**2
        // ordeno esta ecuacion en funcion de "y"
        // hago bascaras por positivo y negativo
        c   =   (x**2 - 2*h*x + h**2 + k**2 - r**2);
        b   =   (-2*k)
        fx1 =   (-b + Math.sqrt(b**2 -4*c))/2;
        fx2 =   (-b - Math.sqrt(b**2 -4*c))/2;

        /* fx1Prima = (h - x)/(Math.sqrt(h**2 - 2*x*h + k**2 -2*k -r**2 -4*x**2)) */
        /* fx1Prima = Math.abs(-(2*(x-h))/Math.sqrt(4*k**2-4*(x**2-2*h*x-r**2+k**2+h**2))) */
        
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

function rotateVector(x,y,z,rad){
    xp = x * Math.sin(rad) + y * Math.cos(rad)
    yp = x * (-Math.cos(rad)) + y * Math.sin(rad)
    z  = z 
    return [xp,yp,z]
}

//cubeVerticies = [[100,-100,100],[100,100,100],[-100,-100,100],[-100,100,100],[100,-100,-100],[100,100,-100],[-100,-100,-100],[-100,100,-100]]

cubeVerticies = [[100,-100,100],[100,-100,-100],[-100,-100,-100],[-100,-100,100],[-100,100,100],[100,100,100],[100,100,-100],[-100,100,-100]]

function seeCube(cubeVerticiesOg){
    cubeVerticiesN = []
    for(let i = 0;i<=cubeVerticiesOg.length - 1;i++){
        out = [cubeVerticiesOg[i][0],cubeVerticiesOg[i][1]* Math.sin(Math.PI/4) - cubeVerticiesOg[i][2] * Math.cos(Math.PI/4),cubeVerticiesOg[i][1]* Math.cos(Math.PI/4) + cubeVerticiesOg[i][2] * Math.sin(Math.PI/4)]
        cubeVerticiesN.push(out)
    }
    return cubeVerticiesN
}

function rotateCube(cubeVerticies,rad){
    output = cubeVerticies    
    
    for(let i = 0;i<=cubeVerticies.length - 1;i++){
        output[i] = rotateVector(output[i][0],output[i][1],output[i][2],rad) 
    }
    return output
}

function drawCube(cubeVerticies,x=600,y=300){
    //console.log(cubeVerticies)
    cubeVerticies = seeCube(cubeVerticies)
    //console.log(cubeVerticies)
    drawLine([(cubeVerticies[0][0]+x),(cubeVerticies[0][1]+y)],[(cubeVerticies[1][0]+x),(cubeVerticies[1][1]+y)])
    drawLine([(cubeVerticies[0][0]+x),(cubeVerticies[0][1]+y)],[(cubeVerticies[3][0]+x),(cubeVerticies[3][1]+y)])
    drawLine([(cubeVerticies[0][0]+x),(cubeVerticies[0][1]+y)],[(cubeVerticies[5][0]+x),(cubeVerticies[5][1]+y)])
    drawLine([(cubeVerticies[2][0]+x),(cubeVerticies[2][1]+y)],[(cubeVerticies[1][0]+x),(cubeVerticies[1][1]+y)])
    drawLine([(cubeVerticies[2][0]+x),(cubeVerticies[2][1]+y)],[(cubeVerticies[3][0]+x),(cubeVerticies[3][1]+y)])
    drawLine([(cubeVerticies[2][0]+x),(cubeVerticies[2][1]+y)],[(cubeVerticies[7][0]+x),(cubeVerticies[7][1]+y)])
    drawLine([(cubeVerticies[6][0]+x),(cubeVerticies[6][1]+y)],[(cubeVerticies[1][0]+x),(cubeVerticies[1][1]+y)])
    drawLine([(cubeVerticies[6][0]+x),(cubeVerticies[6][1]+y)],[(cubeVerticies[5][0]+x),(cubeVerticies[5][1]+y)])
    drawLine([(cubeVerticies[6][0]+x),(cubeVerticies[6][1]+y)],[(cubeVerticies[7][0]+x),(cubeVerticies[7][1]+y)])
    drawLine([(cubeVerticies[5][0]+x),(cubeVerticies[5][1]+y)],[(cubeVerticies[4][0]+x),(cubeVerticies[4][1]+y)])
    drawLine([(cubeVerticies[4][0]+x),(cubeVerticies[4][1]+y)],[(cubeVerticies[3][0]+x),(cubeVerticies[3][1]+y)])
    drawLine([(cubeVerticies[4][0]+x),(cubeVerticies[4][1]+y)],[(cubeVerticies[7][0]+x),(cubeVerticies[7][1]+y)])




    /* for(let i = 0;i<=cubeVerticies.length - 1;i++){
        //drawCross(Math.round(cubeVerticies[i][0]+600),Math.round(cubeVerticies[i][1]+300))
        
        //drawLine([Math.round(cubeVerticies[i][0]+600),Math.round(cubeVerticies[i][1]+300)],[Math.round(cubeVerticies[i+1][0]+600),Math.round(cubeVerticies[i+1][1]+300)])
        //console.log([Math.round(cubeVerticies[i][0]+100),Math.round(cubeVerticies[i][1]+100)])
        
        drawLine([(cubeVerticies[i][0]+600),(cubeVerticies[i][1]+300)],[(cubeVerticies[i+1][0]+600),(cubeVerticies[i+1][1]+300)])
        
        //console.log([cubeVerticies[i+1][0],Math.round(cubeVerticies[i+1][1])])
        //drawLine([cubeVerticies[i+1][0]+100,cubeVerticies[i+1][1]*100],[cubeVerticies[0]+100,cubeVerticies[i][1]*100+10])
    } */
}


i=0
function s1(){
    setInterval(()=>{
        if(i<=10000){
            ctx.clearRect(0,0,1000,1000)
            drawCube(rotateCube(cubeVerticies,i),600,300)
            //console.log(rotateCube(cubeVerticies,i))
            i+=0.0001
        }
    },100)
}
function s2(){
    setInterval(()=>{
        if(i<=10000){
            drawCube(rotateCube(cubeVerticies,i))
            //console.log(rotateCube(cubeVerticies,i))
            i+=0.0001
        }
    },100)
}
function s3(){
    setInterval(()=>{
        if(i<=10000){
            ctx.clearRect(0,0,1000,250)
            drawCube(rotateCube(cubeVerticies,i))
            i+=0.0001
        }
    },100)
}

s1()


/* document.addEventListener("pointermove",function(e){
    drawCircle(e.clientX,e.clientY,10)
}) */

/* document.addEventListener("click",function(e){
    drawCircle(e.clientX,e.clientY,100)
}) */

/* document.addEventListener("pointermove",function(e){
    drawLine([e.clientX,e.clientY],[e.clientX + Math.random()*50,e.clientY + Math.random()*50])
}) */

/* coordA  = []
coordB  = []
document.addEventListener("click",function(e){
    if(coordA.length == 0){
        coordA = [e.clientX,e.clientY]
    }else{
        coordB = [e.clientX,e.clientY]
        console.table(coordA,coordB)
        drawLine(coordA,coordB)
        coordA  = []
        coordB  = []
    }
}) */






//cool
/* 
i=0
function s1(){
    setInterval(()=>{
        if(i<=10000){
            ctx.clearRect(0,0,100,100)
            drawCube(rotateCube(cubeVerticies,i),100,100)
            //console.log(rotateCube(cubeVerticies,i))
            i+=0.0001
        }
    },100)
}
function s2(){
    setInterval(()=>{
        if(i<=10000){
            drawCube(rotateCube(cubeVerticies,i))
            //console.log(rotateCube(cubeVerticies,i))
            i+=0.0001
        }
    },100)
}
function s3(){
    setInterval(()=>{
        if(i<=10000){
            drawCube(rotateCube(cubeVerticies,i))
            //console.log(rotateCube(cubeVerticies,i))
            i+=0.0001
        }
    },100)
    setInterval(()=>{ctx.clearRect(0,0,1000,1000)},500)
}

s3()
s1() */