function app_1(){
    
    
    function drawGrid(color, stepx, stepy) {
       ctx.save()
       ctx.strokeStyle = color;
       ctx.fillStyle = '#ffffff';
       ctx.lineWidth = 0.5;
       ctx.fillRect(0, 0, canvas.width, canvas.height);
    
       for (var i = stepx + 0.5; i < canvas.width; i += stepx) {
         ctx.beginPath();
         ctx.moveTo(i, 0);
         ctx.lineTo(i, canvas.height);
         ctx.stroke();
       }
    
       for (var i = stepy + 0.5; i < canvas.height; i += stepy) {
         ctx.beginPath();
         ctx.moveTo(0, i);
         ctx.lineTo(canvas.width, i);
         ctx.stroke();
       }
       ctx.restore();
    }
    
    var Runge_Kutta=function(m,L2, h){
        this.L2=L2;
        this.L1=1;
        this.m=m;
        this.h=h;
    };
    Runge_Kutta.prototype={
       f:function(x, y, vx, vy, t){
            var A=this.L2*((this.m+1)*9.8*Math.sin(x)/this.L2+vy*vy*Math.sin(x-y))/this.L1;
            var B=Math.cos(x-y)*(9.8*Math.sin(y)/this.L1-vx*vx*Math.sin(x-y));
            var C=this.m+Math.sin(x-y)*Math.sin(x-y);
            return (B-A)/C;
        },
        g:function(x, y, vx, vy, t){
            var A=(this.m+1)*this.L1*(9.8*Math.sin(y)/this.L1-vx*vx*Math.sin(x-y))/this.L2;
            var B=Math.cos(x-y)*((this.m+1)*9.8*Math.sin(x)/this.L2+vy*vy*Math.sin(x-y));
            var C=this.m+Math.sin(x-y)*Math.sin(x-y);
            return (B-A)/C;
        },
        energia:function(x, y, vx, vy){
            var E=(this.m+1)*this.L1*vx*vx/(2*this.L2)+this.L2*vy*vy/(2*this.L1)+vx*vy*Math.cos(x-y)-(this.m+1)*9.8*Math.cos(x)/this.L2-9.8*Math.cos(y)/this.L1;
             return E;
        },
        resolver:function(e){
            var k1, k2, k3, k4;
            var l1, l2, l3, l4;
            var q1, q2, q3, q4;
            var m1, m2, m3, m4;
    //estado inicial
            var x=e.x;
            var y=e.y;
            var vx=e.vx;
            var vy=e.vy;
            var t=e.t;
    
            k1=this.h*vx;
            l1=this.h*this.f(x, y, vx, vy, t);
            q1=this.h*vy;
            m1=this.h*this.g(x, y, vx, vy, t);
    
            k2=this.h*(vx+l1/2);
            l2=this.h*this.f(x+k1/2, y+q1/2, vx+l1/2, vy+m1/2, t+this.h/2);
            q2=this.h*(vy+m1/2);
            m2=this.h*this.g(x+k1/2, y+q1/2, vx+l1/2, vy+m1/2, t+this.h/2);
    
            k3=this.h*(vx+l2/2);
            l3=this.h*this.f(x+k2/2, y+q2/2, vx+l2/2, vy+m2/2, t+this.h/2);
            q3=this.h*(vy+m2/2);
            m3=this.h*this.g(x+k2/2, y+q2/2, vx+l2/2, vy+m2/2, t+this.h/2);
    
            k4=this.h*(vx+l3);
            l4=this.h*this.f(x+k3, y+q3, vx+l3, vy+m3, t+this.h);
            q4=this.h*(vy+m3);
            m4=this.h*this.g(x+k3, y+q3, vx+l3, vy+m3, t+this.h);
    
            x+=(k1+2*k2+2*k3+k4)/6;
            vx+=(l1+2*l2+2*l3+l4)/6;
            y+=(q1+2*q2+2*q3+q4)/6;
            vy+=(m1+2*m2+2*m3+m4)/6;
            t+=this.h;
    //estado 
            e.x=x;
            e.y=y;
            e.vx=vx;
            e.vy=vy;
            e.t=t;
        }
    } 
    
    
    var canvas = document.getElementById('canvas_1'),
        ctx = canvas.getContext('2d');
    ctx.font = '13px Helvetica';
    var wChar= ctx.measureText('m').width;
    
    var escala=(canvas.height-2*wChar)/3.0,
        orgX=wChar+3.0*Math.sin(20*Math.PI/180)*escala, 
        orgY=wChar, //para la gráfica
    //parámetros
        lon1=1.0,
        lon2=2.0,
     // tiempo
        eInicial=0,
        estado={t:0.0, x:Math.PI/3, y:-Math.PI/6, vx:0.0,vy:0},
        objeto=new Runge_Kutta(1, 1, 0.025),
    //gráfica
        orgXGraf=3*canvas.width/4, 
        orgYGraf=canvas.height/2, 
        escalaX=(canvas.width-orgXGraf-wChar)/90.0, 
        escalaY=(orgYGraf-wChar)/10.0, //para la gráfica
         error=0,
        pol_1=[],
        pol_2=[],
        nPuntos=400;
    
     function dispositivo(g){
        g.fillStyle='gray';
        g.fillRect(orgX-wChar, 0, 2*wChar, wChar);
        g.fillStyle='black';
        g.beginPath();
        g.arc(orgX, orgY, 3, 0, 2*Math.PI);
        g.fill();
        var x1=orgX+lon1*Math.sin(estado.x)*escala;
        var y1=orgY+lon1*Math.cos(estado.x)*escala;
        g.beginPath();
        g.moveTo(orgX, orgY);
        g.lineTo(x1, y1);
        g.stroke();
        g.fillStyle='red';
        g.beginPath();
        g.arc(x1, y1, wChar/2, 0, 2*Math.PI);
        g.fill();
        var x2=orgX+(lon1*Math.sin(estado.x)+lon2*Math.sin(estado.y))*escala;
        var y2=orgY+(lon1*Math.cos(estado.x)+lon2*Math.cos(estado.y))*escala;
        g.strokeStyle='black';
        g.beginPath();
        g.moveTo(x1, y1+wChar/2);
        g.lineTo(x2, y2);
        g.stroke();
        g.fillStyle='blue';
        g.beginPath();
        g.arc(x2, y2, wChar/2,  0, 2*Math.PI);
        g.fill();
    //energía
        g.textAlign='left';
        g.textBaseline='bottom';	
    //datos
        g.fillStyle='black';
       g.fillText('t: '+(estado.t).toFixed(2), 0, canvas.height-2);
        g.fillStyle='red';
        g.fillText('\u03B8\u2081: '+(estado.x*180/Math.PI).toFixed(1), 7*wChar, canvas.height-2);
        g.fillStyle='blue';
        g.fillText('\u03B8\u2082: '+(estado.y*180/Math.PI).toFixed(1), 15*wChar, canvas.height-2);
    }
    
    function grafica(g){
        var x1, y1;
        g.textAlign='right';
        g.textBaseline='middle';	
        g.fillStyle='black';
        g.strokeStyle='black';
        g.beginPath();
        g.moveTo(orgXGraf, canvas.height);
        g.lineTo(orgXGraf, 0); //vertical
    //para la carga
        for(var i=-10; i<=10; i+=2){  //eje vertical
            y1=orgYGraf-escalaY*i;
            g.fillText(i, orgXGraf-wChar, y1);
            g.moveTo(orgXGraf, y1);
            g.lineTo(orgXGraf-wChar, y1);
            y1=orgYGraf-escalaY*(i+1);
            g.moveTo(orgXGraf, y1);
            g.lineTo(orgXGraf-wChar/2, y1);
        }
        g.fillText('\u03B8', canvas.width, orgYGraf-wChar);
        g.textAlign='center';
        g.textBaseline='top';	
        g.moveTo(canvas.width/2, orgYGraf);
        g.lineTo(canvas.width, orgYGraf);
        g.fillText('\u03C9', orgXGraf+wChar, 2);
        for(var i=-90; i<=90; i+=20){   //eje horizontal
            x1=orgXGraf+escalaX*i;
            g.moveTo(x1, orgYGraf);
            g.lineTo(x1, orgYGraf+wChar);
            g.fillText(i, x1, orgYGraf+wChar);
            x1=orgXGraf+escalaX*(i+10);
            g.moveTo(x1, orgYGraf);
            g.lineTo(x1, orgYGraf+wChar/2);
        }
        g.stroke();
    //función
        x1=orgXGraf+estado.x*escalaX*180/Math.PI;
        y1=orgYGraf-estado.vx*escalaY;
        pol_1.push({x:x1, y:y1});
        g.strokeStyle='red';
        g.beginPath();
        g.moveTo(pol_1[0].x, pol_1[0].y);
        for(var i=1; i<pol_1.length; i++){
            g.lineTo(pol_1[i].x, pol_1[i].y);	
        }
        g.stroke();
        g.fillStyle='red';
        g.beginPath();
        g.arc(x1,y1,2,0,2*Math.PI);
        g.fill();      
    
        x1=orgXGraf+estado.y*escalaX*180/Math.PI;
        y1=orgYGraf-estado.vy*escalaY;
        pol_2.push({x:x1, y:y1});
    
        g.strokeStyle='blue';
        g.beginPath();
        g.moveTo(pol_2[0].x, pol_2[0].y);
        for(var i=1; i<pol_2.length; i++){
            g.lineTo(pol_2[i].x, pol_2[i].y);	
        }
        g.stroke();
        g.fillStyle='blue';
        g.beginPath();
        g.arc(x1,y1,2,0,2*Math.PI);
        g.fill(); 
    //elimina el primer elemento
        if (pol_2.length>nPuntos){
            pol_2.shift();
            pol_1.shift();
        }
    
        g.textAlign='left';
        g.textBaseline='bottom';	
        g.fillStyle='red';
        error=Math.abs(100*(objeto.energia(estado.x,estado.y,estado.vx,estado.vy)-eInicial)/eInicial);
        g.fillText('Error %: '+error.toFixed(3), canvas.width-10*wChar, 3*wChar/2);
    }
    
    
    
    
    
    var raf,
        nuevo = document.getElementById('nuevo'),
        empieza = document.getElementById('empieza'),
        paso = document.getElementById('paso'),
        pausa=document.getElementById('pausa');
    
    drawGrid('lightgray', 10, 10); 
    dispositivo(ctx);	
    empieza.disabled=true;
    pausa.disabled=true;
    
    
    
            
    
    
    nuevo.onclick = function (e) {
        var m2=parseFloat(document.getElementById('masa2_1').value);
        lon2=parseFloat(document.getElementById('longitud2_1').value);
        var ang1=parseFloat(document.getElementById('angulo1_1').value)*Math.PI/180;
        var ang2=parseFloat(document.getElementById('angulo2_1').value)*Math.PI/180;	
        nPuntos=parseFloat(document.getElementById('numero_1').value);	
        var paso=parseFloat(document.getElementById('paso_1').value);
        
    
        estado={t:0.0, x:ang1, y:ang2, vx:0.0,vy:0};
        objeto=new Runge_Kutta(1/m2, lon2, paso);
        pol_1.length=0;
        pol_2.length=0;
        eInicial=-(1/m2+1)*9.8*Math.cos(ang1)/lon2-9.8*Math.cos(ang2);
        
        ctx.clearRect(0,0,canvas.width,canvas.height);
        drawGrid('lightgray', 10, 10);  
        dispositivo(ctx);
        empieza.disabled=false;
        pausa.disabled=true;
        paso.style.display='none';
        pausa.style.display='inline';
        if(raf!=undefined){
            window.cancelAnimationFrame(raf);
        }
    }
    
    empieza.onclick = function (e) {
        empieza.disabled=true;
        pausa.disabled=false;
        paso.style.display='none';
        pausa.style.display='inline';
        raf=window.requestAnimationFrame(animate);
    }
    pausa.onclick = function (e) {
      empieza.disabled=false;
        pausa.disabled=true;
         paso.style.display='inline';
        pausa.style.display='none';
       window.cancelAnimationFrame(raf);
    }
    paso.onclick = function (e) {
        update();
        ctx.clearRect(0,0,canvas.width,canvas.height);
        drawGrid('lightgray', 10, 10);  
        dispositivo(ctx);
       grafica(ctx);
    }
    
    function update() {
        objeto.resolver(estado);
    }
    
    function animate(time) {
        update();
        ctx.clearRect(0,0,canvas.width,canvas.height);
        drawGrid('lightgray', 10, 10);  
        dispositivo(ctx);
        grafica(ctx);
        if (error>1){
           window.cancelAnimationFrame(raf);
            pausa.disabled=true;
         }else{
            raf=window.requestAnimationFrame(animate);
        }    
    }
    
        
    }