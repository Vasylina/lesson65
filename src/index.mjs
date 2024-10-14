import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import chalk from "chalk";

dotenv.config();

async function run() {
  const client = new MongoClient(process.env.MONGODB_URI);
  const dbName = process.env.DB_NAME;

  try {
    await client.connect();
    console.log("Connected to Database");

    const db = client.db(dbName);

    await db.collection("users").deleteOne({});
    console.log(
      chalk.redBright(
        'Collection "users" has been changed.One document has been deleted.'
      )
    );

    const result = await db
      .collection("users")
      .insertOne({ name: "John Doe", age: 30 });
    console.log(
      chalk.greenBright(
        'One document has been inserted into "users" collection.'
      )
    );

    console.log(chalk.bgRedBright("result:"), result);

    await db.collection("users").deleteMany({});
    console.log(
      chalk.redBright('Collection "users" has been deleted all documents.')
    );

    const result2 = await db.collection("users").insertMany([
      { name: "Bob Doe", age: 30, skills: ["HTML", "CSS", "JS", "Node.js"] },
      { name: "Jane Woo", age: 25, skills: ["Python", "Django"] },
      { name: "Mary Boo", age: 35, skills: ["Java", "Spring"] },
      { name: "Jack Daniels", age: 40 },
      { name: "Jonny Walker", age: 21, skills: ["JavaScript", "React"] },
    ]);
    console.log(
      chalk.greenBright(
        'Many documents has been inserted into "users" collection.'
      )
    );

    console.log(chalk.bgRedBright("result:"), result2);

    const stats = await db.command({ collStats: "users" });
    console.log(
      chalk.blueBright('Number of documents in the "users" collection:'),
      stats.count
    );

    const documents = await db.collection("users").find({}).toArray();
    console.log(
      chalk.magentaBright('Contents of the "users" collection:'),
      documents
    );
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  } finally {
    await client.close();
  }
}

run();
