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
