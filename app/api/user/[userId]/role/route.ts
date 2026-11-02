import { checkUserPermission, getCurrentUser } from "@/app/lib/auth";
import { prisma } from "@/app/lib/db";
import { Role } from "@/app/types";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
    request: NextRequest,
    context: { params: Promise<{ userId: string }> }
) {
    try {

        const { userId } = await context.params;
        const currentUser = await getCurrentUser();

        if (!currentUser || !checkUserPermission(currentUser, Role.ADMIN)) {
            return NextResponse.json({
                error: "You are not authorized to perform this action"
            }, {
                status: 401
            });
        }

        // prevent user from changing their own role

        if (userId === currentUser.id) {
            return NextResponse.json({
                error: "You can not change your own role"
            }, {
                status: 401
            });
        }


        const { role } = await request.json();

        const validateRoles = [Role.MANAGER, Role.USER];

        if (!validateRoles.includes(role)) {
            return NextResponse.json({
                error: "You Cannot Change Your Own Role"
            }, {
                status: 404
            })
        }


        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                role,
            },
            include: { team: true },
        });
        const { password, ...safeUser } = updatedUser;

        return NextResponse.json({
            user: safeUser,
            message: `User Role Updated To ${role} Successfully`
        }, {
            status: 200

        })

    } catch (error) {
        console.error("Role Assignment Error : ", error);
        if (error instanceof Error && error.message.includes("Record to update not found")) {
            return NextResponse.json({
                error: "User not found"
            }, {
                status: 404
            })

        };
        return NextResponse.json({
            error: "Internal Server Error. Something Went Wrong"
        }, {
            status: 500
        });
    };


}