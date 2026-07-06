console.log("SCRIPT IS RUNNING");

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
