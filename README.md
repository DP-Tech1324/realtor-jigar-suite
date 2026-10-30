# Realtor Jigar Suite (AI Enhanced)
- Frontend app (`client-site/`)
- Admin dashboard (`admin-panel/`)
- Shared AI assistant (`shared/ai/`)

## ✅ Setup
See [docs/SETUP.md](docs/SETUP.md) for the database, first admin account, environment variables, deploy, Vastu and AI features.

Built by Sankalp Tech & Solution Inc.

---

## 📂 Scripts

All CREA DDF® fetch and sync scripts are organized in the `/scripts` folder.

| Script Filename                 | Description                                       | Usage Example                           |
|---------------------------------|---------------------------------------------------|-----------------------------------------|
| `ddf_sync.js`                   | Main script to fetch and sync CREA DDF® data.     | `node scripts/ddf_sync.js`              |
| `ddf_sync_ontario_all.js`       | Fetches all Ontario listings.                     | `node scripts/ddf_sync_ontario_all.js`  |
| `ddf_sync_ontario_enum_safe.js` | Ontario listings fetch with enum safety checks.   | `node scripts/ddf_sync_ontario_enum_safe.js` |
| `ddf_sync_ontario_first.js`     | First version of Ontario data fetch.              | `node scripts/ddf_sync_ontario_first.js`|

**How to Run:**
```bash
node scripts/FILENAME.js
Replace FILENAME.js with the script you want to run.

Note:
Ensure you have your required .env credentials set before running any script.