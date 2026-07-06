console.log("SCRIPT IS RUNNING");
console.log("albums:", document.getElementById("albums"));
console.log("gallery:", document.getElementById("gallery"));

let currentAlbum = "all";

const gallery = document.getElementById("gallery");
const albumsDiv = document.getElementById("albums");

function getFilteredPhotos() {
  if (currentAlbum === "all") return photos;
  return photos.filter(p => p.album === currentAlbum);
}

function renderAlbums() {
  const albums = ["all", ...new Set(photos.map(p => p.album))];

  albumsDiv.innerHTML = "";

  albums.forEach(album => {
    const btn = document.createElement("button");
    btn.innerText = album;
    btn.className = "album-btn";

    if (album === "all") btn.classList.add("active");

    btn.onclick = () => {
      currentAlbum = album;

      document.querySelectorAll(".album-btn")
        .forEach(b => b.classList.remove("active"));

      btn.classList.add("active");
      renderGallery();
    };

    albumsDiv.appendChild(btn);
  });
}

let currentIndex = 0;
let touchStartX = 0;

function getCurrentPhotos() {
  return getFilteredPhotos();
}

function openLightbox(index) {
  currentIndex = index;

  const lightbox = document.getElementById("lightbox");
  lightbox.classList.add("show");

  updateLightboxImage(true);
}

function closeLightbox() {
  document.getElementById("lightbox").classList.remove("show");
}

function updateLightboxImage(preloadNext = false) {
  const photos = getCurrentPhotos();
  const photo = photos[currentIndex];

  const img = document.getElementById("lightbox-img");

  const fullPath = "photos/" + photo.file;

  img.src = fullPath;

  // 🔥 preload next image for smoothness
  if (preloadNext) {
    const next = new Image();
    next.src = "photos/" + photos[(currentIndex + 1) % photos.length].file;
  }

  // update download button
  document.getElementById("download").onclick = () => {
    const a = document.createElement("a");
    a.href = fullPath;
    a.download = photo.file;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };
}

function nextImage() {
  const photos = getCurrentPhotos();
  currentIndex = (currentIndex + 1) % photos.length;
  updateLightboxImage(true);
}

function prevImage() {
  const photos = getCurrentPhotos();
  currentIndex = (currentIndex - 1 + photos.length) % photos.length;
  updateLightboxImage(true);
}

document.addEventListener("keydown", (e) => {
  const lightbox = document.getElementById("lightbox");
  if (!lightbox.classList.contains("show")) return;

  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowRight") nextImage();
  if (e.key === "ArrowLeft") prevImage();
});

document.getElementById("lightbox").addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

document.getElementById("lightbox").addEventListener("touchend", (e) => {
  const endX = e.changedTouches[0].screenX;
  const diff = endX - touchStartX;

  if (Math.abs(diff) > 50) {
    if (diff < 0) nextImage();
    else prevImage();
  }
});

function renderGallery() {
  gallery.innerHTML = "";

  getFilteredPhotos().forEach((photo, index) => {
    const div = document.createElement("div");
    div.className = "photo";

    const img = document.createElement("img");

    img.src = "thumbnails/" + photo.file;

  div.onclick = () => openLightbox(index);

    div.appendChild(img);
    gallery.appendChild(div);
  });
}
renderAlbums();
renderGallery();
document.getElementById("close").onclick = closeLightbox;
document.getElementById("next").onclick = nextImage;
document.getElementById("prev").onclick = prevImage;
document.getElementById("close").onclick = closeLightbox;

