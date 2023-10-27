import type { RequestEvent } from '@sveltejs/kit';

export const authenticateUser = async (event: RequestEvent) => {
	const { cookies, fetch } = event;
	const token = cookies.get('token');
	if (!token) {
		return null;
	}
	const response = await fetch('/api/auth/profile');

	if (!response.ok) {
		return null;
	}
	const { user } = await response.json();
	return user;
};
