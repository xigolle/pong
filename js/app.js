$(function () {
	var canvas = $("#myCanvas");
	var ctx = canvas[0].getContext("2d");
	var animating;
	var colDetection;
	var stop = false;
	var paddleW = 20;
	var paddleH = 150;
	var paddleMid = paddleH / 2;
	var paddleOffset = 20;
	var scoreComputer = 0;
	var scorePlayer = 0;
	var scoreLimit = 4;
	var delay= 0 ;
    var pcMove =true;
    var delayCount = 40;
    if (ctx) {
      ctx.canvas.height = 700;
      ctx.canvas.width = 1000;
      var canvasHeight = $("#myCanvas").height();
      var canvasWidth = $("#myCanvas").width();
      var canvasCenterX = ctx.canvas.width / 2;
      var canvasCenterY = ctx.canvas.height / 2;
      var img = new Image();
      img.onload = function () {
         Paddle1.teken();
         Paddle2.teken();
         Bal.teken();
     }


     img.src = "images/1lightsaber.png";
        //objecten aanmaken voor de game
        Bal = new bal(canvasCenterX, canvasCenterY, 10);
        Paddle1 = new paddle(paddleOffset, canvasCenterY - paddleMid, paddleW, paddleH);
        Paddle2 = new paddle(canvasWidth - (paddleOffset + paddleW), canvasCenterY - paddleMid, paddleW, paddleH);
        function bal(x, y, straal) {
        	this.y = y;
        	this.x = x;
        	this.straal = straal;
        	this.ys = randomDirection();
        	this.xs = randomSide(4);

        	this.remove = function () {
        		ctx.globalCompositeOperation = 'destination-out';
        		ctx.beginPath();
        		ctx.arc(this.x, this.y, this.straal, 0, Math.PI * 2);
        		ctx.fillStyle = "white";
        		ctx.strokeStyle = "white";
        		ctx.stroke();
        		ctx.fill();

        		ctx.globalCompositeOperation = 'source-over';
        	}
        	this.teken = function () {
        		ctx.beginPath();
        		ctx.arc(this.x, this.y, this.straal, 0, Math.PI * 2, true);
        		ctx.fillStyle = "gray";
        		ctx.lineWidth = 2;
        		ctx.strokeStyle = "green";
        		ctx.fill();
                // ctx.stroke();
            }
        }

        function paddle(x, y, w, h) {
        	this.y = y;
        	this.x = x;
        	this.w = w;
        	this.h = h;
            this.inix = x;
            this.iniy = y;
        	this.remove = function () {
                //clear eerst de vorige 
                ctx.clearRect(this.x, this.y, this.w, this.h);
            }
            this.teken = function () {
                //dan teken de nieuwe

                ctx.drawImage(img, this.x, this.y, this.w, this.h);

            }
        }
        
        function scored(player) {
            // Bal.xs =4;
            Bal.ys = randomDirection();
            
        	if (player) {
                //player heeft gescoord
                
                scorePlayer++;
                Bal.x = canvasCenterX;
                Bal.xs *=-1;
                Bal.y = canvasCenterY;

            } else {
                //computer heeft gescoord
                pcMove = true;
                scoreComputer++;
                Bal.x = canvasCenterX;
                Bal.xs *=-1;
                Bal.y = canvasCenterY;
                resetPaddle();
                
            }
        }
        function randomDirection(){
        	var result;
        	var number = Math.floor((Math.random()*4)+1);
            var negative = Math.round(Math.random());
            if (negative === 1){
                
                result = number * -1;
                
            }else{

                result = number;
                
            }
        	return result;
        }
        function randomSide(number){
            var negative = Math.round(Math.random());
            
            if (negative === 1){
                
                result = number * -1;
                
            }else{

                result = number;
                
            }
            return result;
        }
        function gameOver() {
        	if (scorePlayer === scoreLimit || scoreComputer === scoreLimit) {
        		stop = true;
        		console.log(stop);
        		if (scoreComputer > scorePlayer) {
                    //computer wint
                } else {
                    //player wint
                }

            }


        }
        function resetPaddle(){
            Paddle2.remove();
            Paddle2.x = Paddle2.inix;
            Paddle2.y = Paddle2.iniy;
        }
        function start() {
            //resetting alle start variabelen

            scoreComputer = 0;
            scorePlayer = 0;
            stop = false;
            animating = requestAnimationFrame(animate);

        }

        function AI() {
            //random nummer tussen verschillende variabelen zodat het lijkt alsof de speler een kans maakt en de computer domme acties maakt 
            if(pcMove){


                if (delay < delayCount ) {
                    delay++;
                }else{
                    Paddle2.remove();
                    if (Bal.y >= Paddle2.y+paddleMid) {
                    //paddle moet naar boven gaan
                    Paddle2.y += 5;
                }else if (Bal.y < Paddle2.y+paddleMid) {
                    //paddle moet naar beneden gaan
                    Paddle2.y -= 5;
                }
            }
        }




        Paddle2.teken();


    }






    function animate() {

        animating = requestAnimationFrame(animate);
        Bal.remove();

        AI();
        colission();
        gameOver();
            //zodat de paddles niet verdwijnen als de bal erover heen gaat
            // Paddle1.teken();
            // Paddle2.teken();
            Bal.teken();
            
            if (stop) {
                //functie om de animatie te laten stoppen werkt met een globale variabele
                
                cancelAnimationFrame(animating);
            }
        }
        $("#button").on("click",function(){
            start();
        })
        function colission() {
            //collision voor de randen van het speelveld

            if (Bal.y + Bal.straal > canvasHeight) {
                //bal raakt de bodem
                Bal.y = canvasHeight - Bal.straal;
                Bal.ys = -Bal.ys;
            }
            else if (Bal.y - Bal.straal < 0) {
                //bal raakt boven kant
                Bal.y = 0 + Bal.straal;
                Bal.ys = -Bal.ys;
            }
            else if (Bal.x + Bal.straal > canvasWidth) {
                //bal raakt de rechterkant
                // Bal.x = canvasWidth - Bal.straal;
                // Bal.xs = -Bal.xs;
                scored(true);
            }
            else if (Bal.x - Bal.straal < 0) {
                //bal raakt de linkerkant
                // Bal.x = 0 +Bal.straal;
                // Bal.xs = -Bal.xs;
                scored(false);
            }
            else {
                //bal gewoon in het veld
                
                Bal.x += Bal.xs;
                Bal.y += Bal.ys;
            }
            //collision voor de paddle
            if (Bal.x + Bal.straal > Paddle2.x && Bal.y > Paddle2.y && Bal.y < Paddle2.y + paddleH) {
                //collision voor de rechter paddle
                Bal.x = canvasWidth - (Bal.straal + paddleW + paddleOffset);
                Bal.xs += Math.random();
                Bal.xs = -Bal.xs;
                delay = 0;
                pcMove = false;
                 
                
                
            }
            else if (Bal.x - Bal.straal < Paddle1.x + paddleW && Bal.y > Paddle1.y && Bal.y < Paddle1.y + paddleH) {
                //collision linker paddle.
                Bal.x = 0 + (Bal.straal + paddleW + paddleOffset);
                delay = 0;
                Bal.xs += Math.random();
                pcMove = true;
                Bal.xs = -Bal.xs;
                console.log(Bal.xs);

            }
            

        }
        start();
        $(window).on("keydown", function (e) {

        	if (e.keyCode === 38 || e.keyCode === 87 || e.keyCode === 90) {
        		e.preventDefault();
                //pijltje naar boven of W of Z
                if (!(Paddle1.y + paddleMid < 0)) {
                    //check of paddle niet buiten het veld beland 
                    Paddle1.remove();
                    Paddle1.y -= 30;
                    Paddle1.teken();
                }




            }
            else if (e.keyCode === 40 || e.keyCode === 83) {
            	e.preventDefault();
                //pijltje naar onder of S
                if (!(Paddle1.y + paddleMid > canvasHeight)) {
                    //check of paddle niet buiten het veld beland
                    Paddle1.remove();
                    Paddle1.y += 30;
                    Paddle1.teken();
                }


            }
        });
        //functionaliteit met muis (geeft vertraging op beweging van de bal)
        // $(window).on("mousemove",function(e){
        // 	Paddle2.remove();
        // 	Paddle1.remove();
        // 	Paddle1.y = e.offsetY;
        // 	Paddle2.y = e.offsetY;


        // });
}
});