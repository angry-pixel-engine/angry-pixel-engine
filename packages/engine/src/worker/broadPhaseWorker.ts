import { Shape, SpartialGrid } from "@collisions2d";
import { Rectangle } from "@math";

interface BroadPhaseMessage {
    type: "update" | "retrieve";
    data: Shape[] | Rectangle;
}

const broadPhaseResolver = new SpartialGrid();

self.onmessage = (event: MessageEvent) => {
    const { type, data } = event.data as BroadPhaseMessage;
    if (type === "update") {
        broadPhaseResolver.update(
            (data as Shape[]).map((shape) => {
                shape.boundingBox = fixRectangle(shape.boundingBox);
                return shape;
            }),
        );
        self.postMessage(true);
    } else if (type === "retrieve") {
        const result = broadPhaseResolver.retrieve(fixRectangle(data as Rectangle));
        self.postMessage(result);
    }
};

const fixRectangle = (rectangle: Rectangle): Rectangle =>
    // @ts-ignore
    new Rectangle(rectangle._position._x, rectangle._position._y, rectangle.width, rectangle.height);
