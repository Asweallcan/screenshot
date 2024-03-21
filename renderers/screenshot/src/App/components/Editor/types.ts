import Konva from "konva";

export interface DrawTools {
  rect: {
    color: string;
    strokeWidth: number;
    item: Konva.Rect;
  };
  circle: {
    color: string;
    strokeWidth: number;
    item: Konva.Ellipse;
  };
}

export type DrawTool<T extends keyof DrawTools = keyof DrawTools> = {
  name: T;
  options: Omit<DrawTools[T], "item">;
};
