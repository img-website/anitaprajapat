// Standalone seed script. Run with:  npm run seed
// Uses the raw MongoDB driver via mongoose connection so it doesn't depend on
// the app's ESM model files. Safe to re-run (upserts admin + settings).
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const URI = process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/anitaprajapat";
const ADMIN_EMAIL = process.env.SEED_ADMIN_EMAIL || "anitaprajapat.superstar@gmail.com";
const ADMIN_PASSWORD = process.env.SEED_ADMIN_PASSWORD || "ChangeMe@123";
const ADMIN_NAME = process.env.SEED_ADMIN_NAME || "Anita Prajapat Admin";

function slug(s) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

async function main() {
  await mongoose.connect(URI);
  const db = mongoose.connection.db;
  console.log("Connected to", db.databaseName);

  // ── Admin user ──
  const hashed = await bcrypt.hash(ADMIN_PASSWORD, 12);
  await db.collection("users").updateOne(
    { email: ADMIN_EMAIL.toLowerCase() },
    {
      $set: { name: ADMIN_NAME, password: hashed, role: "admin", isActive: true, updatedAt: new Date() },
      $setOnInsert: { createdAt: new Date() },
    },
    { upsert: true }
  );
  console.log("✓ Admin user:", ADMIN_EMAIL, "/ password:", ADMIN_PASSWORD);

  // ── Settings singleton ──
  await db.collection("settings").updateOne(
    { key: "global" },
    {
      $setOnInsert: {
        key: "global",
        siteName: "Anita Prajapat",
        tagline: "Rajasthani Devotional Singer",
        phone: "8302598435",
        whatsapp: "918302598435",
        email: ADMIN_EMAIL,
        manager: "Jitendra Kumar Bijarnia",
        address: "Jaipur, Rajasthan",
        logo: "/logo.png",
        social: {
          youtube: "https://www.youtube.com/@SuperstarAnitaPrajapat/",
          instagram: "https://www.instagram.com/anitaprajapat.superstar",
          facebook: "https://www.facebook.com/SuperstarAnitaPrajapat/",
          pinterest: "https://in.pinterest.com/anitaprajapatsuperstar/",
        },
        counters: { stageShows: "10000+" },
        theme: { primary: "#b5277d", gold: "#d99a2b", dark: "#120816", defaultMode: "light" },
        createdAt: new Date(),
      },
      $set: { updatedAt: new Date() },
    },
    { upsert: true }
  );
  console.log("✓ Settings");

  // ── Categories ──
  const cats = [
    { name: "Khatu Shyam Bhajan", type: "bhajan" },
    { name: "Mataji Bhajan", type: "bhajan" },
    { name: "Rajasthani Bhajan", type: "bhajan" },
    { name: "Festival", type: "blog" },
  ];
  for (const c of cats) {
    await db.collection("categories").updateOne(
      { slug: slug(c.name) },
      { $setOnInsert: { ...c, slug: slug(c.name), isActive: true, order: 0, createdAt: new Date() }, $set: { updatedAt: new Date() } },
      { upsert: true }
    );
  }
  const khatu = await db.collection("categories").findOne({ slug: slug("Khatu Shyam Bhajan") });
  console.log("✓ Categories");

  // NOTE: Bhajan videos are NOT seeded — they come live from YouTube.

  // ── Gallery (real stage images) ──
  const galleryImgs = ["/images/g1.jpg", "/images/g2.jpg", "/images/g3.jpg", "/images/g4.jpg", "/images/g5.jpg", "/images/g6.jpg"];
  for (let i = 0; i < galleryImgs.length; i++) {
    await db.collection("galleries").updateOne(
      { "image.url": galleryImgs[i] },
      {
        $setOnInsert: {
          title: `Stage Moment ${i + 1}`,
          mediaType: "image",
          image: { url: galleryImgs[i] },
          isFeatured: i < 3,
          isActive: true,
          order: i,
          createdAt: new Date(),
        },
        $set: { updatedAt: new Date() },
      },
      { upsert: true }
    );
  }
  console.log("✓ Gallery");

  // ── Sample quote, testimonial, event, blog ──
  await db.collection("quotes").updateOne(
    { text: "जहाँ श्याम वहाँ प्रेम" },
    { $setOnInsert: { text: "जहाँ श्याम वहाँ प्रेम", author: "Anita Prajapat", isActive: true, order: 0, createdAt: new Date() }, $set: { updatedAt: new Date() } },
    { upsert: true }
  );
  const testimonials = [
    { name: "Ramesh Sharma", role: "Jagran Organizer, Jaipur", message: "Anita ji's bhajans filled our jagran with divine energy. The whole night felt blessed — truly unforgettable!", rating: 5, order: 0 },
    { name: "Sunita Devi", role: "Devotee, Sikar", message: "Her voice touches the soul. When she sings Khatu Shyam bhajans, the entire pandal echoes with bhakti.", rating: 5, order: 1 },
    { name: "Mahendra Singh", role: "Event Manager, Jodhpur", message: "Extremely professional and punctual. The crowd response at our Mataji jagran was phenomenal. Highly recommended.", rating: 5, order: 2 },
    { name: "Pooja Agarwal", role: "Devotee, Jaipur", message: "I follow all her YouTube bhajans. Watching her live was a dream come true — goosebumps the entire performance!", rating: 5, order: 3 },
    { name: "Rajendra Prasad", role: "Temple Committee, Ajmer", message: "A divine experience for our community. Anita ji connects with every devotee. We will surely invite her again.", rating: 5, order: 4 },
  ];
  for (const t of testimonials) {
    await db.collection("testimonials").updateOne(
      { name: t.name },
      { $setOnInsert: { ...t, isActive: true, createdAt: new Date() }, $set: { updatedAt: new Date() } },
      { upsert: true }
    );
  }
  await db.collection("events").updateOne(
    { slug: slug("Khatu Shyam Jagran Jaipur") },
    { $setOnInsert: { title: "Khatu Shyam Jagran Jaipur", slug: slug("Khatu Shyam Jagran Jaipur"), type: "jagran", city: "Jaipur", state: "Rajasthan", venue: "Community Ground", date: new Date(Date.now() + 20 * 864e5), startTime: "8:00 PM", status: "upcoming", isFeatured: true, coverImage: { url: "/images/g5.jpg" }, gallery: [], seo: {}, createdAt: new Date() }, $set: { updatedAt: new Date() } },
    { upsert: true }
  );
  console.log("✓ Sample content (quote, 5 testimonials, event)");

  await mongoose.disconnect();
  console.log("\nSeed complete. Login at /admin/login");
  process.exit(0);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
