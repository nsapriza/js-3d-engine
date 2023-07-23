let canvase     =   document.createElement("canvas");
canvase.width   =   window.innerWidth;
canvase.height  =   window.innerHeight;
document.body.appendChild(canvase);
let ctx         =   canvase.getContext("2d");


function drawPoint(x,y){
    ctx.fillRect(x-0.5, y-0.5, 0.5, 0.5);
    ctx.stroke();
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
            console.warn(a[0],lineFunction)
        } 
    }else{
        if(a[1]>b[1]){
            c = a
            a = b
            b = c
        }
        for(let y = a[1] ; b[1]>y ; y+=0.5){
            drawPoint(b[0],y)
            console.warn(y)
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

/* document.addEventListener("pointermove",function(e){
    drawCircle(e.clientX,e.clientY,10)
}) */

/* document.addEventListener("click",function(e){
    drawCircle(e.clientX,e.clientY,100)
}) */

document.addEventListener("pointermove",function(e){
    drawLine([e.clientX,e.clientY],[e.clientX + Math.random()*50,e.clientY + Math.random()*50])
})

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
