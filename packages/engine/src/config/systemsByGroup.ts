import { SystemType } from "@ecs";
import { AudioPlayerSystem } from "@system/gameLogic/AudioPlayerSystem";
import { ButtonSystem } from "@system/gameLogic/ButtonSystem";
import { ChildrenSystem } from "@system/gameLogic/ChildrenSystem";
import { ParentSystem } from "@system/gameLogic/ParentSystem";
import { TiledWrapperSystem } from "@system/gameLogic/TiledWrapperSystem";
import { TilemapPreProcessingSystem } from "@system/gameLogic/TilemapPreProcessingSystem";
import { TransformSystem } from "@system/gameLogic/TransformSystem";
import { GamepadSystem } from "@system/input/GamepadSystem";
import { KeyboardSystem } from "@system/input/KeyboardSystem";
import { MouseSystem } from "@system/input/MouseSystem";
import { TouchScreenSystem } from "@system/input/TouchScreenSystem";
import { AnimatorSystem } from "@system/render2d/AnimatorSystem";
import { CameraSystem } from "@system/render2d/CameraSystem";
import { ClearScreenSystem } from "@system/render2d/ClearScreenSystem";
import { ColliderRenderSystem } from "@system/render2d/ColliderRenderSystem";
import { CullingSystem } from "@system/render2d/CullingSystem";
import { MaskRendererSystem } from "@system/render2d/MaskRendererSystem";
import { RenderSystem } from "@system/render2d/RenderSystem";
import { ShadowLightRendererSystem } from "@system/render2d/ShadowLightRendererSystem";
import { SpriteRendererSystem } from "@system/render2d/SpriteRendererSystem";
import { TextRendererSystem } from "@system/render2d/TextRendererSystem";
import { TilemapRendererSystem } from "@system/render2d/TilemapRendererSystem";
import { VideoRendererSystem } from "@system/render2d/VideoRendererSystem";
import { SystemGroup } from "@system/SystemGroup";
import { SYSTEMS } from "./systemTypes";
import { ApplyVelocitySystem } from "@system/physics2d/ApplyVelocitySystem";
import { UpdateBallColliderShapeSystem } from "@system/physics2d/collider/UpdateBallColliderShapeSystem";
import { UpdateBoxColliderShapeSystem } from "@system/physics2d/collider/UpdateBoxColliderShapeSystem";
import { UpdateEdgeColliderShapeSystem } from "@system/physics2d/collider/UpdateEdgeColliderShapeSystem";
import { UpdatePolygonColliderShapeSystem } from "@system/physics2d/collider/UpdatePolygonColliderShapeSystem";
import { UpdateTilemapColliderShapeSystem } from "@system/physics2d/collider/UpdateTilemapColliderShapeSystem";
import { ResolveCollisionSystem } from "@system/physics2d/ResolveCollisionSystemNew";
import { ApplyRepositionSystem } from "@system/physics2d/ApplyRepositionSystem";
import { UpdateCollidersAfterRepositionSystem } from "@system/physics2d/collider/UpdateCollidersAfterRepositionSystem";

export type SystemsByGroup = Map<SystemGroup, { name: symbol; type: SystemType }[]>;

export const systemsByGroup: SystemsByGroup = new Map([
    [
        SystemGroup.PreGameLogic,
        [
            { name: SYSTEMS.KeyboardSystem, type: KeyboardSystem },
            { name: SYSTEMS.MouseSystem, type: MouseSystem },
            { name: SYSTEMS.TouchScreenSystem, type: TouchScreenSystem },
            { name: SYSTEMS.GamepadSystem, type: GamepadSystem },
            { name: SYSTEMS.ButtonSystem, type: ButtonSystem },
            { name: SYSTEMS.AudioPlayerSystem, type: AudioPlayerSystem },
            { name: SYSTEMS.TiledWrapperSystem, type: TiledWrapperSystem },
            { name: SYSTEMS.TilemapPreProcessingSystem, type: TilemapPreProcessingSystem },
            { name: SYSTEMS.ChildrenSystem, type: ChildrenSystem },
            { name: SYSTEMS.ParentSystem, type: ParentSystem },
        ],
    ],
    [SystemGroup.Transform, [{ name: SYSTEMS.TransformSystem, type: TransformSystem }]],
    [
        SystemGroup.Physics,
        [
            { name: SYSTEMS.ApplyVelocitySystem, type: ApplyVelocitySystem },
            { name: SYSTEMS.UpdateBallColliderShapeSystem, type: UpdateBallColliderShapeSystem },
            { name: SYSTEMS.UpdateBoxColliderShapeSystem, type: UpdateBoxColliderShapeSystem },
            { name: SYSTEMS.UpdateEdgeColliderShapeSystem, type: UpdateEdgeColliderShapeSystem },
            { name: SYSTEMS.UpdatePolygonColliderShapeSystem, type: UpdatePolygonColliderShapeSystem },
            { name: SYSTEMS.UpdateTilemapColliderShapeSystem, type: UpdateTilemapColliderShapeSystem },
            { name: SYSTEMS.ResolveCollisionSystem, type: ResolveCollisionSystem },
            { name: SYSTEMS.ApplyRepositionSystem, type: ApplyRepositionSystem },
            { name: SYSTEMS.UpdateCollidersAfterRepositionSystem, type: UpdateCollidersAfterRepositionSystem },
        ],
    ],
    [
        SystemGroup.Render,
        [
            { name: SYSTEMS.AnimatorSystem, type: AnimatorSystem },
            { name: SYSTEMS.CameraSystem, type: CameraSystem },
            { name: SYSTEMS.TilemapRendererSystem, type: TilemapRendererSystem },
            { name: SYSTEMS.SpriteRendererSystem, type: SpriteRendererSystem },
            { name: SYSTEMS.MaskRendererSystem, type: MaskRendererSystem },
            { name: SYSTEMS.ShadowLightRendererSystem, type: ShadowLightRendererSystem },
            { name: SYSTEMS.TextRendererSystem, type: TextRendererSystem },
            { name: SYSTEMS.VideoRendererSystem, type: VideoRendererSystem },
            { name: SYSTEMS.ColliderRenderSystem, type: ColliderRenderSystem },
            { name: SYSTEMS.CullingSystem, type: CullingSystem },
            { name: SYSTEMS.ClearScreenSystem, type: ClearScreenSystem },
            { name: SYSTEMS.RenderSystem, type: RenderSystem },
        ],
    ],
]);
