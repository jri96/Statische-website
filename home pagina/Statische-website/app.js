document.addEventListener("DOMContentLoaded", function () {
    // ------------ Vraagformulier ------------
    const form = document.getElementById("vraag-formulier");
    const message = document.getElementById("form-bericht");

    if (form && message) {
        form.addEventListener("submit", function (e) {
            e.preventDefault();
            message.textContent = "Het vraagformulier is verzonden. Bedankt voor je vraag!";
            form.reset();
        });
    }

    // ------------ Galerij / Media ------------
    const galleryImages = document.querySelectorAll(".gallery-item img");
    const modal = document.getElementById("image-modal");

    if (galleryImages.length > 0 && modal) {
        const modalImg = document.getElementById("modal-image");
        const modalCaption = document.getElementById("modal-caption");
        const closeBtn = document.querySelector(".modal-close");

        galleryImages.forEach(img => {
            // Klik = vergroten
            img.addEventListener("click", () => {
                modal.style.display = "block";
                modalImg.src = img.src;
                modalCaption.textContent = img.dataset.title || img.alt;
            });

            // Als afbeelding niet geladen wordt
            img.addEventListener("error", () => {
                img.src = "img/placeholder.png";
                img.alt = "Afbeelding niet beschikbaar";

                const caption = img.closest(".gallery-item").querySelector("figcaption");
                if (caption) {
                    caption.textContent = "Deze afbeelding is momenteel niet beschikbaar.";
                }
            });
        });

        // Modal sluiten (kruisje)
        closeBtn.addEventListener("click", () => {
            modal.style.display = "none";
        });

        // Modal sluiten (klik naast de foto)
        modal.addEventListener("click", (e) => {
            if (e.target === modal) {
                modal.style.display = "none";
            }
        });
    }
});