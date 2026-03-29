const { MongoClient } = require("mongodb");

async function main() {
  const client = new MongoClient("mongodb://localhost:27017");
  try {
    await client.connect();
    const db = client.db("slangDB");

    const users = db.collection("users");
    const user = await users.findOne({ username: "gen_z_translator" });
    console.log(`${user.username} contributed ${user.contributedTermIds.length} terms`);
    

  } finally {
    await client.close();
  }
}

main().catch(console.error);