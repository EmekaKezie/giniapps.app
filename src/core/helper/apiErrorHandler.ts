import type { IApiRes } from "@appTypes/IAap";

export const handleApiError = (res: IApiRes<any>, enqueueSnackbar: any) => {
  if (res?.status === "invalid_token") {
    // 1. Trigger the global dialog for invalid sessions
    window.dispatchEvent(
      new CustomEvent("session-expired", { detail: res?.message }),
    );
  } else {
    // 2. Trigger the snackbar for any other errors ("failed", "error", etc.)
    const errorMessage =
      res?.message || "An unexpected error occurred. Please try again.";
    enqueueSnackbar(errorMessage, {
      variant: "default",
      anchorOrigin: { horizontal: "left", vertical: "bottom" },
    });
  }
};
