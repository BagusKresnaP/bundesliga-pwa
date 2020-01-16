// REGISTER SERVICE WORKER
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then(function() {
        console.log("Pendaftaran ServiceWorker berhasil");
      })
      .catch(function() {
        console.log("Pendaftaran ServiceWorker gagal");
      });
  });
} else {
  console.log("ServiceWorker belum didukung browser ini.");
}

document.addEventListener("DOMContentLoaded", function() {
  var urlParams = new URLSearchParams(window.location.search);
  var isFromSaved = urlParams.get("saved");
  var isFromDelete = urlParams.get("delete");

  var save = document.getElementById("save");

  if (isFromSaved) {
    // Hide fab jika dimuat dari indexed db
    save.style.display = 'none';
    
    // ambil data team favorite lalu tampilkan
    getSavedFavoriteTeambyId();
  } else if (isFromDelete) {
    // Hide fab jika dimuat dari indexed db
    save.style.display = 'none';
    
    // hapus team favorite
    getDeleteFavoriteTeam();
  } else {
    var item = getTeamById();
  }

  save.onclick = function() {
    console.log("Tombol FAB di klik.");
    console.log(item);
    item.then(function(data) {
      saveForLater(data);
    });
  };
});