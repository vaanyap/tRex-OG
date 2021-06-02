var tRex,anime, edges,ground, lines, cloud, cloudImg, obstacle, obstacleImg1,obstacleImg2,obstacleImg3,obstacleImg4,obstacleImg5,obstacleImg6,score,cactusGroup,cloudsGroup,gameState="play",tRexOverImg,gameOver,Restart,gameOverImg, restartImg, JumpSound, DieSound, CheckPointSound, highScore;

function preload(){
  anime = loadAnimation("trex1.png", "trex3.png", "trex4.png");
  groundd = loadImage("ground2.png");
  cloudImg = loadImage("cloud.png");
  obstacleImg1 = loadImage("obstacle1.png");
  obstacleImg2 = loadImage("obstacle2.png");
  obstacleImg3 = loadImage("obstacle3.png");
  obstacleImg4 = loadImage("obstacle4.png");
  obstacleImg5 = loadImage("obstacle5.png");
  obstacleImg6 = loadImage("obstacle6.png");
  tRexOverImg = loadAnimation("trex_collided.png");
  restartImg = loadImage("restart.png");
  gameOverImg = loadImage("gameOver.png");
  JumpSound = loadSound("jump.mp3");
  DieSound = loadSound("die.mp3");
  CheckPointSound = loadSound("checkPoint.mp3");
}

function setup(){
  createCanvas(600,200);
  tRex = createSprite(50,160,20,20);
  tRex.addAnimation("running",anime);
  tRex.addAnimation("dead",tRexOverImg);
  tRex.scale = 0.5;
  ground = createSprite(200,180,400,5);
  ground.addImage(groundd);
  
  lines = createSprite(50,180,40,2);
  //lines.shapeColor= "lightblue";
  lines.visible = false;
  //apple= Math.round(random(0,100));
 // console.log(apple);
  score=0;
  highScore = 0;
  //creating cactus and cloud group
  // Group() is a predifined class --> to create a group of differnet objects.
  cactusGroup= new Group();
  cloudsGroup = new Group();
  //tRex.debug = true;
  // colision radius>> that sets the collison place in the object. 
  //Known as Collider Radius!
  tRex.setCollider('circle', 0,0,30);
  //tRex.setCollider('rectangle', 0,0,400, tRex.height);
  gameOver = createSprite(300,80,30,30);
  Restart = createSprite(300,110,30,30);
  gameOver.addImage(gameOverImg);
  Restart.addImage(restartImg);
  gameOver.scale = 0.5;
  Restart.scale = 0.5;
  
}
function draw(){
  background("#9370DB");
  
  if(gameState=="play"){
    Restart.visible= false;
    gameOver.visible = false;
    //moving the ground
    ground.velocityX = -8 - score/100;
    //increasing the score
    score=score + Math.round(getFrameRate()/60);
    //making trex jump
    if(score%200==0 && score>1){
      CheckPointSound.play();
    }
    if(keyDown("space")&& tRex.y>140){

      tRex.velocityY = -8;
      JumpSound.play();
    }
     
    //adding gravity
    tRex.velocityY += 0.6;
    //repetition of the ground
    if(ground.x <0 ){
      ground.x = 1000;
    }
    //spawning clouds and obstacles
    spawnClouds();
    spawnObstacles();
    //going to game state over
    if(tRex.isTouching(cactusGroup)){
      gameState = "over";
     tRex.velocityY = 0;
   DieSound.play();
      //JumpSound.play();
      //tRex.velocityY = -10;
      
    }
  }
  
  if(gameState=="over"){
    //stopig the ground
    ground.velocityX = 0;
    cloudsGroup.setVelocityXEach(0);
    cactusGroup.setVelocityXEach(0);
    //setLiftime wont let ur object disappear when lifetime hits 0
    cloudsGroup.setLifetimeEach(-5);
    cactusGroup.setLifetimeEach(-5);
    tRex.changeAnimation("dead",tRexOverImg);
    Restart.visible= true;
    gameOver.visible = true;
    if(score>highScore){
      highScore = score;
    }
  }
  
  if(mousePressedOver(Restart)){
    Reset();
  }
  
  //use a text function to display the score at the top right corner of the screen
  textSize(16);
  fill("black");
  text("score: " +score,450,30);
  text("High Score: " + highScore,300,31);
  
  tRex.collide(lines);

  drawSprites(); 
}

function spawnClouds(){
  if(frameCount%80==0){
    cloud= createSprite(625,50,20,20);
    cloud.addImage(cloudImg);
    cloud.y=Math.round(random(15,120));
    cloud.velocityX = -6 - score/100;
    cloud.scale= 0.5;
    //assigning lifetime to the cloud
    cloud.lifetime= 215;
    tRex.depth= cloud.depth +1;
    cloudsGroup.add(cloud);
  }
}
function spawnObstacles(){
  if(frameCount%100 ==0){
    obstacle = createSprite(600,160,20,40);
    obstacle.velocityX = -6 - score/100;
    //generating random obstacles
    var randomObstacle = Math.round(random(1,6));
    switch(randomObstacle){
      case 1:obstacle.addImage(obstacleImg1);
        break;
        case 2:obstacle.addImage(obstacleImg2);
        break;
        case 3:obstacle.addImage(obstacleImg3);
        break;
        case 4:obstacle.addImage(obstacleImg4);
        break;
        case 5:obstacle.addImage(obstacleImg5);
        break;
        case 6:obstacle.addImage(obstacleImg6);
        break;
        default: break;
        
    }
    obstacle.scale = 0.5;
    //fixing the memory leak problem
    obstacle.lifetime = 305;
    cactusGroup.add(obstacle);
  }
  
}

function Reset(){
  gameState = "play";
  score= 0;
  cactusGroup.destroyEach();
  cloudsGroup.destroyEach();
  tRex.changeAnimation("running",anime);
}
