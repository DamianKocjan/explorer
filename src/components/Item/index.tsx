import { useExplorerState } from "@/hooks/useExplorerState";
import { invoke } from "@tauri-apps/api/tauri";
import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";

interface Item {
  created: number;
  is_dir: boolean;
  modified: number;
  name: string;
  path: string;
  size: number;
}

export const Item: React.FC<{ path: string }> = ({ path }) => {
  const [data, setData] = useState<Item>();
  const { setCurrentPath } = useExplorerState();

  useEffect(() => {
    invoke("get_item_metadata", { dir: path }).then((data) =>
      setData(data as Item)
    );
  }, []);

  const handleChangeDirectory = () => {
    if (data?.is_dir) {
      invoke("change_dir", { dir: data.path });
      setCurrentPath(data.path);
    }
  };

  if (!data) return <Button disabled>loading...</Button>;
  return (
    <Button onClick={handleChangeDirectory} data-path={data.path}>
      {data.name}
    </Button>
  );
};
