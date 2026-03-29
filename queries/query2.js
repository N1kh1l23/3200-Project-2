const { MongoClient } = require("mongodb");

async function main() {
  const client = new MongoClient("mongodb://localhost:27017");
  try {
    await client.connect();
    const db = client.db("slangDB");
    const terms = db.collection("terms");

    const results = await terms.find({isActive: true, $or: [{trendingStatus: "Peak"}, {popularityScore: {$gt: 8.0}}]}).toArray();
    console.log("Active terms that are Peak trending Or have a popularity of more than 8:");
    results.forEach(r => console.log(`${r.text} - ${r.trendingStatus}, popularity: ${r.popularityScore}`));

  } finally {
    await client.close();
  }
}

main().catch(console.error);