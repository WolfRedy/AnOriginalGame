
const canvas = document.getElementById('renderCanvas')
const engine = new BABYLON.Engine(canvas, true)
let a = 0.1
let objectList=[]
let tankinoa

function createScene() {
    const scene = new BABYLON.Scene(engine);
    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 10, new BABYLON.Vector3(0, 0, 0));
    camera.attachControl(canvas, true)
    

    //ground 
    var ground = BABYLON.MeshBuilder.CreateBox("Ground", {width: 100, height: 1, depth: 100}, scene);
    ground.position.y = -20.0;

    var groundMat = new BABYLON.StandardMaterial("groundMat", scene);
    groundMat.diffuseColor = new BABYLON.Color3(0.5, 0.5, 0.5);
    groundMat.emissiveColor = new BABYLON.Color3(0.2, 0.2, 0.2);
    groundMat.backFaceCulling = false;
    ground.material = groundMat;
    ground.receiveShadows = true;

    var physicsRoot = new BABYLON.Mesh("", scene);
    





    console.log(camera)
    window.addEventListener("keydown", function(evt) {
        switch(evt.keyCode) {
            case 90: // Touche z
                console.log('ez')
                camera.cameraPosition = new BABYLON.Vector3(10,2,3)
                break
        }
    });
    const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 0, 0), scene)
    
    
    
    const tank = BABYLON.SceneLoader.ImportMesh('','./tank.babylon',"", scene, function (newMeshes){
        for(mesh of newMeshes) {
            
 
            console.log(mesh)
            objectList.unshift(mesh)
            physicsRoot.addChild(mesh)
        }


    




    }); // Tank



    //Physics
    scene.enablePhysics(null, new BABYLON.CannonJSPlugin());
    
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.0, restitution: 0.7 }, scene);

    const box = BABYLON.MeshBuilder.CreateBox("box", {size:10}, scene);
    box.isVisible = false;

    
    physicsRoot.addChild(box)
    box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.0, restitution: 0 }, scene);
    physicsRoot.physicsImpostor = new BABYLON.PhysicsImpostor(physicsRoot, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 5, friction: 0.0, restitution: 0.7 }, scene);
    

    var impulseDirection = new BABYLON.Vector3(0, 1, 0);
    var impulseMagnitude = 5;
    var contactLocalRefPoint = BABYLON.Vector3.Zero();
    var Pulse = function(meshtopulse) {
        meshtopulse.physicsImpostor.applyImpulse(impulseDirection.scale(impulseMagnitude), box.getAbsolutePosition().add(contactLocalRefPoint));
    }

    window.addEventListener("keydown", function(evt) {
        switch(evt.keyCode) {
            case 32:
            Pulse(physicsRoot)
            console.log(physicsRoot)
    }});


    return scene
}

const scene = createScene()
engine.runRenderLoop(() => {
    scene.render()
})





window.addEventListener("keydown", function(evt) {
    switch(evt.keyCode) {
        case 90: // Touche z
            objectList[0].position.x-=a
            break
        case 83: // Touche s
            objectList[0].position.x+=a
            break
        case 81: // Touche q
            objectList[0].position.z-=a
            break
        case 68: // Touche d
            objectList[0].position.z+=a
            break

    }
});