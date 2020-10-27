import Component from "../../Component";
import ICollider from "../../Core/Collision/Collider/ICollider";
import CollisionManager from "../../Core/Collision/CollisionManager";
import { container } from "../../Game";

export default abstract class AbstractColliderComponent extends Component {
    protected collisionManager: CollisionManager = container.getSingleton<CollisionManager>("CollisionManager");
    protected colliders: ICollider[] = [];

    protected abstract updateCoordinates(): void;

    protected addCollider(collider: ICollider): void {
        this.colliders.push(collider);
        this.collisionManager.addCollider(collider);
    }

    public collidesWithLayer(layer: string): boolean {
        return this.getCollisionWithLayer(layer) !== null;
    }

    public getCollisionWithLayer(layer: string): ICollider | null {
        this.updateCoordinates();

        for (const collider of this.colliders) {
            const collisions = this.collisionManager.getCollisionsForCollider(collider);
            for (const foreignCollider of collisions) {
                if (foreignCollider.gameObject.layer === layer) {
                    return foreignCollider;
                }
            }
        }

        return null;
    }

    public setActive(active: boolean): void {
        if (active === true && this.active === false) {
            this.colliders.forEach((collider: ICollider) => this.collisionManager.addCollider(collider));
        } else if (active === false && this.active === true) {
            this.colliders.forEach((collider: ICollider) => this.collisionManager.removeCollider(collider));
        }

        super.setActive(active);
    }

    public destroy(): void {
        this.colliders.forEach((collider: ICollider) => this.collisionManager.removeCollider(collider));
        super.destroy();
    }
}
