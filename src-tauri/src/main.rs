// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::{Arc, Mutex};

use tauri::State;

mod file_system;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
fn current_dir(state_mux: State<'_, StateSafe>) -> String {
    let state = state_mux.lock().unwrap();
    state.current_dir.clone()
}

#[tauri::command]
fn get_items(state_mux: State<'_, StateSafe>) -> Vec<String> {
    let state = state_mux.lock().unwrap();
    let items = file_system::get_items(state.current_dir.as_str());
    println!("{} - {:?}", state.current_dir, items);
    items
}

#[tauri::command]
fn get_item_metadata(dir: &str) -> file_system::ItemMetadata {
    let metadata = file_system::get_item_metadata(dir);

    match metadata {
        Ok(metadata) => metadata,
        Err(_) => {
            let name = dir.split("\\").last().unwrap().to_string();
            let path = dir.to_string();
            let size = 0;
            let created = 0;
            let modified = 0;
            let is_dir = false;
            file_system::ItemMetadata::new(name, path, size, created, modified, is_dir)
        }
    }
}

#[tauri::command]
fn change_dir(state_mux: State<'_, StateSafe>, dir: &str) {
    let mut state = state_mux.lock().unwrap();
    state.current_dir = dir.to_string();
}

#[derive(Default)]
pub struct AppState {
    current_dir: String,
}

impl AppState {
    pub fn new() -> Self {
        Self {
            current_dir: std::env::current_dir()
                .unwrap()
                .to_str()
                .unwrap()
                .to_string(),
        }
    }
}

pub type StateSafe = Arc<Mutex<AppState>>;

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_fs_extra::init())
        .plugin(tauri_plugin_fs_watch::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            current_dir,
            get_items,
            get_item_metadata,
            change_dir
        ])
        .manage(Arc::new(Mutex::new(AppState::new())))
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
