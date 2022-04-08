class link{
    constructor(bodyA,bodyB){
        var lastlink = bodyA.body.bodies.length-2;
        this.link = Constraint.create({
            //último link da corda
            bodyA: bodyA.body.bodies[lastlink],
            pointA: {x:0,y:0},
            //fruta
            bodyB: bodyB,
            pointB: {x:0,y:0},
            length: -10,
            stiffness: 0.01
        });
        World.add(world, this.link);
    }
    cut(){

    World.remove(engine.world, this.link);

}

}
