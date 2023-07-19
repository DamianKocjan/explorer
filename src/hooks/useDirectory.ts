import { useState } from "react";
import { metadata } from "tauri-plugin-fs-extra-api";
// import { watch } from "tauri-plugin-fs-watch-api";

import { invoke } from "@tauri-apps/api/tauri";
import { ExplorerItem } from "../components/shares/types";

async function getItemData(path: string) {
  const stats = await metadata(path);
  return {
    name: path.split("/").pop() || "",
    type: stats.isDir ? "folder" : "file",
    size: stats.size,
    date: stats.modifiedAt || "",
    path,
  };
}

export function useDirectory(path: string) {
  const [items, setItems] = useState<ExplorerItem[]>([]);

  function getItems() {
    setItems([]);
    invoke("get_items").then((newItems) =>
      setItems(newItems as ExplorerItem[])
    );
  }

  // useEffect(() => {
  // exists(path).then((exists) => exists && getItems());

  //   // watch(path, (e) => {
  //   //   setItems((items) => {
  //   //     const newItems = items.filter((item) => item.path !== e.path);
  //   //     let itemExists = false;
  //   //     exists(e.path).then((exists) => (itemExists = exists));

  //   //     if (!itemExists) {
  //   //       return newItems;
  //   //     }

  //   //     getItemData(e.path).then(({ name, type, size, date, path }) =>
  //   //       newItems.push({
  //   //         name,
  //   //         type,
  //   //         size,
  //   //         date: date.toString(),
  //   //         path,
  //   //       })
  //   //     );

  //   //     return newItems;
  //   //   });
  //   // });
  // }, [path]);

  console.log({
    items,
    path,
  });

  return { items, getItems };
}
