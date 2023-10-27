import { authenticateUser } from '$lib/server/authenticateUser';
import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
  const requestIp = event.getClientAddress();
  event.locals.requestIp = requestIp;
  if (event.url.pathname.startsWith('/api')) {
    return await resolve(event);
  }
  const user = await authenticateUser(event);
  event.locals.user = user;

	const response = await resolve(event);
	return response;
};
