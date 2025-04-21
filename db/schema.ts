import { desc, relations } from "drizzle-orm";
import { boolean, integer, pgEnum, pgTable, serial, text } from "drizzle-orm/pg-core";

export const courses = pgTable("courses", {
    id: serial("id").primaryKey(),
    title: text("title").notNull(),
    imageSrc: text("image_src").notNull()
})
export const coursesRelations = relations(courses, ({ many }) => ({
    userProgress: many(userProgress),
    units: many(units),
}));

export const units = pgTable("units",{
    id:serial("id").primaryKey(),
    title : text("title").notNull(), // unit 1
    description : text("description").notNull(), // learn the basics
    courseID : integer("course_id").references(() => courses.id, {onDelete: "cascade"}).notNull(),
    order : integer("order").notNull(), 
})

export const unitsRelations = relations(units, ({ many, one }) => ({
    course: one(courses, {
        fields: [units.courseID],
        references: [courses.id],
    }),
    lessons: many(lessons),
}));

export const lessons = pgTable("lessons",{
    id: serial("id").primaryKey(),
    title : text("title").notNull(), // lesson 1
    unitID : integer("unit_id").references(() => units.id, {onDelete: "cascade"}).notNull(),
    order : integer("order").notNull(), 
})

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
    unit: one(units, {
        fields: [lessons.unitID],
        references: [units.id],
    }),
    challenges: many(challenges)
}))

export const challengesEnum = pgEnum("type",["SELECT" , "ASSIST"]);

export const challenges = pgTable("challenges",{
    id: serial("id").primaryKey(),
    lessonsID : integer("lesson_id").references(() => lessons.id, {onDelete: "cascade"}).notNull(),
    type: challengesEnum('type').notNull(),
    question : text("question").notNull(),
    order : integer("order").notNull(),
})

export const challengesRelations = relations(challenges, ({ one, many }) => ({
    lesson: one(lessons, {
        fields: [challenges.lessonsID],
        references: [lessons.id],
    }),
    challengeOptions : many(challengeOptions),
    challengeProgress : many(challengeProgress),
}))

export const challengeOptions = pgTable("challenge_options",{
    id: serial("id").primaryKey(),
    challengeId : integer("challenge_id").references(() => challenges.id, {onDelete: "cascade"}).notNull(),
    text : text("text").notNull(),
    correctOption : boolean("correct").notNull(),
    ImageSrc : text("image_src"),
    audioSrc : text("audio_src"),
})

export const challengeOptionRelations = relations(challengeOptions, ({ one }) => ({
    challenge: one(challenges, {
        fields: [challengeOptions.challengeId],
        references: [challenges.id],
    }),
}))


export const challengeProgress = pgTable("challenge_progress",{
    id: serial("id").primaryKey(),
    userId : text("user_id").notNull(),
    challengeId : integer("challenge_id").references(() => challenges.id, {onDelete: "cascade"}).notNull(),
    completed : boolean("completed").notNull().default(false),
})

export const challengeProgressRelations = relations(challengeProgress, ({ one }) => ({
    challenge: one(challenges, {
        fields: [challengeProgress.challengeId],
        references: [challenges.id],
    }),
}))

export const userProgress = pgTable("user_progress", {
    userId : text("user_id").primaryKey(),
    userName : text("user_name").notNull().default("User"),
    userImageSrc : text("user_image_src").notNull().default("/default_user.svg"),
    activeCourseId : integer("active_course_id").references(() => courses.id, {onDelete: "cascade"}),
    hearts : integer("hearts").notNull().default(5),
    points : integer("points").notNull().default(100)  
})

export const userProgressRelations = relations(userProgress, ({ one }) => ({
    activeCourse: one(courses, {
        fields: [userProgress.activeCourseId],
        references: [courses.id],
    }),
}));