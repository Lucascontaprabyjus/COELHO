//Módulo para criar e manipular mecanismos. Um motor é um controlador que gerencia a atualização da simulação do mundo.
const Engine = Matter.Engine; 

//Renderizador baseado em tela simples para visualizar instâncias do Matter.Engine.
//Renderizar = converter símbolos gráficos em arquivo visual. 
//Destina-se a fins de desenvolvimento e depuração, mas também pode ser adequado para jogos simples. 
const Render = Matter.Render; 

//Contém métodos para criar e manipular restrições. 
//Restrições são usadas para especificar que uma distância fixa deve ser mantida entre dois corpos 
//(ou um corpo e uma posição fixa no espaço-mundo). 
//A rigidez (stiffness) das restrições pode ser modificada para criar molas ou elásticos.
const Constraint = Matter.Constraint; 

//Um Matter.Body é um corpo rígido que pode ser simulado por um Matter.Engine.
const Body = Matter.Body; 

//Contém métodos de fábrica para criar modelos de corpo rígido com configurações de corpo 
//comumente usadas (como retângulos, círculos e outros polígonos).
const Bodies = Matter.Bodies; 

//Este módulo foi substituído pelo Matter.Composite.
const World = Matter.World; 

//Um composto é uma coleção de Matter.Body, Matter.Constraint e outros objetos Matter.Composite.
// Um composto pode conter qualquer coisa, desde um único corpo até um mundo inteiro.
const Composite = Matter.Composite; 

//Contém métodos para criar corpos compostos com configurações comumente usadas (como pilhas e cadeias).
const Composites = Matter.Composites; 

var engine;
var world;
var ground;
var rope;
var fruit, constraint1;
var bg_img, fruit_img, rabbit_img;
var triste, comendo, piscando;
var rabbit;
var scizor;
var ropeCut;
var eatingFruit;
var sadSong;
var bgMusic;
var airSong;
var airButton;
var mute;
var canW, canH;


function preload()
{
  bg_img = loadImage('background.png');
  fruit_img = loadImage('melon.png');
  rabbit_img = loadImage('Rabbit-01.png');
  piscando = loadAnimation("blink_1.png", "blink_2.png","blink_3.png");
  comendo = loadAnimation("eat_0.png","eat_1.png","eat_2.png","eat_3.png", "eat_4.png");
  triste = loadAnimation("sad_1.png","sad_2.png","sad_3.png");
  ropeCut = loadSound("rope_cut.mp3");
  bgMusic = loadSound("sound1.mp3");
  eatingFruit = loadSound("eating_sound.mp3");
  sadSong = loadSound ("sad.wav");
  airSong  = loadSound ("air.wav");

  //iniciar a animação e definir o loop
  piscando.playing = true;
  piscando.looping = true;
  comendo.looping = false;
  triste.looping = false;
}

function setup() 
{
  //configuração do tamanho de tela
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if(isMobile){ //verifica se é celular
    canW = displayWidth;
    canH = displayHeight;
    //cria a tela
    createCanvas(canW,canH);
  }
  else{
    canW = windowWidth;
    canH = windowHeight;
    //cria a tela
    createCanvas(canW,canH);
  }

  //cria a tela
  //createCanvas(500,700);
  //aumento da taxa de quadros
  frameRate(80); //geralmente é 30 frames/seg
  //criação do mecanismo de física
  engine = Engine.create();
  //criação do mundo
  world = engine.world;
  //criação do objeto solo a partir da classe Ground
  ground = new Ground(200,canH,600,20);
  //criação do objeto corda a partir da classe Rope
  rope = new Rope(6,{x:230,y:30});
  //som de fundo
 // bgMusic.play();
  bgMusic.setVolume(0.2)

  //sprite do coelho
  piscando.frameDelay = 15;
  comendo.frameDelay = 15;
  triste.frameDelay = 15;

  rabbit = createSprite(200, canH-100, 100, 100);
  //rabbit.addImage(rabbit_img);
  rabbit.addAnimation("piscando", piscando);
  rabbit.addAnimation("comendo", comendo);
  rabbit.addAnimation("triste", triste)
  rabbit.changeAnimation("piscando");
  rabbit.scale = 0.2;

  //botão da tesoura
  scizor = createImg("cut_button.png");
  scizor.position(200, 20);
  scizor.size(60, 60);
  scizor.mouseClicked(drop);

  //botão do soprador
  airButton = createImg("balloon.png");
  airButton.position(60, 200)
  airButton.size(150,90);
  airButton.mouseClicked(pull);

  //botão de mudo
  mute = createImg("mute.png");
  mute.position (270, 20);
  mute.size (40, 40);
  mute.mouseClicked(mutar);


  var fruit_options= {
    density: 0.001
  }
  //criação do corpo da fruta
  fruit = Bodies.circle(300,300,15,fruit_options);
  //adição da fruta ao composto da corda
  Matter.Composite.add(rope.body,fruit);
  //criação do objeto restrição a partir da classe Link
  constraint1 = new link(rope,fruit);

  imageMode(CENTER);
  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50);
  
}

function draw() 
{
  //cor de fundo da tela
  background(51); 

  //inserir a imagem de fundo
  image(bg_img, canW/2, canH/2, canW, canH);

  //mostrar os objetos das classes Ground e Rope
  ground.show();
  rope.show();
  //ellipse(fruit.position.x, fruit.position.y,15);

  //inserir a imagem da fruta
  if(fruit != null){
  image (fruit_img, fruit.position.x, fruit.position.y, 60, 60);
  }
  //atualização do mecanismo de física
  Engine.update(engine);

  //chamada da função de colisão para coelho e fruta
  if(collide(fruit, rabbit)== true){
    rabbit.changeAnimation("comendo");
    eatingFruit.play();
  }
  //chamada da função de colisão para fruta e solo
  if(fruit != null && fruit.position.y >= canH-100){
    rabbit.changeAnimation("triste");
    bgMusic.stop();
    sadSong.play();
    fruit = null;
  }
  
  drawSprites();
 
}

//função para soltar a fruta
function drop(){
  ropeCut.play();
  rope.break();
  constraint1.cut();
  constraint1 = null;
}

//função para colisão
function collide(c1, c2){
if(c1 != null){
  var d = dist(c1.position.x, c1.position.y, c2.position.x, c2.position.y);
if(d <= 80){
  World.remove(world, fruit);
  fruit = null;
  return true;
}
else{
  return false;
}
}


}

//função para assoprar a fruta
function pull(){
  Matter.Body.applyForce(fruit, {x:0, y:0}, {x:0.03, y:0});
  airSong.play();


}
//função para silenciar
function mutar(){

if(bgMusic.isPlaying()){
bgMusic.stop();

}
else{
bgMusic.play();

}
}