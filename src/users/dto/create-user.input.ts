import { BaseUserInput } from "./base-user.input";

export class CreateUserInput extends BaseUserInput {
  createdAt: string = new Date().toUTCString();
  updatedAt: string = new Date().toUTCString();
}
