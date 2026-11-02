import { generateToken, verifyPassword } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { NextRequest, NextResponse } from "next/server";

export async function POST (request : NextRequest){
    try {
        const {email, password} = await request.json();
        // Validate Required Fields

        if (!email || !password) {
            return NextResponse.json({
                error : "Email and Password fields are required"
            }, {
                status : 400
                });
        }

        // Check if the email is already in use
        const userFromDb = await prisma.user.findUnique({
            where : {email},
            include : {team : true},
        });

        if (!userFromDb) {
            return NextResponse.json({
                error : "Email is not registered"
            }, {
                status : 401
            });
        }


        let isValidPassword = await verifyPassword(password, userFromDb.password);

        if(!isValidPassword){
            return NextResponse.json({
                error : "Invalid Password"
            }, {
                status : 401
            });
        }


        // Generate the JWT token
        const token = generateToken(userFromDb.id);

        // Create Response
        const response = NextResponse.json({
            user : {
                id : userFromDb.id,
                email : userFromDb.email,
                name : userFromDb.name,
                role : userFromDb.role,
                teamId : userFromDb.teamId,
                team : userFromDb.team,
                token,
            },
        })

        // Set Cookies
        response.cookies.set("token", token,{
            httpOnly:true,
            secure: process.env.NODE_ENV === "production" ? true : false,
            sameSite: "lax",
            maxAge : 60 * 60 * 24 * 30,
        })

        return response;


    } catch (error) {
        console.error("Login Failed : ", error);
        return NextResponse.json({
            error : "Internal Server Error. Something Went Wrong !"
        },{status : 500})
    }
}