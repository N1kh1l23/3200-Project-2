const { MongoClient } = require("mongodb");

async function main() {
  const client = new MongoClient("mongodb://localhost:27017");
  try {
    await client.connect();
    const db = client.db("slangDB");
    const terms = db.collection("terms");

    const results = await terms.aggregate([
  { $unwind: "$categories" },
  { $group: {
      _id: "$categories",
      avgPopularity: { $avg: "$popularityScore" },
      count: { $sum: 1 }
  }},
  { $sort: { avgPopularity: -1 } }
]).toArray();

    console.log("Average popularity by category:");
    results.forEach(r => console.log(`${r._id}: avg ${r.avgPopularity.toFixed(2)} (${r.count} terms)`));
  } finally {
    await client.close();
  }
}

main().catch(console.error);