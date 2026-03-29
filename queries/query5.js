const { MongoClient } = require("mongodb");

async function main() {
  const client = new MongoClient("mongodb://localhost:27017");
  try {
    await client.connect();
    const db = client.db("slangDB");
    const terms = db.collection("terms");

    const results = await terms.aggregate([
    { $unwind: "$semanticRelations" },
    { $match: { "semanticRelations.relationType": "synonym" } },
    { $project: {
        _id: 0,
        text: 1,
        synonym: "$semanticRelations.toTermText",
        confidence: "$semanticRelations.confidenceScore"
    }}
    ]).toArray();

    console.log("Synonym relationships:");
    results.forEach(r => console.log(`${r.text} → ${r.synonym} (confidence: ${r.confidence})`));

  } finally {
    await client.close();
  }
}

main().catch(console.error);
