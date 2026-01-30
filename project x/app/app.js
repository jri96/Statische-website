document.addEventListener("DOMContentLoaded", () => {
    const html = document.documentElement;
    const page = html.dataset.page;

    const show = id => document.getElementById(id).hidden = false;
    const hide = id => document.getElementById(id).hidden = true;

    /* ============================================================
       HOME
       ============================================================ */
    if (page === "home") {
        if (html.dataset.maintenance === "true") {
            hide("home-content");
            show("home-maintenance");
        }

        const video = document.getElementById("trailer-video");
        const err = document.getElementById("video-error");

        if (video) {
            video.addEventListener("error", () => {
                err.textContent = "Deze video is momenteel niet beschikbaar.";
                err.hidden = false;
            });
        }
    }

    /* ============================================================
       GALLERY
       ============================================================ */
    if (page === "gallery") {
        if (html.dataset.imagesError === "true") {
            hide("gallery-content");
            show("gallery-placeholder");
        }

        const buttons = document.querySelectorAll(".download-btn");
        const msg = document.getElementById("download-message");

        buttons.forEach((btn, index) => {
            btn.addEventListener("click", () => {
                if (index === 5) {
                    msg.textContent = "Deze afbeelding is momenteel niet beschikbaar om te downloaden.";
                    msg.className = "error-message";
                } else {
                    msg.textContent = "Afbeelding succesvol gedownload.";
                    msg.className = "info-message";
                }
            });
        });

        const gVideo = document.getElementById("gallery-video");
        const gErr = document.getElementById("gallery-video-error");
        const gOverlay = document.getElementById("video-error-overlay");

        if (gVideo) {
            // Toon foutmelding wanneer video niet geladen kan worden
            gVideo.addEventListener("error", () => {
                gErr.textContent = "Deze video is momenteel niet beschikbaar.";
                gErr.hidden = false;

                // VISUELE OVERLAY TONEN
                gOverlay.hidden = false;
            });

            // Video expres breken zodra je op play klikt
            gVideo.addEventListener("play", () => {
                const source = gVideo.querySelector("source");

                // Bron kapot maken
                source.src = "../img/doesnotexist.mp4";

                // Forceer opnieuw laden → triggert error
                gVideo.load();
            });
        }
    }

    /* ============================================================
       FAQ
       ============================================================ */
    if (page === "faq") {
        if (html.dataset.formError === "true") {
            hide("vraag-formulier");
            show("faq-form-error");
        }

        const form = document.getElementById("vraag-formulier");
        const msg = document.getElementById("form-bericht");

        if (form) {
            form.addEventListener("submit", e => {
                e.preventDefault();

                if (html.dataset.sendError === "true") {
                    msg.textContent = "Het verzenden van uw vraag is niet gelukt. Probeer het later opnieuw.";
                    msg.className = "error-message";
                } else {
                    msg.textContent = "Uw vraag is succesvol verzonden.";
                    msg.className = "info-message";
                    form.reset();
                }
            });
        }

        document.querySelectorAll("details").forEach(d => {
            d.addEventListener("toggle", () => {
                if (d.open && d.dataset.load === "error") {
                    const p = document.createElement("p");
                    p.textContent = "Het antwoord kan momenteel niet worden weergegeven. Probeer het later opnieuw.";
                    p.className = "error-message";
                    d.appendChild(p);
                }
            });
        });
    }

    /* ============================================================
       INFO
       ============================================================ */
    if (page === "info") {
        if (html.dataset.maintenance === "true") {
            hide("info-content");
            show("info-maintenance");
        }
    }

    /* ============================================================
       DEV INFO
       ============================================================ */
    if (page === "dev-info") {
        if (html.dataset.unavailable === "true") {
            hide("dev-info-content");
            show("dev-info-error");
        }
    }

    /* ============================================================
       FEEDBACK
       ============================================================ */
    if (page === "feedback") {
        if (html.dataset.feedbackError === "true") {
            hide("feedback-content");
            show("feedback-error");
        }
    }
});