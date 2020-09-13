import SpriteRenderer from "../../Engine/Components/SpriteRenderer";
import GameObject from "../../Engine/GameObject";
import Rectangle from "../../Engine/Helper/Rectangle";
import Vector2 from "../../Engine/Helper/Vector2";
import Sprite from "../../Engine/Sprite";
import { LAYER_PROJECTILE } from "../Config/renderLayers";

const SPRITE_PATH = 'image/demo/projectile.png';

export const TAG_PROJECTILE = 'Projectile';

export default class Projectile extends GameObject {
    shooted = false;
    speed = 15;
    deltaX = 0;
    deltay = 0;

    weapon = null;
    cachedParent = null;

    innerPosX = 0; //-3;
    innerPosY = 0; //20;

    constructor(weapon) {
        super();

        this.transform.innerPosition.set(this.innerPosX, this.innerPosY);

        this.weapon = weapon;
        this.layer = LAYER_PROJECTILE;
        this.tag = TAG_PROJECTILE;

        const image = new Image();
        image.src = SPRITE_PATH;

        this.addComponent(() => new SpriteRenderer({
            sprite: new Sprite({
                image: image,
                scale: new Vector2(2, 2),
                smooth: false
            }),
        }), 'SpriteRenderer')
    }

    update() {
        if (this.shooted) {
            this.transform.position.x += this.deltaX;
            this.transform.position.y += this.deltaY;
        }
    }
    
    fire(angle) {
        this.deltaX = Math.cos(angle) * this.speed;
        this.deltaY = Math.sin(angle) * this.speed;
        this.shooted = true;

        this.cachedParent = this._parent;
        this._parent = null;

        setTimeout(() => {
            this.shooted = false;
            this.transform.innerPosition.set(this.innerPosX, this.innerPosY);
            this.parent = this.cachedParent;            
            
            this.weapon.restoreProjectile(this);
        }, 500);
    }
}