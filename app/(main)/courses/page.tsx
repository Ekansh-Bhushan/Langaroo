import { getCourses, getUserProgress } from "@/db/queries";
import { List } from "./list";
import { userProgress } from "@/db/schema";

const CoursePage = async () => {
    const courses = await getCourses();
    const userProgress = await getUserProgress();
    // const [
    //     courses,
    //     activeCourseId
    // ] = await Promise.all([
    //     courses,
    //     userProgress,
    // ]);

    return (
        <div className="h-full max-w-[912px] px-3 max-auto">
            <h1 className="text-2xl font-bold text-neutral-700">

            Language Courses
            </h1>
            <List
                courses = {courses}
                activeCourseId={userProgress?.activeCourseId}
            />
        </div>
    )
}

export default CoursePage;