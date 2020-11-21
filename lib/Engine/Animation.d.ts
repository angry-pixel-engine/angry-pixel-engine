import { Sprite } from "./Sprite";
interface config {
    sprites: Sprite[];
    speed: number;
    loop: boolean;
}
export declare class Animation {
    sprites: Sprite[];
    speed: number;
    loop: boolean;
    constructor(config: config);
}
export {};
