"use client"

import { challengeOptions, challenges, userSubscription } from "@/db/schema"
import { useState, useTransition } from "react";
import Confetti from "react-confetti";
import { Header } from "./hearder";
import { QuesstionBubble } from "./question-bubble";
import { Challenge } from "./challenge";
import { Footer } from "./footer";
import { upsertChallengeProgress } from "@/actions/challenge-progress";
import { toast } from "sonner";
import { reduceHearts } from "@/actions/user-progress";
import { useAudio, useWindowSize, useMount } from "react-use";
import Image from "next/image";
import { ResultCard } from "./result-card";
import { useRouter } from "next/navigation";
import { useHeartModal } from "@/store/use-heart-modal";
import { usePracticeModal } from "@/store/use-practice-modal ";

type Props = {
    initialPercentage: number;
    initialHearts : number;
    initialLessonId : number;
    initialLessonChallenges: (typeof challenges.$inferSelect & {
        completed: boolean;
        challengeOptions: typeof challengeOptions.$inferSelect[];
    })[];
    userSubscription : typeof userSubscription.$inferSelect & {
        isActive : boolean
    } | null;
}

export const Quiz = ({
    initialPercentage,
    initialHearts,
    initialLessonId,
    initialLessonChallenges,
    userSubscription
} : Props) => {

    const { open: openHeartsModal } = useHeartModal(); 
    const { open: openPracticeModal } = usePracticeModal(); 

    useMount(() => {
        if(initialPercentage === 100) {
            openPracticeModal();

        }
    })

    const router = useRouter();
    const { width, height } = useWindowSize();
    const [
        correctAudio,
        _c,
        correctControls,
    ] = useAudio({src:"/correct.mp3"})

    const [
        wrongAudio,
        _i,
        wrongControls,
    ] = useAudio({src:"/wrong.mp3"})

    const [
        finishAudio
    ] = useAudio({src:"/finish.mp3", autoPlay: true})

    const [pending, startTransition] = useTransition();

    const [hearts, setHearts] = useState(initialHearts);
    const [percentage, setPercentage] = useState(() => {
        return initialPercentage===100 ? 0 : initialPercentage
    });
    const [challenges] = useState(initialLessonChallenges);
    const [lessonId] = useState(initialLessonId);
    const [activeIndex, setActiveIndex] = useState(() => {
        const uncompletedIndex = challenges.findIndex((challenge) => !challenge.completed)
        return uncompletedIndex === -1 ? 0 : uncompletedIndex;
    });
    const [selectedOption, setSelectedOption] = useState<number>();
    const [status, setStatus] = useState<"correct" | "wrong" | "none">("none");
    const challenge = challenges[activeIndex];
    const options = challenge?.challengeOptions ?? [];

    const onNext = () => {
        setActiveIndex((current) => current + 1)
    }

    const onSelect = (id:number) => {
        if(status !== "none") return;
        setSelectedOption(id);
    }

    const onContinue = () => {
        if(!selectedOption) return;

        if(status === "wrong") {
            setStatus("none");
            setSelectedOption(undefined);
            return;
        }
        if(status === "correct") {
            onNext();
            setStatus("none");
            setSelectedOption(undefined);
            return;
        }

        const correctOption = options.find((option) => option.correctOption)

        if(!correctOption){
            return;
        }
        if(correctOption && correctOption.id === selectedOption) {
            startTransition(() => {
                upsertChallengeProgress(challenge.id)
                    .then((response) => {
                        if(response?.error === "no hearts left"){
                            openHeartsModal();
                            return;
                        }

                        correctControls.play();
                        setStatus("correct");
                        setPercentage((prev) => prev + 100 / challenges.length);

                        if(initialPercentage === 100) {
                            setHearts((prev) => Math.min(prev + 1, 5))
                        }
                    })
                    .catch(() => toast.error("Something went wrong"))
            })
        } else {
            startTransition(() => {
                reduceHearts(challenge.id)
                    .then((response) => {
                        if(response?.error === "no hearts left") {
                            openHeartsModal();
                            return;
                        }
                        wrongControls.play();
                        setStatus("wrong");

                        if(!response?.error){
                            setHearts((prev) => Math.max(prev - 1, 0));
                        }
                    })
                    .catch(() => toast.error("Something went wrong"));
            })
        }
    }

    if(!challenge) {
        return(
            <>
            {finishAudio}
            <Confetti
                width={width}
                height={height}
                recycle={false}
                numberOfPieces={500}
                tweenDuration={10000}

            />
            <div className="flex flex-col gap-y-4 lg:gap-y-8 max-w-lg mx-auto text-center items-center justify-center h-full">
                <Image
                    src = "/mascot.svg"
                    alt="finish"
                    className="hidden lg:block"
                    height={100}
                    width={100}
                />

<Image
                    src = "/mascot.svg"
                    alt="finish"
                    className="block lg:hidden"
                    height={50}
                    width={50}
                />
                <h1 className="text-xl lg:text-3xl font-bold text-neutral-700">
                    Great Job ! <br/> You have completed the lesson
                </h1>

                <div className="flex items-center gap-x-4 w-full">
                    <ResultCard
                        value={challenges.length * 10}
                        variant="points"
                    />

<ResultCard
                        value={hearts}
                        variant="hearts"
                    />
                </div>
            </div>
            <Footer
                lesssonId={lessonId}
                status="completed"
                onCheck={() => router.push("/learn")}
            />
            </>
        )
    }

    const title = challenge.type === "ASSIST" 
    ? "Select the correct meaning"
    : challenge.question;

    return(
        <>
        {correctAudio}
        {wrongAudio}
        <Header
            hearts = {hearts}
            percentage = {percentage}
            haveActiveSubscription = {!!userSubscription?.isActive}
            />
        <div className="flex-1">
            <div className="h-full flex items-center justify-center">
                <div className="lg:min-h-[350px] lg:w-[600px] w-full px-6 lg:px-0 flex flex-col gap-y-12">
                    <h1 className="text-lg lg:text-3xl text-center lg:text-start font-bold text-neutral-700 ">
                        {title}
                    </h1>

                    <div>
                        {challenge.type === "ASSIST" && (
                            <QuesstionBubble question = {challenge.question} />
                        )}
                        <Challenge
                            options={options}
                            onSelect={onSelect}
                            status={status}
                            selectedOption={selectedOption}
                            disabled={pending}
                            type={challenge.type}
                        />
                    </div>
                </div>
            </div>
        </div>
        <Footer
            disabled={pending || !selectedOption}
            status={status}
            onCheck={onContinue}
        />
        </>
    )
}