const id = 113415; // jujutsu kaisen or something, anilist ID
const url = `https://apikume.alwaysdata.net/api/anime/watch/${id}/1`;
fetch(url)
  .then((r) => r.json())
  .then((d) => console.log(JSON.stringify(d, null, 2)))
  .catch(console.error);
