export function getApiErrorMessage(error, fallback = "Request failed") {
  const data = error?.response?.data;
  if (!data) {
    return error?.message || fallback;
  }
  if (typeof data.error === "string") {
    return data.error;
  }
  if (typeof data.detail === "string") {
    return data.detail;
  }
  if (Array.isArray(data)) {
    return data.join(", ");
  }
  if (typeof data === "object") {
    const messages = Object.entries(data).flatMap(([field, value]) => {
      const items = Array.isArray(value) ? value : [value];
      return items.map((message) =>
        field === "non_field_errors" ? String(message) : `${field}: ${message}`
      );
    });
    if (messages.length > 0) {
      return messages.join(" ");
    }
  }
  return fallback;
}
