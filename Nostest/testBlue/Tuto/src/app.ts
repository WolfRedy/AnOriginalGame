import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Mesh, MeshBuilder, Color4, FreeCamera, SceneLoader, CannonJSPlugin } from "@babylonjs/core";
import { AdvancedDynamicTexture, Button, Control } from "@babylonjs/gui";

enum GameState { STARTMENU = 0, GAME = 1, PAUSE = 2, ANIMATION = 3 }

class App {
    private _scene: Scene;
    private _canvas: HTMLCanvasElement;
    private _engine: Engine;
    private _state: number = 0;
    private _pause: boolean = false;
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
            if (ev.shiftKey && ev.ctrlKey && ev.altKey && ev.key == "I") {
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
        await this._setUpGame(); // A remplacer avec _startMenu() /!\

        // Render Loop
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
    private async _startMenu() {
        this._engine.displayLoadingUI();
        this._scene.detachControl();

        let scene = new Scene(this._engine);
        scene.clearColor = new Color4(0, 0, 0, 1);

        // Camera
        let camera:FreeCamera = new FreeCamera("camera1", new Vector3(1, 1, 0), scene);
        camera.setTarget(Vector3.Zero());
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
            this._setUpGame(); //observables disabled
        });

        // Attente de fin de render
        await scene.whenReadyAsync();
        this._engine.hideLoadingUI();

        // Chepas
        this._scene.dispose();
        this._scene = scene;
        this._state = GameState.STARTMENU;
    }

    private async _setUpGame() {
        this._scene.detachControl();
        this._engine.displayLoadingUI();

        // Scene
        let scene = new Scene(this._engine);
        this._scene = scene;
        await this._pauseMenu(scene)
        await this._loadAssets(scene)
        await this._loadCamera(scene)
        await scene.whenReadyAsync();
        this._engine.hideLoadingUI();
    }

    private async _loadAssets(scene) {
        var light: HemisphericLight = new HemisphericLight("light1", new Vector3(1, 1, 0), scene);

        // Mesh
        var sphere: Mesh = MeshBuilder.CreateSphere("sphere", { diameter: 1 }, scene);
        var map: SceneLoader = SceneLoader.ImportMesh('',"assets/map/test.babylon", "", scene)
        var tank: SceneLoader = SceneLoader.ImportMesh('',"assets/objets/tank.babylon", "", scene, function (newMeshes){
            for(const mesh of newMeshes) {
                mesh.scaling = new Vector3(1, 1, 1)
                mesh.position = new Vector3(20, 0, 0)
            }
        });
        //scene.enablePhysics(null, new CannonJSPlugin());
        
    }

    private async _loadCamera(scene) {
        let camera: ArcRotateCamera = new ArcRotateCamera("Camera", Math.PI / 2, Math.PI / 2, 2, Vector3.Zero(), scene);
        camera.attachControl(this._canvas, true);
    }

    private async _pauseMenu(scene) {
        const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        guiMenu.idealHeight = 720; 
        const pauseBtn = Button.CreateSimpleButton("pause", "En pause");
        pauseBtn.width = 0.2;
        pauseBtn.height = "40px";
        pauseBtn.color = "white";
        pauseBtn.top = "-14px";
        pauseBtn.thickness = 1;
        pauseBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;

        //Events
        pauseBtn.onPointerDownObservable.add(() => {
            this._pause=false
            guiMenu.removeControl(pauseBtn)
        });
        
        window.addEventListener("keydown", (ev) => {
            if (ev.key == "Escape") {
                if(this._pause) {
                    this._pause=false
                    scene.attachControl()
                    guiMenu.removeControl(pauseBtn)
                } else {
                    this._pause=true
                    scene.detachControl()
                    guiMenu.addControl(pauseBtn);
                }
            }
        })
    }
}
new App();