const { MongoClient } = require("mongodb");

async function main() {
  const client = new MongoClient("mongodb://localhost:27017");
  try {
    await client.connect();
    const db = client.db("slangDB");
    const terms = db.collection("terms");

    await terms.updateOne({text: "bussin"}, {$set: {isActive: false}})
    console.log("The term bussin has been deactivated due to a decline in usage.")


  } finally {
    await client.close();
  }
}

main().catch(console.error);