import type { RequestHandler } from './$types';
import prisma from '$lib/server/prisma';
import { error, json } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from '$lib/server/nodemailer';

export const POST: RequestHandler = async ({ request, cookies, locals }) => {
	try {
		var { email, password, answer } = await request.json();
	} catch (e) {
		throw error(400, 'Please fill in all fields');
	}
	if (!email || !password) {
		throw error(400, 'Please fill in all fields');
	}
	const user = await prisma.user.findUnique({
		where: {
			email
		}
	});
	if (!user) {
		throw error(400, 'User does not exist');
	}
	const passwordMatch = await bcrypt.compare(password, user.password);
	if (!passwordMatch) {
		await prisma.logs.create({
			data: {
				email: email,
				type: 'LOGIN',
				ip: locals.requestIp,
				success: false
			}
		});
		const attempts = await prisma.logs.count({
			where: {
				email: email,
				type: 'LOGIN',
				success: false,
				createdAt: {
					gte: new Date(new Date().getTime() - 60000 * 1)
				}
			}
		});
		if (attempts >= 5) {
			if (!user.locked) {
				await prisma.user.update({
					where: {
						email: email
					},
					data: {
						locked: true,
						lockedAt: new Date()
					}
				});
				const mail = await nodemailer.sendMail({
					from: 't0ng.k.dev@gmail.com',
					to: email,
					subject: 'Account Locked',
					html: `<p>Your account has been locked for 1 minute you can unlock your account by answering your security question.</p>`
				});
				console.log(mail);
			}
			return json(
				{
					success: false,
					hint: user.hint,
					message: `You have been locked out for 1 minute you can unlock your account by answering your security question.`
				},
				{
					status: 400
				}
			);
		} else {
			return json(
				{
					success: false,
					message: `Incorrect password ${attempts}/5 attempts`
				},
				{
					status: 400
				}
			);
		}
	}

	if (user.locked && user.lockedAt) {
		const lockedAt = new Date(user.lockedAt);
		const now = new Date();
		const diff = now.getTime() - lockedAt.getTime();
		if (!(diff < 60000 * 1)) {
			await prisma.user.update({
				where: {
					email: email
				},
				data: {
					locked: false,
					lockedAt: null
				}
			});
			user.locked = false;
			user.lockedAt = null;
		}
	}

	if (user.locked && user.answer !== answer) {
		throw error(400, 'Incorrect answer');
	}

	if (user.locked && user.answer === answer) {
		await prisma.user.update({
			where: {
				email: email
			},
			data: {
				locked: false,
				lockedAt: null
			}
		});

		await prisma.logs.deleteMany({
			where: {
				email: email,
				type: 'LOGIN',
				success: false
			}
		});
	}

	const token = jwt.sign(email, 'supersecret');
	cookies.set('token', token, {
		path: '/',
		maxAge: 60 * 60 * 24 * 7,
		sameSite: 'lax'
	});

	return json({
		success: true,
		message: 'Logged in successfully'
	});
};
