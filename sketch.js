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
var rabbit;
var scizor;

function preload()
{
  bg_img = loadImage('background.png');
  fruit_img = loadImage('melon.png');
  rabbit_img = loadImage('Rabbit-01.png');
}

function setup() 
{
  //cria a tela
  createCanvas(500,700);
  //aumento da taxa de quadros
  frameRate(80); //geralmente é 30 frames/seg
  //criação do mecanismo de física
  engine = Engine.create();
  //criação do mundo
  world = engine.world;
  //criação do objeto solo a partir da classe Ground
  ground = new Ground(200,680,600,20);
  //criação do objeto corda a partir da classe Rope
  rope = new Rope(6,{x:250,y:30});

  //sprite do coelho
  rabbit = createSprite(400, 600, 100, 100);
  rabbit.addImage(rabbit_img);
  rabbit.scale = 0.2;

  //botão da tesoura
  scizor = createImg("cut_button.png");
  scizor.position(250, 30);
  scizor.size(90, 90);
  scizor.mouseClicked(drop);

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
  image(bg_img, width/2, height/2, 500, 700);

  //mostrar os objetos das classes Ground e Rope
  ground.show();
  rope.show();
  //ellipse(fruit.position.x, fruit.position.y,15);

  //inserir a imagem da fruta
  image(fruit_img, fruit.position.x, fruit.position.y, 60,60);
  
  //atualização do mecanismo de física
  Engine.update(engine);
  
  drawSprites();
 
   
}

//função para soltar a fruta
function drop(){

  rope.break();
  constraint1.cut();
  constraint1 = null;
}
