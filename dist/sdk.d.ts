import type { CallInput, NomosSdkOptions, OperationDefinition } from "./types.js";
export declare class NomosSDK {
    private readonly baseUrl;
    private readonly bearerToken?;
    private readonly basicAuth?;
    private readonly defaultHeaders;
    private readonly operationsByKey;
    constructor(options?: NomosSdkOptions);
    listOperations(): OperationDefinition[];
    getOperation(key: string): OperationDefinition;
    call(key: string, input?: CallInput): Promise<{
        status: number;
        headers: Headers;
        data: unknown;
    }>;
    private renderPath;
    private inferAuth;
}
