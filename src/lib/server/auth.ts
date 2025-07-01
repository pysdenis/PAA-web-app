// src/lib/server/auth.ts
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { User, AuditLog } from '$lib/server/db';  // import Mongoose modelů

const JWT_SECRET = process.env.JWT_SECRET || 'default_secret_key';

export async function hashPassword(password: string): Promise<string> {
	const saltRounds = 12;
	return await bcrypt.hash(password, saltRounds);
}

export async function verifyPassword(password: string, hash: string): Promise<boolean> {
	return await bcrypt.compare(password, hash);
}

export function createJwtToken(user: any): string {
	const payload = { sub: user._id, role: user.role };
	return jwt.sign(payload, JWT_SECRET, { expiresIn: '3600min' });
}

export function verifyJwt(token: string): any | null {
	try {
		return jwt.verify(token, JWT_SECRET);
	} catch (err) {
		return null;
	}
}
