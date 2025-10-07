// item_lister.js
// Generates full-path indexes for categories, subcategories, and items

const fs = require("fs");
const path = require("path");

const ROOT = path.join(__dirname, "categories");

function writeJSON(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
  console.log(`✅ Wrote ${filePath}`);
}

function listDirectories(dirPath) {
  if (!fs.existsSync(dirPath)) return [];
  return fs
    .readdirSync(dirPath, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

function normalize(p) {
  return p.replace(/\\/g, "/");
}

function buildIndexes() {
  if (!fs.existsSync(ROOT)) {
    console.error(`❌ Categories root not found: ${ROOT}`);
    process.exit(1);
  }

  const categories = listDirectories(ROOT);
  const globalItems = [];
  const categoryPaths = [];

  categories.forEach((categoryName) => {
    const categoryPath = path.join(ROOT, categoryName);
    const categoryJsonPath = path.join(categoryPath, `${categoryName}.json`);

    // Add category JSON to category list
    if (fs.existsSync(categoryJsonPath)) {
      const relPath = path.relative(__dirname, categoryJsonPath);
      categoryPaths.push(normalize(relPath));
    }

    const subcategories = listDirectories(categoryPath);
    const subcategoryPaths = [];

    const categoryItems = [];

    subcategories.forEach((subName) => {
      const subPath = path.join(categoryPath, subName);
      const subJsonPath = path.join(subPath, `${subName}.json`);

      // Add subcategory JSON to subs list
      if (fs.existsSync(subJsonPath)) {
        const relSubPath = path.relative(__dirname, subJsonPath);
        subcategoryPaths.push(normalize(relSubPath));
      }

      const itemsPath = path.join(subPath, "items");
      const itemDirs = listDirectories(itemsPath);

      const subItems = [];

      itemDirs.forEach((itemDir) => {
        const absItemJsonPath = path.join(
          ROOT,
          categoryName,
          subName,
          "items",
          itemDir,
          `${itemDir}.json`
        );

        if (fs.existsSync(absItemJsonPath)) {
          const relItemJsonPath = path.relative(__dirname, absItemJsonPath);
          const normalizedPath = normalize(relItemJsonPath);

          subItems.push(normalizedPath);
          categoryItems.push(normalizedPath);
          globalItems.push(normalizedPath);
        }
      });

      // Write subcategory item list
      const subListFile = path.join(subPath, `${subName}_item_list.json`);
      writeJSON(subListFile, subItems);
    });

    // Write category item list
    const catListFile = path.join(categoryPath, `${categoryName}_item_list.json`);
    writeJSON(catListFile, categoryItems);

    // Write subcategory list with full paths (named correctly as subs)
    const subsFile = path.join(categoryPath, `${categoryName}_subs.json`);
    writeJSON(subsFile, subcategoryPaths);
  });

  // Write global item list
  const globalListFile = path.join(ROOT, "global_item_list.json");
  writeJSON(globalListFile, globalItems);

  // Write category list
  const categoryListFile = path.join(ROOT, "category_list.json");
  writeJSON(categoryListFile, categoryPaths);
}

buildIndexes();