function app_2(){
    

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
    
    
    var canvas = document.getElementById('canvas_2'),
        ctx = canvas.getContext('2d');
    ctx.font = '13px Helvetica';
    var wChar= ctx.measureText('m').width;
    
    //orígenes
     //escala
    var escala=(canvas.height-2*wChar)/3.0,
        orgX=wChar+3.0*Math.sin(20*Math.PI/180)*escala, 
        orgY=wChar, //para la gráfica
    //parámetros
        m1=1.0,
        m2=1.0,
        lon1=1.0,
        lon2=1.0,
        ang1=Math.PI/18, //10 grados
        ang2=0,
        B1, B2, D1, D2, //coeficientes
        w1, w2, //cuadrados de las frecuencias normales
     // tiempo
        t=0.0,
        dt=0.025,
        energia=0,
    //gráfica
        orgXGraf=orgX+3.0*Math.sin(20*Math.PI/180)*escala+4*wChar, 
        orgYGraf=canvas.height/2, 
        escalaX=(canvas.width-orgXGraf-wChar)/10.0, 
        escalaY=(orgYGraf-wChar)/20.0, //para la gráfica
         pol_1=[],
        pol_2=[],
        multiplicar=0;
    
     function dispositivo(g){
        g.fillStyle='gray';
        g.fillRect(orgX-wChar, 0, 2*wChar, wChar);
        g.fillStyle='black';
        g.beginPath();
        g.arc(orgX, orgY, 3, 0, 2*Math.PI);
        g.fill();
        var x1=orgX+lon1*Math.sin(ang1)*escala;
        var y1=orgY+lon1*Math.cos(ang1)*escala;
        g.beginPath();
        g.moveTo(orgX, orgY);
        g.lineTo(x1, y1);
        g.stroke();
        g.fillStyle='red';
        g.beginPath();
        g.arc(x1, y1, wChar/2, 0, 2*Math.PI);
        g.fill();
        var x2=orgX+(lon1*Math.sin(ang1)+lon2*Math.sin(ang2))*escala;
        var y2=orgY+(lon1*Math.cos(ang1)+lon2*Math.cos(ang2))*escala;
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
        g.fillStyle='black';
        g.fillText('E(J): '+energia.toFixed(3), canvas.width-10*wChar, 3*wChar/2);
    //datos
        g.fillText('t: '+t.toFixed(2), 0, canvas.height-2);
        g.fillStyle='red';
        g.fillText('\u03B8\u2081: '+(ang1*180/Math.PI).toFixed(1), 7*wChar, canvas.height-2);
        g.fillStyle='blue';
        g.fillText('\u03B8\u2082: '+(ang2*180/Math.PI).toFixed(1), 15*wChar, canvas.height-2);
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
        for(var i=-20; i<=20; i+=5){  //eje vertical
            y1=orgYGraf-escalaY*i;
            g.fillText(i, orgXGraf-wChar, y1);
            g.moveTo(orgXGraf, y1);
            g.lineTo(orgXGraf-wChar, y1);
            for(var j=1; j<5; j++){
                y1=orgYGraf-escalaY*(i+j);
                g.moveTo(orgXGraf, y1);
                g.lineTo(orgXGraf-wChar/2, y1);
            }
        }
        g.fillText('t(s)', canvas.width, orgYGraf-wChar);
        g.textAlign='center';
        g.textBaseline='top';	
        g.moveTo(orgXGraf, orgYGraf);
        g.lineTo(canvas.width, orgYGraf);
        for(var i=0; i<=10; i++){   //eje horizontal
            x1=orgXGraf+escalaX*i;
            g.moveTo(x1, orgYGraf);
            g.lineTo(x1, orgYGraf+wChar);
            g.fillText(i+multiplicar*10, x1, orgYGraf+wChar);
        }
        g.stroke();
    //función
        x1=orgXGraf+(t-multiplicar*10)*escalaX;
        y1=orgYGraf-ang1*escalaY*180/Math.PI;
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
    
        y1=orgYGraf-ang2*escalaY*180/Math.PI;
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
    }
        
    var raf, 
        nuevo = document.getElementById('nuevo_2'),
        empieza = document.getElementById('empieza_2'),
       paso = document.getElementById('paso_2'),
        pausa=document.getElementById('pausa_2');
        
    drawGrid('lightgray', 10, 10);
    dispositivo(ctx); 
    empieza.disabled=true;
    pausa.disabled=true;
    
    nuevo.onclick = function (e) {	
        m2=parseFloat(document.getElementById('masa22_1').value);
        lon2=parseFloat(document.getElementById('longitud22_1').value);
        ang1=parseFloat(document.getElementById('angulo21_1').value)*Math.PI/180;
        ang2=parseFloat(document.getElementById('angulo22_1').value)*Math.PI/180;
        
        w1=((m1+m2)*9.8/(2*m1*lon1))*((1+lon1/lon2)-Math.sqrt((1+lon1/lon2)*(1+lon1/lon2)-4*m1*lon1/((m1+m2)*lon2)));
        w2=((m1+m2)*9.8/(2*m1*lon1))*((1+lon1/lon2)+Math.sqrt((1+lon1/lon2)*(1+lon1/lon2)-4*m1*lon1/((m1+m2)*lon2)));
      //coeficientes
        B2=w1*(w2*lon1*ang1+w2*lon2*ang2-9.8*ang2)/(9.8*(w2-w1));
        D2=w2*(-w1*lon1*ang1-w1*lon2*ang2+9.8*ang2)/(9.8*(w2-w1));
        B1=(-w1*lon2+9.8)*B2/(w1*lon1);
        D1=(-w2*lon2+9.8)*D2/(w2*lon1);
      
        t=0.0;
        energia=(m1+m2)*9.8*lon1*ang1*ang1/2+m2*9.8*lon2*ang2*ang2/2;
        pol_1.length=0;
        pol_2.length=0;
        multiplicar=0;
     
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
       t+=dt;
        ang1=B1*Math.cos(Math.sqrt(w1)*t)+D1*Math.cos(Math.sqrt(w2)*t);
        ang2=B2*Math.cos(Math.sqrt(w1)*t)+D2*Math.cos(Math.sqrt(w2)*t);
        var v1=-B1*Math.sqrt(w1)*Math.sin(Math.sqrt(w1)*t)-Math.sqrt(w2)*D1*Math.sin(Math.sqrt(w2)*t);
        var v2=-B2*Math.sqrt(w1)*Math.sin(Math.sqrt(w1)*t)-Math.sqrt(w2)*D2*Math.sin(Math.sqrt(w2)*t);
        energia=(m1+m2)*lon1*lon1*v1*v1/2+m2*lon2*lon2*v2*v2/2+m2*lon1*lon2*v1*v2+(m1+m2)*9.8*lon1*ang1*ang1/2+m2*9.8*lon2*ang2*ang2/2;
        if(t>(multiplicar+1)*10){
            multiplicar++;
            pol_1.length=0;
            pol_2.length=0;
        }
    }
    
    
    
    function animate(time) {
        update();
        ctx.clearRect(0,0,canvas.width,canvas.height);
        drawGrid('lightgray', 10, 10);  
        dispositivo(ctx);
        grafica(ctx);
        raf=window.requestAnimationFrame(animate);
    }
    
    
    }
    
    