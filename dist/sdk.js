import { getLatestVersion, getOperations } from "./overview.js";
export class NomosSDK {
    baseUrl;
    bearerToken;
    basicAuth;
    defaultHeaders;
    operationsByKey;
    constructor(options = {}) {
        const version = options.specVersion ?? getLatestVersion();
        const operations = getOperations(version);
        this.baseUrl = options.baseUrl ?? "https://api.nomos.energy";
        this.bearerToken = options.bearerToken;
        this.basicAuth = options.basicAuth;
        this.defaultHeaders = options.defaultHeaders ?? {};
        this.operationsByKey = new Map(operations.map((op) => [op.key, op]));
    }
    listOperations() {
        return [...this.operationsByKey.values()].sort((a, b) => a.key.localeCompare(b.key));
    }
    getOperation(key) {
        const op = this.operationsByKey.get(key);
        if (!op) {
            throw new Error(`Unknown operation key: ${key}`);
        }
        return op;
    }
    async call(key, input = {}) {
        const operation = this.getOperation(key);
        const url = new URL(this.renderPath(operation.path, input.path), this.baseUrl);
        if (input.query) {
            for (const [k, v] of Object.entries(input.query)) {
                if (v == null)
                    continue;
                if (Array.isArray(v)) {
                    for (const item of v) {
                        url.searchParams.append(k, String(item));
                    }
                }
                else {
                    url.searchParams.set(k, String(v));
                }
            }
        }
        const headers = new Headers({
            Accept: "application/json",
            ...this.defaultHeaders,
            ...(input.headers ?? {}),
        });
        const auth = input.auth ?? this.inferAuth(operation.security);
        if (auth === "bearer") {
            if (!this.bearerToken) {
                throw new Error(`Operation ${operation.key} requires bearer auth, but no bearerToken was configured`);
            }
            headers.set("Authorization", `Bearer ${this.bearerToken}`);
        }
        if (auth === "basic") {
            if (!this.basicAuth) {
                throw new Error(`Operation ${operation.key} requires basic auth, but no basicAuth was configured`);
            }
            const encoded = Buffer.from(`${this.basicAuth.username}:${this.basicAuth.password}`).toString("base64");
            headers.set("Authorization", `Basic ${encoded}`);
        }
        let body;
        if (input.body !== undefined) {
            headers.set("Content-Type", "application/json");
            body = JSON.stringify(input.body);
        }
        const response = await fetch(url, {
            method: operation.method.toUpperCase(),
            headers,
            body,
        });
        const contentType = response.headers.get("content-type") ?? "";
        let data;
        if (contentType.includes("application/json")) {
            data = await response.json();
        }
        else if (contentType.includes("application/pdf")) {
            data = Buffer.from(await response.arrayBuffer());
        }
        else {
            data = await response.text();
        }
        return {
            status: response.status,
            headers: response.headers,
            data,
        };
    }
    renderPath(pathTemplate, params = {}) {
        return pathTemplate.replace(/\{([^}]+)\}/g, (_, paramName) => {
            const value = params[paramName];
            if (value === undefined) {
                throw new Error(`Missing required path parameter: ${paramName}`);
            }
            return encodeURIComponent(String(value));
        });
    }
    inferAuth(security) {
        if (security.includes("bearer") && this.bearerToken)
            return "bearer";
        if (security.includes("basic") && this.basicAuth)
            return "basic";
        if (security.includes("none"))
            return "none";
        if (security.includes("bearer"))
            return "bearer";
        if (security.includes("basic"))
            return "basic";
        return "none";
    }
}
