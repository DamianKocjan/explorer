import { useRef } from "react";
import { Store } from "tauri-plugin-store-api";

const STORE_KEY = ".settings.dat";

function useStore() {
  const store = useRef(new Store(STORE_KEY));
  return store.current;
}

export function useLatestUsedFolders() {
  const store = useStore();

  const getLatestUsedFolders = async () => {
    const folders = await store.get("latestUsedFolders");
    return folders as string[];
  };

  const addUsedFolder = async (path: string) => {
    const folders = await getLatestUsedFolders();
    // use only 100 latest used folders
    const newFolders = [path, ...(folders || [])].slice(0, 100);
    await store.set("latestUsedFolders", newFolders);
  };

  return { getLatestUsedFolders, addUsedFolder };
}

export function useLatestUsedFiles() {
  const store = useStore();

  const getLatestUsedFiles = async () => {
    const files = await store.get("latestUsedFiles");
    return files as string[];
  };

  const addUsedFile = async (path: string) => {
    const files = await getLatestUsedFiles();
    // use only 100 latest used files
    const newFiles = [path, ...(files || [])].slice(0, 100);
    await store.set("latestUsedFiles", newFiles);
  };

  return { getLatestUsedFiles, addUsedFile };
}
