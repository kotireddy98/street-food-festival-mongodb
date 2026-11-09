// =====================================================================
// EXPORT — write every collection to ../exports/*.json (Extended JSON)
// Local mongosh only (uses the file system). On Atlas use:
//   Collections > (collection) > Export Collection > JSON
// or:  mongoexport --uri "<atlas-uri>/festival" -c vendors --jsonArray -o vendors.json
// =====================================================================
db = db.getSiblingDB("festival");
const fs = require("fs");
const path = require("path");
const outDir = process.env.EXPORT_DIR || "exports";

db.getCollectionNames().sort().forEach(function (name) {
  const docs = db.getCollection(name).find().sort({ _id: 1 }).toArray();
  fs.writeFileSync(path.join(outDir, name + ".json"), EJSON.stringify(docs, null, 2, { relaxed: false }));
  print("exported " + name + ": " + docs.length + " documents");
});
