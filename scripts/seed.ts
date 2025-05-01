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
        await db.delete(schema.units);
        await db.delete(schema.lessons);
        await db.delete(schema.challenges);
        await db.delete(schema.challengeOptions);
        await db.delete(schema.challengeProgress);
        await db.delete(schema.userSubscription);

        await db.insert(schema.courses).values([
            {
                id: 1,
                title: "Punjabi",
                imageSrc: "/punjabi-letter.svg",
            },
            {
                id: 2,
                title: "Assamese",
                imageSrc: "/Assamese-letter.svg",
            },
            {
                id: 3,
                title: "Bengali",
                imageSrc: "/Bengali-letter.svg",
            },
{
            id: 4,
            title: "Bodo",
            imageSrc: "/Bodo-letter.svg",
        },
        ]); 
        
        await db.insert(schema.units).values([
            {
                id: 1,
                title: "Unit 1",
                description: "Learn the basics",
                courseID: 1,
                order: 1,
            },
            {
                id: 2,
                title: "Unit 2",
                description: "Learn the basics",
                courseID: 1,
                order: 2,
            }
        ]);

        await db.insert(schema.lessons).values([
            {
                id: 1,
                title: "Nouns",
                unitID: 1,
                order: 1,
            },
            {
                id: 2,
                title: "Verbs",
                unitID: 1,
                order: 2,
            },
            {
                id: 3,
                title: "Verbs",
                unitID: 1,
                order: 3,
            },
            {
                id: 4,
                title: "Verbs",
                unitID: 1,
                order: 4,
            },
            {
                id: 5,
                title: "Verbs",
                unitID: 1,
                order: 5,
            }
        ]);

        await db.insert(schema.challenges).values([
            {
                id: 1,
                lessonsID: 1,
                type: "SELECT",
                question: 'Which one of them is man',
                order: 1,
            },
            {
            id: 2,
            lessonsID: 1,
            type: "ASSIST",
            question: '"The man" ',
            order: 2,
        },
        {
            id: 3,
            lessonsID: 1,
            type: "SELECT",
            question: 'Which one of them is "The Woman" ',
            order: 3,
        }
        ]);

        await db.insert(schema.challengeOptions).values([
            {
                id: 1,
                challengeId: 1, // which one of them is man
                text: 'Man',
                correctOption: true,
                ImageSrc: '/man.svg',
                audioSrc: '/pb_man.mp3',
            },
            {
                id: 2,
                challengeId: 1, // which one of them is man
                text: 'Woman',
                correctOption: false,
                ImageSrc: '/woman.svg',
                audioSrc: '/pb_woman.mp3',
            },
            {
                id: 3,
                challengeId: 1, // which one of them is man
                text: 'Baby',
                correctOption: false,
                ImageSrc: '/baby.svg',
                audioSrc: '/pb_baby.mp3',
            },
            {
                id: 4,
                challengeId: 1, // which one of them is man
                text: 'Baby bay',
                correctOption: false,
                ImageSrc: '/baby.svg',
                audioSrc: '/pb_baby.mp3',
            },




            {
                id: 5,
                challengeId: 2, // which one of them is man
                text: 'Man',
                correctOption: true,
            
                audioSrc: '/pb_man.mp3',
            },
            {
                id: 6,
                challengeId: 2, // which one of them is man
                text: 'Woman',
                correctOption: false,
                
                audioSrc: '/pb_woman.mp3',
            },
            {
                id: 7,
                challengeId: 2, // which one of them is man
                text: 'Baby',
                correctOption: false,
                
                audioSrc: '/pb_baby.mp3',
            },
            {
                id: 8,
                challengeId: 2, // which one of them is man
                text: 'Baby bay',
                correctOption: false,
                
                audioSrc: '/pb_baby.mp3',
            },






            {
                id: 9,
                challengeId: 3, // which one of them is man
                text: 'Man',
                correctOption: false,
                ImageSrc: '/man.svg',
                audioSrc: '/pb_man.mp3',
            },
            {
                id: 10,
                challengeId: 3, // which one of them is man
                text: 'Woman',
                correctOption: true,
                ImageSrc: '/woman.svg',
                audioSrc: '/pb_woman.mp3',
            },
            {
                id: 11,
                challengeId: 3, // which one of them is man
                text: 'Baby',
                correctOption: false,
                ImageSrc: '/baby.svg',
                audioSrc: '/pb_baby.mp3',
            },
            {
                id: 12,
                challengeId: 3, // which one of them is man
                text: 'Baby bay',
                correctOption: false,
                ImageSrc: '/baby.svg',
                audioSrc: '/pb_baby.mp3',
            },
        ]);


        await db.insert(schema.challenges).values([
            {
                id: 4,
                lessonsID: 2,
                type: "SELECT",
                question: 'Which one of them is man',
                order: 1,
            },
            {
            id: 5,
            lessonsID: 2,
            type: "ASSIST",
            question: '"The man" ',
            order: 2,
        },
        {
            id: 6,
            lessonsID: 2,
            type: "SELECT",
            question: 'Which one of them is "The Woman" ',
            order: 3,
        }
        ]);

        console.log('Seeding finished')
    }catch (error) {
        console.error("Error seeding database:", error);
        throw new Error("Seeding failed");
    }

}

main();
