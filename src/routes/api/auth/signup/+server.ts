import type { RequestHandler } from './$types';
import prisma from '$lib/server/prisma';
import { error, json } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';

export const POST: RequestHandler = async ({request}) => {
    try {
        var {email, password, confirmPassword, hint, answer} = await request.json();
    } catch (e) {
        throw error(400, 'Please fill in all fields');
    }
    if (!email || !password || !confirmPassword || !hint || !answer) {
        throw error(400, 'Please fill in all fields');
    }
    if (password !== confirmPassword) {
        throw error(400, 'Passwords do not match');
    }
    const exitedUser = await prisma.user.findUnique({
        where: {
            email,
        },
    });
    if (exitedUser) {
        throw error(400, 'User already exists');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await prisma.user.create({
        data: {
            email,
            password: hashedPassword,
            hint,
            answer
        },
    });
    if (user) {
        return json({
            message: 'User created successfully',
            success: true,
        });
    } else {
        throw error(500, 'User creation failed');
    }
};
