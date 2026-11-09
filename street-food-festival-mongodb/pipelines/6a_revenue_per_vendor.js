// Paste into Atlas > festival.orders > Aggregations > Text mode
[
  { $group: { _id: "$vendor_id", revenue: { $sum: "$total" }, orders: { $sum: 1 } } },
  { $sort: { revenue: -1 } },
  { $lookup: { from: "vendors", localField: "_id", foreignField: "_id", as: "v" } },
  { $project: { _id: 0, vendor_id: "$_id", vendor: { $first: "$v.name" },
                revenue: { $round: ["$revenue", 2] }, orders: "$orders" } }
]
