import { AppError } from "./app-error";

export class UnauthorizedError extends AppError {
  constructor(message = "Not authorized") {
    super(message, 401, "UNAUTHORIZED");
  }
}
