// =====================================================================
// STEP 3 — Insert 13 vendors by hand (8 cuisines, 3 zones)
// Model (STEP 2): the menu is EMBEDDED inside each vendor document.
// V13 is inserted on purpose so Step 5 can delete it and still leave 12.
// =====================================================================
db = db.getSiblingDB("festival");

db.vendors.insertOne({
  _id: "V01", name: "Pelmeņi Express", cuisine: "Latvian",
  stall: { zone: "A", number: 3 }, rating: 4.6, tags: ["traditional", "family"],
  menu: [
    { item: "Pelmeņi with sour cream", price: 6.5, vegan: false, allergens: ["gluten", "milk"] },
    { item: "Rye bread pudding",       price: 4.0, vegan: false, allergens: ["gluten", "milk", "egg"] },
    { item: "Grey peas with onion",    price: 5.0, vegan: true,  allergens: [] }
  ]
});

db.vendors.insertOne({
  _id: "V02", name: "Rīgas Kūpinātava", cuisine: "Latvian",
  stall: { zone: "A", number: 5 }, rating: 4.2, tags: ["smoked", "seafood"],
  menu: [
    { item: "Smoked sprat sandwich", price: 5.5, vegan: false, allergens: ["fish", "gluten"] },
    { item: "Potato pancakes",       price: 5.0, vegan: false, allergens: ["egg", "gluten"] },
    { item: "Sauerkraut salad",      price: 3.5, vegan: true,  allergens: [] }
  ]
});

db.vendors.insertOne({
  _id: "V03", name: "Tbilisi Fire", cuisine: "Georgian",
  stall: { zone: "B", number: 1 }, rating: 4.8, tags: ["bakery", "bestseller"],
  menu: [
    { item: "Adjarian khachapuri",    price: 9.0, vegan: false, allergens: ["gluten", "milk", "egg"] },
    { item: "Khinkali (5 pcs)",       price: 8.0, vegan: false, allergens: ["gluten"] },
    { item: "Badrijani with walnuts", price: 6.0, vegan: true,  allergens: ["nuts"] }
  ]
});

db.vendors.insertOne({
  _id: "V04", name: "Supra Grill", cuisine: "Georgian",
  stall: { zone: "B", number: 4 }, rating: 4.3, tags: ["grill", "meat"],
  menu: [
    { item: "Mtsvadi pork skewer", price: 10.5, vegan: false, allergens: [] },
    { item: "Lobio bean stew",     price: 6.5,  vegan: true,  allergens: [] },
    { item: "Churchkhela",         price: 3.5,  vegan: true,  allergens: ["nuts"] }
  ]
});

db.vendors.insertOne({
  _id: "V05", name: "Tokyo Ramen Bar", cuisine: "Japanese",
  stall: { zone: "B", number: 2 }, rating: 4.7, tags: ["noodles", "spicy"],
  menu: [
    { item: "Tonkotsu ramen",   price: 11.0, vegan: false, allergens: ["gluten", "egg", "soy", "sesame"] },
    { item: "Vegan miso ramen", price: 9.5,  vegan: true,  allergens: ["gluten", "soy", "sesame"] },
    { item: "Edamame",          price: 4.0,  vegan: true,  allergens: ["soy"] }
  ]
});

db.vendors.insertOne({
  _id: "V06", name: "Sushi Wave", cuisine: "Japanese",
  stall: { zone: "C", number: 2 }, rating: 4.1, tags: ["seafood", "fresh"],
  menu: [
    { item: "Salmon nigiri set", price: 12.0, vegan: false, allergens: ["fish", "soy", "sesame"] },
    { item: "Avocado maki",      price: 6.5,  vegan: true,  allergens: ["soy", "sesame"] },
    { item: "Mochi ice cream",   price: 4.5,  vegan: false, allergens: ["milk"] }
  ]
});

db.vendors.insertOne({
  _id: "V07", name: "Taco Loco", cuisine: "Mexican",
  stall: { zone: "A", number: 1 }, rating: 4.5, tags: ["street", "spicy"],
  menu: [
    { item: "Al pastor tacos",    price: 8.5, vegan: false, allergens: [] },
    { item: "Black bean burrito", price: 7.5, vegan: true,  allergens: ["gluten"] },
    { item: "Guacamole & chips",  price: 5.0, vegan: true,  allergens: [] }
  ]
});

db.vendors.insertOne({
  _id: "V08", name: "El Fuego", cuisine: "Mexican",
  stall: { zone: "C", number: 5 }, rating: 3.9, tags: ["cheesy", "sweet"],
  menu: [
    { item: "Chicken quesadilla", price: 8.0, vegan: false, allergens: ["gluten", "milk"] },
    { item: "Elote corn",         price: 4.5, vegan: false, allergens: ["milk"] },
    { item: "Churros",            price: 4.0, vegan: false, allergens: ["gluten", "egg", "milk"] }
  ]
});

db.vendors.insertOne({
  _id: "V09", name: "Bombay Street", cuisine: "Indian",
  stall: { zone: "B", number: 3 }, rating: 4.6, tags: ["curry", "spicy"],
  menu: [
    { item: "Butter chicken & rice", price: 10.0, vegan: false, allergens: ["milk"] },
    { item: "Chana masala",          price: 7.0,  vegan: true,  allergens: [] },
    { item: "Samosa (2 pcs)",        price: 4.5,  vegan: true,  allergens: ["gluten"] }
  ]
});

db.vendors.insertOne({
  _id: "V10", name: "Beirut Bites", cuisine: "Lebanese",
  stall: { zone: "B", number: 5 }, rating: 4.5, tags: ["mezze", "wraps"],
  menu: [
    { item: "Falafel wrap",     price: 7.5, vegan: true,  allergens: ["gluten", "sesame"] },
    { item: "Hummus plate",     price: 6.0, vegan: true,  allergens: ["sesame"] },
    { item: "Chicken shawarma", price: 9.0, vegan: false, allergens: ["gluten", "sesame", "milk"] }
  ]
});

db.vendors.insertOne({
  _id: "V11", name: "Napoli Slice", cuisine: "Italian",
  stall: { zone: "A", number: 2 }, rating: 4.3, tags: ["pizza", "family"],
  menu: [
    { item: "Margherita pizza", price: 9.5, vegan: false, allergens: ["gluten", "milk"] },
    { item: "Marinara pizza",   price: 8.0, vegan: true,  allergens: ["gluten"] },
    { item: "Tiramisu",         price: 5.0, vegan: false, allergens: ["gluten", "milk", "egg"] }
  ]
});

db.vendors.insertOne({
  _id: "V12", name: "Borsch & Co", cuisine: "Ukrainian",
  stall: { zone: "C", number: 1 }, rating: 4.4, tags: ["traditional", "soup"],
  menu: [
    { item: "Red borscht",          price: 6.0, vegan: true,  allergens: [] },
    { item: "Varenyky with potato", price: 7.0, vegan: false, allergens: ["gluten", "milk"] },
    { item: "Syrnyky",              price: 5.5, vegan: false, allergens: ["milk", "egg", "gluten"] }
  ]
});

db.vendors.insertOne({
  _id: "V13", name: "Seoul Food Truck", cuisine: "Korean",
  stall: { zone: "C", number: 4 }, rating: 3.8, tags: ["truck", "spicy"],
  menu: [
    { item: "Bibimbap",       price: 9.5, vegan: false, allergens: ["egg", "soy", "sesame"] },
    { item: "Kimchi pancake", price: 6.5, vegan: true,  allergens: ["gluten", "soy"] },
    { item: "Tteokbokki",     price: 7.0, vegan: false, allergens: ["fish", "soy"] }
  ]
});

print("Vendors inserted: " + db.vendors.countDocuments());
print("Distinct cuisines (" + db.vendors.distinct("cuisine").length + "):");
printjson(db.vendors.distinct("cuisine"));
printjson(db.vendors.aggregate([
  { $group: { _id: "$stall.zone", vendors: { $sum: 1 } } }, { $sort: { _id: 1 } }
]).toArray());
