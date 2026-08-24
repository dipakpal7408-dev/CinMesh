// Run with: npm run seed
require("dotenv").config();
const connectDB = require("../config/db");
const Community = require("../models/Community");

const defaultCommunities = [
  { name: "CSE Hub", branch: "CSE", category: "General", description: "Everything Computer Science." },
  { name: "ECE Circle", branch: "ECE", category: "General", description: "Electronics & Communication discussions." },
  { name: "DSA Grinders", branch: "CSE", category: "DSA", description: "Daily DSA practice and doubt solving." },
  { name: "Web Dev Builders", branch: "CSE", category: "Web Development", description: "Frontend, backend, full-stack projects." },
  { name: "AI/ML Explorers", branch: "CSE", category: "AI/ML", description: "Machine learning papers, projects & jobs." },
  { name: "GATE Aspirants", branch: "General", category: "GATE", description: "GATE prep, mock tests, study groups." },
  { name: "Placements Prep", branch: "General", category: "Placements", description: "Interview experiences and resources." },
  { name: "Internship Finder", branch: "General", category: "Internships", description: "Internship openings and referrals." },
];

const slugify = (s) =>
  s.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)+/g, "");

(async () => {
  await connectDB();
  for (const c of defaultCommunities) {
    const slug = slugify(c.name);
    const exists = await Community.findOne({ slug });
    if (!exists) {
      await Community.create({ ...c, slug, members: [], moderators: [] });
      console.log(`Created community: ${c.name}`);
    }
  }
  console.log("Seeding complete.");
  process.exit(0);
})();
