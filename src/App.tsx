import { invoke } from "@tauri-apps/api/tauri";
import { useState } from "react";

import { Explorer } from "./components/Explorer";
import "./globals.css";

function App() {
  const [greetMsg, setGreetMsg] = useState("");
  const [name, setName] = useState("");

  async function greet() {
    // Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
    setGreetMsg(await invoke("greet", { name }));
  }

  return (
    <div>
      <Explorer />
    </div>
  );
}

export default App;
