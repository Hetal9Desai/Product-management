function showSuccessModal(
  message: string,
  redirect: boolean = true,
  redirectURL: string = "index.html"
): void {
  let successModalEl = document.getElementById(
    "successModal"
  ) as HTMLElement | null;

  // If the modal doesn't exist in the DOM, create and insert it
  if (!successModalEl) {
    const modalHTML = `
      <div class="modal fade" id="successModal" tabindex="-1" aria-hidden="true">
        <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content text-center">
            <div class="modal-header border-0 pb-0">
              <h5 class="modal-title w-100">Success</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div class="modal-body pt-2">
              <p id="successMessage" class="mb-0">${message}</p>
            </div>
          </div>
        </div>
      </div>`;

    document.body.insertAdjacentHTML("beforeend", modalHTML);
    successModalEl = document.getElementById(
      "successModal"
    ) as HTMLElement | null;
  } else {
    const msg = document.getElementById("successMessage") as HTMLElement | null;
    if (msg) {
      msg.textContent = message;
    } else {
      console.error("Success message element not found!");
    }
  }

  // Check if successModalEl is still null after trying to create it
  if (!successModalEl) {
    console.error("Modal element could not be found or created.");
    return;
  }

  const modalInstance = new bootstrap.Modal(successModalEl);
  modalInstance.show();

  setTimeout(() => {
    modalInstance.hide();
    if (redirect) {
      window.location.href = redirectURL;
    }
  }, 1500);
}
