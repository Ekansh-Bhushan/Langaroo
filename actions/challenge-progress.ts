"use server"

import db from "@/db/drizzle";
import { getUserProgress } from "@/db/queries";
import { challengeProgress, challenges, userProgress } from "@/db/schema";
import { auth } from "@clerk/nextjs/server"
import { error } from "console";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const upsertChallengeProgress = async (challengeId: number) =>{
    const { userId } = await auth();

    if(!userId) {
        throw new Error("user not authenticated");
    }

    const currentUserProgress = await getUserProgress();
    // TODO: handle subscription query later

    if(!currentUserProgress) {
        throw new Error("user progress not found");
    }
    const challenge = await db.query.challenges.findFirst({
        where: eq(challenges.id, challengeId),
    })

    if(!challenge){
        throw new Error("challenge not found");
    }

    const lessonsID = challenge.lessonsID;

    const exisitingChallengeProgress = await db.query.challengeProgress.findFirst({
        where: and(
            eq(challengeProgress.userId, userId),
            eq(challengeProgress.challengeId, challengeId),
        ),
    })

    const isPractice = !!exisitingChallengeProgress;

    if(currentUserProgress.hearts === 0 && !isPractice) {
        return {error: "no hearts left"}
    }

    if(isPractice) {
        await db.update(challengeProgress).set({
            completed : true,
        }).where(eq(challengeProgress.id, exisitingChallengeProgress.id));

        await db.update(userProgress).set({
            hearts: Math.min(currentUserProgress.hearts + 1, 5),
            points: currentUserProgress.points + 10,
        }).where(eq(userProgress.userId,userId));

        revalidatePath("/learn");
        revalidatePath("/lesson");
        revalidatePath("/quests");
        revalidatePath("/leaderboard");
        revalidatePath(`/lesson/${lessonsID}`);
        return;
    }

    await db.insert(challengeProgress).values({
        challengeId,
        userId,
        completed: true,
    });

    await db.update(userProgress).set({
        points: currentUserProgress.points + 10,
    }).where(eq(userProgress.userId, userId));

    revalidatePath("/learn");
    revalidatePath("/lesson");
    revalidatePath("/quests");
    revalidatePath("/leaderboard");
    revalidatePath(`/lesson/${lessonsID}`);
}