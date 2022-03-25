import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Mesh, MeshBuilder, Color4, FreeCamera, SceneLoader, CannonJSPlugin, Camera, Matrix, Quaternion, StandardMaterial, Color3, UniversalCamera, TransformNode } from "@babylonjs/core";
import { AdvancedDynamicTexture, Button, Control, Rectangle } from "@babylonjs/gui";
import { Environment } from "./environment";
import { PlayerInput } from "./inputController";
import { Player } from "./characterController";

enum GameState { STARTMENU = 0, GAME = 1, PAUSE = 2, ANIMATION = 3 }

class App {
    private _canvas: HTMLCanvasElement;
    private _engine: Engine;
    private _scene: Scene;
    private _camera: ArcRotateCamera;
    private _state: number = 0;
    private _environment: Environment;
    private _input: PlayerInput;
    private _pause: boolean;
    private _player: any;
    assets: any;
    private _camRoot: TransformNode;
    private _yTilt: TransformNode;

    constructor() {
        this._canvas = this._createCanvas()
        this._init()
    }

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

    private async _init(): Promise<void> {
        this._engine = new Engine(this._canvas, true);
        this._scene = new Scene(this._engine);

        // Racourcis de Debug
        window.addEventListener("keydown", (ev) => {

            // Shift+Ctrl+Alt+I
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.key == "I") {
                if (this._scene.debugLayer.isVisible()) {
                    this._scene.debugLayer.hide();
                } else {
                    this._scene.debugLayer.show();
                }
            }
        });

        // Main
        this._main();
    }
    
    private async  _main() {
        await this._startMenu()

        // Render loop
        this._engine.runRenderLoop(() => {
            switch (this._state) {
                case GameState.STARTMENU:
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
        
        window.addEventListener('resize', () => {
            this._engine.resize();
        });
    }

    private async _startMenu() {
        this._engine.displayLoadingUI();
        this._scene.detachControl();

        let scene = new Scene(this._engine);
        scene.clearColor = new Color4(0, 0, 0, 1);
        
        // Camera
        this._camera = new ArcRotateCamera("Camera", Math.PI/2, Math.PI/2, 20, new Vector3(0, 0, 0), scene);
        this._camera.attachControl(this._canvas, true)
       
        const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        guiMenu.idealHeight = 720; 

        // Création du bouton play
        const startBtn = Button.CreateSimpleButton("start", "PLAY");
        startBtn.width = 0.2;
        startBtn.height = "40px";
        startBtn.color = "white";
        startBtn.top = "-14px";
        startBtn.thickness = 1;
        startBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        guiMenu.addControl(startBtn);

        startBtn.onPointerDownObservable.add(() => {
            this._loadGame()
        });

        // Attente de fin de render
        await scene.whenReadyAsync();
        this._engine.hideLoadingUI();

        // Chepas
        this._scene.dispose();
        this._scene = scene;
        this._state = GameState.STARTMENU;
    }

    private async _loadGame() {
        this._scene.detachControl();
        this._engine.displayLoadingUI();

        // Scene + camera
        let scene = new Scene(this._engine);
        this._scene = scene;

        // Creation de l'environnement
        const environment = new Environment(scene);
        this._environment = environment;
        await this._environment.load();

        //
        await this._loadPlayerAssets(scene);
        await scene.whenReadyAsync();
        await this._inGame();
        await this._UI()
        await this._pauseMenu()
        this._state = GameState.GAME
        this._engine.hideLoadingUI();
    }

    
    private _setupPlayerCamera(): void {
            this._camera = new ArcRotateCamera("Camera", Math.PI/2, Math.PI/2, 20, new Vector3(0, 2, 0), this._scene);
            this._camera.attachControl(this._canvas,true)
    }

    private async _loadPlayerAssets(Scene) {
        this._setupPlayerCamera();
        const input = new PlayerInput(Scene);
        this._input = input;

    }

    private async _inGame() {
        let scene = this._scene
        this._input = new PlayerInput(scene);
        this._player = new Player(this.assets, scene, this._input);
    }

    private async _UI() {
        
    }
    
    private async _pauseMenu() {
        const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        guiMenu.idealHeight = 720; 

        // Bouton
        const startBtn = Button.CreateSimpleButton("start", "PLAY");
        startBtn.width = 0.2;
        startBtn.height = "40px";
        startBtn.color = "white";
        startBtn.top = "-14px";
        startBtn.thickness = 1;
        startBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;
        
        // Fond transparent
        const Font = new Rectangle("font")
        Font.color = 'rgba(0,255,0,0.2)'
        guiMenu.addControl(Font)
        
        startBtn.onPointerDownObservable.add(() => {
            guiMenu.removeControl(startBtn);
            this._camera.attachControl()
            this._pause = false
        });
        window.addEventListener("keydown", (ev) => {
            console.log(ev.key)
            if(ev.key == "Escape") {
                if(this._pause) {
                    guiMenu.removeControl(startBtn);
                    this._camera.attachControl()
                    this._pause = false
                } else {
                    guiMenu.addControl(startBtn);
                    this._camera.detachControl()
                    this._pause = true
                }
            }
        })
    }
}
new App();