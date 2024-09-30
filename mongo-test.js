const { MongoClient } = require("mongodb");

const uri = "mongodb://mongo:27017/jennifer-anns?replicaSet=rs0"; // Your MongoDB URI

async function testConnection() {
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  try {
    // Connect to the MongoDB cluster
    await client.connect();

    // Make a test query
    const databasesList = await client.db().admin().listDatabases();
    console.log("Databases:");
    databasesList.databases.forEach((db) => console.log(` - ${db.name}`));
  } catch (e) {
    console.error("Connection failed:", e);
  } finally {
    // Close the connection
    await client.close();
  }
}

testConnection();
