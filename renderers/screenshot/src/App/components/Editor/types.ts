import Konva from "konva";
import { Rect, Ellipse, Group } from "react-konva";

interface DrawTools {
  rect: {
    color: string;
    strokeWidth: number;
    Node: typeof Rect;
    props: Konva.RectConfig;
  };
  circle: {
    color: string;
    strokeWidth: number;
    Node: typeof Ellipse;
    props: Konva.EllipseConfig;
  };
  mosaic: {
    Node: typeof Group;
    props: {
      childNodes: Array<{
        Node: typeof Rect;
        props: Konva.RectConfig;
      }>;
    };
  };
}

export type DrawShape = keyof DrawTools;

export type DrawTool<T extends DrawShape = DrawShape> = {
  name: T;
  options: Omit<DrawTools[T], "Node" | "props">;
};

export type DrawNode<T extends DrawShape = DrawShape> = {
  Node: DrawTools[T]["Node"];
  props: DrawTools[T]["props"];
};
