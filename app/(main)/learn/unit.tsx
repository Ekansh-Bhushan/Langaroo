import { lessons, units } from "@/db/schema";
import { UnitBanner } from "./unitbanner";
import { LessonButton } from "./lesson-button";

type Props = {
    id : number;
    order : number;
    title : string;
    description : string;
    lessons : (typeof lessons.$inferSelect & {
        complete: boolean;
    })[];
    activeLesson: typeof lessons.$inferSelect & {
        unit : typeof units.$inferSelect;
    } | undefined;
    activeLessonPercentage: number;
}

export const Unit = ({
    id,
    order,
    title,
    description,
    lessons,
    activeLesson,
    activeLessonPercentage,
} : Props) => {
    return (
        <>
            <UnitBanner
                title={title}
                description={description}
            />
            <div className="flex items-center flex-col relative">
                {lessons.map((lesson, index) =>{
                    const isCurrent = lesson.id === activeLesson?.id;
                    const isLocked = !lesson.complete && !isCurrent;

                    return(
                        <LessonButton
                            key={lesson.id}
                            id={lesson.id}
                            index={index}
                            totalCount={lessons.length - 1}
                            locked={isLocked}
                            current={isCurrent}
                            percentage={activeLessonPercentage}
                        />
                    )
                })} 
            </div>
        </>
    )
}