const q = `query {
  SiteStatistics {
    anime {
      pageInfo { total }
    }
  }
}`;
fetch("https://graphql.anilist.co", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
  body: JSON.stringify({ query: q }),
})
  .then((r) => r.json())
  .then(console.log);
