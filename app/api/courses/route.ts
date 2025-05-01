import db from "@/db/drizzle"
import { NextResponse } from "next/server";
import { courses } from "@/db/schema";
import { getAdmin } from "@/lib/auth";


export const GET = async () => {

    const isAdmin = await getAdmin();
    
    if(!isAdmin) {
        return new NextResponse("You are not authorised", {status: 401})
    }
    const data = await db.query.courses.findMany();

    return NextResponse.json(data)
}

export const POST = async (req : Request) => {

    const isAdmin = await getAdmin();
    
    if(!isAdmin) {
        return new NextResponse("You are not authorised", {status: 401})
    }

    const body = await req.json();

    const data = await db.insert(courses).values({
        ...body,
    }).returning();

    return NextResponse.json(data[0])
}