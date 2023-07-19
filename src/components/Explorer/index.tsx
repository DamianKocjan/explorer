import { invoke } from "@tauri-apps/api/tauri";
import React, { useEffect } from "react";

import { useExplorerState } from "@/hooks/useExplorerState";
import { useDirectory } from "../../hooks/useDirectory";
import { Item } from "../Item";
import { Button } from "../ui/button";

export const Explorer: React.FC = () => {
  const { currentPath, setCurrentPath } = useExplorerState();
  const { getItems, items } = useDirectory(currentPath);

  useEffect(() => {
    if (currentPath) {
      getItems();
      return;
    }

    invoke("current_dir").then((dir) => setCurrentPath(dir as string));
  }, [currentPath]);

  return (
    <div>
      {currentPath && (
        <Button
          onClick={() => {
            const newPath = currentPath
              .replaceAll("\\", "/")
              .split("/")
              .slice(0, -1)
              .join("/");

            invoke("change_dir", {
              dir: newPath,
            });
            setCurrentPath(newPath);
          }}
        >
          Back
        </Button>
      )}
      {JSON.stringify({ currentPath })}
      <div className="flex flex-col gap-2">
        {items.map((item, index) => {
          return <Item key={index} path={item as any} />;
        })}
      </div>
    </div>
  );
};
