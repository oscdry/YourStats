import prismaClient from '../db/dbConnections.js';

export const getContactFormEntriesService = () => {
	return prismaClient.contactEntry.findMany();
};

export const deleteContactFormEntryService = (id: number) => {
	return prismaClient.contactEntry.delete({
		where: {
			id
		}
	});
};