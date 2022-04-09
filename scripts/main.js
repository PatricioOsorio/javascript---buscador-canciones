const d = document;
const $form = d.querySelector('.song-search');
const $loader = d.querySelector('.loader');
const $error = d.querySelector('.error');
const $main = d.querySelector('main');
const $artist = d.querySelector('.artist');
const $song = d.querySelector('.song');

$form.addEventListener('submit', async (e) => {
  e.preventDefault();

  try {
    $loader.style.display = 'block';

    let artist = e.target.artist.value.toLowerCase();
    let song = e.target.song.value.toLowerCase();
    let $artistTemplate = ``;
    let $songTemplate = ``;
    let endpointArtist = `https://theaudiodb.com/api/v1/json/2/search.php?s=${artist}`;
    let endpointSong = `https://api.lyrics.ovh/v1/${artist}/${song}`;
    let artistFetch = fetch(endpointArtist);
    let songFetch = fetch(endpointSong);

    [artistRes, songRes] = await Promise.all([artistFetch, songFetch]);

    artistData = await artistRes.json();
    songData = await songRes.json();

    // console.log(artistData);
    // console.log(songData);

    if (artistData.artists === null) {
      $artistTemplate = `<h2>No existe el interprete ${artist}</h2>`;
    } else {
      let artist = artistData.artists[0];
      $artistTemplate = `
      <h2>${artist.strArtist}</h2>
      <img src="${artist.strArtistThumb}" alt="${artist.strArtist}" />
      <p>${artist.intBornYear} - ${artist.intDiedYear || 'Presente'}</p>
      <p>${artist.strCountry}</p>
      <p>${artist.strGenre} - ${artist.strStyle}</p>
      <a href="http://${artist.strWebsite}" target="_blank">Sitio web</a>
      <p>${artist.strBiographyEN}</p>
      `;
    }

    if (songData.error) {
      $songTemplate = `<h2>No existe la cancion ${song}</h2>`;
    } else {
      $songTemplate = `
      <h2>${song}</h2>
      <blockquote>${songData.lyrics}</blockquote>
      `;
    }

    $loader.style.display = 'none';

    $artist.innerHTML = $artistTemplate;
    $song.innerHTML = $songTemplate;
  } catch (error) {
    // console.log(error);
    $loader.style.display = 'none';
    let message = error.statusText || 'Ocurrio un error';
    $error.innerHTML = `<p>Error ${error.status}: ${message}</p>`;
  }
});
