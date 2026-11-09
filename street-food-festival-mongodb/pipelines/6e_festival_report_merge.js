// Paste into Atlas > festival.orders > Aggregations > Text mode
[
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
]
