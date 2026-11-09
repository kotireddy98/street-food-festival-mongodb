// ALL QUERIES - Street Food Festival (MongoDB). Runnable from an empty database.
// Generated from scripts/01..08 by run_all.sh

// ----- 01_setup.js -----
{ // block scope so each step can reuse names
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
}

// ----- 02_insert_vendors.js -----
{ // block scope so each step can reuse names
// =====================================================================
// STEP 3 — Insert 13 vendors by hand (8 cuisines, 3 zones)
// Model (STEP 2): the menu is EMBEDDED inside each vendor document.
// V13 is inserted on purpose so Step 5 can delete it and still leave 12.
// =====================================================================
db = db.getSiblingDB("festival");

db.vendors.insertOne({
  _id: "V01", name: "Pelmeņi Express", cuisine: "Latvian",
  stall: { zone: "A", number: 3 }, rating: 4.6, tags: ["traditional", "family"],
  menu: [
    { item: "Pelmeņi with sour cream", price: 6.5, vegan: false, allergens: ["gluten", "milk"] },
    { item: "Rye bread pudding",       price: 4.0, vegan: false, allergens: ["gluten", "milk", "egg"] },
    { item: "Grey peas with onion",    price: 5.0, vegan: true,  allergens: [] }
  ]
});

db.vendors.insertOne({
  _id: "V02", name: "Rīgas Kūpinātava", cuisine: "Latvian",
  stall: { zone: "A", number: 5 }, rating: 4.2, tags: ["smoked", "seafood"],
  menu: [
    { item: "Smoked sprat sandwich", price: 5.5, vegan: false, allergens: ["fish", "gluten"] },
    { item: "Potato pancakes",       price: 5.0, vegan: false, allergens: ["egg", "gluten"] },
    { item: "Sauerkraut salad",      price: 3.5, vegan: true,  allergens: [] }
  ]
});

db.vendors.insertOne({
  _id: "V03", name: "Tbilisi Fire", cuisine: "Georgian",
  stall: { zone: "B", number: 1 }, rating: 4.8, tags: ["bakery", "bestseller"],
  menu: [
    { item: "Adjarian khachapuri",    price: 9.0, vegan: false, allergens: ["gluten", "milk", "egg"] },
    { item: "Khinkali (5 pcs)",       price: 8.0, vegan: false, allergens: ["gluten"] },
    { item: "Badrijani with walnuts", price: 6.0, vegan: true,  allergens: ["nuts"] }
  ]
});

db.vendors.insertOne({
  _id: "V04", name: "Supra Grill", cuisine: "Georgian",
  stall: { zone: "B", number: 4 }, rating: 4.3, tags: ["grill", "meat"],
  menu: [
    { item: "Mtsvadi pork skewer", price: 10.5, vegan: false, allergens: [] },
    { item: "Lobio bean stew",     price: 6.5,  vegan: true,  allergens: [] },
    { item: "Churchkhela",         price: 3.5,  vegan: true,  allergens: ["nuts"] }
  ]
});

db.vendors.insertOne({
  _id: "V05", name: "Tokyo Ramen Bar", cuisine: "Japanese",
  stall: { zone: "B", number: 2 }, rating: 4.7, tags: ["noodles", "spicy"],
  menu: [
    { item: "Tonkotsu ramen",   price: 11.0, vegan: false, allergens: ["gluten", "egg", "soy", "sesame"] },
    { item: "Vegan miso ramen", price: 9.5,  vegan: true,  allergens: ["gluten", "soy", "sesame"] },
    { item: "Edamame",          price: 4.0,  vegan: true,  allergens: ["soy"] }
  ]
});

db.vendors.insertOne({
  _id: "V06", name: "Sushi Wave", cuisine: "Japanese",
  stall: { zone: "C", number: 2 }, rating: 4.1, tags: ["seafood", "fresh"],
  menu: [
    { item: "Salmon nigiri set", price: 12.0, vegan: false, allergens: ["fish", "soy", "sesame"] },
    { item: "Avocado maki",      price: 6.5,  vegan: true,  allergens: ["soy", "sesame"] },
    { item: "Mochi ice cream",   price: 4.5,  vegan: false, allergens: ["milk"] }
  ]
});

db.vendors.insertOne({
  _id: "V07", name: "Taco Loco", cuisine: "Mexican",
  stall: { zone: "A", number: 1 }, rating: 4.5, tags: ["street", "spicy"],
  menu: [
    { item: "Al pastor tacos",    price: 8.5, vegan: false, allergens: [] },
    { item: "Black bean burrito", price: 7.5, vegan: true,  allergens: ["gluten"] },
    { item: "Guacamole & chips",  price: 5.0, vegan: true,  allergens: [] }
  ]
});

db.vendors.insertOne({
  _id: "V08", name: "El Fuego", cuisine: "Mexican",
  stall: { zone: "C", number: 5 }, rating: 3.9, tags: ["cheesy", "sweet"],
  menu: [
    { item: "Chicken quesadilla", price: 8.0, vegan: false, allergens: ["gluten", "milk"] },
    { item: "Elote corn",         price: 4.5, vegan: false, allergens: ["milk"] },
    { item: "Churros",            price: 4.0, vegan: false, allergens: ["gluten", "egg", "milk"] }
  ]
});

db.vendors.insertOne({
  _id: "V09", name: "Bombay Street", cuisine: "Indian",
  stall: { zone: "B", number: 3 }, rating: 4.6, tags: ["curry", "spicy"],
  menu: [
    { item: "Butter chicken & rice", price: 10.0, vegan: false, allergens: ["milk"] },
    { item: "Chana masala",          price: 7.0,  vegan: true,  allergens: [] },
    { item: "Samosa (2 pcs)",        price: 4.5,  vegan: true,  allergens: ["gluten"] }
  ]
});

db.vendors.insertOne({
  _id: "V10", name: "Beirut Bites", cuisine: "Lebanese",
  stall: { zone: "B", number: 5 }, rating: 4.5, tags: ["mezze", "wraps"],
  menu: [
    { item: "Falafel wrap",     price: 7.5, vegan: true,  allergens: ["gluten", "sesame"] },
    { item: "Hummus plate",     price: 6.0, vegan: true,  allergens: ["sesame"] },
    { item: "Chicken shawarma", price: 9.0, vegan: false, allergens: ["gluten", "sesame", "milk"] }
  ]
});

db.vendors.insertOne({
  _id: "V11", name: "Napoli Slice", cuisine: "Italian",
  stall: { zone: "A", number: 2 }, rating: 4.3, tags: ["pizza", "family"],
  menu: [
    { item: "Margherita pizza", price: 9.5, vegan: false, allergens: ["gluten", "milk"] },
    { item: "Marinara pizza",   price: 8.0, vegan: true,  allergens: ["gluten"] },
    { item: "Tiramisu",         price: 5.0, vegan: false, allergens: ["gluten", "milk", "egg"] }
  ]
});

db.vendors.insertOne({
  _id: "V12", name: "Borsch & Co", cuisine: "Ukrainian",
  stall: { zone: "C", number: 1 }, rating: 4.4, tags: ["traditional", "soup"],
  menu: [
    { item: "Red borscht",          price: 6.0, vegan: true,  allergens: [] },
    { item: "Varenyky with potato", price: 7.0, vegan: false, allergens: ["gluten", "milk"] },
    { item: "Syrnyky",              price: 5.5, vegan: false, allergens: ["milk", "egg", "gluten"] }
  ]
});

db.vendors.insertOne({
  _id: "V13", name: "Seoul Food Truck", cuisine: "Korean",
  stall: { zone: "C", number: 4 }, rating: 3.8, tags: ["truck", "spicy"],
  menu: [
    { item: "Bibimbap",       price: 9.5, vegan: false, allergens: ["egg", "soy", "sesame"] },
    { item: "Kimchi pancake", price: 6.5, vegan: true,  allergens: ["gluten", "soy"] },
    { item: "Tteokbokki",     price: 7.0, vegan: false, allergens: ["fish", "soy"] }
  ]
});

print("Vendors inserted: " + db.vendors.countDocuments());
print("Distinct cuisines (" + db.vendors.distinct("cuisine").length + "):");
printjson(db.vendors.distinct("cuisine"));
printjson(db.vendors.aggregate([
  { $group: { _id: "$stall.zone", vendors: { $sum: 1 } } }, { $sort: { _id: 1 } }
]).toArray());
}

// ----- 03_generate_orders.js -----
{ // block scope so each step can reuse names
// =====================================================================
// STEP 4 — Generate 300 random orders (loop from the brief)
// Orders are a SEPARATE collection and point to the vendor via vendor_id.
//
// Only change vs. the brief: Math.random() is replaced by a seeded random
// generator (mulberry32, seed 2026) so every run — locally or on Atlas —
// produces exactly the same 300 orders, and the numbers in our report match.
// Replace rand() with Math.random() to get the brief's original behaviour.
// =====================================================================
db = db.getSiblingDB("festival");

const rand = (function (seed) {         // mulberry32: deterministic 0..1
  return function () {
    seed |= 0; seed = (seed + 0x6D2B79F5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
})(2026);

const vendors = db.vendors.find().sort({ _id: 1 }).toArray();
const pay = ["card", "cash", "app"];
for (let i = 0; i < 300; i++) {
  const v = vendors[Math.floor(rand() * vendors.length)];
  const d = v.menu[Math.floor(rand() * v.menu.length)];
  const qty = 1 + Math.floor(rand() * 3);
  db.orders.insertOne({
    vendor_id: v._id,
    ts: new Date(Date.UTC(2026, 5, 20 + Math.floor(rand() * 3), 12 + Math.floor(rand() * 11), Math.floor(rand() * 60))),
    payment: pay[Math.floor(rand() * 3)],
    items: [{ item: d.item, qty: qty, price: d.price }],
    total: qty * d.price
  });
}

print("Orders inserted: " + db.orders.countDocuments());
print("First festival order / last festival order:");
printjson(db.orders.find({}, { _id: 0, ts: 1 }).sort({ ts: 1 }).limit(1).toArray()[0]);
printjson(db.orders.find({}, { _id: 0, ts: 1 }).sort({ ts: -1 }).limit(1).toArray()[0]);
print("Sample order:");
printjson(db.orders.findOne({}, { _id: 0 }));
}

// ----- 04_basic_queries.js -----
{ // block scope so each step can reuse names
// =====================================================================
// STEP 5 — Basic queries (find / update / delete)
// =====================================================================
db = db.getSiblingDB("festival");

// ---------------------------------------------------------------------
// 5.1  All vegan dishes under 7 EUR
//      The menu is an embedded array, so we $unwind it and filter each dish.
// ---------------------------------------------------------------------
print("\n5.1 Vegan dishes under 7 EUR");
printjson(db.vendors.aggregate([
  { $unwind: "$menu" },
  { $match: { "menu.vegan": true, "menu.price": { $lt: 7 } } },
  { $project: { _id: 0, vendor: "$name", cuisine: "$cuisine", dish: "$menu.item", price: "$menu.price" } },
  { $sort: { price: 1, dish: 1 } }
]).toArray());

// Short alternative with find(): returns vendors that HAVE such a dish
// and, thanks to $elemMatch projection, only the first matching dish.
// db.vendors.find({ menu: { $elemMatch: { vegan: true, price: { $lt: 7 } } } },
//                 { name: 1, "menu.$": 1 })

// ---------------------------------------------------------------------
// 5.2  Vendors in zone B with rating above 4.3   ($gt, so 4.3 is excluded)
// ---------------------------------------------------------------------
print("\n5.2 Zone B vendors with rating > 4.3");
printjson(db.vendors.find(
  { "stall.zone": "B", rating: { $gt: 4.3 } },
  { _id: 1, name: 1, cuisine: 1, rating: 1, stall: 1 }
).sort({ rating: -1 }).toArray());

// ---------------------------------------------------------------------
// 5.3  Raise every price in the "Georgian" cuisine by 10 %
//      Classic form:  { $mul: { "menu.$[].price": 1.1 } }  -> gives 7.700000000000001
//      We use an update PIPELINE so the new prices are rounded to cents.
// ---------------------------------------------------------------------
print("\n5.3 Georgian prices BEFORE");
printjson(db.vendors.find({ cuisine: "Georgian" }, { name: 1, "menu.item": 1, "menu.price": 1 }).toArray());

const res53 = db.vendors.updateMany(
  { cuisine: "Georgian" },
  [{ $set: {
      menu: { $map: {
        input: "$menu", as: "m",
        in: { $mergeObjects: ["$$m", { price: { $round: [{ $multiply: ["$$m.price", 1.1] }, 2] } }] }
      } }
  } }]
);
printjson(res53);

print("5.3 Georgian prices AFTER (+10 %)");
printjson(db.vendors.find({ cuisine: "Georgian" }, { name: 1, "menu.item": 1, "menu.price": 1 }).toArray());
print("Orders keep the price at the moment of sale (price snapshot), so old orders are unchanged:");
printjson(db.orders.findOne({ vendor_id: "V03" }, { _id: 0, vendor_id: 1, items: 1, total: 1 }));

// ---------------------------------------------------------------------
// 5.4  Delete one vendor and show what happens to its orders
//      MongoDB has NO foreign keys and NO cascade delete:
//      the vendor disappears, its orders stay and become "orphans".
// ---------------------------------------------------------------------
print("\n5.4 Delete vendor V13 (Seoul Food Truck)");
print("Orders pointing to V13 before delete: " + db.orders.countDocuments({ vendor_id: "V13" }));
printjson(db.vendors.deleteOne({ _id: "V13" }));
print("Vendor V13 still exists?  " + (db.vendors.findOne({ _id: "V13" }) !== null));
print("Orders pointing to V13 after delete: " + db.orders.countDocuments({ vendor_id: "V13" }) + "   <-- orphaned");

print("Orphan check with $lookup (orders whose vendor no longer exists):");
printjson(db.orders.aggregate([
  { $lookup: { from: "vendors", localField: "vendor_id", foreignField: "_id", as: "v" } },
  { $match: { v: { $size: 0 } } },
  { $group: { _id: "$vendor_id", orphan_orders: { $sum: 1 }, lost_revenue: { $sum: "$total" } } }
]).toArray());

// Our decision: keep the money history but out of the live reports.
// Move the orphans to an archive collection, then remove them from orders.
db.orders.aggregate([
  { $match: { vendor_id: "V13" } },
  { $set: { archived_reason: "vendor V13 deleted" } },
  { $merge: { into: "orders_archive", whenMatched: "replace", whenNotMatched: "insert" } }
]);
printjson(db.orders.deleteMany({ vendor_id: "V13" }));
print("orders: " + db.orders.countDocuments() + "   orders_archive: " + db.orders_archive.countDocuments() +
      "   vendors: " + db.vendors.countDocuments());
}

// ----- 05_pipelines.js -----
{ // block scope so each step can reuse names
// =====================================================================
// STEP 6 — Five aggregation pipelines
// Each pipeline is also pasted (array only) into Atlas >
// Collections > orders > Aggregation > "Text" mode for the screenshots.
// =====================================================================
db = db.getSiblingDB("festival");

// ---------------------------------------------------------------------
// 6a  Revenue per vendor, sorted descending      ($group, $sort)
// ---------------------------------------------------------------------
const pipelineA = [
  { $group: { _id: "$vendor_id", revenue: { $sum: "$total" }, orders: { $sum: 1 } } },
  { $sort: { revenue: -1 } },
  { $lookup: { from: "vendors", localField: "_id", foreignField: "_id", as: "v" } },
  { $project: { _id: 0, vendor_id: "$_id", vendor: { $first: "$v.name" },
                revenue: { $round: ["$revenue", 2] }, orders: "$orders" } }
];
print("\n6a Revenue per vendor (EUR, descending)");
printjson(db.orders.aggregate(pipelineA).toArray());

// ---------------------------------------------------------------------
// 6b  Busiest hour of each festival day           ($hour, $dayOfMonth)
//     $match on ts first, so the compound index of Step 7 can be used.
// ---------------------------------------------------------------------
const pipelineB = [
  { $match: { ts: { $gte: ISODate("2026-06-20T00:00:00Z"), $lt: ISODate("2026-06-23T00:00:00Z") } } },
  { $group: { _id: { day: { $dayOfMonth: "$ts" }, hour: { $hour: "$ts" } },
              orders: { $sum: 1 }, revenue: { $sum: "$total" } } },
  { $sort: { "_id.day": 1, orders: -1, revenue: -1 } },
  { $group: { _id: "$_id.day", busiest_hour: { $first: "$_id.hour" },
              orders: { $first: "$orders" }, revenue: { $first: "$revenue" } } },
  { $project: { _id: 0, day: { $concat: [{ $toString: "$_id" }, " June 2026"] },
                busiest_hour: { $concat: [{ $toString: "$busiest_hour" }, ":00-",
                                          { $toString: { $add: ["$busiest_hour", 1] } }, ":00 UTC"] },
                orders: "$orders", revenue: { $round: ["$revenue", 2] } } },
  { $sort: { day: 1 } }
];
print("\n6b Busiest hour of each festival day");
printjson(db.orders.aggregate(pipelineB).toArray());

// ---------------------------------------------------------------------
// 6c  Best-selling dish per cuisine        ($unwind, $lookup, $group, $first)
// ---------------------------------------------------------------------
const pipelineC = [
  { $unwind: "$items" },
  { $lookup: { from: "vendors", localField: "vendor_id", foreignField: "_id", as: "vendor" } },
  { $unwind: "$vendor" },
  { $group: { _id: { cuisine: "$vendor.cuisine", dish: "$items.item", vendor: "$vendor.name" },
              portions: { $sum: "$items.qty" } } },
  { $sort: { portions: -1, "_id.dish": 1 } },
  { $group: { _id: "$_id.cuisine", best_dish: { $first: "$_id.dish" },
              vendor: { $first: "$_id.vendor" }, portions_sold: { $first: "$portions" } } },
  { $project: { _id: 0, cuisine: "$_id", best_dish: "$best_dish", vendor: "$vendor", portions_sold: "$portions_sold" } },
  { $sort: { cuisine: 1 } }
];
print("\n6c Best-selling dish per cuisine (by portions sold)");
printjson(db.orders.aggregate(pipelineC).toArray());

// ---------------------------------------------------------------------
// 6d  Share of card vs cash vs app payments, in percent
// ---------------------------------------------------------------------
const pipelineD = [
  { $group: { _id: "$payment", orders: { $sum: 1 }, revenue: { $sum: "$total" } } },
  { $group: { _id: null, all_orders: { $sum: "$orders" }, all_revenue: { $sum: "$revenue" },
              methods: { $push: { payment: "$_id", orders: "$orders", revenue: "$revenue" } } } },
  { $unwind: "$methods" },
  { $project: { _id: 0, payment: "$methods.payment", orders: "$methods.orders",
                pct_of_orders:  { $round: [{ $multiply: [{ $divide: ["$methods.orders",  "$all_orders"]  }, 100] }, 1] },
                pct_of_revenue: { $round: [{ $multiply: [{ $divide: ["$methods.revenue", "$all_revenue"] }, 100] }, 1] } } },
  { $sort: { pct_of_orders: -1, payment: 1 } }
];
print("\n6d Payment share (%)");
printjson(db.orders.aggregate(pipelineD).toArray());

// ---------------------------------------------------------------------
// 6e  "Festival report" document written to a new collection ($merge)
//     $facet computes several sub-reports in one pass; $merge upserts by _id,
//     so re-running refreshes the same report instead of duplicating it.
// ---------------------------------------------------------------------
const pipelineE = [
  { $facet: {
      totals: [{ $group: { _id: null, orders: { $sum: 1 }, revenue: { $sum: "$total" },
                           avg_order: { $avg: "$total" },
                           portions: { $sum: { $sum: "$items.qty" } } } }],
      per_day: [{ $group: { _id: { $dateToString: { format: "%Y-%m-%d", date: "$ts" } },
                            orders: { $sum: 1 }, revenue: { $sum: "$total" } } },
                { $sort: { _id: 1 } },
                { $project: { _id: 0, day: "$_id", orders: "$orders", revenue: { $round: ["$revenue", 2] } } }],
      top_vendors: [{ $group: { _id: "$vendor_id", revenue: { $sum: "$total" } } },
                    { $sort: { revenue: -1 } }, { $limit: 3 },
                    { $lookup: { from: "vendors", localField: "_id", foreignField: "_id", as: "v" } },
                    { $project: { _id: 0, vendor_id: "$_id", name: { $first: "$v.name" },
                                  revenue: { $round: ["$revenue", 2] } } }],
      payments: [{ $group: { _id: "$payment", orders: { $sum: 1 } } }, { $sort: { _id: 1 } },
                 { $project: { _id: 0, payment: "$_id", orders: "$orders" } }]
  } },
  { $project: {
      _id: "festival-2026",
      title: "Street Food Festival 20-22 June 2026 - final report",
      generated_at: "$$NOW",
      orders: { $first: "$totals.orders" },
      revenue_eur: { $round: [{ $first: "$totals.revenue" }, 2] },
      avg_order_eur: { $round: [{ $first: "$totals.avg_order" }, 2] },
      portions_sold: { $first: "$totals.portions" },
      per_day: "$per_day", top_vendors: "$top_vendors", payments: "$payments"
  } },
  { $merge: { into: "festival_report", on: "_id", whenMatched: "replace", whenNotMatched: "insert" } }
];
db.orders.aggregate(pipelineE);
print("\n6e Document stored in collection festival_report:");
printjson(db.festival_report.findOne({}, { generated_at: 0 }));
}

// ----- 06_index_explain.js -----
{ // block scope so each step can reuse names
// =====================================================================
// STEP 7 — Compound index that speeds up pipeline 6b (busiest hour)
// Compare explain("executionStats") BEFORE and AFTER the index.
// =====================================================================
db = db.getSiblingDB("festival");

const pipelineB = [
  { $match: { ts: { $gte: ISODate("2026-06-20T00:00:00Z"), $lt: ISODate("2026-06-23T00:00:00Z") } } },
  { $group: { _id: { day: { $dayOfMonth: "$ts" }, hour: { $hour: "$ts" } },
              orders: { $sum: 1 }, revenue: { $sum: "$total" } } },
  { $sort: { "_id.day": 1, orders: -1, revenue: -1 } },
  { $group: { _id: "$_id.day", busiest_hour: { $first: "$_id.hour" },
              orders: { $first: "$orders" }, revenue: { $first: "$revenue" } } }
];

// Pulls the key numbers out of explain() (location differs between versions)
function summary(label, ex) {
  const out = { label: label, stage: [], totalDocsExamined: null, totalKeysExamined: null,
                nReturned: null, executionTimeMillis: null };
  (function walk(o) {
    if (!o || typeof o !== "object") return;
    if (o.executionStats && o.executionStats.totalDocsExamined !== undefined && out.totalDocsExamined === null) {
      out.totalDocsExamined   = o.executionStats.totalDocsExamined;
      out.totalKeysExamined   = o.executionStats.totalKeysExamined;
      out.nReturned           = o.executionStats.nReturned;
      out.executionTimeMillis = o.executionStats.executionTimeMillis;
    }
    if (o.winningPlan) {
      (function stages(p) {
        if (!p || typeof p !== "object") return;
        if (p.stage) out.stage.push(p.stage);
        if (p.inputStage) stages(p.inputStage);
        if (p.queryPlan) stages(p.queryPlan);
        if (p.inputStages) p.inputStages.forEach(stages);
      })(o.winningPlan);
    }
    for (const k in o) walk(o[k]);
  })(ex);
  out.stage = out.stage.join(" <- ");
  return out;
}

// Clean start: make sure only the default _id index exists
db.orders.dropIndexes();

print("BEFORE index:");
const before = summary("before", db.orders.explain("executionStats").aggregate(pipelineB));
printjson(before);

// Compound index: ts (range filter + $hour/$dayOfMonth) and total (summed revenue).
// Both fields the pipeline needs live in the index -> COVERED query, no documents read.
printjson(db.orders.createIndex({ ts: 1, total: 1 }, { name: "ts_1_total_1" }));

print("AFTER index:");
const after = summary("after", db.orders.explain("executionStats").aggregate(pipelineB));
printjson(after);

print("\nComparison table");
printjson([
  { run: "before (no index)",       plan: before.stage, totalDocsExamined: before.totalDocsExamined, totalKeysExamined: before.totalKeysExamined },
  { run: "after  {ts:1, total:1}",  plan: after.stage,  totalDocsExamined: after.totalDocsExamined,  totalKeysExamined: after.totalKeysExamined }
]);
printjson(db.orders.getIndexes().map(i => ({ name: i.name, key: i.key })));
}

// ----- 07_validation.js -----
{ // block scope so each step can reuse names
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
}

// ----- 08_twist_sesame_recall.js -----
{ // block scope so each step can reuse names
// =====================================================================
// TWIST — Sesame recall arrives at 19:00 (22 June 2026, last festival day)
// 1) ONE updateMany with arrayFilters marks every sesame dish available:false
// 2) List the stalls a visitor with a sesame allergy can still safely visit
// =====================================================================
db = db.getSiblingDB("festival");
const RECALL_AT = ISODate("2026-06-22T19:00:00Z");

print("Dishes containing sesame BEFORE the recall:");
printjson(db.vendors.aggregate([
  { $unwind: "$menu" }, { $match: { "menu.allergens": "sesame" } },
  { $project: { _id: 0, vendor: "$name", dish: "$menu.item", available: { $ifNull: ["$menu.available", true] } } }
]).toArray());

// ---- 1) The recall: a single updateMany with arrayFilters -------------
const recall = db.vendors.updateMany(
  { "menu.allergens": "sesame" },                         // vendors that sell at least one sesame dish
  { $set: { "menu.$[dish].available": false,              // only the matching array elements
            "menu.$[dish].recalled_at": RECALL_AT } },
  { arrayFilters: [{ "dish.allergens": "sesame" }] }
);
printjson(recall);

print("\nDishes now marked unavailable:");
printjson(db.vendors.aggregate([
  { $unwind: "$menu" }, { $match: { "menu.available": false } },
  { $project: { _id: 0, vendor_id: "$_id", vendor: "$name", dish: "$menu.item", available: "$menu.available" } }
]).toArray());

// ---- 2a) Strictly safe stalls: NO dish on the menu contains sesame ----
//      (no shared grill / cross-contamination risk at the stall)
print("\nSAFE stalls for a sesame-allergic visitor (no sesame anywhere on the menu):");
printjson(db.vendors.find(
  { "menu.allergens": { $ne: "sesame" } },
  { _id: 1, name: 1, cuisine: 1, stall: 1 }
).sort({ "stall.zone": 1, "stall.number": 1 }).toArray());

// ---- 2b) Stalls to AVOID: still open but had sesame dishes recalled ---
print("\nStalls to AVOID (sesame dishes recalled; risk of cross-contamination):");
printjson(db.vendors.aggregate([
  { $match: { "menu.allergens": "sesame" } },
  { $project: { _id: 1, name: 1, stall: 1,
      recalled:  { $map: { input: { $filter: { input: "$menu", cond: { $eq: ["$$this.available", false] } } }, in: "$$this.item" } },
      still_sold: { $map: { input: { $filter: { input: "$menu", cond: { $ne: ["$$this.available", false] } } }, in: "$$this.item" } } } },
  { $sort: { _id: 1 } }
]).toArray());

// ---- Bonus: how many recalled portions were sold after 19:00? ---------
print("\nBonus - recalled dishes sold after 19:00 on 22 June (visitors to warn):");
const recalledDishes = db.vendors.aggregate([
  { $unwind: "$menu" }, { $match: { "menu.available": false } }, { $group: { _id: null, d: { $addToSet: "$menu.item" } } }
]).toArray()[0].d;
printjson(db.orders.aggregate([
  { $match: { ts: { $gte: RECALL_AT }, "items.item": { $in: recalledDishes } } },
  { $group: { _id: "$vendor_id", orders: { $sum: 1 }, times: { $push: { $dateToString: { format: "%H:%M", date: "$ts" } } } } },
  { $sort: { _id: 1 } }
]).toArray());
}
