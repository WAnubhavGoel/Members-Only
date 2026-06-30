import { prisma } from "./prisma.js";
import bcrypt from "bcryptjs";

async function main() {
  console.log("🌱 Starting database seeding...");

  await prisma.message.deleteMany();
  await prisma.user.deleteMany();
  console.log("🧹 Cleaned existing database entries.");

  const passwordHash = await bcrypt.hash("password123", 10);

  console.log("👤 Creating seed users...");
  const admin = await prisma.user.create({
    data: {
      firstName: "James",
      lastName: "Bond",
      email: "admin@clubhouse.com",
      password: passwordHash,
      membership: true,
      isAdmin: true,
    },
  });

  const member = await prisma.user.create({
    data: {
      firstName: "Sherlock",
      lastName: "Holmes",
      email: "member@clubhouse.com",
      password: passwordHash,
      membership: true,
      isAdmin: false,
    },
  });

  const guest = await prisma.user.create({
    data: {
      firstName: "John",
      lastName: "Doe",
      email: "guest@clubhouse.com",
      password: passwordHash,
      membership: false,
      isAdmin: false,
    },
  });

  console.log("✅ Seed users created.");

  console.log("💬 Creating seed messages...");
  
  await prisma.message.create({
    data: {
      title: "did anyone watch the match yesterday?",
      body: "insane comeback in the last 10 minutes. still can't believe they pulled it off. did anyone else see it?",
      authorId: admin.id,
    },
  });

  await prisma.message.create({
    data: {
      title: "best coffee in the city?",
      body: "looking for a good cafe to study this weekend. preferably somewhere quiet with decent wifi. let me know if u guys have any spots!",
      authorId: member.id,
    },
  });

  await prisma.message.create({
    data: {
      title: "traffic on 5th avenue is a nightmare",
      body: "avoid the downtown route if you can. been stuck here for like 45 mins. typical Friday afternoon.",
      authorId: guest.id,
    },
  });

  console.log("✅ Seed messages created.");
  console.log("✨ Seeding completed successfully!");
  console.log("\n🔑 Default login credentials (Password is 'password123' for all):");
  console.log(` - Admin: ${admin.email}`);
  console.log(` - Member: ${member.email}`);
  console.log(` - Guest: ${guest.email}\n`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Seeding failed:", e);
    await prisma.$disconnect();
    process.exit(1);
  });