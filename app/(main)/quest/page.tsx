import { FeedWrapper } from "@/components/feed-wrapper";
import { Promo } from "@/components/promo";
import { StickyWrapper } from "@/components/sticky-wrapper";
import { Progress } from "@/components/ui/progress";
import { UserProgress } from "@/components/user-progress"
import { quest } from "@/constants";
import { getUserProgress, getUserSubscriptions } from "@/db/queries"
import Image from "next/image";
import { redirect } from "next/navigation";

const QuestsPage = async () => {

    const userProgressData = getUserProgress();

    const userSubscriptionData = getUserSubscriptions();


    const [
        userProgress,
        userSubscriptions,
    ] = await Promise.all([
        userProgressData,
        userSubscriptionData,
    ])
    const isPro = !!userSubscriptions?.isActive

    if (!userProgress || !userProgress.activeCourse) {
        redirect("/courses")
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
                {!isPro && (
                    <Promo />
                )}
            </StickyWrapper>
            <FeedWrapper>
                <div className="w-full flex flex-col items-center">
                    <Image
                        src="/quest.svg"
                        alt="Quests"
                        height={90}
                        width={90}
                    />

                    <h1 className="text-center font-bold text-neutral-800 text-2xl my-6">
                        Quests
                    </h1>

                    <p className="text-muted-foreground text-center text-lg mb-6">
                        Complete quest by earning points
                    </p>

                    <ul className="w-full">
                        {quest.map((quest) => {
                            const progress = (userProgress.points / quest.value) * 100;
                            return (
                                <div
                                    className="flex items-center w-full p-4 gap-x-4 border-t-2"
                                    key={quest.title}
                                >
                                    <Image
                                        src="/points.svg"
                                        alt="point"
                                        height={60}
                                        width={60}
                                    />

                                    <div className="flex flex-col gap-y-2 w-full">
                                        <p className="text-neutral-700 text-xl font-bold">
                                            {quest.title}
                                        </p>
                                        <Progress value={progress} className="h-3" />
                                    </div>

                                </div>
                            )
                        })}
                    </ul>

                </div>
            </FeedWrapper>
        </div>
    )
}

export default QuestsPage