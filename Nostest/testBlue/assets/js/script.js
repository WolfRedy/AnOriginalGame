const canvas = document.getElementById('renderCanvas')
const engine = new BABYLON.Engine(canvas, true)
let a = 0.5
function createScene() {
    const scene = new BABYLON.Scene(engine);
    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 10, new BABYLON.Vector3(0, 0, 0));
    camera.attachControl(canvas, true);
    const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 0, 0), scene)
    //const box = BABYLON.MeshBuilder.CreateBox('box', {}, scene)
    const car = BABYLON.SceneLoader.ImportMesh('','./assets/babylon_object/f40obj.babylon',"", scene, function (newMeshes) {
        for (mesh in newMeshes){
            newMeshes[mesh].scaling = new BABYLON.Vector3(2, 2, 2);
            newMeshes[mesh].position = new BABYLON.Vector3(0,1,0);
        }
    }); // voiture F40
    console.log(car)
    window.addEventListener("keydown", function(evt) {
        switch(evt.keyCode) {
            case 90: // Touche z
                box.position = new BABYLON.Vector3(box.position._x,box.position._y,box.position._z-a)
                break
            case 83: // Touche s
                box.position = new BABYLON.Vector3(box.position._x,box.position._y,box.position._z+a)
                break
            case 81: // Touche q
                box.position = new BABYLON.Vector3(box.position._x+a,box.position._y,box.position._z)
                break
            case 68: // Touche d
                box.position = new BABYLON.Vector3(box.position._x-a,box.position._y,box.position._z)
                break
        }
    });
    //console.log(box)
    return scene
}
const scene = createScene()
engine.runRenderLoop(() => {
    scene.render()
})