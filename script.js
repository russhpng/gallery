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

function openLightbox(index) {
  currentIndex = index;

  const photosToShow = getFilteredPhotos();
  const photo = photosToShow[currentIndex];

  const lightbox = document.getElementById("lightbox");
  const img = document.getElementById("lightbox-img");

  img.src = "photos/" + photo.file; // full resolution image path
  lightbox.classList.remove("hidden");
}

function closeLightbox() {
  document.getElementById("lightbox").classList.add("hidden");
}

document.getElementById("lightbox").onclick = (e) => {
  if (e.target.id === "lightbox") closeLightbox();
};
document.getElementById("prev").onclick = () => {
  const photosToShow = getFilteredPhotos();
  currentIndex = (currentIndex - 1 + photosToShow.length) % photosToShow.length;

  document.getElementById("lightbox-img").src =
    "photos/" + photosToShow[currentIndex].file;
};

document.getElementById("next").onclick = () => {
  const photosToShow = getFilteredPhotos();
  currentIndex = (currentIndex + 1) % photosToShow.length;

  document.getElementById("lightbox-img").src =
    "photos/" + photosToShow[currentIndex].file;
};

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

