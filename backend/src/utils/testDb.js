require("dotenv").config();

const prisma = require("../config/prisma");

async function testDb() {
  try {
    await prisma.$connect();

    console.log("Database connected successfully");

    const userCount = await prisma.user.count();
    const projectCount = await prisma.project.count();
    const taskCount = await prisma.task.count();
    const evaluationCount = await prisma.evaluation.count();

    console.log("Users:", userCount);
    console.log("Projects:", projectCount);
    console.log("Tasks:", taskCount);
    console.log("Evaluations:", evaluationCount);
  } catch (error) {
    console.error("Database connection failed");
    console.error(error);
  } finally {
    await prisma.$disconnect();
  }
}

testDb();
