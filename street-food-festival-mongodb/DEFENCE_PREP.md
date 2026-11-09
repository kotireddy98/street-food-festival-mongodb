# Defence preparation (15 minutes)

## Part 1 — Live demo, 5 minutes: our three strongest queries
Run these in the Atlas shell on the `festival` database (already loaded).

**1. Best-selling dish per cuisine (6c)** — uses `$unwind`, `$lookup`, `$group`, `$first`.
Say: "We unwind the items, join each order to its vendor to get the cuisine, sum portions per dish, sort, and take the first per cuisine."

**2. Busiest hour + explain (6b, Step 7)** — show the result, then
`db.orders.explain("executionStats").aggregate(pipelineB)` → point at `totalDocsExamined: 0` and `PROJECTION_COVERED`.
Say: "The index { ts, total } contains every field the pipeline needs, so MongoDB never reads a document."

**3. Sesame recall (Twist)** — one `updateMany` with `arrayFilters`, then the safe-stall `find`.
Say: "`$[dish]` updates only array elements that match the filter, in every vendor, in one command."

## Part 2 — Twist, 5 minutes
Our solution: `scripts/08_twist_sesame_recall.js`, explained in REPORT §7. If the teacher changes the allergen, replace `"sesame"` with e.g. `"nuts"` in 3 places — that's all.

## Part 3 — Individual questions: likely "explain and modify" requests

| Teacher asks | Change |
|---|---|
| 6a: only day 2 | add first stage `{ $match: { ts: { $gte: ISODate("2026-06-21"), $lt: ISODate("2026-06-22") } } }` |
| 6a: top 3 only | add `{ $limit: 3 }` after `$sort` |
| 6a: revenue per cuisine instead | `$lookup` first, `$unwind: "$v"`, then `$group: { _id: "$v.cuisine", ... }` |
| 6b: busiest hour of the whole festival | drop `$dayOfMonth` from `_id`, `$sort: { orders: -1 }`, `$limit: 1` |
| 6b: by revenue instead of orders | `$sort: { "_id.day": 1, revenue: -1 }` |
| 6c: by revenue not portions | `$sum: { $multiply: ["$items.qty", "$items.price"] }` |
| 6c: top 2 per cuisine | replace `$first` with `$push` then `$slice: ["$dishes", 2]`, or `$topN` (MongoDB 5.2+) |
| 6d: per day | group `_id: { day: { $dayOfMonth: "$ts" }, payment: "$payment" }` |
| 6e: use `$out` | replace `$merge` with `{ $out: "festival_report" }` (replaces the whole collection) |
| 5.1: vegan under 5 EUR in zone A | add `"stall.zone": "A"` before `$unwind`, `$lt: 5` |
| 5.2: rating ≥ 4.3 | `$gte` instead of `$gt` (adds Supra Grill) |
| 5.3: +10 % only for dishes over 8 EUR | `$cond: [{ $gt: ["$$m.price", 8] }, newPrice, "$$m.price"]` inside `$map` |
| 5.3: why not `$mul`? | `{ $mul: { "menu.$[].price": 1.1 } }` works but gives 7.700000000000001 — we round |
| 5.4: delete without orphans | soft delete `$set: { active: false }`, or delete vendor + `deleteMany` orders in a transaction |
| 7: why this field order? | `ts` carries the range; `total` only makes it covered. `{ total: 1, ts: 1 }` could not serve the ts range efficiently |
| 8: make rating required | add `"rating"` to `required` |
| 8: what about existing bad docs? | `validationLevel: "moderate"` checks only valid docs on update |
| Twist: undo the recall | same updateMany with `$set: { "menu.$[dish].available": true }` (or `$unset`) |
| Twist: safe = at least one safe dish | aggregate with `$filter` on `menu` where `allergens` does not contain sesame |

## Who explains what (fill in)
| Part | Wrote it | Must also explain |
|---|---|---|
| Steps 1–4, model | [Member 1] | [Member 2] |
| Step 5, Step 8 | [Member 2] | [Member 3] |
| Step 6, Step 7, twist | [Member 3] | [Member 1] |
