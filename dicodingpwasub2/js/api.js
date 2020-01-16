const base_url = "https://api.football-data.org/v2/";

// Blok kode yang akan di panggil jika fetch berhasil
function status(response) {
  if (response.status !== 200) {
    console.log("Error : " + response.status);
    // Method reject() akan membuat blok catch terpanggil
    return Promise.reject(new Error(response.statusText));
  } else {
    // Mengubah suatu objek menjadi Promise agar bisa "di-then-kan"
    return Promise.resolve(response);
  }
}

// Blok kode untuk memparsing json menjadi array JavaScript
function json(response) {
  return response.json();
}

// Blok kode untuk meng-handle kesalahan di blok catch
function error(error) {
  // Parameter error berasal dari Promise.reject()
  console.log("Error : " + error);
}

//Memanggil API standing dam memasukkan token API football-data.org
let request = new Request(base_url + "competitions/2002/standings", {
  headers: new Headers({
    'X-Auth-Token' : '9bce69cbb7ee47b49a668e18ff053f03'
  })
});

// Blok kode untuk melakukan request data json
function getKlasemen() {
  showLoader()
  fetch(request)
    .then(status)
    .then(json)
    .then(function(data) {
      // Objek/array JavaScript dari response.json() masuk lewat data.
      // Menampilkan data klasemen
      var klasemenHTML =  `
              <div id="loader"></div>
              <table style="font-size:20px;" class="striped responsive-table container">
                <thead style="background-color: #CD4141; color: white;">
                  <tr>
                    <th colspan="3">Nama Klub</th>
                    <th>MP</th>
                    <th>W</th>
                    <th>D</th>
                    <th>L</th>
                    <th>GF</th>
                    <th>GA</th>
                    <th>GD</th>
                    <th>Pts</th>
                  </tr>
                </thead>
                <tbody>
          `;
        data.standings["0"].table.forEach(function(item) {
          item = JSON.parse(JSON.stringify(item).replace(/http:/g, 'https:'));
          klasemenHTML += `
                  <tr>
                    <td>${item.position}</td>
                    <td><a href="./team.html?id=${item.team.id}"><img style="width:25px;" alt="${item.team.name}" src="${item.team.crestUrl}"></a></td>
                    <td><a href="./team.html?id=${item.team.id}">${item.team.name}</a></td>
                    <td>${item.playedGames}</td>
                    <td>${item.won}</td>
                    <td>${item.draw}</td>
                    <td>${item.lost}</td>
                    <td>${item.goalsFor}</td>
                    <td>${item.goalsAgainst}</td>
                    <td>${item.goalDifference}</td>
                    <td>${item.points}</td>
                  </tr>
          `;
      });
      klasemenHTML += `</tbody>
              </table>`;
      hideLoader()
      // Sisipkan komponen card ke dalam elemen dengan id #content
      document.getElementById("klasemen").innerHTML = klasemenHTML;
    })
    .catch(error);
}

function getTeamById() {
  return new Promise(function(resolve, reject) {

  // Ambil nilai query parameter (?id=)
  var urlParams = new URLSearchParams(window.location.search);
  var idParam = urlParams.get("id");

  //Memanggil API team dam memasukkan token API football-data.org
  var request = new Request(base_url + "teams/" + idParam, {
    headers: new Headers({
      'X-Auth-Token' : '9bce69cbb7ee47b49a668e18ff053f03'
    })
  });

  if ("caches" in window) {
      caches.match(request).then(function(response) {
        if (response) {
          response.json().then(function(data) {
            // Menyusun komponen card artikel secara dinamis
            var teamHTML = `
              <div class="col s12 m6">
                <div class="row">
                <h4 class="light center grey-text text-darken-3"><b>${data.name}</b></h4>
                </div>
              </div>
            `;
            // Sisipkan komponen card ke dalam elemen dengan id #content
            document.getElementById("body-content").innerHTML = teamHTML;
            // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
            resolve(data);
          });
        }
      });
    }
  showLoader()
  fetch(request)
    .then(status)
    .then(json)
    .then(function(data) {
      data = JSON.parse(JSON.stringify(data).replace(/http:/g, 'https:'));
      // Objek/array JavaScript dari response.json() masuk lewat data.
      console.log(data);
      // tampilkan data detail team
      var teamHTML = `
        <div class="row" style="font-size:20px; font-family:helvetica; ">
          <h4 class="light center grey-text text-darken-3"><img style="width:30px;" alt="${data.name}" src="${data.crestUrl}"> <b>${data.name}</b></h4>
          <p align="center">Founded : ${data.founded}<br>Club Colors : ${data.clubColors}<br>Ground : ${data.venue} <br>Address : ${data.address}<br>Phone : ${data.phone} <br> <br>Website : <a href="${data.website}"> ${data.website}</a> </p>
          <div class="col m6 s12">
            <div class="card-panel center">
              <h5>Squad</h5>
              <p>
                <ul>
        `;
        data.squad.forEach(function(item) {
          teamHTML += `
                    <li>${item.name} (${item.position})</li>
                      `;
          });
        teamHTML += `
                  </ul>
                </p>
              </div>
            </div>
            <div class="col m6 s12">
            <div class="card-panel center">
              <h5>Competitions</h5>
              <p>
                <ul>
                    `;
        data.activeCompetitions.forEach(function(item) {
          teamHTML += `
                    <li>${item.name}</li>
                      `;
          });
        teamHTML += `
                </ul>
              </p>
            </div>
          </div>
        </div>
                    `;
      // Sisipkan komponen card ke dalam elemen dengan id #content
      document.getElementById("body-content").innerHTML = teamHTML;
      // Kirim objek data hasil parsing json agar bisa disimpan ke indexed db
      resolve(data);
      hideLoader()
    });
  });
}

function getSavedFavoriteTeam() {
  getAll().then(function(team) {
    showLoader()
    console.log(team);
    // Menampilkan data favorite team
    var teamHTML = `<h3 class="light center grey-text text-darken-3">Favorite Team</h3>
                    <div class="row">`;
    team.forEach(function(data) {
      data = JSON.parse(JSON.stringify(data).replace(/http:/g, 'https:')); //sesuai catatan di Dicoding
      teamHTML += `
                  <div class="col s12 m6 l3">
                    <div class="card">
                      <div class="card-content">
                        <span class="card-title activator grey-text text-darken-4"><img style="width:25px;" alt="${data.name}" src="${data.crestUrl}"> ${data.name}<i class="material-icons right">more_vert</i></span>
                      </div>
                      <div class="card-action"><p><a href="./tim_favorit.html?id=${data.id}&saved=true">Detail</a><a href="./tim_favorit.html?id=${data.id}&delete=true">Delete</a></p></div>
                      <div class="card-reveal">
                        <span class="card-title grey-text text-darken-4">${data.name}<i class="material-icons right">close</i></span>
                        <p>Founded : ${data.founded}<br>Club Colors : ${data.clubColors}<br>Ground : ${data.venue} <br>Address : ${data.address}<br>Phone : ${data.phone} <br> <br>Website : <a href="${data.website}"> ${data.website}</a></p>
                      </div>
                    </div>
                  </div>
                `;
    });
    teamHTML += "</div>"
    // Sisipkan komponen card ke dalam elemen dengan id #content
    document.getElementById("body-content").innerHTML = teamHTML;
    hideLoader()
  });
}

function getSavedFavoriteTeambyId() {
  var urlParams = new URLSearchParams(window.location.search);
  var idParam = urlParams.get("id");
  
  getById(idParam).then(function(team) {
    team = JSON.parse(JSON.stringify(team).replace(/http:/g, 'https:'));
    showLoader()
    console.log(team);
    teamHTML = '';
    var teamHTML = `
        <div class="row" style="font-size:20px; font-family:helvetica; ">
          <h4 class="light center grey-text text-darken-3"><img style="width:30px;" alt="${team.name}" src="${team.crestUrl}"> <b>${team.name}</b></h4>
          <p align="center">Founded : ${team.founded}<br>Club Colors : ${team.clubColors}<br>Ground : ${team.venue} <br>Address : ${team.address}<br>Phone : ${team.phone} <br> <br>Website : <a href="${team.website}"> ${team.website}</a> </p>
          <div class="col m6 s12">
            <div class="card-panel center">
              <h5>Squad</h5>
              <p>
                <ul>
        `;
        team.squad.forEach(function(item) {
          teamHTML += `
                    <li>${item.name} (${item.position})</li>
                      `;
          });
        teamHTML += `
                  </ul>
                </p>
              </div>
            </div>
            <div class="col m6 s12">
            <div class="card-panel center">
              <h5>Competitions</h5>
              <p>
                <ul>
                    `;
        team.activeCompetitions.forEach(function(item) {
          teamHTML += `
                    <li>${item.name}</li>
                      `;
          });
        teamHTML += `
                </ul>
              </p>
            </div>
          </div>
        </div>
                    `;
    // Sisipkan komponen card ke dalam elemen dengan id #content
    document.getElementById("body-content").innerHTML = teamHTML;
    hideLoader()
  });
}

function getDeleteFavoriteTeam() {
  var urlParams = new URLSearchParams(window.location.search);
  var idParam = urlParams.get("id");
  //hapus data team favorite indexed DB
  deleteFavoriteTeam(idParam).then(function(team) { });
    deleteHTML = '';
    var deleteHTML = `
    <div class="card">
      <div class="card-content">
        <span class="card-title">Team favorite berhasil dihapus</span>
      </div>
    </div>
  `;
    // Sisipkan komponen card ke dalam elemen dengan id #content
    document.getElementById("body-content").innerHTML = deleteHTML;
}

var showLoader = () => {
  var html = `<div class="preloader-wrapper medium active">
              <div class="spinner-layer spinner-green-only">
                <div class="circle-clipper left">
                  <div class="circle"></div>
                </div><div class="gap-patch">
                  <div class="circle"></div>
                </div><div class="circle-clipper right">
                  <div class="circle"></div>
                </div>
              </div>
              </div>`
    document.getElementById("loader").innerHTML = html;
}

var hideLoader = () => {
  document.getElementById("loader").innerHTML = '';
}

//fungsi getMatches masih belum berhasil
function getMatches() {
  //Memanggil API team dam memasukkan token API football-data.org
  var request = new Request(base_url + "matches/", {
    headers: new Headers({
      'X-Auth-Token' : '9bce69cbb7ee47b49a668e18ff053f03'
    })
  });

  showLoader()
  fetch(request)
  .then(status)
  .then(json)
	.then(function(data){
    matchesData = data;
		var groupBy = function (xs, key) {
			return xs.reduce(function (rv, x) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
			}, {});
		};
		var matchdays = groupBy(data.matches, 'matchday');
    var html = '';
    for (const key in matchdays) {
      if (key != 'null') {
        html += `
          <div class="card">
            <div class="card-content">
              <div class="row ">
        `
        matchdays[key].forEach(function(match) {
          var dateToDMY = function(date) {
						return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`
          }
          html += `
            <div class="col s12 m6 l6" style="border-top:rgba(0,0,0,.2) solid 1px">
              <div style="text-align: center">
                <h6>${dateToDMY(new Date(match.utcDate))}</h6>
              </div>
              <div class="col s4 m4 l4">${match.homeTeam.name}</div>
              <div class="col s1">${match.score.fullTime.homeTeam}</div>
              <div style="text-align: center" class="col s2">vs</div>
              <div style="text-align: right" class="col s1">${match.score.fullTime.awayTeam}</div>
              <div style="text-align: right" class="col s4">${match.awayTeam.name}</div>
            </div>
          `
        });
        html += `
              </div>
            </div>
          </div>
        `
      }
    }
    document.getElementById("matches").innerHTML = html;
    hideLoader();
	})
	.catch(error);
}