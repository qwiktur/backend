export interface ErrorResponse {
    error: Error;
    error_description: string;
}

export type Error =
      'server_error'
    | 'not_found'
    | 'forbidden';
