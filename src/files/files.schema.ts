import * as mongoose from 'mongoose';

export const FilesSchema = new mongoose.Schema({
    key: String,
    fileUrl: String,
    owner: {
        id: String,
        email: String,
        displayName: String,
    },
    displayName: String,
    createdAt: String,
    updatedAt: String
});