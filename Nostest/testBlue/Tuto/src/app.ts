import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Mesh, MeshBuilder, Color4, FreeCamera, SceneLoader } from "@babylonjs/core";
import {AdvancedDynamicTexture, Button, Control} from "@babylonjs/gui";

enum GameState { START = 0, GAME = 1, PAUSE = 2, ANIMATION = 3 }

class App {
    private _scene: Scene;
    private _canvas: HTMLCanvasElement;
    private _engine: Engine;
    private _state: number = 0;

    constructor() {
        this._canvas = this._createCanvas();

        // Init
        this._init()
    }

    // Fonction Init
    private async _init(): Promise<void> {
        this._engine = new Engine(this._canvas, true);
        this._scene = new Scene(this._engine);

        // Racourcis de Debug
        window.addEventListener("keydown", (ev) => {
            // Shift+Ctrl+Alt+I
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.keyCode === 73) {
                if (this._scene.debugLayer.isVisible()) {
                    this._scene.debugLayer.hide();
                } else {
                    this._scene.debugLayer.show();
                }
            }
        });

        // Main
        await this._main();
    }

    // Fonction Main
    private async _main(): Promise<void> {
        await this._start();

        // Render Loop
        this._engine.runRenderLoop(() => {
            switch (this._state) {
                case GameState.START:
                    this._scene.render();
                    break;
                case GameState.GAME:
                    this._scene.render();
                    break;
                case GameState.PAUSE:
                    this._scene.render();
                    break;
                case GameState.ANIMATION:
                    this._scene.render();
                    break;
                default: break;
            }
        });
    }
    
    // Creation de Canvas
    private _createCanvas(): HTMLCanvasElement {
        document.documentElement.style["overflow"] = "hidden";
        document.documentElement.style.overflow = "hidden";
        document.documentElement.style.width = "100%";
        document.documentElement.style.height = "100%";
        document.documentElement.style.margin = "0";
        document.documentElement.style.padding = "0";
        document.body.style.overflow = "hidden";
        document.body.style.width = "100%";
        document.body.style.height = "100%";
        document.body.style.margin = "0";
        document.body.style.padding = "0";

        this._canvas = document.createElement("canvas");
        this._canvas.style.width = "100%";
        this._canvas.style.height = "100%";
        this._canvas.id = "gameCanvas";
        document.body.appendChild(this._canvas);
        return this._canvas;
    }

    // Menu de base
    private async _start() {
        this._engine.displayLoadingUI();
    }
}
new App();