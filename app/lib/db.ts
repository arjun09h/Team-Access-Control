import { PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

// Database Helper Function 

export async function checkDatabaseConnection (): Promise<boolean> {
    try {
        await prisma.$queryRaw`SELECT 1`;
        return true;
        
    } catch (error) {
        console.error(`Database Connection Failed : ${error}`);
        return false;
    }
}
