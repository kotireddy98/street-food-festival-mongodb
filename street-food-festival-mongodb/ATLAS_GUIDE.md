# Running everything on your own Atlas cluster (for the live demo)

The teacher runs the demo **on your cloud database**, so do this once before the defence.

## 1. Create the free cluster (Step 1)
1. Go to <https://cloud.mongodb.com> → sign up / log in.
2. **Create** → **M0 Free** → provider AWS, region closest to you (e.g. Frankfurt) → name `festival-cluster` → **Create Deployment**.
3. **Database Access**: create a user (e.g. `team`) with a password. **Network Access**: *Add current IP address* (or `0.0.0.0/0` for the defence day only).
4. 📸 Screenshot: cluster overview showing *M0* and *Active*.

## 2. Open the shell inside Atlas
**Data Explorer** (Browse Collections) → top right **Open MongoDB Shell** (`>_`). The shell is mongosh in the browser.

## 3. Run the scripts in order
Open each file in `scripts/` and paste it into the Atlas shell, one step at a time:

| Order | File | 📸 Screenshot to take |
|---|---|---|
| 1 | `01_setup.js` | shell output with `[ 'orders', 'vendors' ]` |
| 2 | `02_insert_vendors.js` | "Vendors inserted: 13" + cuisines list |
| 3 | `03_generate_orders.js` | "Orders inserted: 300" |
| 4 | `04_basic_queries.js` | each of 5.1, 5.2, 5.3, 5.4 outputs |
| 5 | `05_pipelines.js` | shell output of 6a–6e |
| 6 | `06_index_explain.js` | before/after table (275 → 0) |
| 7 | `07_validation.js` | "REJECTED: Document failed validation" |
| 8 | `08_twist_sesame_recall.js` | updateMany result + safe stalls |

Tip: paste long scripts in parts (one query at a time) if the browser shell is slow. `01_setup.js` uses `db.getSiblingDB("festival")`, which works the same as `use festival`.

Alternative from your laptop (needs mongosh installed):
```bash
MONGO_URI="mongodb+srv://team:<password>@festival-cluster.xxxxx.mongodb.net" ./run_all.sh
```

## 4. Screenshots of the five pipelines in the Aggregation Pipeline Builder (Step 6)
1. Data Explorer → `festival` → `orders` → **Aggregations** tab.
2. Switch to **Text** mode (`</>` toggle), paste only the array from `pipelines/6a_revenue_per_vendor.js` (one file per pipeline).
3. Press **Run** → 📸 screenshot with the stages on the left and the results on the right.
4. Repeat for 6b, 6c, 6d, 6e. For 6e the preview stops before `$merge`; press **Run** to write, then open the `festival_report` collection and 📸 it.

## 5. Explain in Atlas (Step 7)
In the Aggregations tab press **Explain** before and after creating the index (Indexes tab → Create Index → `{ "ts": 1, "total": 1 }`). 📸 both explain panels showing *Documents Examined*.

## 6. Validation in Atlas (Step 8)
Collection `vendors` → **Validation** tab shows the `$jsonSchema` after running `07_validation.js`. 📸 it, then 📸 the rejected insert from the shell.

## 7. Export collections (JSON)
Collection → **⋯ / Export Collection** → JSON (or Compass → Export). Already-exported files from our test run are in `exports/`.

Save your own Atlas screenshots into `screenshots/atlas/` and push them to GitHub.
