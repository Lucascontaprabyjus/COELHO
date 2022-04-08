class Rope //corda
  {
    constructor(nlink, pointA)
    {
      //número de links da corda
      this.nlink = nlink;
      //Retorna o próximo índice de grupo exclusivo para o qual os corpos colidirão.
      //Matter.Body.nextGroup([isNonColliding=false]).Se isNonColliding for true
      //retornará o próximo índice de grupo exclusivo para o qual os corpos não colidirão.
      const group = Body.nextGroup(true);

      //Crie um novo composto contendo corpos criados no retorno de chamada em uma organização de grade. 
      //Esta função usa os limites do corpo para evitar sobreposições.
      //Matter.Composites.stack(xx, yy, columns, rows, columnGap, rowGap, callback)
      //retorna: Um novo composto contendo objetos criados no retorno de chamada
      const rects = Composites.stack(100, 100, this.nlink, 1, 5, 5, function(x, y) {
        //body.collisionFilter : Especifica as propriedades do filtro de colisão deste corpo.
      return Bodies.rectangle(x, y, 30, 5, { collisionFilter: { group: group } });
  });
  //ponto de fixação da corda 
  this.pointA = pointA;
  //Encadeia todos os corpos no composto fornecido usando restrições.
  //Matter.Composites.chain(composite, xOffsetA, yOffsetA, xOffsetB, yOffsetB, options) 
  //render como opção do composto (tipo linha)
  this.body = Composites.chain(rects, 0.1, 0, -0.6, 0, {stiffness: 0.1, length: 0.1, render: {type: 'line'}});
      
  World.add(world, this.body);
      
      //Função genérica de adição única ou múltipla. 
      //Adiciona um único ou uma matriz de corpo(s), restrição(ões) ou composto(s) ao composto fornecido.
      //Matter.Composite.add(composite, object) 
    Composite.add(rects, Constraint.create({
    pointA: this.pointA, //ponto A de fixação da corda
    bodyB: rects.bodies[0], //primeiro retângulo da corda
    pointB: {x:0, y:0}, //posição com relação ao centro
    length:10, //comprimento de cada retângulo
    stiffness: 0.1 //rigidez da corda
  }));
      
    }
    
    break() //função para quebrar a cadeia
    { //Matter.Composite.clear(this.rope,true);
      this.body = null; //body é o composto tipo cadeia
    }
    
    show() //função para mostrar os desenhos dos vértices
    {
      if(this.body!=null)
      {
        //percorre a matriz de retângulos
        for (var i = 0; i < this.body.bodies.length-1; i++) 
        {
          //função para desenhar os vértices
          this.drawVertices(this.body.bodies[i].vertices); 
        }
      }
    }
    //função para desenhar os vértices
    drawVertices(vertices) 
    {
      //começa o desenho (vertex)
      beginShape(); 
      //código de cor em hexadecimal
      fill('#FFF717');
      //sem contorno
      noStroke();
      
      //percorre a matriz de vértices 
      for (var i = 0; i < vertices.length; i++) 
        {
          // começa a desenhar os vértices de acordo com as coordenadas x e y (bibliotec p5)
          vertex(vertices[i].x, vertices[i].y); 
        }
       //termina o desenho
      endShape(CLOSE); 
    }
    //função para mostrar a restrição
   showConstraints(constraints) 
   {
     if(constraints!=null)
     {
    for (var i = 0; i < constraints.length; i++) {
      //chama a função para desenhar a restrição
      this.drawConstraint(constraints[i]); 
    }
  }
  }
  //função criada para desenhar a restrição
  drawConstraint(constraint) { 
    if(constraint!=null)    
      {
    const offsetA = constraint.pointA; //ponto A de fixação da corda
    var posA = {x:0, y:0};
    if (constraint.bodyA) {
      posA = constraint.bodyA.position;
    }
    const offsetB = constraint.pointB; //primeiro retângulo da corda
    var posB = {x:0, y:0};
    if (constraint.bodyB) {
      posB = constraint.bodyB.position;
    }
    //formatação da linha
    push()
    strokeWeight(4);
    stroke(255);
    //desenho da linha
    line(
      posA.x + offsetA.x, //offset deslocamento do centro do corpo com relação a restrição
      posA.y + offsetA.y,
      posB.x + offsetB.x,
      posB.y + offsetB.y
    );
    pop();
      }
    }
  }