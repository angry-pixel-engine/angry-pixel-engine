import { AsyncSystem, EntityManager } from "@ecs";
import { inject, injectable } from "@ioc";
import { Collider, CollisionRepository, CollisionMethod, Shape } from "@collisions2d";
import { TYPES } from "@config/types";
import { SYSTEMS } from "@config/systemTypes";
import { BallCollider } from "@component/physics2d/BallCollider";
import { BoxCollider } from "@component/physics2d/BoxCollider";
import { EdgeCollider } from "@component/physics2d/EdgeCollider";
import { PolygonCollider } from "@component/physics2d/PolygonCollider";
import { TilemapCollider } from "@component/physics2d/TilemapCollider";
import { Rectangle, Vector2 } from "@math";

/**
 * Array containing which layers will collide with each other.
 * @category Config
 * @public
 */
export type CollisionMatrix = [string, string][];

@injectable(SYSTEMS.ResolveCollisionSystem)
export class ResolveCollisionSystem implements AsyncSystem {
    // auxiliars
    private colliders: Collider[] = [];
    private shapes: Shape[] = [];
    private collisions: Set<string> = new Set();
    private broadPhaseWorker: Worker;
    // private narrowPhaseWorker: Worker;

    constructor(
        @inject(TYPES.EntityManager) private readonly entityManager: EntityManager,
        @inject(TYPES.CollisionMatrix) private collisionMatrix: CollisionMatrix,
        @inject(TYPES.CollisionResolutionMethod) private collisionResolutionMethod: CollisionMethod,
        @inject(TYPES.CollisionRepository) private collisionRepository: CollisionRepository,
    ) {
        this.broadPhaseWorker = new Worker(new URL("./broadPhaseWorker", import.meta.url));
        // this.narrowPhaseWorker = new Worker(new URL("./narrowPhaseWorker.ts", import.meta.url));
    }

    public async onUpdate(): Promise<void> {
        this.collisionRepository.removeAll();
        this.colliders = [];
        this.shapes = [];
        this.collisions.clear();

        this.collectCollidersAndShapes();

        await this.broadPhaseResolverUpdate(this.shapes);

        const shapesToCheck = this.shapes.filter((shape) => shape.updateCollisions);
        for (const shape of shapesToCheck) {
            const neighbors = await this.broadPhase(shape);
            this.narrowPhase(shape, neighbors);
        }
    }

    private collectCollidersAndShapes(): void {
        [BallCollider, BoxCollider, PolygonCollider, EdgeCollider, TilemapCollider].forEach((type) =>
            this.entityManager.search<Collider>(type).forEach(({ component: collider, entity }) => {
                this.colliders.push(collider);
                collider.shapes.forEach((shape) => {
                    shape.entity = entity;
                    shape.collider = this.colliders.length - 1;
                    shape.id = this.shapes.length;
                    shape.ignoreCollisionsWithLayers = collider.ignoreCollisionsWithLayers ?? [];
                    shape.layer = collider.layer;
                    this.shapes.push(shape);
                });
            }),
        );
    }

    private broadPhaseResolverUpdate(shapes: Shape[]): Promise<void> {
        return new Promise((resolve) => {
            this.broadPhaseWorker.onmessage = (event) => {
                if (event.data !== true) return;
                this.broadPhaseWorker.onmessage = null;
                resolve();
            };
            this.broadPhaseWorker.postMessage({ type: "update", data: shapes });
        });
    }

    private broadPhaseResolverUpdateRetrieve(boundingBox: Rectangle): Promise<number[]> {
        return new Promise((resolve) => {
            this.broadPhaseWorker.onmessage = (event: MessageEvent) => {
                if (!Array.isArray(event.data)) return;
                this.broadPhaseWorker.onmessage = null;
                resolve(event.data);
            };
            this.broadPhaseWorker.postMessage({ type: "retrieve", data: boundingBox });
        });
    }

    // broad phase takes care of looking for possible collisions
    private async broadPhase({ boundingBox, layer }: Shape): Promise<Shape[]> {
        const neighbors = await this.broadPhaseResolverUpdateRetrieve(boundingBox);

        return this.collisionMatrix
            ? neighbors
                  .map<Shape>((id) => this.shapes[id])
                  .filter((remote) =>
                      this.collisionMatrix.some(
                          (row) =>
                              (row[0] === layer && row[1] === remote.layer) ||
                              (row[1] === layer && row[0] === remote.layer),
                      ),
                  )
            : neighbors.map<Shape>((id) => this.shapes[id]);
    }

    // narrow phase takes care of checking for actual collision
    private narrowPhase(local: Shape, neighbors: Shape[]): void {
        neighbors
            .filter(
                (neighbor) =>
                    local.entity !== neighbor.entity &&
                    local.id !== neighbor.id &&
                    !local.ignoreCollisionsWithLayers.includes(neighbor.layer) &&
                    !neighbor.ignoreCollisionsWithLayers.includes(local.layer) &&
                    !this.isResolved(local, neighbor),
            )
            .forEach((neighbor) => {
                const resolution = this.collisionResolutionMethod.findCollision(local, neighbor);

                if (resolution) {
                    this.collisionRepository.persist({
                        localCollider: this.colliders[local.collider],
                        localEntity: local.entity,
                        remoteCollider: this.colliders[neighbor.collider],
                        remoteEntity: neighbor.entity,
                        resolution,
                    });

                    this.collisionRepository.persist({
                        localCollider: this.colliders[neighbor.collider],
                        localEntity: neighbor.entity,
                        remoteCollider: this.colliders[local.collider],
                        remoteEntity: local.entity,
                        resolution: {
                            direction: Vector2.scale(new Vector2(), resolution.direction, -1),
                            penetration: resolution.penetration,
                        },
                    });

                    this.collisions.add(`${local.id}-${neighbor.id}`);
                    this.collisions.add(`${neighbor.id}-${local.id}`);
                }
            });
    }

    private isResolved(local: Shape, neighbor: Shape): boolean {
        return this.collisions.has(`${local.id}-${neighbor.id}`);
    }
}
