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
