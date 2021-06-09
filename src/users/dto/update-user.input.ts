import { BaseUserInput } from "./base-user.input";

export class UpdateUserInput extends BaseUserInput {
  updatedAt: string = new Date().toUTCString();
}
