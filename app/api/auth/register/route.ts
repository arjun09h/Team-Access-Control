import { generateToken, hashPassword } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { Role } from "@/app/types";
import { NextRequest, NextResponse } from "next/server";

export async function POST (request : NextRequest){
    try {
        const {name, email, password, teamCode} = await request.json();
        // Validate Required Fields

        if (!name || !email || !password) {
            return NextResponse.json({
                error : "Name Email and Password fields are required"
            }, {
                status : 400
                });
        }

        // Check if the email is already in use
        const existingUser = await prisma.user.findUnique({
            where : {email},
        });

        if (existingUser) {
            return NextResponse.json({
                error : "Email already in use"
            }, {
                status : 409
            });
        }

        let teamId : string | undefined ;
        if (teamCode){
           const team = await prisma.team.findUnique({
                where : {code : teamCode}
           })        
           if (!team){
                return NextResponse.json({
                    error : "Please Enter The Valid Team Code"
                },{
                    status : 400
                })
           }
           teamId = team.id;
        }

        let hashedPassword = await hashPassword(password);

        // Make the first user an Admin

        const userCount = await prisma.user.count();
        const role = userCount === 0 ? Role.ADMIN : Role.USER;
        const user = await prisma.user.create({
            data : {
                name,
                email,
                password : hashedPassword,
                role,
                teamId
            },
            include :{
                team : true
            }
        })

        // Generate the JWT token
        const token = generateToken(user.id);

        // Create Response
        const response = NextResponse.json({
            user : {
                id : user.id,
                email : user.email,
                name : user.name,
                role : user.role,
                teamId : user.teamId,
                team : user.team,
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
        console.error("Registration Failed");
        return NextResponse.json({
            error : "Internal Server Error. Something Went Wrong !"
        },{status : 500})
    }
}