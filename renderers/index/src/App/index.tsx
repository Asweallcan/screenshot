import React, { useCallback } from "react";

export const App: React.FC = () => {
  const onScreenshot = useCallback(() => {
    window.bridge.screenshot();
  }, []);

  return <button onClick={onScreenshot}>截图</button>;
};
