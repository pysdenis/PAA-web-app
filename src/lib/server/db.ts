// src/lib/server/db.ts
import mongoose from 'mongoose';
import type { Connection } from 'mongoose';

const connectDb = async () => {
	try {
		if (mongoose.connection.readyState >= 1) return;

		const dbUri = process.env.MONGO_URI;
		if (!dbUri) {
			console.error('Není nastavena proměnná prostředí MONGO_URI');
			process.exit(1);
		}
		await mongoose.connect(dbUri, {
			dbName: 'TODO',
		});
	} catch (error) {
		console.error('Chyba při připojování k databázi MongoDB:', error);
		process.exit(1);
	}
};

export default connectDb;


// Definice schémat (Mongoose Schemas & Models):
const { Schema } = mongoose;

// Uživatelský účet
const UserSchema = new Schema(
	{
		email: { type: String, unique: true, required: true },
		passwordHash: String, // uložené zahashované heslo (bcrypt)
		role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
		googleRefreshToken: String // token pro Google API integraci (pokud uživatel propojí účet)
	},
	{ timestamps: true }
);
export const User = mongoose.models.User || mongoose.model('User', UserSchema);

// Projekt a Úkoly
const TaskSchema = new Schema(
	{
		projectId: { type: Schema.Types.ObjectId, ref: 'Project' },
		title: String,
		description: String,
		done: { type: Boolean, default: false },
		dueDate: Date
	},
	{ timestamps: true }
);
export const Task = mongoose.models.Task || mongoose.model('Task', TaskSchema);

const ProjectSchema = new Schema(
	{
		ownerId: { type: Schema.Types.ObjectId, ref: 'User' },
		name: String,
		description: String,
		tasks: [{ type: Schema.Types.ObjectId, ref: 'Task' }]
	},
	{ timestamps: true }
);
export const Project = mongoose.models.Project || mongoose.model('Project', ProjectSchema);

// Finance - záznam příjmu/výdaje
const FinanceRecordSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: 'User' },
		type: { type: String, enum: ['income', 'expense'] },
		amount: Number,
		category: String,
		date: { type: Date, default: Date.now },
		note: String
	},
	{ timestamps: true }
);
export const FinanceRecord =
	mongoose.models.FinanceRecord || mongoose.model('FinanceRecord', FinanceRecordSchema);

// Školní poznámky
const NoteSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: 'User' },
		title: String,
		content: String,
		course: String // např. předmět, ke kterému poznámka patří
	},
	{ timestamps: true }
);
export const Note = mongoose.models.Note || mongoose.model('Note', NoteSchema);

// Wiki stránky
const WikiPageSchema = new Schema(
	{
		userId: { type: Schema.Types.ObjectId, ref: 'User' },
		slug: { type: String, unique: true }, // unikátní identifikátor stránky
		title: String,
		content: String,
		revisions: [
			{
				content: String,
				timestamp: Date
			}
		]
	},
	{ timestamps: true }
);
export const WikiPage = mongoose.models.WikiPage || mongoose.model('WikiPage', WikiPageSchema);

// Příkazy (pro pracovní rozhraní)
const CommandSchema = new Schema({
	userId: { type: Schema.Types.ObjectId, ref: 'User' },
	title: String, // název příkazu
	command: String, // skutečný shell příkaz
	createdAt: { type: Date, default: Date.now }
});
export const CommandDef = mongoose.models.CommandDef || mongoose.model('CommandDef', CommandSchema);

// Audit log
const AuditLogSchema = new Schema({
	userId: { type: Schema.Types.ObjectId, ref: 'User' },
	action: String, // popis akce (např. "LOGIN", "CREATE_TASK", ...)
	details: String, // detailnější informace
	timestamp: { type: Date, default: Date.now }
});
export const AuditLog = mongoose.models.AuditLog || mongoose.model('AuditLog', AuditLogSchema);
