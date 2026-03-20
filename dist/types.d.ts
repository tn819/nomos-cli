export type HttpMethod = "get" | "post" | "put" | "patch" | "delete";
export type OperationSecurity = "bearer" | "basic" | "none";
export interface OperationDefinition {
    key: string;
    method: HttpMethod;
    path: string;
    summary: string;
    tags: string[];
    security: OperationSecurity[];
    specVersion: string;
}
export interface CallInput {
    path?: Record<string, string | number>;
    query?: Record<string, string | number | boolean | Array<string | number | boolean> | null | undefined>;
    body?: unknown;
    headers?: Record<string, string>;
    auth?: OperationSecurity;
}
export interface NomosSdkOptions {
    baseUrl?: string;
    specVersion?: string;
    bearerToken?: string;
    basicAuth?: {
        username: string;
        password: string;
    };
    defaultHeaders?: Record<string, string>;
}
