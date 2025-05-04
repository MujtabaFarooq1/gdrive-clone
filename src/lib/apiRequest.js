import { toast } from "sonner";

export async function apiRequest(
  url,
  options = {},
  {
    defaultErrorMessage = "Something went wrong",
    successMessage = null,
    showSuccessToast = true,
    showErrorToast = true,
  } = {}
) {
  try {
    const res = await fetch(url, options);
    const contentType = res.headers.get("content-type");

    let data;
    if (contentType && contentType.includes("application/json")) {
      data = await res.json();
    } else {
      data = await res.text();
    }

    if (!res.ok) {
      const message = typeof data === "object" ? data?.message : data;
      const errorMessage = message || defaultErrorMessage;

      throw new Error(errorMessage);
    }

    const apiSuccessMessage = data?.message || successMessage;

    if (showSuccessToast && apiSuccessMessage) {
      toast.success(apiSuccessMessage);
    }

    return data;
  } catch (error) {
    const fallbackMessage = error?.message || defaultErrorMessage;
    if (showErrorToast) toast.error(`${fallbackMessage}`);
    throw new Error(fallbackMessage);
  }
}
