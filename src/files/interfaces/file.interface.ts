import { Document } from 'mongoose';

export interface File extends Document {
  readonly key: string;
  readonly fileName: string;
  fileUrl: string;
  readonly owner: {
    id: string;
    email: string;
    displayName: string;
  };
  readonly createdAt: string;
  readonly updatedAt: string;
}
