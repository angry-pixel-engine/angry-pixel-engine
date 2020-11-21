export declare class MouseController {
    leftButtonPressed: boolean;
    scrollButonPressed: boolean;
    rightButtonPressed: boolean;
    private gameNode;
    private gameCanvas;
    private viewportPosition;
    private lastViewportPosition;
    private _hasMoved;
    constructor(gameNode: HTMLElement, gameCanvas: HTMLCanvasElement);
    get hasMoved(): boolean;
    private setup;
    private updateButtonDown;
    private updateButtonUp;
    private updatePosition;
    private update;
}
