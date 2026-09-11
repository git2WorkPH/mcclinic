import { print } from "graphql";
import type { TypedDocumentNode } from "@graphql-typed-document-node/core";
export function api(token: string, practiceId?: string) {
  return async function request<T, V>(
    document: TypedDocumentNode<T, V>,
    variables: V,
  ): Promise<T> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 20000);
    try {
      const response = await fetch("/mvp/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(practiceId ? { "x-practice-id": practiceId } : {}),
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ query: print(document), variables }),
        signal: controller.signal,
      });
      const body = (await response.json()) as {
        data?: T;
        errors?: { message: string; extensions?: { code?: string } }[];
      };
      if (!response.ok || body.errors?.length || !body.data)
        throw new Error(
          body.errors?.[0]?.message ?? "Connection unavailable. Please retry.",
        );
      return body.data;
    } catch (error) {
      if (controller.signal.aborted)
        throw new Error(
          "The request timed out. Retry to safely check the same action.",
        );
      throw error;
    } finally {
      clearTimeout(timer);
    }
  };
}
export type Api = ReturnType<typeof api>;
