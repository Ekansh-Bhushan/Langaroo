"use server";

import { POINTS_TO_REFILL } from "@/constants";
import db from "@/db/drizzle";
import { getCoursesById, getUserProgress, getUserSubscriptions } from "@/db/queries";
import { challengeProgress, challenges, userProgress } from "@/db/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";



export const upsertUserProgress = async (courseId : number) => {
    const { userId } = await auth();
    const user = await currentUser();


    if(!userId || !user) {
        throw new Error("User not authenticated");
    }

    const course = await getCoursesById(courseId);

    if(!course) {
        throw new Error("Course not found");
    }

    if(!course.units.length || !course.units[0].lessons.length) {
        throw new Error("Course is empty");
    }

    const existingUserProgress = await getUserProgress();
    if(existingUserProgress) {
        await db.update(userProgress).set({
            activeCourseId: courseId,
            userName: user.firstName || "User",
            userImageSrc: user.imageUrl || "/default_user.svg",
        })
        revalidatePath("/courses");
        revalidatePath("/learn");
        redirect("/learn");
    }

    await db.insert(userProgress).values({
        userId,
        activeCourseId: courseId,
        userName: user.firstName || "User",
        userImageSrc: user.imageUrl || "/default_user.svg",
    })

    revalidatePath("/courses");
    revalidatePath("/learn");
    redirect("/learn");
}


export const reduceHearts = async (challengeId: number) => {
    const { userId } = await auth();

    if(!userId) {
        throw new Error("User not authenticated");
    }
    const currentUserProgress = await getUserProgress();
    const userSubscription = await getUserSubscriptions();

    const challenge = await db.query.challenges.findFirst({
        where: eq(challenges.id, challengeId)
    })

    if(!challenge){
        throw new Error("challenge not found");
    }

    const lessonsID = challenge.lessonsID;

    const exisitingChallengeProgress = await db.query.challengeProgress.findFirst({
        where: and(
            eq(challengeProgress.userId, userId),
            eq(challengeProgress.challengeId, challengeId)
        )
    })

    const isPractice = !!exisitingChallengeProgress;

    if(isPractice) {
        return {error: "practice"};
    }

    if(!currentUserProgress) {
        throw new Error("User progress not found");
    }

    if(userSubscription?.isActive) {
        return {error:"subscription"}
    }
    if(currentUserProgress.hearts === 0) {
        return {error: "no hearts left"}
    }

    await db.update(userProgress).set({
        hearts: Math.max(currentUserProgress.hearts - 1 , 0)
    }).where(eq(userProgress.userId, userId));

    revalidatePath("/shop");
    revalidatePath("/learn");
    revalidatePath("/quests");
    revalidatePath("/learderboard");
    revalidatePath(`/lesson/${lessonsID}`);

}

export const refillHearts = async () => {
    const currentUserProgress = await getUserProgress();

    if(!currentUserProgress) {
        throw new Error("User progress not found");
    }

    if(currentUserProgress.hearts === 5) {
        throw new Error("Hears are already full");
    }

    if(currentUserProgress.points < POINTS_TO_REFILL) {
        throw new Error("Not enough Points");
    }

    await db.update(userProgress).set({
        hearts : Math.min(currentUserProgress.hearts + 1, 5),
        points : currentUserProgress.points - POINTS_TO_REFILL
        }).where(eq(userProgress.userId, currentUserProgress.userId))
   
    revalidatePath("/shop");
    revalidatePath("/learn");
    revalidatePath("/quests");
    revalidatePath("/learderboard");
}
