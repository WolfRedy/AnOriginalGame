
const canvas = document.getElementById('renderCanvas')
const engine = new BABYLON.Engine(canvas, true)
let a = 0.1
let objectList=[]
let tankinoa

function createScene() {
    const scene = new BABYLON.Scene(engine);
    var camera = new BABYLON.TargetCamera("UniversalCamera", new BABYLON.Vector3(10, -10, 0), scene);
    
    

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
    camera.radius = 30;
    camera.heightOffset = 10;
    camera.cameraAcceleration = 1;
    camera.maxCameraSpeed = 10;
    camera.attachControl(canvas, true)
    camera.lockedTarget= physicsRoot;



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
    
    ground.physicsImpostor = new BABYLON.PhysicsImpostor(ground, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0, friction: 0.1, restitution: 0.1 }, scene);

    const box = BABYLON.MeshBuilder.CreateBox("box", {width: 10, height: 3, depth: 10}, scene);
    box.isVisible = false;
    box.position.set(0,0,0)
    box.position.y +=0.45

    
    physicsRoot.addChild(box)
    box.physicsImpostor = new BABYLON.PhysicsImpostor(box, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 0}, scene);
    physicsRoot.physicsImpostor = new BABYLON.PhysicsImpostor(physicsRoot, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 5, friction: 0.1, restitution: 0.7 }, scene);
    

    
    var impulseMagnitude = 20;
    var contactLocalRefPoint = BABYLON.Vector3.Zero();
    var Pulse = function(meshtopulse,impulseDirection) {
        meshtopulse.physicsImpostor.applyImpulse(impulseDirection.scale(impulseMagnitude), box.getAbsolutePosition().add(contactLocalRefPoint));
    }

    window.addEventListener("keydown", function(evt) {
        switch(evt.keyCode) {
            case 90: // Touche z
                Pulse(physicsRoot,new BABYLON.Vector3(-1,0,0))
                break
            case 83: // Touche s
            Pulse(physicsRoot,new BABYLON.Vector3(1,0,0))
                break
            case 81: // Touche q
            Pulse(physicsRoot,new BABYLON.Vector3(0,0,-1))
                break
            case 68: // Touche d
            Pulse(physicsRoot,new BABYLON.Vector3(0,0,1))
                break
            case 32: // Touche space
            Pulse(physicsRoot,new BABYLON.Vector3(0,1,0))
                break
        }
    });

    scene.registerBeforeRender(function () {
        
        camera.position = physicsRoot.position.add(new BABYLON.Vector3(20,2,0))
        
        
        
    });







    return scene
}

const scene = createScene()
engine.runRenderLoop(() => {
    scene.render()
    
})





