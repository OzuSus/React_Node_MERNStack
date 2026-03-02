import fs from "fs";

const raw = JSON.parse(fs.readFileSync("./product.json", "utf-8"));

const categoryMap = {
    1: "699b0630d9336e95afa3033a",
    52: "699b0630d9336e95afa3033b",
    53: "699b0630d9336e95afa3033c",
    54: "699b0630d9336e95afa3033d",
};

const DEFAULT_JEWELER = "69948292121cbf2246108cfc";

const transformed = raw.rows.map(p => ({
    name: p.name?.trim(),
    price: Number(p.prize),
    tag: 'NEW',
    rating: 0,
    review: 0,
    description: p.description?.trim(),
    image: p.image?.trim(),
    quantity: 200,
    id_category: {
        $oid: categoryMap[p.id_category]
    },
    id_jeweler: {
        $oid: DEFAULT_JEWELER
    }
}));

fs.writeFileSync(
    "./product_mongo.json",
    JSON.stringify(transformed, null, 2)
);

console.log("✅ Done transform with $oid format!");