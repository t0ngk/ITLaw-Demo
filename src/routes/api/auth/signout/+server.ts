import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async ({ cookies }) => {
	cookies.set('token', '', {
		sameSite: 'lax',
		path: '/',
		expires: new Date(0)
	});
	return json({
		success: true
	});
};
