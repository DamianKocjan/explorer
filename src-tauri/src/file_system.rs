use std::io::{self, Error};

use serde::{Deserialize, Serialize};

pub(crate) fn latest_used_files() -> Result<Vec<String>, Error> {
    Ok(vec![])
}

pub(crate) fn get_items(dir: &str) -> Vec<String> {
    let mut items = vec![];
    let paths = std::fs::read_dir(dir).unwrap();
    for path in paths {
        let path = path.unwrap().path();
        let path = path.to_str().unwrap().to_string();
        items.push(path);
    }
    items
}

#[derive(Debug, Clone, Serialize, Deserialize)]
pub(crate) struct ItemMetadata {
    pub name: String,
    pub path: String,
    pub size: u64,
    pub created: u64,
    pub modified: u64,
    pub is_dir: bool,
}

impl ItemMetadata {
    pub fn new(
        name: String,
        path: String,
        size: u64,
        created: u64,
        modified: u64,
        is_dir: bool,
    ) -> Self {
        Self {
            name,
            path,
            size,
            created,
            modified,
            is_dir,
        }
    }
}

pub(crate) fn get_item_metadata(dir: &str) -> Result<ItemMetadata, Error> {
    let metadata = std::fs::metadata(dir)?;
    let name = dir.split("\\").last().unwrap().to_string();
    let path = dir.to_string();
    let size = metadata.len();
    let created = metadata.created()?.elapsed().unwrap().as_secs();
    let modified = metadata.modified()?.elapsed().unwrap().as_secs();
    let is_dir = metadata.is_dir();
    Ok(ItemMetadata::new(
        name, path, size, created, modified, is_dir,
    ))
}
