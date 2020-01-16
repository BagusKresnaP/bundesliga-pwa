var dbPromised = idb.open("liga-sepakbola", 1, function(upgradeDb) {
  var teamObjectStore = upgradeDb.createObjectStore("team", {
    keyPath: "id"
  });
  teamObjectStore.createIndex("name", "name", {
    unique: false
  });
});

function saveForLater(data) {
  dbPromised
    .then(function(db) {
      var tx = db.transaction("team", "readwrite");
      var store = tx.objectStore("team");
      console.log(data);
      store.put(data);
      return tx.complete;
    })
    .then(function() {
      console.log("Team Favorite berhasil di simpan.");
    });
}

function getAll() {
  return new Promise(function(resolve, reject) {
    dbPromised
      .then(function(db) {
        var tx = db.transaction("team", "readonly");
        var store = tx.objectStore("team");
        return store.getAll();
      })
      .then(function(team) {
        resolve(team);
      });
  });
}

function getAllByTitle(title) {
  dbPromised
    .then(function(db) {
      var tx = db.transaction("team", "readonly");
      var store = tx.objectStore("team");
      var titleIndex = store.index("name");
      var range = IDBKeyRange.bound(title, title + "\uffff");
      return titleIndex.getAll(range);
    })
    .then(function(team) {
      console.log(team);
    });
}

function getById(id) {
  var get_id = parseInt(id);
  return new Promise(function(resolve, reject) {
    dbPromised
      .then(function(db) {
        var tx = db.transaction("team", "readonly");
        var store = tx.objectStore("team");
        return store.get(get_id);
      })
      .then(function(team) {
        resolve(team);
      });
  });
}

function deleteFavoriteTeam(id) {
  var get_id = parseInt(id);
  return new Promise(function(resolve, reject) {
    dbPromised
    .then(function(db) {
      var tx = db.transaction('team', 'readwrite');
      var store = tx.objectStore('team');
      store.delete(get_id);
      return tx.complete;
    }).then(function() {
      console.log(get_id);
      console.log('Team favorite berhasil dihapus');
    });
  });
}