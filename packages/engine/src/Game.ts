import { bootstrap, GameConfig } from "@config/bootstrap";
import { TYPES } from "@config/types";
import { Container, DependencyName, DependencyType } from "@ioc";
import { LoopManager } from "@manager/LoopManager";
import { SceneManager, SceneType } from "@manager/SceneManager";

/**
 * Game is the main class that contains all the managers, scenes, entities and components. It allows to start and stop the execution of the game.
 * @public
 * @category Core
 * @example
 * ```js
 * const game = new Game({
 *   containerNode: document.getElementById("app"),
 *   width: 1920,
 *   height: 1080,
 * });
 * game.addScene(MainScene, "MainScene");
 * game.start();
 * ```
 * @example
 * ```js
 * const game = new Game({
 *   containerNode: document.getElementById("app"),
 *   width: 1920,
 *   height: 1080,
 *   debugEnabled: false,
 *   canvasColor: "#000000",
 *   physicsFramerate: 180,
 *   collisions: {
 *     collisionMatrix: [
 *       ["layer1", "layer2"],
 *       ["layer1", "layer3"],
 *     ],
 *     collisionMethod: CollisionMethods.SAT,
 *     collisionBroadPhaseMethod: BroadPhaseMethods.SpartialGrid,
 *   }
 * });
 * game.addScene(MainScene, "MainScene");
 * game.start();
 * ```
 */
export class Game {
    private readonly container: Container;

    constructor(gameConfig: GameConfig) {
        this.container = bootstrap(gameConfig);
    }

    /**
     * TRUE if the game is running
     */
    public get running(): boolean {
        return this.container.get<LoopManager>(TYPES.LoopManager).running;
    }

    /**
     * Add a scene to the game
     *
     * @param sceneType The class of the scene
     * @param name The name for the scene
     * @param openingScene If this is the opening scene, set TRUE, FALSE instead (optional: default FALSE)
     */
    public addScene(sceneType: SceneType, name: string, openingScene: boolean = false): void {
        this.container.get<SceneManager>(TYPES.SceneManager).addScene(sceneType, name, openingScene);
    }

    /**
     * Add a new class to be used as dependency
     *
     * @param dependencyType The class of the dependency
     * @param name The name for the dependecy (optional: if the class uses the "injectable" decorator, this parameter is unnecesary)
     */
    public addDependencyType(dependencyType: DependencyType, name?: DependencyName): void {
        this.container.add(dependencyType, name);
    }

    /**
     * Add a new instance to be used as dependency
     *
     * @param dependency The dependency instance
     * @param name The name for the dependecy
     */
    public addDependencyInstance(dependencyInstance: any, name: DependencyName): void {
        this.container.set(name, dependencyInstance);
    }

    /**
     * Start the game
     */
    public start(): void {
        this.container.get<LoopManager>(TYPES.LoopManager).start();
    }

    /**
     * Stop the game
     */
    public stop(): void {
        this.container.get<LoopManager>(TYPES.LoopManager).stop();
    }
}
