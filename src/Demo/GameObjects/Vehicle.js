import GameObject from "../../Engine/GameObject";
import { SPRITE_RENDERER } from '../../Engine/Component';
import SpriteRenderer from '../../Engine/Components/SpriteRenderer';

export default class Vehicle extends GameObject {
    sprite = new Image();
    speed = 0;

    constructor(spritePath, speed) {
        super();

        this.sprite.src = spritePath;
        this.speed = speed;

        this.transform.position.x = 50;
        this.transform.position.y = 50;

        this.components[SPRITE_RENDERER] = new SpriteRenderer(this, { sprite: this.sprite });
    }

    gameLoop(event) {
        //this.moveVehicle(event.input.keyboard);
    }

    moveVehicle(keyboard) {
        let deltaX = 0;
        let deltaY = 0;
        
        if (keyboard.isPressed('ArrowUp')) {
            deltaY = -this.speed;
        } else if (keyboard.isPressed('ArrowDown')) {
            deltaY = this.speed;
        }

        if (keyboard.isPressed('ArrowLeft')) {
            deltaX = -this.speed;
        } else if (keyboard.isPressed('ArrowRight')) {
            deltaX = +this.speed;
        }
        
        this.transform.position.x += deltaX;
        this.transform.position.y += deltaY;
    }
}