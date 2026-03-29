const express = require("express");
const { MongoClient, ObjectId } = require("mongodb");
const path = require("path");

const app = express();
const PORT = 3000;
const MONGO_URL = "mongodb://localhost:27017";
const DB_NAME = "slangDB";

// Middleware
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

let db;

// Connect to MongoDB and start server
async function start() {
  const client = new MongoClient(MONGO_URL);
  await client.connect();
  db = client.db(DB_NAME);
  console.log("Connected to MongoDB");

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
  });
}

// ============ HOME ============
app.get("/", (req, res) => {
  res.render("index");
});

// ============ TERMS ROUTES ============

// READ — list all terms
app.get("/terms", async (req, res) => {
  const terms = await db.collection("terms").find({}).sort({ popularityScore: -1 }).toArray();
  res.render("terms", { terms });
});

// CREATE — show form
app.get("/terms/new", (req, res) => {
  res.render("termForm", { term: null });
});

// CREATE — handle form submission
app.post("/terms", async (req, res) => {
  const newTerm = {
    termId: parseInt(req.body.termId),
    text: req.body.text,
    difficultyRating: parseInt(req.body.difficultyRating),
    trendingStatus: req.body.trendingStatus,
    popularityScore: parseFloat(req.body.popularityScore),
    dateAdded: new Date().toISOString().split("T")[0],
    isActive: true,
    origin: {
      originId: parseInt(req.body.originId) || 0,
      name: req.body.originName || "",
      description: req.body.originDescription || "",
      cultureGroup: req.body.originCultureGroup || ""
    },
    definitions: [],
    categories: req.body.categories ? req.body.categories.split(",").map(c => c.trim()) : [],
    regions: [],
    semanticRelations: []
  };
  await db.collection("terms").insertOne(newTerm);
  res.redirect("/terms");
});

// UPDATE — show edit form
app.get("/terms/edit/:id", async (req, res) => {
  const term = await db.collection("terms").findOne({ _id: new ObjectId(req.params.id) });
  res.render("termForm", { term });
});

// UPDATE — handle edit submission
app.post("/terms/edit/:id", async (req, res) => {
  await db.collection("terms").updateOne(
    { _id: new ObjectId(req.params.id) },
    {
      $set: {
        text: req.body.text,
        difficultyRating: parseInt(req.body.difficultyRating),
        trendingStatus: req.body.trendingStatus,
        popularityScore: parseFloat(req.body.popularityScore),
        isActive: req.body.isActive === "on",
        categories: req.body.categories ? req.body.categories.split(",").map(c => c.trim()) : []
      }
    }
  );
  res.redirect("/terms");
});

// DELETE — remove a term
app.post("/terms/delete/:id", async (req, res) => {
  await db.collection("terms").deleteOne({ _id: new ObjectId(req.params.id) });
  res.redirect("/terms");
});

// ============ USERS ROUTES ============

// READ — list all users
app.get("/users", async (req, res) => {
  const users = await db.collection("users").find({}).sort({ joinDate: -1 }).toArray();
  res.render("users", { users });
});

// CREATE — show form
app.get("/users/new", (req, res) => {
  res.render("userForm", { user: null });
});

// CREATE — handle form submission
app.post("/users", async (req, res) => {
  const newUser = {
    userId: parseInt(req.body.userId),
    username: req.body.username,
    email: req.body.email,
    role: req.body.role,
    joinDate: new Date().toISOString().split("T")[0],
    isActive: true,
    profile: {
      displayName: req.body.displayName || "",
      bio: req.body.bio || "",
      region: req.body.region || ""
    },
    contributedTermIds: [],
    favoriteTermIds: []
  };
  await db.collection("users").insertOne(newUser);
  res.redirect("/users");
});

// UPDATE — show edit form
app.get("/users/edit/:id", async (req, res) => {
  const user = await db.collection("users").findOne({ _id: new ObjectId(req.params.id) });
  res.render("userForm", { user });
});

// UPDATE — handle edit submission
app.post("/users/edit/:id", async (req, res) => {
  await db.collection("users").updateOne(
    { _id: new ObjectId(req.params.id) },
    {
      $set: {
        username: req.body.username,
        email: req.body.email,
        role: req.body.role,
        isActive: req.body.isActive === "on",
        profile: {
          displayName: req.body.displayName || "",
          bio: req.body.bio || "",
          region: req.body.region || ""
        }
      }
    }
  );
  res.redirect("/users");
});

// DELETE — remove a user
app.post("/users/delete/:id", async (req, res) => {
  await db.collection("users").deleteOne({ _id: new ObjectId(req.params.id) });
  res.redirect("/users");
});

start().catch(console.error);