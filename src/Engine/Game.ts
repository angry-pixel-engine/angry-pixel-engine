import { SceneManager, SceneConstructor } from "./Core/Scene/SceneManager";
import { RenderManager } from "./Core/Rendering/RenderManager";
import { CollisionManager } from "./Core/Collision/CollisionManager";
import { loadDependencies } from "./Core/DependencyInjection/Config";
import { Container } from "./Core/DependencyInjection/Container";
import { TimeManager } from "./Core/Time/TimeManager";
import { AssetManagerFacade } from "./Facades/AssetManagerFacade";
import { DomManagerFacade } from "./Facades/DomManagerFacade";
import { InputManagerFacade } from "./Facades/InputManagerFacade";
import { SceneManagerFacade } from "./Facades/SceneManagerFacade";
import { TimeManagerFacade } from "./Facades/TimeManagerFacade";
import { DEFAULT_FRAMERATE, DEFAULT_ITERATIONS, PhysicsIterationManager } from "./Core/Physics/PhysicsIterationManager";
import { GameObjectManagerFacade } from "./Facades/GameObjectManagerFacade";

export const EVENT_START: string = "mini-engine-start";
export const EVENT_UPDATE: string = "mini-engine-update";
export const EVENT_UPDATE_PHYSICS: string = "mini-engine-update-physics";
export const EVENT_UPDATE_RENDER: string = "mini-engine-update-render";

export const container: Container = new Container();

export interface IGameConfig {
    containerNode: HTMLElement;
    gameWidth?: number;
    gameHeight?: number;
    debugEnabled?: boolean;
    bgColor?: string;
    context2d?: string;
    physicsFramerate?: number;
    physicsIterations?: number;
    collisions?: {
        quadTree: string;
        quadTreeSize?: { width: number; height: number }; // TODO: one different size per scene
        debugQuadTree?: boolean;
    };
}

const defaultConfig: IGameConfig = {
    containerNode: null,
    gameWidth: 320,
    gameHeight: 180,
    debugEnabled: false,
    bgColor: "#000000",
    context2d: "fallback",
    physicsFramerate: DEFAULT_FRAMERATE,
    physicsIterations: DEFAULT_ITERATIONS,
    collisions: { quadTree: "dynamic", quadTreeSize: null, debugQuadTree: false },
};

export class Game {
    private sceneManager: SceneManager;
    private renderManager: RenderManager;
    private collisionManager: CollisionManager;
    private timeManager: TimeManager;
    private physicsIterationManager: PhysicsIterationManager;

    private _config: IGameConfig;

    private _running: boolean = false;
    private frameRequestId: number = null;

    constructor(config: IGameConfig) {
        this._config = {
            ...defaultConfig,
            ...config,
        };

        if (this.config.containerNode === null) {
            throw new Error("Config parameter 'containerNode' cannot be empty.");
        }

        this.setupManagers();
        this.initializeFacades();
    }

    private setupManagers(): void {
        loadDependencies(container, this);

        this.renderManager = container.getSingleton<RenderManager>("RenderManager");
        this.sceneManager = container.getSingleton<SceneManager>("SceneManager");
        this.collisionManager = container.getSingleton<CollisionManager>("CollisionManager");
        this.timeManager = container.getSingleton<TimeManager>("TimeManager");
        this.physicsIterationManager = container.getSingleton<PhysicsIterationManager>("PhysicsIterationManager");
    }

    private initializeFacades(): void {
        AssetManagerFacade.initialize();
        DomManagerFacade.initialize();
        InputManagerFacade.initialize();
        SceneManagerFacade.initialize();
        TimeManagerFacade.initialize();
        GameObjectManagerFacade.initialize();
    }

    public get config(): IGameConfig {
        return this._config;
    }

    public get running(): boolean {
        return this._running;
    }

    public addScene(name: string, sceneFunction: SceneConstructor, openingScene: boolean = false): void {
        this.sceneManager.addScene(name, sceneFunction, openingScene);
    }

    public run(): void {
        this.sceneManager.loadOpeningScene();
        this.timeManager.start();

        this.requestAnimationFrame();
    }

    public stop(): void {
        this.stopLoop();
        setTimeout(() => {
            this.sceneManager.unloadCurrentScene();
            this.renderManager.clearCanvas(this._config.bgColor);
        }, 100);
    }

    private gameLoop(time: number): void {
        try {
            this._running = true;

            this.timeManager.update(time);

            this.dispatchFrameEvent(EVENT_START);
            this.dispatchFrameEvent(EVENT_UPDATE);

            this.collisionManager.update();
            this.physicsIterationManager.update(() => this.dispatchFrameEvent(EVENT_UPDATE_PHYSICS));
            this.dispatchFrameEvent(EVENT_UPDATE_RENDER);

            this.renderManager.clearCanvas(this._config.bgColor);
            this.renderManager.render();

            this.requestAnimationFrame();
        } catch (error) {
            console.error("Mini Engine Error: " + error);
            this.stopLoop();
            // throw error;
        }
    }

    public stopLoop(): void {
        window.cancelAnimationFrame(this.frameRequestId);
        this._running = false;
        this.frameRequestId = null;
    }

    public resumeLoop(): void {
        if (this._running == false && this.frameRequestId === null) {
            this.requestAnimationFrame();
        }
    }

    private requestAnimationFrame(): void {
        this.frameRequestId = window.requestAnimationFrame((time) => this.gameLoop(time));
    }

    private dispatchFrameEvent(event: string): void {
        window.dispatchEvent(new CustomEvent(event));
    }
}
