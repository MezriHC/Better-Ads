import NextAuth from "next-auth"
import { authOptions } from "../../../_shared"

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
