import $ from "jquery";

declare global {
  interface JQuery {
    modal(action: string): JQuery;
  }
}

export function showSuccessModal(
  message: string,
  redirect: boolean = false,
  redirectURL: string = "index.html"
): void {
  const modal = document.getElementById("successModal");
  const messageEl = document.getElementById("successMessage");

  if (modal && messageEl) {
    messageEl.textContent = message;

    $("#successModal").modal("show");

    setTimeout(() => {
      $("#successModal").modal("hide");

      if (redirect) {
        window.location.href = redirectURL;
      }
    }, 1500);
  }
}
