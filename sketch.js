var bg, bgi;
var boat, boatImage, boatSound, dashSound;
var lifeLostSound,vict1sound,vict2sound,crocSound;
var s1,s2,s3,s4,s5;
var crocL,c1,c2,c3,bullet,bul,crocGroup,bulGroup;
var crocStart; var brd1,brd2;
var obs,obsGroup; var score=0,lives=0; var highScore=0;
var gameState="PLAY"; var life1,life2,life3,lifeImg;
var i=0; var xPos;
var button;


function preload()
{
  bgi=loadImage("waterbg.png");
  boatImage=loadImage("s4.png");  boatSound=loadSound("running boat.wav");  dashSound=loadSound("dash.wav");
  lifeImg=loadImage("Life.png");
  s1=loadImage("s1.png");  s2=loadImage("s2.png");  s3=loadImage("s3.png");  s4=loadImage("s4.png");  s5=loadImage("boat.png");
  c1=loadAnimation("crocodile/L1.png","crocodile/L1.png","crocodile/L1.png","crocodile/L1.png","crocodile/L1.png","crocodile/L2.png","crocodile/L2.png","crocodile/L2.png","crocodile/L3.png","crocodile/L3.png")
  c2=loadAnimation("crocodile/R1.png","crocodile/R1.png","crocodile/R1.png","crocodile/R1.png","crocodile/R1.png","crocodile/R2.png","crocodile/R2.png","crocodile/R2.png","crocodile/R3.png","crocodile/R3.png")
  c3=loadAnimation("crocodile/F1.png","crocodile/F1.png","crocodile/F1.png","crocodile/F1.png","crocodile/F1.png","crocodile/F2.png","crocodile/F2.png","crocodile/F2.png","crocodile/F3.png","crocodile/F3.png")
  bul=loadImage("crocodile/firebul.png")
  lifeLostSound=loadSound("allLifeLost.wav")
  vict1sound=loadSound("victory.wav")
  vict2sound=loadSound("victory2.wav")
  crocSound=loadSound("crank.wav")
}

function setup()
{
  createCanvas(1200,600)
  
  bg=createSprite(width/2,height/2,width,height)
  bg.addImage(bgi);  bg.scale=3.5;  bg.velocityY=5;
  
  boat=createSprite(width/2,height*3/4+50);  boat.addImage(boatImage)
  boat.scale=0.4;  //boat.debug=true;  boat.setCollider("rectangle",0,0,90,280)
  brd1=createSprite(380,height/2,2,height);  brd2=createSprite(830,height/2,2,height)
  brd1.visible=false;   brd2.visible=false;
  crocGroup=new Group();  bulGroup=new Group();  obsGroup= new Group();
  
  life1=createSprite(width/4*3,30,30,30);  life1.shapeColor="red";  life1.addImage(lifeImg);  life1.scale=0.1;
  life2=createSprite(width/4*3+40,30,30,30);  life2.shapeColor="red";  life2.addImage(lifeImg); life2.scale=0.1;
  life3=createSprite(width/4*3+80,30,30,30);  life3.shapeColor="red";  life3.addImage(lifeImg);  life3.scale=0.1;
}

function draw()
{
  background(25)
  console.log("STARTED")
    if(gameState==="PLAY" )
  {    
    boatSound.play();

    if(bg.y>height-70) { bg.x=width/2; bg.y=height/2}
    
    score = score + Math.round(getFrameRate()/60);
    if(highScore<score){ highScore=score;}
    bg.velocityY=5+ score/200

    if(keyDown("left") )   
    {     boat.velocityX=-4;    boat.velocityY=0;    }
    if(keyDown("right") )  
    {     boat.velocityX=4;     boat.velocityY=0;    } 
    if(keyWentDown("up") )  {   boat.velocityY=-1;   } 
    if(keyWentDown("down")) {   boat.velocityY=1;    } 
    boat.bounceOff(brd1); boat.bounceOff(brd2);

    getObs(); 
   
        obsGroup.bounceOff(boat,()=>
        {
           lives = lives + 1;
           console.log("lifeTime"+lives)   
           boatSound.stop();
           dashSound.play();
           obsGroup.get(i).destroy() 
           if(lives===1){life1.visible=false;} 
           if(lives===2){life2.visible=false;} 
           if(lives === 3)
                {
                life3.visible=false;  
                gameState="END"
                boatSound.stop();
                lifeLostSound.play()
                }    
        } );
        
        if(score==500){vict1sound.play()}
        if(score==1500){vict2sound.play()}
        if(crocStart==="START" && score>=500)
        {
                crocodile()
                crocGroup.bounceOff(boat,()=>
                {
                console.log("croc bite");
                crocGroup.get(i).destroy()
                boatSound.stop();
                dashSound.play()
                crocSound.play()
                score=score-200
                })
                
                if(bulGroup.isTouching(crocGroup))
                {bulGroup.destroyEach(); crocGroup.get(i).destroy(); boatSound.stop(); dashSound.play();}
        }
        
  }
    if(keyDown("r") && gameState==="END")   {    reset();     }
    if( score===500) { gameState="L2"; }
    if(score===1500) {gameState="L3";crocStart="STOP";}
    if(keyDown("c") && gameState==="L2")   {    level2reset();   }
    if(keyDown("r") && gameState==="L3")   {    reset();     }
    
    
  drawSprites();

  if (gameState==="END")  {   level1();  }
  if(gameState==="L2")  { level2(); }
  if(gameState==="L3") { level3();}
 
  strokeWeight(3)
  textSize(20)
  stroke("black")
  fill("green")
  text("Your Score : " + score,width/3,60)
  text("High Score:  " + highScore, width/3,30)
}



function getObs()
{
  if(frameCount % 60===0)
    {
     obsSize=random(15,40)
     obs=createSprite(random(width/6*2,width/6*4),-20,obsSize,obsSize+10)
     obs.debug=true;
     obsGroup.add(obs);
      num=Math.round(random(1,5))
      if(num===1){ obs.addImage(s1);obs.scale=0.2;obs.setCollider("rectangle",0,0,180,300)}
      if(num===2){ obs.addImage(s2);obs.scale=0.4;obs.setCollider("rectangle",0,0,120,350)}
      if(num===3){ obs.addImage(s3);obs.scale=0.7;obs.setCollider("rectangle",-10,0,50,170)}
      if(num===4){ obs.addImage(s5);obs.scale=0.1;obs.setCollider("rectangle",0,0,190,490)}
      if(num===5){ obs.addImage(s5);obs.scale=0.1;obs.setCollider("rectangle",0,0,190,490)}
      obs.velocityY=5+ score/100;
      obs.lifetime=150;
      obs.depth=boat.depth
      boat.depth++
     
    }
}


function end()
{
    bg.velocityY=0;
    boat.velocityX=0;
    boat.velocityY=0;
    obsGroup.setVelocityYEach(0)
    obsGroup.setLifetimeEach(-1)
    textSize(30)
    stroke("yellow")
    strokeWeight(5)
    fill("blue");
    text('Press *** R *** to Restart',width/5*2,height/2)
    
}

function reset()
{
  obsGroup.destroyEach();
  score=0;
  lives=0;
  gameState="PLAY";
  life1.visible=true
  life2.visible=true
  life3.visible=true 
  console.log("reset function")
// bg.velocityY=5; 
}

function level1()
{
  bg.velocityY=0;
    boat.velocityX=0;
    boat.velocityY=0;
    obsGroup.setVelocityYEach(0)
    obsGroup.setLifetimeEach(-1)
    textSize(30)
    stroke("yellow")
     strokeWeight(5)
    fill("blue");
    text('Press *** R *** to Restart',width/5*2,height/2)
}

function level2()
{
    boatSound.stop()
    bg.velocityY=0;
    boat.velocityX=0;
    boat.velocityY=0;
    obsGroup.setVelocityYEach(0)
    obsGroup.setLifetimeEach(-1)
    textSize(30)
    stroke("black")
     strokeWeight(5)
    fill("yellow");
    text("Great Job!!",width/2,height/2-40)
    text('Press *** C *** For LEVEL - 2',width/5*2,height/2)
    textSize(25)
    text('Hit Space to shoot special Bullet for Crocodiles',width/5*2,height/2+80)
   crocStart="START"
   
}

function level2reset()
{
  obsGroup.destroyEach();
  //score=0;
  lives=0;
  gameState="PLAY";
  life1.visible=true
  life2.visible=true
  life3.visible=true 
// bg.velocityY=5;
}

function level3()
{
    boatSound.stop()
    bg.velocityY=0;
    boat.velocityX=0;
    boat.velocityY=0;
    obsGroup.setVelocityYEach(0)
    obsGroup.setLifetimeEach(-1)
    textSize(30)
    stroke("black")
     strokeWeight(5)
    fill("yellow");
    text("Excellent Job!!",width/2,height/2-40)
    text('You have Crossed Danger Zone ',width/5*2,height/2)
    textSize(20)
    text(' YOU WIN!! -- NEXT LEVEL WILL COME SOON',width/5*2,height/2+60)
    text("PRESS R TO PLAY AGAIN", width/2, height/2+100)
}

function crocodile()
{
      if(frameCount % 200===0)
      {
            var x=Math.round(random(1,3))
            
            if(x===1){
              crocL=createSprite(0,Math.round(random(200,500)),20,20)
            crocL.addAnimation("Left_Croc",c1); 
            crocL.velocityX=3;
            crocL.setCollider("rectangle",0,0,100,30)
            }
            if(x===2){
              crocL=createSprite(width,Math.round(random(200,500)),20,20);
              crocL.addAnimation("Right_Croc",c2); 
              crocL.velocityX=-3
              crocL.setCollider("rectangle",0,0,100,30)
            }
            if(x===3){
              crocL=createSprite(width/2,-10,20,20);
              crocL.addAnimation("front_Croc",c3); 
              crocL.velocityY=3
              crocL.setCollider("rectangle",0,0,25,90)
            }
            crocL.scale=1.3
            crocL.depth=boat.depth
            boat.depth++
            crocGroup.add(crocL)
            crocL.lifetime=800
            //crocL.debug=true
        
      }

      if(keyWentDown("space"))
      {
            bullet=createSprite(boat.x,boat.y,10,10)
            bullet.velocityY=-8
            bullet.addImage(bul)
            bullet.scale=0.1
            bullet.lifetime=300;
            bulGroup.add(bullet)
      }
}