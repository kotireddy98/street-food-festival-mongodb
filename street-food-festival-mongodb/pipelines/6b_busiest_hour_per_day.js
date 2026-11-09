// Paste into Atlas > festival.orders > Aggregations > Text mode
[
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
]
