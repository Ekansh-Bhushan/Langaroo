import db from "@/db/drizzle"
import { courses } from "@/db/schema";
import { getAdmin } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

export const GET = async (
    req: Request,
    { params }: { params: { courseId: number } },

) => {

    const isAdmin = await getAdmin();

    if (!isAdmin) {
        return new NextResponse("You are not authorised", { status: 401 })
    }
    const data = await db.query.courses.findFirst({
        where: eq(courses.id, params.courseId)
    })

    return NextResponse.json(data)
}


export const PUT = async (
    req: Request,
    { params }: { params: { courseId: number } },

) => {

    const isAdmin = await getAdmin();

    if (!isAdmin) {
        return new NextResponse("You are not authorised", { status: 401 })
    }

    const body = await req.json();
    const data = await db.update(courses).set({
        ...body,
    }).where(eq(courses.id, params.courseId)).returning()

    return NextResponse.json(data)
}

export const DELETE = async (
    req: Request,
    { params }: { params: { courseId: number } },

) => {

    const isAdmin = await getAdmin();

    if (!isAdmin) {
        return new NextResponse("You are not authorised", { status: 401 })
    }
    const data = await db.delete(courses).where(eq(courses.id, params.courseId)).returning();

    return NextResponse.json(data)
}