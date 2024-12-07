import connectDB from "@/lib/mongoose";
import NotFound from "@/models/notfound.model";
import { handleError } from "@/utils/errorHandler";
import { NextRequest, NextResponse } from "next/server";
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest){
    try {
        await connectDB()

        const notFound = await NotFound.find().populate('folder account')

        return NextResponse.json({
            status: 'success',
            data: notFound
        })
    } catch (error) {
        return handleError(error)
    }
}