import prismaClient from "../db/dbConnections.js";


export const getUserById = async (id: number) => {
    return prismaClient.user.findUnique({
        where: {
            id: id
        }
    });
};