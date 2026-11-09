// =====================================================================
// STEP 1 — Database "festival" with two collections: vendors, orders
// Run in: Atlas > Data Explorer > "Open MongoDB shell"  (or local mongosh)
// Safe to re-run: it starts from an EMPTY database every time.
// =====================================================================
db = db.getSiblingDB("festival");   // same as:  use festival

db.dropDatabase();                  // start from an empty database

db.createCollection("vendors");
db.createCollection("orders");

print("Collections in festival:");
printjson(db.getCollectionNames().sort());
