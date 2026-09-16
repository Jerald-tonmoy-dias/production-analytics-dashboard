type ErrorDetail = {
  field: string;
  issue: string;
};

/** Typed failure mapped to the API error envelope in Route Handlers. */
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

/** Invalid query/path (`400 VALIDATION_ERROR`). */
export class ValidationError extends AppError {
  constructor(message: string, details?: readonly ErrorDetail[]) {
    super("VALIDATION_ERROR", message, details);
  }
}

/** Missing order (or nested customer) (`404 NOT_FOUND`). */
export class NotFoundError extends AppError {
  constructor(message: string) {
    super("NOT_FOUND", message);
  }
}

/** Corrupt dataset or unexpected failure (`500 INTERNAL_ERROR`). */
export class InternalError extends AppError {
  constructor(message: string) {
    super("INTERNAL_ERROR", message);
  }
}
