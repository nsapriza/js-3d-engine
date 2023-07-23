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
        drawPoint(x+i,y)
        drawPoint(x,y-i)
        drawPoint(x-i,y)
    }
}

function drawLine(a,b){
    if((a[1]<270 && b[1]<270) || (a[1]>370 && b[1]>370) || (a[2]>=0 || b[2]>=0)){
        ctx.beginPath();
        ctx.moveTo(a[0],a[1]);
        ctx.lineTo(b[0], b[1]);
        ctx.stroke();
    }else{
        return
    }
    /* if (!Array.isArray(a)  || !Array.isArray(b)){
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
    } */
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


//-------------------------------------------------------------------------------------------------

piramide = [[100,-100,-100],[-100,-100,-100],[-100,100,-100],[100,100,-100],[0,0,100]]

cubo     = [[100,-100,100],[100,-100,-100],[-100,-100,-100],[-100,-100,100],[-100,100,100],[100,100,100],[100,100,-100],[-100,100,-100]]

//-------------------------------------------------------------------------------------------------

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
//s2(piramide)

document.addEventListener("click",(e)=>{console.log(e.clientX,e.clientY)})

s1(cubo)

/* v = rotateObjectXY(cubo,Math.PI/4)
v = rotateObjectZY(v)
 */

//console.log([v[2][0]+600 , v[2][1]+300 , v[2][2]] , [ v[3][0]+600 , v[3][1]+300 , v[3][2]])
//console.log(v[2][1]+300 > 270 || v[3][1]+300 > 270)
//console.log(v[2][1]+300 < 300 || v[3][1]+300 < 300)
//console.log(v[2][1]+300 > 270,v[2][1]+300 < 300 ,v[2][2] <= 0,0,v[3][1]+300 > 270,v[3][1]+300 < 300 ,v[3][2] <= 0)

/* console.log((v[1]<270 && v[1]<270),(v[1]>370 && v[1]>370),(v[2]>=0 && v[2]>=0))
drawLine([(v[2][0]+x),(v[2][1]+y),v[2][2]],[(v[3][0]+x),(v[3][1]+y),v[3][2]])

ctx.clearRect(0,0,1000,1000)
drawCube(v,600,300) */