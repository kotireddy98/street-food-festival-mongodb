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
