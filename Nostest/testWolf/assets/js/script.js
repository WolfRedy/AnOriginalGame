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
    
    /**** Set camera and light *****/
    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 10, new BABYLON.Vector3(0, 0, 0));
    camera.attachControl(canvas, true);
    const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0));
    const music  = new BABYLON.Sound("retromus", "./assets/sounds/among.mp3", scene); 
        window.addEventListener("mousedown", function(evt) {
        // left click to fire
        if (evt.button === 0) {
            music.play();
          }
        });
        
        window.addEventListener("keydown", function(evt) {
          // Press space key to fire
          if (evt.keyCode === 32) {
            music.play();
          }
        });
    
    
    

    var car = BABYLON.SceneLoader.ImportMesh("", "./assets/", "f40obj.babylon", scene, function (newMeshes) {
      // Set the target of the camera to the first imported mesh
      for (meshes in newMeshes){
        newMeshes[meshes].scaling = new BABYLON.Vector3(1, 1, 1);
        newMeshes[meshes].position = new BABYLON.Vector3(0,1,100);
      }
  });
 
  
  BABYLON.SceneLoader.ImportMesh("", "./assets/", "test.babylon", scene, function (newMeshes) {
    // Set the target of the camera to the first imported mesh

});

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
});
