import os
import subprocess
from PIL import Image
import shutil

PHOTO_DIR = "photos"
THUMB_DIR = "thumbnails"
OUTPUT_JS = "photos.js"
MAX_SIZE = 800

print("🧹 Cleaning old thumbnails...")
if os.path.exists(THUMB_DIR):
    shutil.rmtree(THUMB_DIR)
os.makedirs(THUMB_DIR, exist_ok=True)

print("🖼️ Building thumbnails + photos.js...")

photos = []

for file in os.listdir(PHOTO_DIR):
    if file.lower().endswith((".jpg", ".jpeg", ".png", ".webp")):

        # 👇 ALBUM DETECTION RULE
        # folder naming: travel_IMG001.jpg, cars_IMG002.jpg
        if "_" in file:
            album = file.split("_")[0].lower()
        else:
            album = "uncategorized"

        photos.append({
            "file": file,
            "album": album
        })

        img = Image.open(os.path.join(PHOTO_DIR, file))
        img = img.convert("RGB")
        img.thumbnail((MAX_SIZE, MAX_SIZE))

        img.save(os.path.join(THUMB_DIR, file), optimize=True, quality=75)

photos.sort(key=lambda x: x["file"])

with open(OUTPUT_JS, "w") as f:
    f.write("const photos = [\n")
    for p in photos:
        f.write(f'  {{ file: "{p["file"]}", album: "{p["album"]}" }},\n')
    f.write("];\n")

print("📦 Staging changes...")

subprocess.run(["git", "add", "."], check=True)

status = subprocess.run(
    ["git", "status", "--porcelain"],
    capture_output=True, text=True, check=True
)

if not status.stdout.strip():
    print("✅ Nothing changed — thumbnails and photos.js already up to date.")
else:
    print("💾 Committing...")
    subprocess.run([
        "git",
        "commit",
        "-m",
        "Update photo gallery"
    ], check=True)

    print("🚀 Pushing to GitHub...")
    subprocess.run(["git", "pull", "--rebase"], check=True)
    subprocess.run(["git", "push"], check=True)
    print("🎉 DONE — site is updating on GitHub Pages")
input("Press Enter to close...")
