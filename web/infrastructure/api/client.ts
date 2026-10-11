import { createBrowserApiClient, type ApiRequestFn } from "./httpClient";
import { HttpAuthRepository } from "./repositories/HttpAuthRepository";
import { HttpCommentRepository } from "./repositories/HttpCommentRepository";
import { HttpProjectRepository } from "./repositories/HttpProjectRepository";
import { HttpTaskRepository } from "./repositories/HttpTaskRepository";
import type { IAuthRepository } from "../../domain/repositories/IAuthRepository";
import type { ICommentRepository } from "../../domain/repositories/ICommentRepository";
import type { IProjectRepository } from "../../domain/repositories/IProjectRepository";
import type { ITaskRepository } from "../../domain/repositories/ITaskRepository";
import { localStorageTokenStore, type TokenStore } from "../auth/tokenStore";

let browserClient: ApiRequestFn | null = null;
let tokenStore: TokenStore = localStorageTokenStore;

export function getBrowserClient(): ApiRequestFn {
  if (!browserClient) browserClient = createBrowserApiClient();
  return browserClient;
}

export function getTokenStore(): TokenStore {
  return tokenStore;
}

/** Test seam. Repositories read the store lazily, so swapping affects them too. */
export function setTokenStore(store: TokenStore): void {
  tokenStore = store;
}

function currentToken(): string | null {
  return getTokenStore().getToken();
}

export function getProjectRepository(): IProjectRepository {
  return new HttpProjectRepository(getBrowserClient(), currentToken);
}

export function getTaskRepository(): ITaskRepository {
  return new HttpTaskRepository(getBrowserClient(), currentToken);
}

export function getCommentRepository(): ICommentRepository {
  return new HttpCommentRepository(getBrowserClient(), currentToken);
}

export function getAuthRepository(): IAuthRepository {
  return new HttpAuthRepository(getBrowserClient());
}
