import { Scene, Mesh, Vector3, HemisphericLight, MeshBuilder, ArcRotateCamera } from "@babylonjs/core";

export class Environment {
    private _scene: Scene;

    constructor(scene: Scene) {
        this._scene = scene;
    }

    public async load() {
        let scene = this._scene
        var light: HemisphericLight = new HemisphericLight("light1", new Vector3(10, 5, 2), scene);
        var sphere: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 0.5 }, scene)
        sphere.position = new Vector3(0,2,0)
        var ground = Mesh.CreateBox("ground", 24, this._scene);
        ground.scaling = new Vector3(1,.02,1);
    }
}