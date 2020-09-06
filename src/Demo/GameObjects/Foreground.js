import GameObject from "../../Engine/GameObject";
import SpriteRenderer from "../../Engine/Components/SpriteRenderer";
import Sprite from "../../Engine/Sprite";

export const TAG_FOREGROUND = 'Foreground';
export const LAYER_FOREGROUND = 'Foreground';

const SPRITE_PATH = 'image/demo/testmap.png';

export default class Foreground extends GameObject {
    width = 0;
    height = 0;
    spriteRenderer = null;

    constructor() {
        super();

        this.tag = TAG_FOREGROUND;
        this.layer = LAYER_FOREGROUND;
        this.transform.position.x = 0;
        this.transform.position.y = 0;

        this.transform.scale.x = 3;
        this.transform.scale.y = 3;

        const image = new Image();
        image.src = SPRITE_PATH;
        
        this.addComponent(() => new SpriteRenderer({
            sprite: new Sprite({
                image: image,
                smooth: false
            }),
        }), 'SpriteRenderer');

        this.spriteRenderer = this.getComponent('SpriteRenderer');
    }

    update() {
        if (this.spriteRenderer.sprite.loaded && this.width === 0) {
            this.width = this.spriteRenderer.sprite.width * this.transform.scale.x;
            this.height = this.spriteRenderer.sprite.height * this.transform.scale.y;
        }
    }
}