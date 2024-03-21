interface DrawTools {
  rect: {
    color: string;
    width: number;
  };
  circle: {
    color: string;
    width: number;
  };
}

export type DrawTool<T extends keyof DrawTools = keyof DrawTools> = {
  name: T;
  options: DrawTools[T];
};
