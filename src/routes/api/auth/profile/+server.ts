import type { RequestHandler } from './$types';
import prisma from '$lib/server/prisma';
import { error, json } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

export const GET: RequestHandler = async ({ cookies }) => {
	const token = cookies.get('token');
	if (!token) {
		throw error(401, 'Not authorized');
	}
	const getUser = jwt.verify(token, 'supersecret') as string;
    if (!getUser) {
        throw error(401, 'Not authorized');
    }
	const user = await prisma.user.findUnique({
        where: {
            email: getUser
        },
        select: {
            email: true
        }
    })
	if (!user) {
		throw error(401, 'Not authorized');
	}
	return json({
		success: true,
		user
	});
};
