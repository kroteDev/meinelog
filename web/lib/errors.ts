import { ApiError } from "@/infrastructure/api/httpClient";

export function toUserMessage(error: unknown): string {
  if (error instanceof ApiError) {
    if (error.status === 401) return "Your session expired. Please sign in again.";
    if (error.status === 404) return "Not found. It may have been deleted.";
    if (error.status === 422) {
      return error.messages.length > 0
        ? error.messages.join("; ")
        : "Couldn't save. Please check the fields.";
    }
    return `Request failed (${error.status}). Please try again.`;
  }
  if (error instanceof TypeError) {
    return "Couldn't reach the server. Check your connection.";
  }
  return "Something went wrong. Please try again.";
}
