// Paste into Atlas > festival.orders > Aggregations > Text mode
[
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
]
