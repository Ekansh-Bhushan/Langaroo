import { auth } from "@clerk/nextjs/server"

const allowedIds = [
    "user_2vwlbtAWCs2KxCCz0IZ5bJRlgwW",
]

export const getAdmin = async () => {
    const { userId } = await auth();
    if(!userId) return false
    return allowedIds.indexOf(userId) !== -1;
}