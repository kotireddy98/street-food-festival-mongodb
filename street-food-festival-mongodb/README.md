# Street Food Festival — MongoDB Atlas project

Back end for a three-day street food festival: **vendors with embedded menus** and **orders referencing vendors**, five aggregation pipelines, an index tuned with `explain`, `$jsonSchema` validation and a sesame-recall twist.

## Submission checklist

| Required by the teacher | Where it is |
|---|---|
| ☑ Written report (≤ 6 pages): data model, design decisions, answers | [`REPORT.md`](REPORT.md) · [`docs/REPORT.pdf`](docs/REPORT.pdf) |
| ☑ All queries and scripts, plain text, runnable from an empty database | [`all_queries.js`](all_queries.js) (one file) · [`scripts/`](scripts) (one file per step) · [`run_all.sh`](run_all.sh) |
| ☑ Screenshots of every step with its result | [`screenshots/`](screenshots) (+ add your Atlas ones in `screenshots/atlas/`, see [`ATLAS_GUIDE.md`](ATLAS_GUIDE.md)) |
| ☑ Data model diagram | [`docs/data-model.png`](docs/data-model.png) |
| ☑ Five-slide defence presentation | [`slides/defence.pptx`](slides/defence.pptx) |
| ☑ One-paragraph statement on tools and AI use | [`AI_STATEMENT.md`](AI_STATEMENT.md) |
| ☑ Exported collections (JSON) | [`exports/`](exports) — `vendors`, `orders`, `orders_archive`, `festival_report` |
| ☑ Five pipelines for the Pipeline Builder | [`pipelines/`](pipelines) |
| ☑ explain comparison | REPORT §5 · [`outputs/06_index_explain.txt`](outputs/06_index_explain.txt) · `screenshots/07b_explain_comparison.png` |
| ☑ Defence preparation | [`DEFENCE_PREP.md`](DEFENCE_PREP.md) |

## Steps → files

| Step | Script | Recorded output | Screenshot |
|---|---|---|---|
| 1 Cluster, DB, collections | `scripts/01_setup.js` | `outputs/01_setup.txt` | `01_step1_setup.png` |
| 2 Data model (3 sentences) | REPORT §2 | — | `02_step2_data_model.png` |
| 3 13 vendors | `scripts/02_insert_vendors.js` | `outputs/02_insert_vendors.txt` | `03_step3_vendors.png` |
| 4 300 orders | `scripts/03_generate_orders.js` | `outputs/03_generate_orders.txt` | `04_step4_orders.png` |
| 5 Basic queries | `scripts/04_basic_queries.js` | `outputs/04_basic_queries.txt` | `05_step5_basic_queries.png` |
| 6 Five pipelines | `scripts/05_pipelines.js` | `outputs/05_pipelines.txt` | `06_step6_pipelines.png` |
| 7 Index + explain | `scripts/06_index_explain.js` | `outputs/06_index_explain.txt` | `07_step7_index.png` |
| 8 Validation | `scripts/07_validation.js` | `outputs/07_validation.txt` | `08_step8_validation.png` |
| Twist | `scripts/08_twist_sesame_recall.js` | `outputs/08_twist_sesame_recall.txt` | `09_twist_sesame_recall.png` |

## Key results

- **Top stall:** Sushi Wave 448.50 EUR · total 3 782.00 EUR from 275 orders
- **Queue peaks:** 20 Jun 12:00, 21 Jun 15:00, 22 Jun 14:00 (UTC)
- **Payments:** card 35.3 % · app 32.4 % · cash 32.4 %
- **Index `{ ts: 1, total: 1 }`:** totalDocsExamined **275 → 0** (covered query)
- **Sesame recall:** 7 dishes at 3 stalls marked unavailable; 9 safe stalls

## How to run

```bash
# local MongoDB or Atlas
MONGO_URI="mongodb+srv://<user>:<pass>@<cluster>.mongodb.net" ./run_all.sh
# or paste all_queries.js / each scripts/*.js into the Atlas Data Explorer shell
```

Orders use a seeded random generator, so every run gives exactly the numbers above.
