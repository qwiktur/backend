import { Error } from 'mongoose';

export interface APIError {
    error: ErrorType;
    error_description: string;
}

export interface APIErrorResponse {
    errors: APIError[];
}

export const formatErrors = (...errors: APIError[]): APIErrorResponse => {
    return { errors };
}

export const formatServerError = (): APIErrorResponse => {
    return formatErrors({
        error: 'server_error',
        error_description: 'Internal server error'
    });
}

export const translateMongooseValidationError = (validationError: Error.ValidationError): APIError[] => {
    const translatedErrors: APIError[] = [];
    for (const field of Object.keys(validationError.errors)) {
        const subError = validationError.errors[field];
        translatedErrors.push({
            error: 'validation_failed',
            error_description: subError.message
        });
    }
    return translatedErrors;
}

export type ErrorType =
      'server_error'
    | 'not_found'
    | 'forbidden'
    | 'validation_failed';
