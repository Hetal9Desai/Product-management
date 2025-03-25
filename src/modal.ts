export function showSuccessModal(
  message: string,
  redirect: boolean = false,
  redirectURL: string = "index.html"
): void {
  const modal = document.getElementById("successModal");
  const messageEl = document.getElementById("successMessage");

  if (modal && messageEl) {
    messageEl.textContent = message;

    // @ts-ignore: Assuming jQuery + Bootstrap modal is available globally
    $("#successModal").modal("show");

    setTimeout(() => {
      // @ts-ignore
      $("#successModal").modal("hide");
      if (redirect) {
        window.location.href = redirectURL;
      }
    }, 1500);
  }
}
