import { getLesson, getUserProgress, getUserSubscriptions } from "@/db/queries";
import { redirect } from "next/navigation";
import { Quiz } from "../quiz";

// type Props = {
//     params : {
//         lessonId : string;
//     }
// }

const LessonIdPage = async () => {
    // const lessonData = getLesson(Number(params.lessonId));
    // const userProgressData = getUserProgress();
    // const userSubscriptionData = getUserSubscriptions();

    // const [
    //     lesson,
    //     userProgress,
    //     userSubscription
    // ] = await Promise.all([
    //     lessonData,
    //     userProgressData,
    //     userSubscriptionData
    // ])

    // if(!userProgress || !lesson) {
    //     redirect("/learn")
    // }

    // const initialPercentage = lesson.challenges
    //     .filter((challenge) => challenge.completed)
    //     .length / lesson.challenges.length * 100;

    return (
        // <Quiz
        //     initialLessonId = {lesson.id}
        //     initialLessonChallenges = {lesson.challenges}
        //     initialHearts = {userProgress.hearts}
        //     initialPercentage = {initialPercentage}
        //     userSubscription = {userSubscription}
        // />
        <div>

        </div>
    )
}

export default LessonIdPage;