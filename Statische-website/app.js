document.addEventListener("DOMContentLoaded", function () {
  // =========================================================
  // GLOBAL: down-mode (?down=1)
  // =========================================================
  const params = new URLSearchParams(window.location.search);
  const isDown = params.get("down") === "1";

  function show(el) { if (el) el.style.display = "block"; }
  function hide(el) { if (el) el.style.display = "none"; }

  // =========================================================
  // FAQ – vragen opslaan + tonen (localStorage)
  // =========================================================
  const faqForm = document.getElementById("vraag-formulier");
  const faqMsg = document.getElementById("form-bericht");
  const submittedList = document.getElementById("submitted-questions");

  function loadQuestions() {
    if (!submittedList) return;

    const items = JSON.parse(localStorage.getItem("faqQuestions") || "[]");
    submittedList.innerHTML = "";

    if (items.length === 0) {
      const li = document.createElement("li");
      li.textContent = "Nog geen vragen ingestuurd.";
      submittedList.appendChild(li);
      return;
    }

    items.forEach(q => {
      const li = document.createElement("li");
      li.textContent = `${q.onderwerp}: ${q.vraag} (${q.naam})`;
      submittedList.appendChild(li);
    });
  }

  if (faqForm && faqMsg) {
    loadQuestions();

    faqForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const data = {
        naam: document.getElementById("naam")?.value.trim(),
        email: document.getElementById("email")?.value.trim(),
        onderwerp: document.getElementById("onderwerp")?.value.trim(),
        vraag: document.getElementById("vraag")?.value.trim(),
        ts: Date.now()
      };

      const items = JSON.parse(localStorage.getItem("faqQuestions") || "[]");
      items.unshift(data);
      localStorage.setItem("faqQuestions", JSON.stringify(items.slice(0, 10)));

      faqMsg.textContent = "Uw vraag is ontvangen. Bedankt!";
      faqMsg.style.display = "block";
      faqForm.reset();
      loadQuestions();
    });
  }

  // =========================================================
  // FAQ – antwoord tonen / foutmelding (Sprint 3)
  // =========================================================
  const faqDetails = document.querySelectorAll(".faq-list details");

  faqDetails.forEach(detail => {
    detail.addEventListener("toggle", () => {
      const oldError = detail.querySelector(".faq-error");
      if (oldError) oldError.remove();

      const answer = detail.querySelector("p");

      if (isDown && detail.open) {
        if (answer) answer.style.display = "none";

        const err = document.createElement("div");
        err.className = "faq-error";
        err.textContent =
          "Het antwoord kan momenteel niet worden weergegeven. Probeer het later opnieuw.";
        detail.appendChild(err);
      } else {
        if (answer) answer.style.display = "";
      }
    });
  });

  // =========================================================
  // MEDIA – video afspelen + foutmelding
  // =========================================================
  const videoOk = document.getElementById("video-ok");
  const videoFail = document.getElementById("video-fail");
  const trailerVideo = document.getElementById("trailer-video");

  if (videoOk && videoFail) {
    if (isDown) {
      hide(videoOk);
      show(videoFail);

      if (trailerVideo) {
        try { trailerVideo.pause(); } catch (e) {}
        trailerVideo.removeAttribute("src");
      }
    } else {
      show(videoOk);
      hide(videoFail);

      if (trailerVideo) {
        trailerVideo.addEventListener("error", () => {
          hide(videoOk);
          show(videoFail);
        });
      }
    }
  }

  // =========================================================
  // FEEDBACK – tonen / fout / reactie opslaan
  // =========================================================
  const feedbackOk = document.getElementById("feedback-ok");
  const feedbackFail = document.getElementById("feedback-fail");
  const replyForm = document.getElementById("reply-form");
  const replyMsg = document.getElementById("reply-msg");
  const savedReply = document.getElementById("saved-reply");

  if (feedbackOk && feedbackFail) {
    if (isDown) {
      hide(feedbackOk);
      show(feedbackFail);
    } else {
      show(feedbackOk);
      hide(feedbackFail);
    }
  }

  if (savedReply) {
    savedReply.textContent =
      localStorage.getItem("feedbackReply") || "Nog geen reactie geplaatst.";
  }

  if (replyForm) {
    replyForm.addEventListener("submit", (e) => {
      e.preventDefault();
      if (isDown) return;

      const text = document.getElementById("reply")?.value.trim();
      if (!text) return;

      localStorage.setItem("feedbackReply", text);
      if (savedReply) savedReply.textContent = text;

      if (replyMsg) {
        replyMsg.textContent = "Reactie verzonden. Bedankt!";
        replyMsg.style.display = "block";
      }

      replyForm.reset();
    });
  }

  // =========================================================
  // UITGEBREIDE INFO – onderhoud scenario
  // =========================================================
  const devOk = document.getElementById("dev-ok");
  const devFail = document.getElementById("dev-fail");

  if (devOk && devFail) {
    if (isDown) {
      hide(devOk);
      show(devFail);
    } else {
      show(devOk);
      hide(devFail);
    }
  }

  // =========================================================
  // MEDIA – image modal + fallback
  // =========================================================
  const galleryImages = document.querySelectorAll(".gallery-item img");
  const modal = document.getElementById("image-modal");

  if (galleryImages.length && modal) {
    const modalImg = document.getElementById("modal-image");
    const modalCaption = document.getElementById("modal-caption");
    const closeBtn = document.querySelector(".modal-close");

    galleryImages.forEach(img => {
      img.addEventListener("click", () => {
        modal.style.display = "block";
        modalImg.src = img.src;
        modalCaption.textContent = img.dataset.title || img.alt;
      });

      img.addEventListener("error", () => {
        if (img.dataset.fallback === "1") return;
        img.dataset.fallback = "1";

        img.src = "img/placeholder.png";
        img.alt = "Afbeelding niet beschikbaar";

        const cap = img.closest(".gallery-item")?.querySelector("figcaption");
        if (cap) cap.textContent = "Deze afbeelding is momenteel niet beschikbaar.";
      });
    });

    if (closeBtn) {
      closeBtn.addEventListener("click", () => modal.style.display = "none");
    }

    modal.addEventListener("click", (e) => {
      if (e.target === modal) modal.style.display = "none";
    });
  }

  // =========================================================
  // MEDIA – downloads (single + zip)
  // =========================================================
  const downloadMsg = document.getElementById("download-msg");

  function setDownloadMsg(text) {
    if (!downloadMsg) return;
    downloadMsg.textContent = text;
    downloadMsg.style.display = "block";
  }

  async function downloadSingle(filePath) {
    try {
      const res = await fetch(filePath);
      if (!res.ok) throw new Error();

      const blob = await res.blob();
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = filePath.split("/").pop();
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(url);
      setDownloadMsg("Download gestart.");
    } catch {
      setDownloadMsg("Deze afbeelding is momenteel niet beschikbaar om te downloaden.");
    }
  }

  async function downloadAllAsZip(files) {
    try {
      if (typeof JSZip === "undefined") {
        setDownloadMsg("Downloadfunctie is niet beschikbaar (JSZip ontbreekt).");
        return;
      }

      const zip = new JSZip();

      for (const path of files) {
        const res = await fetch(path);
        if (!res.ok) throw new Error();
        zip.file(path.split("/").pop(), await res.blob());
      }

      const zipBlob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(zipBlob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "afbeeldingen.zip";
      document.body.appendChild(a);
      a.click();
      a.remove();

      URL.revokeObjectURL(url);
      setDownloadMsg("Collectie wordt gedownload naar uw apparaat.");
    } catch {
      setDownloadMsg("Deze afbeelding is momenteel niet beschikbaar om te downloaden.");
    }
  }

  document.querySelectorAll(".download-one").forEach(btn => {
    btn.addEventListener("click", () => downloadSingle(btn.dataset.file));
  });

  const downloadAllBtn = document.getElementById("download-all");
  if (downloadAllBtn) {
    downloadAllBtn.addEventListener("click", () => {
      const files = Array.from(document.querySelectorAll(".download-one"))
        .map(b => b.dataset.file);
      downloadAllAsZip(files);
    });
  }
});
