import Scene from "../../Engine/Scene";
import SpotPointer from "../GameObjects/SpotPointer";
import FollowPlayerCamera from "../Components/FollowPlayerCamera";
import PlayerTop, { LAYER_PLAYER } from "../GameObjects/PlayerTop";
import ForegroundTopDown, { LAYER_FOREGROUND } from "../GameObjects/ForegroundTopDown";

export default class TopDown extends Scene {

    constructor() {
        super();

        this.addGameObject(() => new ForegroundTopDown(), 'Foreground')
            .addGameObject(() => new PlayerTop(), 'Player')
            .addGameObject(() => new SpotPointer());

        this.gameCamera.camera.addLayerToRender(LAYER_PLAYER);
        this.gameCamera.camera.addLayerToRender(LAYER_FOREGROUND);
        this.gameCamera.addComponent(() => new FollowPlayerCamera());
    }

    start(event) {
        event.game.canvasBGColor = '#080500';
    }
}