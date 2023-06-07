var carro, carroImg;
var estrada, estradaImg;
var buraco, buracoImg;
var barreira, barreiraImg;
var parede1, parede2;
var placa, placaImg;
var restart, restartImg;
var gameOver, gameOverImg;
var score = 0;
var play = 1;
var end = 0;
var record = 0;

var gameState = "play";
var coin, coinImg;

var tempoDecorrido = 0;
var tempoLimite = 1; 

var grupoBarreira, grupoPlaca, grupoBuraco, coinGp;

function preload() {
  carroImg = loadImage("carro.png");
  buracoImg = loadImage("buraco.png");
  estradaImg = loadImage("estrada2.png");
  barreiraImg = loadImage("barreira.png");
  placaImg = loadImage("placa.png");
  coinImg = loadImage("coin.png");
  restartImg = loadImage("restart.png");
  gameOverImg = loadImage("gameover.png");
}

function setup() {
  createCanvas(840, 650);

  parede1 = createSprite(800, 325, 2, 700);
  parede2 = createSprite(40, 325, 2, 700);
  parede1.visible = false;
  parede2.visible = false;

  estrada = createSprite(420, 5);
  estrada.addImage(estradaImg);

  carro = createSprite(419, 590);
  carro.addImage(carroImg);
  carro.scale = 0.6;
  carro.rotation = -90;
  carro.setCollider("rectangle", 0, 0, 220, 90);

  restart = createSprite(419, 370);
  restart.addImage(restartImg);
  restart.scale = 0.099;
  restart.visible = false;

  gameOver = createSprite(419, 280);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.3;
  gameOver.visible = false;

  grupoBarreira = new Group();
  grupoPlaca = new Group();
  grupoBuraco = new Group();
  coinGp = new Group();
}

function draw() {
  background(0);
  drawSprites();
  tempoDecorrido++;
  textSize(30);
  fill("white")
  text("Score: " + score, 590, 70);
  text("X: " + mouseX + "/ Y: " + mouseY, mouseX, mouseY);

  if (score > record) {
    record = score;
  }

  if (gameState === "play") {

    grupoBarreira.forEach(function(barreira) {
      barreira.velocityY = 3 + (floor(score / 2) * 3);
    });
  
    grupoBuraco.forEach(function(buraco) {
      buraco.velocityY = 3 + (floor(score / 2) * 3);
    });
  
    grupoPlaca.forEach(function(placa) {
      placa.velocityY = 3 + (floor(score / 2) * 3);
    });
  
    coinGp.forEach(function(coin) {
      coin.velocityY = 3 + (floor(score / 2) * 3);
    });
  


    estrada.velocityY = 3 + (floor(score / 2) * 3);

    if (estrada.y > 500) {
      estrada.y = 99;
    }

    if (tempoDecorrido >= tempoLimite) {
      if (carro.rotation === 0 || carro.rotation === 180|| carro.rotation ===90) {
        carro.rotation = -90; // Altera a rotação para -90
        tempoDecorrido = 0; // Reinicia o tempo decorrido após alterar a rotação automaticamente
      }
    }

    if (keyDown("left_arrow") || keyDown("A")) {
      carro.x = carro.x - 8;
      carro.rotation = 180;
      tempoDecorrido = 0;
    }

    if (keyDown("right_arrow") || keyDown("D")) {
      carro.x = carro.x + 8;
      carro.rotation = 0;
     tempoDecorrido = 0;
    }

    if (keyDown("up_arrow") || keyDown("W")) {
      carro.y = carro.y - 8;
      carro.rotation = -90;
    }

    if (keyDown("down_arrow") || keyDown("S")) {
      carro.y = carro.y + 8;
      carro.rotation = 90;
    }

    

    carro.velocityY = 2;
    edges = createEdgeSprites();
    carro.collide(edges);
    carro.collide(parede1);
    carro.collide(parede2);

   

    

    createBarreira();
    createBuraco();
    createPlaca();
    createCoin();
    mostrarResultado();

    // Verifica colisões
    if (carro.isTouching(grupoBarreira) || carro.isTouching(grupoBuraco) || carro.isTouching(grupoPlaca)) {
      gameState = "end";
     
    }

    if (carro.isTouching(coinGp)) {
      score = score + 1;
      coinGp.destroyEach();
    }
  }
  else if (gameState === "end") {
    estrada.velocityY = 0;
    grupoBarreira.setVelocityYEach(0);
    grupoBuraco.setVelocityYEach(0);
    grupoPlaca.setVelocityYEach(0);
    coinGp.setVelocityYEach(0);
    carro.velocityY = 0;
    restart.visible = true;
    gameOver.visible = true;

    if (mousePressedOver(restart)) {
      gameState = "play";
      restart.visible = false;
      gameOver.visible = false;
      grupoBarreira.destroyEach();
      grupoBuraco.destroyEach();
      grupoPlaca.destroyEach();
      coinGp.destroyEach();
      score = 0;
      carro.x = 419;
      carro.y = 590;
    }
  }
}

function createBarreira() {
  if (frameCount % 140 === 0) {
    var barreira = createSprite(100, -10);
    barreira.addImage(barreiraImg);
    barreira.scale = 0.05;
    barreira.velocityY = 3;
    barreira.lifetime = 235;
    barreira.x = random(185, 660);
    barreira.depth = carro.depth - 1;
    barreira.debug = false;
    barreira.setCollider("rectangle", 0, 280, 1799, 1400);

    var sobreposto = true;
    while (sobreposto) {
      sobreposto = false;
      for (var i = 0; i < grupoBuraco.length; i++) {
        if (barreira.collide(grupoBuraco.get(i))) {
          sobreposto = true;
          barreira.x = random(185, 660);
          break;
        }
      }
    }

    grupoBarreira.add(barreira);
  }
}

function createBuraco() {
  if (frameCount % 100 === 0) {
    var buraco = createSprite(100, -10);
    buraco.addImage(buracoImg);
    buraco.scale = 0.1;
    buraco.velocityY = 3;
    buraco.x = random(170, 670);
    buraco.lifetime = 230;
    buraco.depth = carro.depth - 1;
    buraco.debug = false;
    buraco.setCollider("circle", 0, 0, 200);

    var sobreposto = true;
    while (sobreposto) {
      sobreposto = false;
      for (var i = 0; i < grupoBarreira.length; i++) {
        if (buraco.collide(grupoBarreira.get(i))) {
          sobreposto = true;
          buraco.x = random(170, 670);
          break;
        }
      }
    }

    grupoBuraco.add(buraco);
  }
}

function createPlaca() {
  if (frameCount % 240 === 0) {
    var placa = createSprite(770, random(-10, -100));
    placa.addImage(placaImg);
    placa.velocityY = 3;
    placa.lifetime = 300;
    placa.depth = carro.depth - 1;
    grupoPlaca.add(placa);
  }
  if (frameCount % 240 === 0) {
    var placa = createSprite(75, random(-10, -100));
    placa.addImage(placaImg);
    placa.velocityY = 3;
    placa.lifetime = 300;
    placa.depth = carro.depth - 1;
    grupoPlaca.add(placa);
    placa.debug = false;
  }
}

function createCoin() {
  if (frameCount % 180 === 0) {
    var coin = createSprite(random(170, 670), random(-10, -80));
    coin.scale = 0.3;
    coin.addImage(coinImg);
    coin.velocityY = 3;
    coin.lifetime = 300;
    coin.debug = false;
    coin.setCollider("circle", 0, 0, 90);

    var sobreposto = true;
    while (sobreposto) {
      sobreposto = false;

      // Verificar colisão com grupoBarreira
      for (var i = 0; i < grupoBarreira.length; i++) {
        if (coin.collide(grupoBarreira.get(i))) {
          sobreposto = true;
          coin.position.x = random(170, 670);
          coin.position.y = random(-10, -80);
          break;
        }
      }

      // Verificar colisão com grupoBuraco
      for (var j = 0; j < grupoBuraco.length; j++) {
        if (coin.collide(grupoBuraco.get(j))) {
          sobreposto = true;
          coin.position.x = random(170, 670);
          coin.position.y = random(-10, -80);
          break;
        }
      }

      // Verificar colisão com grupoPlaca
      for (var k = 0; k < grupoPlaca.length; k++) {
        if (coin.collide(grupoPlaca.get(k))) {
          sobreposto = true;
          coin.position.x = random(170, 670);
          coin.position.y = random(-10, -80);
          break;
        }
      }
    }

    coinGp.add(coin);
  }
}

function mostrarResultado() {
  
  textSize(20);
  fill(255);
  text("Record: " + record, 610, 100);
}

