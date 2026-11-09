// Paste into Atlas > festival.orders > Aggregations > Text mode
[
  { $group: { _id: "$payment", orders: { $sum: 1 }, revenue: { $sum: "$total" } } },
  { $group: { _id: null, all_orders: { $sum: "$orders" }, all_revenue: { $sum: "$revenue" },
              methods: { $push: { payment: "$_id", orders: "$orders", revenue: "$revenue" } } } },
  { $unwind: "$methods" },
  { $project: { _id: 0, payment: "$methods.payment", orders: "$methods.orders",
                pct_of_orders:  { $round: [{ $multiply: [{ $divide: ["$methods.orders",  "$all_orders"]  }, 100] }, 1] },
                pct_of_revenue: { $round: [{ $multiply: [{ $divide: ["$methods.revenue", "$all_revenue"] }, 100] }, 1] } } },
  { $sort: { pct_of_orders: -1, payment: 1 } }
]
