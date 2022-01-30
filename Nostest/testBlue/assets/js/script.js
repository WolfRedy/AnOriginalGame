const canvas = document.getElementById('renderCanvas')
const engine = new BABYLON.Engine(canvas, true)
let a = 0.5
let b = 1
function createScene() {
    const scene = new BABYLON.Scene(engine);
    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 10, new BABYLON.Vector3(0, 0, 0));
    camera.attachControl(canvas, true);
    const light = new BABYLON.HemisphericLight('light', new BABYLON.Vector3(0, 0, 0), scene)
    //const box = BABYLON.MeshBuilder.CreateBox('box', {}, scene)
    const car = BABYLON.SceneLoader.ImportMesh('','./assets/babylon_object/f40obj.babylon',"", scene, function (newMeshes){
        for(mesh of newMeshes) {
            mesh.scaling = new BABYLON.Vector3(mesh.scaling.x*b,mesh.scaling.y*b,mesh.scaling.z*b)
            mesh.position = new BABYLON.Vector3(mesh.position.x*b,mesh.position.y*b,mesh.position.z*b)
        }
    }); // voiture F40
    console.log(car)
    window.addEventListener("keydown", function(evt) {
        switch(evt.keyCode) {
            case 90: // Touche z
                car.position = new BABYLON.Vector3(car.position._x,car.position._y,car.position._z-a)
                break
            case 83: // Touche s
                car.position = new BABYLON.Vector3(car.position._x,car.position._y,car.position._z+a)
                break
            case 81: // Touche q
                car.position = new BABYLON.Vector3(car.position._x+a,car.position._y,car.position._z)
                break
            case 68: // Touche d
                car.position = new BABYLON.Vector3(car.position._x-a,car.position._y,car.position._z)
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