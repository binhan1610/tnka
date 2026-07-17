"use strict";

/**
 * Toàn bộ thông tin sự kiện được gom vào một object để dễ chỉnh sửa.
 * Thời gian trong dateISO được hiểu theo múi giờ Việt Nam (+07:00).
 */
const eventData = {
  graduateName: "Đặng Bình An",
  title: "Lễ tốt nghiệp - Đặng Bình An",
  time: "08:00",
  dateDisplay: "30/07/2026",
  dateISO: "2026-07-30T08:00:00+07:00",
  endISO: "2026-07-30T10:00:00+07:00",
  address: "387 Hoàng Quốc Việt",
  venue: "Trường Cao đẳng Sư phạm Trung ương",
  mapQuery: "387 Hoàng Quốc Việt, Hà Nội",
  dressLine1: "Lịch sự",
  dressLine2: "Trang trọng",
  description: "Trân trọng kính mời bạn tới dự lễ tốt nghiệp của Đặng Bình An."
};

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const openingScreen = document.getElementById("openingScreen");
const openInvitationButton = document.getElementById("openInvitation");
const invitationPage = document.getElementById("invitationPage");
const musicToggle = document.getElementById("musicToggle");
const backgroundMusic = document.getElementById("backgroundMusic");
const toast = document.getElementById("toast");

let animationStarted = false;
let toastTimer;
let lastFocusedElement = null;

/** Chờ một khoảng thời gian và trả về Promise để dùng cùng async/await. */
function wait(milliseconds) {
  return new Promise((resolve) => window.setTimeout(resolve, milliseconds));
}

/**
 * Chia chuỗi theo grapheme để giữ nguyên ký tự tiếng Việt và emoji.
 * Intl.Segmenter được ưu tiên; Array.from là phương án dự phòng.
 */
function splitGraphemes(text) {
  if (typeof Intl !== "undefined" && typeof Intl.Segmenter === "function") {
    const segmenter = new Intl.Segmenter("vi", { granularity: "grapheme" });
    return Array.from(segmenter.segment(text), (item) => item.segment);
  }
  return Array.from(text);
}

/**
 * Tạo hiệu ứng từng ký tự mà không liên tục gán innerHTML.
 * Mỗi ký tự được tạo bằng document.createElement và append qua DocumentFragment.
 */
async function typeText(element, text, speed = 70) {
  if (!element) return;

  element.textContent = "";
  element.setAttribute("aria-label", text.replace(/\n/g, " "));

  const fragment = document.createDocumentFragment();
  const characterElements = [];

  splitGraphemes(text).forEach((character) => {
    if (character === "\n") {
      fragment.appendChild(document.createElement("br"));
      return;
    }

    const characterElement = document.createElement("span");
    characterElement.className = "type-char";
    characterElement.setAttribute("aria-hidden", "true");
    characterElement.textContent = character === " " ? "\u00A0" : character;
    fragment.appendChild(characterElement);
    characterElements.push(characterElement);
  });

  element.appendChild(fragment);

  if (prefersReducedMotion) {
    characterElements.forEach((characterElement) => characterElement.classList.add("is-visible"));
    return;
  }

  for (const characterElement of characterElements) {
    characterElement.classList.add("is-visible");
    await wait(speed);
  }
}

/** Hiện một phần tử trong chuỗi animation. */
async function revealElement(element, delayAfter = 360) {
  if (!element) return;
  element.classList.add("is-revealed");
  if (!prefersReducedMotion) await wait(delayAfter);
}

/** Điền các trường có data-event-field bằng dữ liệu trong eventData. */
function applyEventData() {
  document.querySelectorAll("[data-event-field]").forEach((element) => {
    const field = element.dataset.eventField;
    if (Object.prototype.hasOwnProperty.call(eventData, field)) {
      element.textContent = eventData[field];
    }
  });
}


/** Xóa nội dung mẫu trước khi thiệp hiện để tránh chữ bị lóe trước animation. */
function initializeTypeTargets() {
  document.querySelectorAll(".type-target").forEach((element) => {
    const text = element.dataset.text || element.textContent.trim();
    element.dataset.text = text;
    element.setAttribute("aria-label", text.replace(/\n/g, " "));
    element.textContent = "";
  });
}

/** Tạo các hạt sáng vàng ngẫu nhiên nhưng nhẹ mắt. */
function createSparkles() {
  const sparkleLayer = document.getElementById("sparkles");
  if (!sparkleLayer) return;

  const total = window.innerWidth < 480 ? 25 : 40;
  const fragment = document.createDocumentFragment();

  for (let index = 0; index < total; index += 1) {
    const sparkle = document.createElement("span");
    sparkle.className = "sparkle";
    sparkle.style.left = `${Math.random() * 100}%`;
    sparkle.style.top = `${Math.random() * 100}%`;
    sparkle.style.setProperty("--size", `${2 + Math.random() * 5}px`);
    sparkle.style.setProperty("--duration", `${2.8 + Math.random() * 4.5}s`);
    sparkle.style.setProperty("--delay", `${Math.random() * 5}s`);
    fragment.appendChild(sparkle);
  }

  sparkleLayer.appendChild(fragment);
}

/** Chạy toàn bộ chuỗi xuất hiện theo đúng thứ tự yêu cầu. */
async function runOpeningSequence() {
  if (animationStarted) return;
  animationStarted = true;

  const headerCap = document.getElementById("headerCap");
  const topInvitation = document.getElementById("topInvitation");
  const topDivider = document.getElementById("topDivider");
  const attendText = document.getElementById("attendText");
  const mainTitle = document.getElementById("mainTitle");
  const graduationText = document.getElementById("graduationText");
  const portraitHalo = document.getElementById("portraitHalo");
  const portraitFrame = document.getElementById("portraitFrame");
  const invitationRibbon = document.getElementById("invitationRibbon");
  const graduateName = document.getElementById("graduateName");
  const nameDivider = document.getElementById("nameDivider");
  const timeDetail = document.getElementById("timeDetail");
  const locationDetail = document.getElementById("locationDetail");
  const dressDetail = document.getElementById("dressDetail");
  const closingMessage = document.getElementById("closingMessage");
  const closingScript = document.getElementById("closingScript");

  await revealElement(headerCap, 400);
  await typeText(topInvitation, topInvitation.dataset.text, 52);
  await revealElement(topDivider, 200);
  await typeText(attendText, attendText.dataset.text, 80);
  await typeText(mainTitle, mainTitle.dataset.text, 82);
  await typeText(graduationText, graduationText.dataset.text, 95);
  await revealElement(portraitHalo, 120);
  await revealElement(portraitFrame, 900);
  await revealElement(invitationRibbon, 720);
  await typeText(graduateName, graduateName.dataset.text, 105);
  await revealElement(nameDivider, 240);
  await revealElement(timeDetail, 420);
  await revealElement(locationDetail, 420);
  await revealElement(dressDetail, 520);

  const closingSection = document.querySelector(".closing-section");
  closingSection?.classList.add("is-revealed");
  await typeText(closingMessage, closingMessage.dataset.text, 25);
  await typeText(closingScript, closingScript.dataset.text, 65);
}

/** Phát nhạc sau tương tác người dùng; nếu trình duyệt từ chối thì giữ trạng thái tắt. */
async function tryPlayMusic() {
  try {
    backgroundMusic.volume = 0.34;
    await backgroundMusic.play();
    setMusicButtonState(true);
  } catch (_error) {
    setMusicButtonState(false);
  }
}

function setMusicButtonState(isPlaying) {
  musicToggle.classList.toggle("is-playing", isPlaying);
  musicToggle.setAttribute("aria-pressed", String(isPlaying));
  musicToggle.setAttribute("aria-label", isPlaying ? "Tắt nhạc" : "Bật nhạc");
  const stateText = musicToggle.querySelector(".music-state");
  if (stateText) stateText.textContent = isPlaying ? "Đang phát" : "Nhạc";
}

async function openInvitation() {
  openingScreen.classList.add("is-opened");
  invitationPage.classList.add("is-visible");
  invitationPage.setAttribute("aria-hidden", "false");
  musicToggle.classList.remove("is-hidden");

  await tryPlayMusic();
  await wait(prefersReducedMotion ? 0 : 300);
  window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
  runOpeningSequence();
}

musicToggle.addEventListener("click", async () => {
  if (backgroundMusic.paused) {
    await tryPlayMusic();
  } else {
    backgroundMusic.pause();
    setMusicButtonState(false);
  }
});

backgroundMusic.addEventListener("ended", () => setMusicButtonState(false));
backgroundMusic.addEventListener("error", () => setMusicButtonState(false));
openInvitationButton.addEventListener("click", openInvitation);

/** Đổi Date thành chuỗi UTC dùng trong định dạng iCalendar. */
function toICSDate(dateString) {
  return new Date(dateString)
    .toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
}

function escapeICS(value) {
  return String(value)
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

/** Tạo file .ics trực tiếp trên trình duyệt, không cần backend. */
function downloadCalendarFile() {
  const now = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}Z$/, "Z");
  const location = `${eventData.address}, ${eventData.venue}`;

  const icsContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Graduation Invitation//VI",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${Date.now()}@graduation-invitation.local`,
    `DTSTAMP:${now}`,
    `DTSTART:${toICSDate(eventData.dateISO)}`,
    `DTEND:${toICSDate(eventData.endISO)}`,
    `SUMMARY:${escapeICS(eventData.title)}`,
    `DESCRIPTION:${escapeICS(eventData.description)}`,
    `LOCATION:${escapeICS(location)}`,
    "BEGIN:VALARM",
    "TRIGGER:-P1D",
    "ACTION:DISPLAY",
    "DESCRIPTION:Nhắc lịch lễ tốt nghiệp",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR"
  ].join("\r\n");

  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const downloadUrl = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = downloadUrl;
  anchor.download = "le-tot-nghiep-dang-binh-an.ics";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(downloadUrl);
  showToast("Đã tạo file lịch cho bạn.");
}

document.getElementById("calendarButton").addEventListener("click", downloadCalendarFile);
document.getElementById("mapButton").addEventListener("click", () => {
  const mapUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(eventData.mapQuery)}`;
  window.open(mapUrl, "_blank", "noopener,noreferrer");
});

/** Modal gửi lời chúc. */
const wishModal = document.getElementById("wishModal");
const wishForm = document.getElementById("wishForm");
const guestNameInput = document.getElementById("guestName");

function openWishModal() {
  lastFocusedElement = document.activeElement;
  wishModal.hidden = false;
  document.body.style.overflow = "hidden";
  window.setTimeout(() => guestNameInput.focus(), 30);
}

function closeWishModal() {
  wishModal.hidden = true;
  document.body.style.overflow = "";
  if (lastFocusedElement instanceof HTMLElement) lastFocusedElement.focus();
}

document.getElementById("wishButton").addEventListener("click", openWishModal);
document.getElementById("closeWishModal").addEventListener("click", closeWishModal);
document.getElementById("cancelWish").addEventListener("click", closeWishModal);

wishModal.addEventListener("click", (event) => {
  if (event.target === wishModal) closeWishModal();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !wishModal.hidden) closeWishModal();
});

wishForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const formData = new FormData(wishForm);
  const guestName = String(formData.get("guestName") || "").trim();
  const guestWish = String(formData.get("guestWish") || "").trim();

  if (!guestName || !guestWish) {
    showToast("Bạn hãy nhập đầy đủ họ tên và lời chúc.");
    return;
  }

  const wishEntry = {
    guestName,
    guestWish,
    createdAt: new Date().toISOString()
  };

  try {
    const oldEntries = JSON.parse(localStorage.getItem("graduationWishes") || "[]");
    const entries = Array.isArray(oldEntries) ? oldEntries : [];
    entries.push(wishEntry);
    localStorage.setItem("graduationWishes", JSON.stringify(entries));
  } catch (_error) {
    // Một số trình duyệt chặn localStorage khi mở file local; thiệp vẫn hoạt động bình thường.
  }

  wishForm.reset();
  closeWishModal();
  showToast(`Cảm ơn ${guestName} đã gửi lời chúc!`);
});

function showToast(message) {
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.classList.add("is-visible");
  toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 3200);
}

/** IntersectionObserver dành cho các phần ở cuối thiệp khi người dùng cuộn tới. */
function setupScrollReveal() {
  const targets = document.querySelectorAll(".scroll-reveal");

  if (prefersReducedMotion || !("IntersectionObserver" in window)) {
    targets.forEach((target) => target.classList.add("is-revealed"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries, currentObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-revealed");
        currentObserver.unobserve(entry.target);
      });
    },
    { threshold: 0.15, rootMargin: "0px 0px -40px" }
  );

  targets.forEach((target) => observer.observe(target));
}

applyEventData();
initializeTypeTargets();
createSparkles();
setupScrollReveal();
