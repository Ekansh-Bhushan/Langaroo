import "dotenv/config";
import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "../db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

const main = async () => {
    try {
        console.log("Seeding database...");

        await db.delete(schema.courses);
        await db.delete(schema.userProgress);

        await db.insert(schema.courses).values([
            {
                id: 1,
                title: "Punjabi",
                imageSrc: "/flag.svg",
            },
            {
                id: 2,
                title: "English",
                imageSrc: "/lettera.svg",
            },
            {
                id: 3,
                title: "Japanses",
                imageSrc: "/letterb.svg",
            },
        ]);         
        console.log('Seeding finished')
    }catch (error) {
        console.error("Error seeding database:", error);
        throw new Error("Seeding failed");
    }

}

main();
