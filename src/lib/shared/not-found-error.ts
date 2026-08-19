import { AppError } from "./app-error";

export class NotFoundError extends AppError {
  constructor(resource: string, id?: string | number) {
    const message = id ? `${resource} ${id} not found` : `${resource} not found`;
    super(message, 404, "NOT_FOUND");
  }
}
