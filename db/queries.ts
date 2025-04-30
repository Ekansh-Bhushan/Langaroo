import { cache, use } from "react";
import db from "./drizzle";
import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { challengeProgress, challenges, courses, lessons, units, userProgress, userSubscription } from "./schema";

export const getUserProgress = cache(async () => {
    const { userId } = await auth();
    if(!userId) {
        return null;
    }

    const data = await db.query.userProgress.findFirst({
        where: eq(userProgress.userId, userId),
        with:{
            activeCourse: true,
        },
    });

    return data;
})

export const getUnits = cache(async () => {
    const { userId } = await auth();
    const userProgress = await getUserProgress();

    if(!userId || !userProgress?.activeCourseId) {
        return [];
    }

    const data = await db.query.units.findMany({
        where: eq(units.courseID, userProgress.activeCourseId),
        with:{
            lessons: {
                with:{
                    challenges: {
                        with:{
                            challengeProgress: {
                                where: eq(challengeProgress.userId, userId),
                            },
                        },
                    },
                },
            },
        },
    });

    const normalizedData = data.map((unit) => {
        const lessonsWithCompleteStatus = unit.lessons.map((lesson) => {

            if(lesson.challenges.length === 0){ 
                return { ...lesson, complete: false}
            }
          const allCompleteChallenges = lesson.challenges.every((challenge) => {
            return (
              challenge.challengeProgress &&
              challenge.challengeProgress.length > 0 &&
              challenge.challengeProgress.every((progress) => progress.completed)
            );
          });
          return {
            ...lesson, complete: allCompleteChallenges,
        }
        })
        return {...unit, lessons: lessonsWithCompleteStatus }
    })
    return normalizedData;
})    

export const getCourses = cache(async () => {
    const data = await db.query.courses.findMany();
    return data;
})

export const getCoursesById = cache(async (courseId : number) => {
    const data = await db.query.courses.findFirst({ 
        where: eq(courses.id, courseId),
    });
    return data;
})

export const getCoursesProgress = cache(async () => {
    const { userId } = await auth();
    const userProgress = await getUserProgress();

    if(!userId || !userProgress?.activeCourseId) {
        return null;
    }

    const unitsInActiveCourse = await db.query.units.findMany({
        orderBy: (units, { asc }) => [asc(units.order)],
        where: eq(units.courseID, userProgress.activeCourseId),
        with: {
            lessons: {
                orderBy: (lessons, {asc}) => [asc(lessons.order)],
                with: {
                    unit: true,
                    challenges: {
                        with: {
                            challengeProgress: {
                                where: eq(challengeProgress.userId,userId),
                            }
                        }
                    }
                }
            }
        }
    })

    const firstUncompletedLesson = unitsInActiveCourse
        .flatMap((unit) => unit.lessons)
        .find((lessons)=>{
            return lessons.challenges.some((challenge) => {
                return !challenge.challengeProgress 
                || challenge.challengeProgress.length === 0 
                || challenge.challengeProgress.some((progress)=>progress.completed === false);
            })
        })
    
    return {
        activeLesson : firstUncompletedLesson,
        activeLessonId: firstUncompletedLesson?.id,
    }
})

export const getLesson = cache(async (id? : number)=> {
    const { userId } = await auth();

    if(!userId) {
        return null;
    }
    const courseProgress = await getCoursesProgress();

    const lessonID = id || courseProgress?.activeLessonId;

    if(!lessonID) {
        return null;
    }

    const data = await db.query.lessons.findFirst({
        where: eq(lessons.id,lessonID),
        with: {
            challenges: {
                orderBy: (challenges, {asc}) => [asc(challenges.order)],
                with: {
                    challengeOptions: true,
                    challengeProgress: {
                        where: eq(challengeProgress.userId, userId),
                    }
                }
            }
        }
    })

    if(!data || !data.challenges) {
        return null
    }

    const normalizedChallenges = data.challenges.map((challenge) => {
        const completed = challenge.challengeProgress 
            && challenge.challengeProgress.length >0
            && challenge.challengeProgress.every((progress) => progress.completed);

        return {
            ...challenge,completed
        }
    })

    return{ ...data, challenges: normalizedChallenges}
})

export const getlessonPercentage = cache(async() => {
    const courseProgress = await getCoursesProgress();

    if(!courseProgress || !courseProgress.activeLessonId) {
        return 0;
    }

    const lesson = await getLesson(courseProgress.activeLessonId);

    if(!lesson) {
        return 0;
    }

    const completedChallenges = lesson.challenges.filter((challenge) => challenge.completed);

    const percentage = Math.round(
        (completedChallenges.length / lesson.challenges.length) * 100,
    )

    return percentage;
})

const DAY_IN_MS = 86_400_000;

export const getUserSubscriptions = cache(async () => {
    const { userId } = await auth();
    if (!userId) return null;

    const data = await db.query.userSubscription.findFirst({
        where: eq(userSubscription.userId, userId),
    });

    if (!data) return null;

    const isActive = data.razorpayCurrentPeriodEnd?.getTime()! + DAY_IN_MS > Date.now();

    return {
        ...data,
        isActive: !!isActive,
    };
});
