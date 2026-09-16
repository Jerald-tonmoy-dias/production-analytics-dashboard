type ErrorDetail = {
  field: string;
  issue: string;
};

export class AppError extends Error {
  readonly code: string;
  readonly details?: readonly ErrorDetail[];

  constructor(
    code: string,
    message: string,
    details?: readonly ErrorDetail[]
  ) {
    super(message);
    this.name = new.target.name;
    this.code = code;
    this.details = details;
  }
}

export class ValidationError extends AppError {
  constructor(message: string, details?: readonly ErrorDetail[]) {
    super("VALIDATION_ERROR", message, details);
  }
}

export class NotFoundError extends AppError {
  constructor(message: string) {
    super("NOT_FOUND", message);
  }
}

export class InternalError extends AppError {
  constructor(message: string) {
    super("INTERNAL_ERROR", message);
  }
}
