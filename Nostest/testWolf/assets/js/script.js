var canvas = document.getElementById("renderCanvas");

var startRenderLoop = function (engine, canvas) {
  engine.runRenderLoop(function () {
    if (sceneToRender && sceneToRender.activeCamera) {
      sceneToRender.render();
    }
  });
};

var engine = null;
var scene = null;
var sceneToRender = null;
var createDefaultEngine = function () {
  return new BABYLON.Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
    disableWebGL2Support: false,
  });
};
const createScene =  () => {
    const scene = new BABYLON.Scene(engine);
    scene.collisionsEnabled = true;
    scene.gravity = new BABYLON.Vector3(0, -0.9, 0);
  
    /**** Set camera and light *****/
    	//var camera = new BABYLON.ArcRotateCamera("Camera", 3 * Math.PI / 2, -Math.PI / 2, 50, BABYLON.Vector3.Zero(), scene);
      //camera.useFramingBehavior=true;
    //camera.attachControl(canvas, true);
    camera = new BABYLON.FreeCamera("FreeCamera", new BABYLON.Vector3(0, 10, -16), scene);
    camera.setTarget(new BABYLON.Vector3(0, -8, 0));
    camera.attachControl(canvas, true);
    camera.minZ = 0.45;
    camera.checkCollisions = true;
    //camera.applyGravity = true;
   
    


    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));
    const music  = new BABYLON.Sound("retromus", "./assets/sounds/among.mp3", scene); 
    window.addEventListener("keyup", onKeyUp, false);function onKeyUp(event){    switch (event.keyCode) {        case 32:            camera.position.y += 3;        break;    }}
        window.addEventListener("mousedown", function(evt) {
        // left click to fire
        if (evt.button === 0) {
            music.play();
          }
        });
        
        window.addEventListener("keydown", function(evt) {
          // Press space key to fire
          if (evt.keyCode === 83) {
            music.play();
          }
        });
    
        
        var ground = BABYLON.Mesh.CreatePlane("ground", 20.0, scene);
        ground.position = new BABYLON.Vector3(5, 20, -15);
        ground.rotation = new BABYLON.Vector3(Math.PI / 2, 0, 0);
        ground.checkCollisions=true;

        var car = BABYLON.SceneLoader.ImportMesh("", "./assets/", "tank.babylon", scene, function (newMeshes) {
          // Set the target of the camera to the first imported mesh
          camera.setTarget(meshes);
          for (meshes of newMeshes){
            
            meshes.position.x += 20
            meshes.position.y += 20
            meshes.position.z += 20
    
            meshes.position = new BABYLON.Vector3(0,1,1);
            meshes.checkCollisions = true;
            window.addEventListener("keydown", function(evt) {
              switch(evt.keyCode) {
                  case 90: // Touche z
                      meshes.position.x+=1;
                      break
                  case 83: // Touche s
                      meshes.position.x-=1;
                      break
                  case 81: // Touche q
                  meshes.position.z+=1; 
                      break
                  case 68: // Touche d
                  meshes.position.z-=1;
                      break
                  case 32: //space
                  meshes.position.y+=1;
                      break
                
              }
            })
          }
        })
        //We create 2000 trees at random positions
     for (var i = 0; i < 2000; i++) {
      boxNew = BABYLON.MeshBuilder.CreateBox("box", {});
      boxNew.position.x = Math.random() * 100 - 50;
      boxNew.position.z = Math.random() * 100 - 50;
     }
        //Ici j'ai crée une boite avec une pos que je fais bouger
        //const box = BABYLON.MeshBuilder.CreateBox("box", {});
        //boxNew.position= new BABYLON.Vector3(10,50,5)
        boxNew.position.x = 20;
    
        const frameRate = 5;
    
        const xSlide = new BABYLON.Animation("xSlide", "position.x", frameRate, BABYLON.Animation.ANIMATIONTYPE_FLOAT, BABYLON.Animation.ANIMATIONLOOPMODE_CYCLE);
    
        const keyFrames = []; 
        console.log(keyFrames)
        keyFrames.push({
            frame: 0,
            value: 20
        });
    
        keyFrames.push({
            frame: frameRate,
            value: -20
        });
    
        keyFrames.push({
            frame: 2 * frameRate,
            value: 20
        });
    
        xSlide.setKeys(keyFrames);
    
        boxNew.animations.push(xSlide);//on push nos données dans xSlide qui gère l'animation
    //animation avant
        scene.beginAnimation(boxNew, 0, 2 * frameRate, true);      
  BABYLON.SceneLoader.ImportMesh("", "./assets/", "test.babylon", scene, function (newMeshes) {
    for (meshes of newMeshes){meshes.checkCollisions = true;}
    
  })


     


    return scene;
}
window.initFunction = async function () {
  var asyncEngineCreation = async function () {
    try {
      return createDefaultEngine();
    } catch (e) {
      console.log(
        "the available createEngine function failed. Creating the default engine instead"
      );
      return createDefaultEngine();
    }
  };

  window.engine = await asyncEngineCreation();
  if (!engine) throw "engine should not be null.";
  startRenderLoop(engine, canvas);
  window.scene = createScene();
};
initFunction().then(() => {
  sceneToRender = scene;
});

// Resize
window.addEventListener("resize", function () {
  engine.resize();
})
