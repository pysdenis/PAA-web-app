import 'dotenv/config';
import connectDb from './lib/server/db';

import type { Handle } from '@sveltejs/kit';

export const handle: Handle = async ({ event, resolve }) => {
	await connectDb(); // Připojení k databázi

	return resolve(event); // Pokračování v zpracování požadavku
};
