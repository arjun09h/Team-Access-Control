import { getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { Role } from "@/app/types";
import { Prisma } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    try {
        const user = await getCurrentUser();
        if (!user) {
            return NextResponse.json({
                error: "You are not authorized to access user information",
            }, { status: 401 });
        }
        const searchParams = request.nextUrl.searchParams;
        const teamId = searchParams.get("teamId");
        const role = searchParams.get("role");

        // Build where claus based on user role
        const where: Prisma.UserWhereInput = {};
        if (user.role === Role.ADMIN) {
            // Admin can see all user
        } else if (user.role === Role.MANAGER) {
            // Manager can see the users in their team and cross team users but not cross team manager
            where.OR = [{ teamId: user.teamId }, { role: Role.USER }];
        } else {
            // User can see only their own team members
            where.teamId = user.teamId;
            where.role = { not: Role.ADMIN };
        }

        if (teamId) {
            where.teamId = teamId;
        }
        if (role && Object.values(Role).includes(role as Role)) {
            where.role = role as Role;
        }

        const users = await prisma.user.findMany({
            where,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                team: {
                    select: {
                        id: true,
                        name: true,
                    },
                },
                createdAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            }
        });
        return NextResponse.json({ users })

    } catch (error) {
        console.error("get users error : ", error);
        return NextResponse.json({
            error: "Internal server error. Something went Wrong !"
        }, { status: 500 });
    }
}