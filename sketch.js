var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload()
{
  //this adds the running animation to the trex
  trexImage = loadImage("de7b21e0-d30f-4ed6-aac5-e90a9387b40d.png")
  
  //this loads the ground image
  groundImage = loadImage("ground2.png");
  
  //this loads the cloud image
  cloudImage = loadImage("ezgif.com-gif-maker.jpg");
  
  //these lines load the images for the obstacles
  obstacleImage = loadImage("Cactus.png");
  
  //these load the images for the restart and gameover symbol
  restartImg = loadImage("restart.png")
  gameOverImg = loadImage("gameOver.png")
  
  //these load in the sound
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}

function setup() 
{
  //this makes the canvas
  createCanvas(600, 200);
  
  //this draws the trex sprite
  trex = createSprite(50,160,20,50);
  trex.addImage("greenTrex" ,trexImage);
  trex.scale = 0.06;
  
  //this creates the sprite for the ground image
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  //this makes the gameover at the end of the game
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  
 // this makes the restart at the end of the game
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  
 
  gameOver.scale = 0.5;
  restart.scale = 0.5;
  
  //this makes an invisible ground for the trex to stand on
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  //this makes the trex collide with the obstacles with a specific shape
  trex.setCollider("rectangle",0,0,trex.width,trex.height);
  trex.debug = false;
  
  score = 0;
  
}

function draw() 
{ 
  background("blue");
  //displaying score
  text("Score: "+ score, 500,50);
  
  
  if(gameState === PLAY)
  {

    //this makes the gameover and the restart symbols go away
    gameOver.visible = false;
    restart.visible = false;
    
    //this makes the ground speed up based on the score
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    //this makes it so there is noise every time the score increases by 300
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    //this makes the ground reset
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 160) {
        trex.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    //this changes the gameState
    if(obstaclesGroup.isTouching(trex))
    {
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the trex animation
      trex.changeAnimation("collided", trex_collided);
    
     
     //this makes the ground and the trex move
      ground.velocityX = 0;
      trex.velocityY = 0
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     //this makes the obstacles and the clouds stop moving
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
     
     //this makes the game reset when you press the reset button
     if(mousePressedOver(restart))
 {
    reset();
  }
 }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);
  
  drawSprites();
}

function reset()
{
  gameState = PLAY;
  gameOver.visible = false;
  restart.visible = false;
  obstaclesGroup.destroyEach();
  cloudsGroup.destroyEach();
  trex.changeAnimation("running",trex_running );
  score = 0;
}

//this draws in the obstacles
function spawnObstacles()
{
 if (frameCount % 60 === 0)
 {
   var obstacle = createSprite(600,165,10,40);
   obstacle.addImage(obstacleImage);
   obstacle.velocityX = -(6 + score/100);
   obstacle.scale = 0.1;
   obstacle.lifetime = 300;
   
   obstaclesGroup.add(obstacle);
 }
}

//this draws in the clouds
function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

