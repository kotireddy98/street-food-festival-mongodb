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
