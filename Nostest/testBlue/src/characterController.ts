import { Scene, ShadowGenerator, TransformNode } from "@babylonjs/core";
import { PlayerInput } from "./inputController";

export class Player extends TransformNode {
    scene: Scene;
    static ORIGINAL_TILT: any;
    constructor(assets, scene: Scene, /*shadowGenerator: ShadowGenerator,*/ input?: PlayerInput) {
        super("player", scene);
        this.scene = scene
        
    }
    private _updateFromControls(): void {

    }
}