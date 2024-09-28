import { bootstrap, GameConfig } from "@config/bootstrap";
import { TYPES } from "@config/types";
import { Container } from "@ioc";
import { LoopManager } from "@manager/LoopManager";
import { SceneManager, SceneType } from "@manager/SceneManager";

export class Game {
    private readonly container: Container;

    constructor(gameConfig: GameConfig) {
        this.container = bootstrap(gameConfig);
    }

    public get running(): boolean {
        return this.container.get<LoopManager>(TYPES.LoopManager).running;
    }

    public addScene(sceneType: SceneType, name: string, openingScene: boolean = false): void {
        this.container.get<SceneManager>(TYPES.SceneManager).addScene(sceneType, name, openingScene);
    }

    public start(): void {
        this.container.get<LoopManager>(TYPES.LoopManager).start();
    }

    public stop(): void {
        this.container.get<LoopManager>(TYPES.LoopManager).stop();
    }
}