const { MongoClient } = require("mongodb");
const sqlite3 = require("sqlite3").verbose();

async function migrateMongoDBToSQLite(mongoUri, mongoDbName, collections, sqliteDbPath, batchSize = 100) {
  let mongoClient;
  let sqliteDb;

  try {
    // Connect to MongoDB
    mongoClient = new MongoClient(mongoUri);
    await mongoClient.connect();
    console.log("Connected to MongoDB");
    const mongoDb = mongoClient.db(mongoDbName);

    // Connect to SQLite
    sqliteDb = new sqlite3.Database(sqliteDbPath, (err) => {
      if (err) {
        throw new Error(`Error connecting to SQLite: ${err.message}`);
      }
      console.log(`Connected to SQLite database at ${sqliteDbPath}`);
    });

    const screens = mongoDb.collection("screens");
    const movies = mongoDb.collection("movies");

    for (const collectionName of collections) {
      console.log(`\nMigrating collection: ${collectionName}`);
      
      const collection = mongoDb.collection(collectionName);
      const documents = await collection.find().toArray();

      if (!documents.length) {
        console.log(`Collection ${collectionName} is empty, skipping.`);
        continue;
      }

      // Create SQLite table dynamically based on MongoDB document structure
      const keys = Object.keys(documents[0]);
      const columns = keys.map((key) => `${key} TEXT`).join(", "); // Defaulting to TEXT
      const createTableQuery = `CREATE TABLE IF NOT EXISTS ${collectionName} (${columns});`;

      sqliteDb.run(createTableQuery, (err) => {
        if (err) {
          throw new Error(`Error creating table for ${collectionName}: ${err.message}`);
        }
      });

      // Batch insert documents into SQLite
      let batch = [];
      documents.forEach((doc, index) => {
        const values = keys.map((key) => {
          const value = doc[key];
          if (typeof value === "object" && value !== null) {
            return JSON.stringify(value); // Handle objects and arrays
          }
          return value !== undefined ? value.toString() : null;
        });

        batch.push(values);

        // If batch size is reached or it's the last document
        if (batch.length >= batchSize || index === documents.length - 1) {
          const placeholders = keys.map(() => "?").join(", ");
          const insertQuery = `INSERT INTO ${collectionName} (${keys.join(", ")}) VALUES (${placeholders})`;

          sqliteDb.serialize(() => {
            const stmt = sqliteDb.prepare(insertQuery);
            batch.forEach((row) => {
              stmt.run(row, (err) => {
                if (err) {
                  console.error(`Error inserting row: ${err.message}`);
                }
              });
            });
            stmt.finalize();
          });

          batch = []; // Clear the batch
        }
      });

      console.log(`Collection ${collectionName} migrated successfully.`);
    }

    console.log("Migration completed successfully!");
  } catch (error) {
    console.error(`Error during migration: ${error.message}`);
  } finally {
    // Close connections
    if (sqliteDb) {
      sqliteDb.close((err) => {
        if (err) {
          console.error(`Error closing SQLite connection: ${err.message}`);
        } else {
          console.log("SQLite connection closed.");
        }
      });
    }
    if (mongoClient) {
      await mongoClient.close();
      console.log("MongoDB connection closed.");
    }
  }
}

// Configuration
const mongoUri = "mongodb+srv://zaidanwar2804:gDPjg2XDLdXPe2yv@cluster0.q88wg.mongodb.net/";
const mongoDbName = "moviedb";
const collections = [screens,movies]; // List of collections to migrate
const sqliteDbPath = "MyDatabase.db";

// Run migration
migrateMongoDBToSQLite(mongoUri, mongoDbName, collections, sqliteDbPath);
