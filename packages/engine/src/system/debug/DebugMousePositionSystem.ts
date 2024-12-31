import { Transform } from "@component/gameLogic/Transform";
import { Camera, debugRenderLayer } from "@component/render2d/Camera";
import { defaultTextureAtlasOptions } from "@component/render2d/TextRenderer";
import { GameConfig } from "@config/bootstrap";
import { SYSTEMS } from "@config/systemTypes";
import { TYPES } from "@config/types";
import { EntityManager, System } from "@ecs";
import { inject, injectable } from "@ioc";
import { InputManager } from "@manager/InputManager";
import { RenderManager } from "@manager/RenderManager";
import { Vector2 } from "@math";
import { RenderDataType, TextOrientation, TextRenderData } from "@webgl";

const defaultFontSize = 24;

@injectable(SYSTEMS.DebugMousePositionSystem)
export class DebugMousePositionSystem implements System {
    private readonly positionInViewport: Vector2 = new Vector2();
    private readonly positionInViewportWithZoom: Vector2 = new Vector2();
    private readonly positionInWorldspace: Vector2 = new Vector2();
    private readonly renderDataPerCamera: Map<number, TextRenderData> = new Map();

    constructor(
        @inject(TYPES.EntityManager) private readonly entityManager: EntityManager,
        @inject(TYPES.RenderManager) private readonly renderManager: RenderManager,
        @inject(TYPES.InputManager) private readonly inputManager: InputManager,
        @inject(TYPES.CanvasElement) private readonly canvas: HTMLCanvasElement,
        @inject(TYPES.GameConfig) private readonly gameConfig: GameConfig,
    ) {}

    public onUpdate(): void {
        if (!this.gameConfig.debugEnabled || !this.inputManager.mouse) return;

        const { positionInViewport } = this.inputManager.mouse;

        this.entityManager.search(Camera, { debug: true }).forEach(({ entity, component: camera }, index) => {
            const { zoom } = camera;
            const cameraPosition = this.entityManager.getComponent(entity, Transform).position;
            const renderData = this.renderDataPerCamera.get(index) ?? createRenderData();

            Vector2.floor(
                this.positionInWorldspace,
                Vector2.add(
                    this.positionInWorldspace,
                    cameraPosition,
                    Vector2.scale(this.positionInWorldspace, positionInViewport, 1 / zoom),
                ),
            );

            Vector2.floor(
                this.positionInViewportWithZoom,
                Vector2.scale(this.positionInViewportWithZoom, positionInViewport, 1 / zoom),
            );

            Vector2.round(this.positionInViewport, positionInViewport);

            renderData.color = this.gameConfig.debugColor;
            renderData.text = `Mouse Position: viewport=${this.positionInViewport}, viewport(with zoom)=${this.positionInViewportWithZoom}, world=${this.positionInWorldspace}`;
            renderData.fontSize = defaultFontSize / zoom;
            renderData.shadow.offset.x = 2 / zoom;
            renderData.shadow.offset.y = -2 / zoom;
            this.updateRenderDataPosition(renderData, cameraPosition, zoom);
            this.renderManager.addRenderData(renderData);
        });
    }

    private updateRenderDataPosition(renderData: TextRenderData, cameraPosition: Vector2, zoom: number): void {
        switch (this.gameConfig.debugTextPosition) {
            case "top-left":
                renderData.position.set(
                    cameraPosition.x - (this.canvas.width / 2 - defaultFontSize) / zoom,
                    cameraPosition.y + (this.canvas.height / 2 - defaultFontSize) / zoom,
                );
                break;
            case "top-right":
                renderData.position.set(
                    cameraPosition.x + (this.canvas.width / 2 - (renderData.text.length / 2) * defaultFontSize) / zoom,
                    cameraPosition.y + (this.canvas.height / 2 - defaultFontSize) / zoom,
                );
                break;
            case "bottom-left":
            default:
                renderData.position.set(
                    cameraPosition.x - (this.canvas.width / 2 - defaultFontSize) / zoom,
                    cameraPosition.y - (this.canvas.height / 2 - defaultFontSize) / zoom,
                );
                break;
            case "bottom-right":
                renderData.position.set(
                    cameraPosition.x + (this.canvas.width / 2 - (renderData.text.length / 2) * defaultFontSize) / zoom,
                    cameraPosition.y - (this.canvas.height / 2 - defaultFontSize) / zoom,
                );
                break;
        }
    }
}

const createRenderData = (fontSize: number = defaultFontSize): TextRenderData => ({
    type: RenderDataType.Text,
    text: "",
    position: new Vector2(),
    layer: debugRenderLayer,
    color: "#00FF00",
    fontSize,
    font: "Arial",
    shadow: {
        color: "#000000",
        opacity: 1,
        offset: new Vector2(1, -1),
    },
    orientation: TextOrientation.RightCenter,
    flipHorizontally: false,
    flipVertically: false,
    letterSpacing: 0,
    lineHeight: fontSize,
    opacity: 1,
    rotation: 0,
    smooth: false,
    textureAtlas: {
        ...defaultTextureAtlasOptions,
    },
});
