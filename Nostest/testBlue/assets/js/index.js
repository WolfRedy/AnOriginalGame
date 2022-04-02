const canvas = document.getElementById('renderCanvas')
const engine = new BABYLON.Engine(canvas, true)
let objectList=[]
function createScene() {
    const scene = new BABYLON.Scene(engine);
    const camera = new BABYLON.ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 10, new BABYLON.Vector3(0, 0, 0));
    camera.attachControl(canvas, true)
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
    const box = BABYLON.MeshBuilder.CreateBox("box", {
        size:10,
    }, scene);
    box.position = new BABYLON.Vector3(15,0,0)
    const tank = BABYLON.SceneLoader.ImportMesh('','./assets/babylon_object/tank.babylon',"", scene, function (newMeshes){
        for(mesh of newMeshes) {
            mesh.scaling = new BABYLON.Vector3(1, 1, 1)
            mesh.position = new BABYLON.Vector3(0, 0, 0)
            objectList.unshift(mesh)
        }
    });
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