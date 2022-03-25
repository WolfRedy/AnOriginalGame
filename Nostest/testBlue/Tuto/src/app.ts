import "@babylonjs/core/Debug/debugLayer";
import "@babylonjs/inspector";
import "@babylonjs/loaders/glTF";
import { Engine, Scene, ArcRotateCamera, Vector3, HemisphericLight, Mesh, MeshBuilder, Color4, FreeCamera, SceneLoader, CannonJSPlugin, Camera, Matrix, Quaternion, StandardMaterial, Color3 } from "@babylonjs/core";
import { AdvancedDynamicTexture, Button, Control } from "@babylonjs/gui";
import { Environment } from "./environment";

enum GameState { STARTMENU = 0, GAME = 1, PAUSE = 2, ANIMATION = 3 }

class App {
    private _scene: Scene;
    private _canvas: HTMLCanvasElement;
    private _engine: Engine;
    private _state: number = 0;
    private _pause: boolean = false;
    private _environment: Environment;
    constructor() {
        this._canvas = this._createCanvas();

        // Init
        this._init()
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
        await this._startMenu(); // A remplacer avec _startMenu() /!\

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

    // Menu de base
    private async _startMenu() {
        this._engine.displayLoadingUI();
        this._scene.detachControl();

        let scene = new Scene(this._engine);
        scene.clearColor = new Color4(0, 0, 0, 1);

        // Camera
        let camera: FreeCamera = new FreeCamera("camera", Vector3.Zero(), scene)
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
            this._setUpGame();
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
        this._setupPlayerCamera().attachControl(true)

        // Creation de l'environnement
        const environment = new Environment(scene);
        this._environment = environment;
        await this._environment.load();

        //
        await this._loadCharacterAssets(scene)
        await this._goToGame(scene)
        await scene.whenReadyAsync();
        this._engine.hideLoadingUI();
    }

    private _setupPlayerCamera() {
        var camera = new ArcRotateCamera("arc", -Math.PI/2, Math.PI/2, 40, new Vector3(0,3,0), this._scene);
        return(camera)
    }

    private async _loadCharacterAssets(scene) {
        //collision mesh
        const outer = MeshBuilder.CreateBox("outer", { width: 2, depth: 1, height: 3 }, scene);
        outer.isVisible = false;
        outer.isPickable = false;
        outer.checkCollisions = true;

        //move origin of box collider to the bottom of the mesh (to match imported player mesh)
        outer.bakeTransformIntoVertices(Matrix.Translation(0, 1.5, 0));

        outer.ellipsoid = new Vector3(1, 1.5, 1);
        outer.ellipsoidOffset = new Vector3(0, 1.5, 0);

        outer.rotationQuaternion = new Quaternion(0, 1, 0, 0);
        var box = MeshBuilder.CreateBox("Small1", { width: 0.5, depth: 0.5, height: 0.25, faceColors: [new Color4(0, 0, 0, 1), new Color4(0, 0, 0, 1), new Color4(0, 0, 0, 1), new Color4(0, 0, 0, 1), new Color4(0, 0, 0, 1), new Color4(0, 0, 0, 1)] }, scene);
        box.position.y = 1.5;
        box.position.z = 1;

        var body = Mesh.CreateCylinder("body", 3, 2, 2, 0, 0, scene);
        var bodymtl = new StandardMaterial("red", scene);
        bodymtl.diffuseColor = new Color3(0.8, 0.5, 0.5);
        body.material = bodymtl;
        body.isPickable = false;
        body.bakeTransformIntoVertices(Matrix.Translation(0, 1.5, 0)); // simulates the imported mesh's origin
        
        //parent the meshes
        box.parent = body;
        body.parent = outer;
        return {
            mesh: outer as Mesh
        }
    }

    private async _goToGame(scene) {
        await this._setupPauseMenu(scene._activeCamera)
    }

    private async _setupPauseMenu(camera) {
        const guiMenu = AdvancedDynamicTexture.CreateFullscreenUI("UI");
        guiMenu.idealHeight = 720; 
        const pauseBtn = Button.CreateSimpleButton("pause", "En pause");
        pauseBtn.width = 0.2;
        pauseBtn.height = "40px";
        pauseBtn.color = "white";
        pauseBtn.top = "-14px";
        pauseBtn.thickness = 3;
        pauseBtn.verticalAlignment = Control.VERTICAL_ALIGNMENT_BOTTOM;

        // Events
        pauseBtn.onPointerDownObservable.add(() => {
            this._pause=false
            camera.attachControl()
            guiMenu.removeControl(pauseBtn)
        });
        
        window.addEventListener("keydown", (ev) => {
            if (ev.key == "Escape") {
                if(this._pause) {
                    this._pause=false
                    camera.attachControl()
                    guiMenu.removeControl(pauseBtn)
                } else {
                    this._pause=true
                    camera.detachControl()
                    guiMenu.addControl(pauseBtn);
                }
            }
        })
    }
}
new App();