import { FeedWrapper } from "@/components/feed-wrapper";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { Header } from "./header";
import { UserProgress } from "@/components/user-progress";
import { getCoursesProgress, getlessonPercentage, getUnits, getUserProgress, getUserSubscriptions } from "@/db/queries";
import { redirect } from "next/navigation";
import { Unit } from "./unit";

const Learn = async () => {
    const userProgressData = getUserProgress();
    const courseProgressData = getCoursesProgress();
    const lessonPercentageData = getlessonPercentage();
    const unitsData = getUnits();
    const userSubscriptionData = getUserSubscriptions();

    const [
        userProgress,
        units,
        courseProgress,
        lesssonPercentage,
        userSubscription,
    ] = await Promise.all([
        userProgressData,
        unitsData,
        courseProgressData,
        lessonPercentageData,
        userSubscriptionData
    ]);

    const isPro = !!userSubscription?.isActive 

    if(!userProgress || !userProgress.activeCourse) {
        redirect("/courses");
    }
 
    if(!courseProgress) {
        redirect("/courses");
    }
    return (
        <div className="flex flex-row-reverse gap-[48px] px-6">
            <StickyWrapper>
                <UserProgress
                    activeCourse={userProgress.activeCourse} 
                    heart={userProgress.hearts} 
                    points={userProgress.points} 
                    haveActiveSubscription={isPro} 
                />
            </StickyWrapper>
            <FeedWrapper>
                <Header title={userProgress.activeCourse.title}/>
                {units.map((unit) => (
                    <div key={unit.id} className="mb-10">
                        <Unit
                            id = {unit.id}
                            order = {unit.order}
                            description = {unit.description}
                            lessons = {unit.lessons}
                            title = {unit.title}
                            activeLesson = {courseProgress.activeLesson}
                            activeLessonPercentage = {lesssonPercentage}
                        />
                    </div>
                ))}
            </FeedWrapper>
        </div>
    )
}
export default Learn;