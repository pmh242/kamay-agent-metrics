import http, { type IncomingMessage, type ServerResponse } from "node:http";

import { DIAGNOSTICS_UI_HTML } from "./diagnosticsUi.js";
import type { MetricsService } from "./service.js";

export interface ListenAddress {
  host: "127.0.0.1";
  port: number;
}

export interface MetricsHttpServer {
  listen: (port: number) => Promise<ListenAddress>;
  close: () => Promise<void>;
}

export function createMetricsHttpServer(service: MetricsService): MetricsHttpServer {
  const server = http.createServer((request: IncomingMessage, response: ServerResponse) => {
    const url = new URL(request.url ?? "/", "http://127.0.0.1");

    if (url.pathname === "/favicon.ico") {
      response.statusCode = 204;
      response.end();
      return;
    }

    if (url.pathname === "/diagnostics") {
      if (request.method !== "GET") {
        response.setHeader("allow", "GET");
        writeJson(response, 405, { error: "method_not_allowed" });
        return;
      }
      writeHtml(response, 200, DIAGNOSTICS_UI_HTML);
      return;
    }

    if (url.pathname !== "/metrics/current") {
      writeJson(response, 404, { error: "not_found" });
      return;
    }

    if (request.method !== "GET") {
      response.setHeader("allow", "GET");
      writeJson(response, 405, { error: "method_not_allowed" });
      return;
    }

    writeJson(response, 200, service.getCurrent());
  });

  return {
    listen: (port: number) => new Promise((resolve, reject) => {
      server.once("error", reject);
      server.listen(port, "127.0.0.1", () => {
        server.off("error", reject);
        const address = server.address();
        if (address === null || typeof address === "string") {
          reject(new Error("Unable to resolve metrics server address."));
          return;
        }
        resolve({ host: "127.0.0.1", port: address.port });
      });
    }),
    close: () => new Promise((resolve, reject) => {
      if (!server.listening) {
        resolve();
        return;
      }
      server.close((error?: Error) => {
        if (error !== undefined) {
          reject(error);
          return;
        }
        resolve();
      });
    })
  };
}

function writeJson(response: ServerResponse, statusCode: number, body: unknown): void {
  response.statusCode = statusCode;
  response.setHeader("content-type", "application/json; charset=utf-8");
  response.end(JSON.stringify(body));
}

function writeHtml(response: ServerResponse, statusCode: number, body: string): void {
  response.statusCode = statusCode;
  response.setHeader("content-type", "text/html; charset=utf-8");
  response.end(body);
}
