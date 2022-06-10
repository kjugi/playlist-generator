import { ErrorCode, type ErrorType } from "./fetchUtil";

export const isKnownError = (errObject: unknown): errObject is ErrorType => {
  return (errObject as ErrorType).error?.status !== undefined;
}

export const handleError = (err: unknown, customMessage?: string) => {
  let returnedError: ErrorType;

  if (isKnownError(err)) {
    returnedError = {
      ...err,
      error: {
        ...err.error,
        message: `${customMessage ? `${customMessage}: ` : ''}${err.error.message}`
      }
    };
  }
  else {
    returnedError = {
      error: {
        status: ErrorCode.ServerError,
        message: `Raw error message: "${JSON.stringify(err)}"`
      }
    }
  }

  return returnedError;
}
