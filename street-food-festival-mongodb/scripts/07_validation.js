// =====================================================================
// STEP 8 — $jsonSchema validation on vendors
// Rules: cuisine is required, and no menu price may be negative.
// =====================================================================
db = db.getSiblingDB("festival");

printjson(db.runCommand({
  collMod: "vendors",
  validator: { $jsonSchema: {
    bsonType: "object",
    required: ["_id", "name", "cuisine", "stall", "menu"],
    properties: {
      name:    { bsonType: "string", minLength: 1 },
      cuisine: { bsonType: "string", minLength: 1, description: "cuisine is required" },
      rating:  { bsonType: ["double", "int"], minimum: 0, maximum: 5 },
      stall:   { bsonType: "object", required: ["zone", "number"],
                 properties: { zone: { enum: ["A", "B", "C"] }, number: { bsonType: ["int", "double", "long"], minimum: 1 } } },
      menu: {
        bsonType: "array", minItems: 1,
        items: {
          bsonType: "object",
          required: ["item", "price"],
          properties: {
            item:      { bsonType: "string" },
            price:     { bsonType: ["double", "int", "decimal"], minimum: 0,
                         description: "menu price cannot be negative" },
            vegan:     { bsonType: "bool" },
            allergens: { bsonType: "array", items: { bsonType: "string" } },
            available: { bsonType: "bool" }
          }
        }
      }
    }
  } },
  validationLevel: "strict",
  validationAction: "error"
}));

print("Existing vendors that break the new rules (should be 0): " +
      db.vendors.countDocuments({ $nor: [db.getCollectionInfos({ name: "vendors" })[0].options.validator] }));

// --- Rejected insert 1: negative price -------------------------------
print("\nTry to insert a dish with price -2.5 ...");
try {
  db.vendors.insertOne({
    _id: "V99", name: "Broken Stall", cuisine: "Test",
    stall: { zone: "C", number: 9 }, rating: 4.0,
    menu: [{ item: "Free money soup", price: -2.5, vegan: true, allergens: [] }]
  });
} catch (e) {
  print("REJECTED: " + e.message);
  printjson(e.errInfo);
}

// --- Rejected insert 2: cuisine missing ------------------------------
print("\nTry to insert a vendor without cuisine ...");
try {
  db.vendors.insertOne({
    _id: "V98", name: "Mystery Stall",
    stall: { zone: "A", number: 9 },
    menu: [{ item: "Surprise box", price: 5.0 }]
  });
} catch (e) {
  print("REJECTED: " + e.message);
  printjson(e.errInfo.details.schemaRulesNotSatisfied);
}

// --- Valid insert still works, then remove it -------------------------
print("\nA valid vendor is accepted:");
printjson(db.vendors.insertOne({
  _id: "V97", name: "Valid Test Stall", cuisine: "Test",
  stall: { zone: "A", number: 9 }, rating: 4.0,
  menu: [{ item: "Water", price: 0, vegan: true, allergens: [] }]
}));
db.vendors.deleteOne({ _id: "V97" });
print("Vendors after validation tests: " + db.vendors.countDocuments());
