import os
import tkinter as tk
from tkinter import filedialog

# Comma-separated list of folders to exclude
EXCLUDED_FOLDERS = "node_modules"

def select_folder():
    root = tk.Tk()
    root.withdraw()
    folder_path = filedialog.askdirectory(title="Select Folder")
    return folder_path

def print_folder_structure(start_path, indent=""):
    excluded = set(EXCLUDED_FOLDERS.split(','))
    for item in os.listdir(start_path):
        if item in excluded:
            continue
        path = os.path.join(start_path, item)
        if os.path.isdir(path):
            print(f"{indent}└── {item}/")
            print_folder_structure(path, indent + "    ")
        else:
            print(f"{indent}└── {item}")

if __name__ == "__main__":
    folder_path = select_folder()
    if folder_path:
        print(f"Folder structure for: {folder_path}")
        print(f"Excluding folders: {EXCLUDED_FOLDERS}")
        print_folder_structure(folder_path)
    else:
        print("No folder selected.")