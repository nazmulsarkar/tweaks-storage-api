import { FileOwnerInput } from "./file-owner.input";

export class BaseFileInput {
  key: string;
  fileName: string;
  owner: FileOwnerInput;
  createdAt: string = new Date().toUTCString();
  updatedAt: string = new Date().toUTCString();
}
