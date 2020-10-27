import Animator from "../../Engine/Components/Animator";
import RectangleCollider from "../../Engine/Components/Colliders/RectangleCollider";
import SpriteRenderer from "../../Engine/Components/Renderer/SpriteRenderer";
import { container } from "../../Engine/Game";
import GameObject from "../../Engine/GameObject";
import Rectangle from "../../Engine/Libs/Geometric/Shapes/Rectangle";
import Vector2 from "../../Engine/Helper/Vector2";
import Sprite from "../../Engine/Sprite";
import { PlayerWalking } from "../Animations/PlayerTopAnimations";
import { LAYER_BOT, LAYER_PROJECTILE } from "../Config/renderLayers";
import { TAG_PLAYER } from "./PlayerTop";

export const TAG_BOT = "Bot";

export default class Bot extends GameObject {
    timeManager = container.getSingleton("TimeManager");
    assetManager = container.getSingleton("AssetManager");

    player = null;
    tilemap = null;
    collider = null;

    walkSpeed = 180;

    // status
    aimAngle = 0; // in radians
    previousDirection = new Vector2(1, 0);
    currentDirection = new Vector2(1, 0);
    walkingAnimation = false;
    currentSpeed = new Vector2(0, 0);
    respawnPoint = new Vector2(0, 0);

    playerDistance = 128;

    constructor(x, y) {
        super();

        this.tag = TAG_BOT;
        this.layer = LAYER_BOT;
        this.transform.position.set(x, y);
        this.respawnPoint.set(x, y);

        this.addComponent(
            () =>
                new SpriteRenderer({
                    sprite: new Sprite({
                        image: this.assetManager.getImage("image/demo/player-top-down.png"),
                        slice: new Rectangle(0, 0, 32, 32),
                        scale: new Vector2(2, 2),
                        smooth: false,
                    }),
                    rotation: -90,
                }),
            "SpriteRenderer"
        );

        this.addComponent(
            () =>
                new Animator({
                    spriteRenderer: this.getComponent("SpriteRenderer"),
                }),
            "Animator"
        );
        this.getComponent("Animator").addAnimation("PlayerWalking", PlayerWalking);

        this.addComponent(() => new RectangleCollider({ width: 32, height: 32, debug: false }), "RectangleCollider");
        this.collider = this.getComponent("RectangleCollider");
    }

    start() {
        this.player = this.findGameObjectByTag(TAG_PLAYER);
        this.tilemap = this.findGameObjectByName("Foreground").getComponent("TilemapRenderer");
    }

    update() {
        this.updateAimAngle();
        this.updateCurrentDirection();
        this.move();
    }

    updateAimAngle() {
        this.aimAngle = Math.atan2(
            this.player.transform.position.y - this.transform.position.y,
            this.player.transform.position.x - this.transform.position.x
        );
        this.transform.rotation = (this.aimAngle * 180) / Math.PI;
    }

    updateCurrentDirection() {
        this.currentDirection.x = Math.cos(this.aimAngle);
        this.currentDirection.y = Math.sin(this.aimAngle);
    }

    move() {
        if (
            Math.abs(this.player.transform.position.x - this.transform.position.x) <= this.playerDistance &&
            Math.abs(this.player.transform.position.y - this.transform.position.y) <= this.playerDistance
        ) {
            return;
        }

        const deltaX = this.currentDirection.x * (this.walkSpeed * this.timeManager.deltaTime);
        const deltaY = this.currentDirection.y * (this.walkSpeed * this.timeManager.deltaTime);

        this.transform.position.x += deltaX;
        if (deltaX !== 0 && this.isTouchingForeground()) {
            this.transform.position.x -= deltaX;
        }

        this.transform.position.y += deltaY;
        if (deltaY !== 0 && this.isTouchingForeground()) {
            this.transform.position.y -= deltaY;
        }
    }

    isTouchingForeground() {
        return this.collider.collidesWithLayer("Foreground") || this.collider.collidesWithLayer("Bot");
    }

    die() {
        this.setActive(false);
        setTimeout(() => {
            this.transform.position.set(this.respawnPoint.x, this.respawnPoint.y);
            this.setActive(true);
        }, 5000);
    }

    animate() {}
}
