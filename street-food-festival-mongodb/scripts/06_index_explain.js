// =====================================================================
// STEP 7 — Compound index that speeds up pipeline 6b (busiest hour)
// Compare explain("executionStats") BEFORE and AFTER the index.
// =====================================================================
db = db.getSiblingDB("festival");

const pipelineB = [
  { $match: { ts: { $gte: ISODate("2026-06-20T00:00:00Z"), $lt: ISODate("2026-06-23T00:00:00Z") } } },
  { $group: { _id: { day: { $dayOfMonth: "$ts" }, hour: { $hour: "$ts" } },
              orders: { $sum: 1 }, revenue: { $sum: "$total" } } },
  { $sort: { "_id.day": 1, orders: -1, revenue: -1 } },
  { $group: { _id: "$_id.day", busiest_hour: { $first: "$_id.hour" },
              orders: { $first: "$orders" }, revenue: { $first: "$revenue" } } }
];

// Pulls the key numbers out of explain() (location differs between versions)
function summary(label, ex) {
  const out = { label: label, stage: [], totalDocsExamined: null, totalKeysExamined: null,
                nReturned: null, executionTimeMillis: null };
  (function walk(o) {
    if (!o || typeof o !== "object") return;
    if (o.executionStats && o.executionStats.totalDocsExamined !== undefined && out.totalDocsExamined === null) {
      out.totalDocsExamined   = o.executionStats.totalDocsExamined;
      out.totalKeysExamined   = o.executionStats.totalKeysExamined;
      out.nReturned           = o.executionStats.nReturned;
      out.executionTimeMillis = o.executionStats.executionTimeMillis;
    }
    if (o.winningPlan) {
      (function stages(p) {
        if (!p || typeof p !== "object") return;
        if (p.stage) out.stage.push(p.stage);
        if (p.inputStage) stages(p.inputStage);
        if (p.queryPlan) stages(p.queryPlan);
        if (p.inputStages) p.inputStages.forEach(stages);
      })(o.winningPlan);
    }
    for (const k in o) walk(o[k]);
  })(ex);
  out.stage = out.stage.join(" <- ");
  return out;
}

// Clean start: make sure only the default _id index exists
db.orders.dropIndexes();

print("BEFORE index:");
const before = summary("before", db.orders.explain("executionStats").aggregate(pipelineB));
printjson(before);

// Compound index: ts (range filter + $hour/$dayOfMonth) and total (summed revenue).
// Both fields the pipeline needs live in the index -> COVERED query, no documents read.
printjson(db.orders.createIndex({ ts: 1, total: 1 }, { name: "ts_1_total_1" }));

print("AFTER index:");
const after = summary("after", db.orders.explain("executionStats").aggregate(pipelineB));
printjson(after);

print("\nComparison table");
printjson([
  { run: "before (no index)",       plan: before.stage, totalDocsExamined: before.totalDocsExamined, totalKeysExamined: before.totalKeysExamined },
  { run: "after  {ts:1, total:1}",  plan: after.stage,  totalDocsExamined: after.totalDocsExamined,  totalKeysExamined: after.totalKeysExamined }
]);
printjson(db.orders.getIndexes().map(i => ({ name: i.name, key: i.key })));
