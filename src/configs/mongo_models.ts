import mongoose from "./db.js";

const { Schema } = mongoose;

export const User = mongoose.model(
	"User",
	new Schema({
		name: { type: String, required: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		teamId: {
			type: Schema.Types.Mixed,
			ref: "Team",
			default: null,
		},
		subscription: {
			type: String,
			default: "free",
		},
	}),
);

export const Admin = mongoose.model(
	"Admin",
	new Schema({
		userId: {
			type: Schema.Types.ObjectId,
			ref: "User",
		},
	}),
);

export const Team = mongoose.model(
	"Team",
	new Schema({
		name: { type: String, required: true, unique: true },
		leaderId: { type: Schema.Types.ObjectId, ref: "User", required: true },
	}),
);

export const Area = mongoose.model(
	"Area",
	new Schema({
		name: { type: String, required: true },
		description: { type: String, required: true },
		weathered: { type: Boolean, required: true, default: false },
		latitude: { type: Number, required: true },
		longitude: { type: Number, required: true },
		quantityBoxes: { type: Number, required: true, default: 0 },
		teamId: { type: Schema.Types.ObjectId, ref: "Team", required: true },
	}).index({ name: 1, teamId: 1 }, { unique: true }),
);

// export const Box = mongoose.model(
// 	"Box",
// 	new Schema({
// 		identifier: { type: String, required: true },
// 		status: { type: Boolean, required: true, default: false },
// 		areaId: { type: Schema.Types.ObjectId, ref: "Area", required: true },
// 	}).index({ identifier: 1, areaId: 1 }, { unique: true }),
// );

export const Production = mongoose.model(
	"Production",
	new Schema({
		date: { type: Date, default: Date.now, required: true },
		amount: { type: Number, required: true },
		teamId: { type: Schema.Types.ObjectId, ref: "Team", required: true },
		areaId: { type: Schema.Types.ObjectId, ref: "Area", required: true },
	}),
);

export const Sale = mongoose.model(
	"Sale",
	new Schema({
		date: { type: Date, default: Date.now, required: true },
		amount: { type: Number, required: true },
		buyer: { type: String, required: true },
		salePrice: { type: Number, required: true },
		teamId: { type: Schema.Types.ObjectId, ref: "Team", required: true },
	}),
);

export const Vehicle = mongoose.model(
	"Vehicle",
	new Schema({
		model: { type: String, required: true },
		availability: { type: String, required: true },
		teamId: { type: Schema.Types.ObjectId, ref: "Team", required: true },
	}),
);
