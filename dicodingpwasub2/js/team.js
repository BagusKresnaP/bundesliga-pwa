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

  var s = document.getElementById("save");
  var d = document.getElementById("tombol_delete");
  s.style.display = 'block';
  d.style.display = 'none';

  if (isFromSaved) {
    // Hide fab jika dimuat dari indexed db
    s.style.display = 'none';
    
    // ambil data team favorite lalu tampilkan
    getSavedFavoriteTeambyId();
  } else if (isFromDelete) {
    // Hide fab jika dimuat dari indexed db
    s.style.display = 'none';
    
    // hapus team favorite
    getDeleteFavoriteTeam();
  } else {
    var item = getTeamById();
  }

  save.onclick = function() {
    if (s.style.display === "none") {
      s.style.display = "block";
      d.style.display = "none";
    } else {
      s.style.display = "none";
      d.style.display = "block";
    }
    M.toast({ html: `Team favorite berhasil disimpan!` })
    
    console.log("Tombol FAB di klik.");
    console.log(item);
    item.then(function(data) {
      saveForLater(data);
    });
  };

  tombol_delete.onclick = function() {
    if (d.style.display === "none") {
      s.style.display = "block";
      d.style.display = "none";
    } else {
      s.style.display = "none";
      d.style.display = "block";
    }
    M.toast({ html: `Team favorite berhasil dihapus!` })
    
    console.log("Tombol FAB di klik.");
    console.log(item);
    item.then(function(data) {
      getDeleteFavoriteTeam();
    });
  };
});