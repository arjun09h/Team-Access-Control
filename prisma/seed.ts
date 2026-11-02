import { hashPassword } from "@/app/lib/auth";
import { Role } from "@/app/types";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
async function main() {
    console.log("Starting Database seed....");
    
    // Create Teams
    const teams = await Promise.all([
        prisma.team.create({
            data:{
                name:"Engineering",
                description:"Engineering Team",
                code:"Eng-2026",
            },
        }),
        prisma.team.create({
            data:{
                name:"Marketing",
                description:"Marketing Team",
                code:"Mkt-2026",
            },
        }),
        prisma.team.create({
            data:{
                name:"Sales",
                description:"Sales Team",
                code:"Sales-2026",
            }
        })
    ])
    
    // Sample Users
    const sampleUsers = [
        {
            name:"John Doe",
            email:"john.doe@example.com",
            password:"password123",
            team:teams[0],
            role:Role.MANAGER,
        },
        {
            name:"John Developer",
            email:"john.dev@example.com",
            password:"123456789",
            team:teams[0],
            role:Role.USER,
        },
        {
            name:"Jane Designer",
            email:"jane.des@example.com",
            password:"00000000",
            team:teams[1],
            role:Role.MANAGER,
        },
        {
            name:"Bob Marketer",
            email:"bob.mar@example.com",
            password:"12345678",
            team:teams[1],
            role:Role.USER,
        },
        {
            name:"Alice Sales",
            email:"alice.sls@example.com",
            password:"11112222",
            team:teams[2],
            role:Role.MANAGER,
        },
    ]

    for (const userData of sampleUsers){
        await prisma.user.create({
            data:{
                email:userData.email,
                name:userData.name,
                password:await hashPassword(userData.password),
                role:userData.role,
                teamId:userData.team.id,
            },

        });
    };

    console.log("Data Seeded Successfully");
    

}
main()
.catch((e)=>{
    console.error("Seeding Failed : ", e)
    process.exit(1)
})
.finally(async ()=>{
    await prisma.$disconnect()
})