export const ERROR_CODES = [
  "VALIDATION_ERROR",
  "NOT_FOUND",
  "INTERNAL_ERROR",
] as const;

export type ErrorCode = (typeof ERROR_CODES)[number];

export type ErrorDetail = {
  field: string;
  issue: string;
};

export type ErrorEnvelope = {
  error: {
    code: ErrorCode;
    message: string;
    details?: ErrorDetail[];
  };
};

const HTTP_STATUS: Record<ErrorCode, number> = {
  VALIDATION_ERROR: 400,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
};

/** Typed failure mapped to the API error envelope in Route Handlers. */
export class AppError extends Error {
  readonly code: ErrorCode;
  readonly details?: readonly ErrorDetail[];

  constructor(
    code: ErrorCode,
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

/**
 * Narrow an unknown thrown value to {@link AppError}.
 */
export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError;
}

/**
 * Map a thrown value to the HTTP status and envelope in `docs/api-reference.md`.
 *
 * Unknown failures become `500 INTERNAL_ERROR` with a generic message (no stack).
 *
 * @param error - `AppError` subclass or anything else thrown in a Route Handler.
 */
export function toErrorResponse(error: unknown): {
  status: number;
  body: ErrorEnvelope;
} {
  if (isAppError(error)) {
    const details = error.details?.length
      ? error.details.map((detail) => ({
          field: detail.field,
          issue: detail.issue,
        }))
      : undefined;

    return {
      status: HTTP_STATUS[error.code],
      body: {
        error: {
          code: error.code,
          message: error.message,
          ...(details ? { details } : {}),
        },
      },
    };
  }

  return {
    status: HTTP_STATUS.INTERNAL_ERROR,
    body: {
      error: {
        code: "INTERNAL_ERROR",
        message: "Unexpected error.",
      },
    },
  };
}
