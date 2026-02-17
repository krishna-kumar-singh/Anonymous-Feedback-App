import dbConnect from "@/lib/db/dbConnect"
import UserModel from "@/model/user.model"
import { ApiResponse } from "@/types/ApiResponse"
import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from "next/server"
export async function POST(request:NextRequest):Promise<NextResponse<ApiResponse>>{
    await dbConnect()
    try {
        const {username,email,password} =await request.json()

        // finding a user which exist
        const isUserExist= await UserModel.findOne({$or:[{email},{username}]})

        if(isUserExist){
            return NextResponse.json<ApiResponse>(
                {
                    success:false,
                    message:"User already exist with these email or username"
                },
                {status:200}
            )
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword=await bcrypt.hash(password,salt)

        const newUser=new UserModel({
            username,
            password:hashedPassword,
            email,
            messages:[],
        })
        
        await newUser.save()
        
        return NextResponse.json<ApiResponse>(
            {
                success:true,
                message:"User registered successfully. Please sign in."
            },
            {status:200}
        )
        
    } catch (error) {
        console.error("error registering user", error)
        return NextResponse.json<ApiResponse>(
            {
                success:false,
                message:"failed in signup"
            },
            {status:500}
        )
    }
}