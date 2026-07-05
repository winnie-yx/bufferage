import "./style.css";
import { landingCopy } from "./copy";
import { initLandingExperience } from "./landing";
import { initModelViewer } from "./model-viewer";
import { initPortfolioShowcase } from "./showcase";
import { initShowcaseTitleParticles } from "./showcase-title";
const app = document.querySelector("#app");
if (!app) {
    throw new Error("App root not found");
}
app.innerHTML = `
  <section class="landing-overlay">
    <canvas class="landing-canvas" aria-hidden="true"></canvas>
    <div class="landing-content">
      <div class="landing-kicker">Experimental Portfolio</div>
      <h1 class="landing-title">Bufferage</h1>
      <div class="landing-body">
        <p class="landing-copy landing-copy--en">${landingCopy.english}</p>
      </div>
      <button class="landing-enter" type="button">Enter</button>
    </div>
  </section>
  <div class="shell-frame">
    <main class="shell">
      <header class="hud hud-top">
        <div class="meta meta--left">
          <span>connect</span>
          <span>pipe</span>
          <span>smooth</span>
        </div>
        <div class="brand">
          <span class="brand__eyebrow">( PREVIEW )</span>
          <h1>Choose Your Hesitation Question</h1>
        </div>
        <div class="meta meta--right meta--statement">
          <p>Bufferage explores hesitation as a uniquely human form of judgment. Enter to navigate nine dimensions where machine certainty meets human pause.</p>
        </div>
      </header>

      <section class="stage">
        <canvas class="showcase-title-canvas" aria-hidden="true"></canvas>
        <div class="scene-layer">
          <canvas class="scene-canvas" aria-label="3D portfolio sphere"></canvas>
        </div>
      </section>

      <footer class="hud hud-bottom">
        <div class="nav-copy">
          <span>Xiaohongshu</span>
          <span>Github</span>
        </div>
        <div class="nav-copy nav-copy--center">
          <span>Built By</span>
          <span>Bufferage Studio</span>
        </div>
        <div class="nav-copy nav-copy--right">
          <span>© Bufferage</span>
        </div>
      </footer>

      <section class="model-page" aria-hidden="true">
        <canvas class="model-canvas" aria-label="3D retro computer model"></canvas>
        <div class="model-copy model-copy--top">[system] drag to rotate view</div>
        <div class="model-copy model-copy--bottom">
          <span>guest@MacBook: click to start</span>
          <span>[ CLICK TO START ]</span>
        </div>
        <div class="computer-screen" aria-hidden="true">
          <div class="computer-screen__boot"></div>
          <div class="computer-screen__glitch"></div>
          <div class="computer-screen__loader">
            <div class="computer-screen__loader-label">Loading showcase interface...</div>
            <div class="computer-screen__loader-bar">
              <span class="computer-screen__loader-fill"></span>
            </div>
            <div class="computer-screen__loader-progress">0%</div>
          </div>
          <div class="computer-desktop">
            <aside class="computer-sidebar">
              <button class="desktop-icon" type="button"><span class="desktop-icon__badge">▣</span><span>My Computer</span></button>
              <button class="desktop-icon" type="button"><span class="desktop-icon__badge">⌘</span><span>Network Neighborhood</span></button>
              <button class="desktop-icon" type="button"><span class="desktop-icon__badge">♻</span><span>Recycle Bin</span></button>
              <button class="desktop-icon" type="button"><span class="desktop-icon__badge desktop-icon__badge--accent">H</span><span>Henry Showcase</span></button>
              <button class="desktop-icon" type="button"><span class="desktop-icon__badge">TXT</span><span>Credits.txt</span></button>
            </aside>
            <section class="computer-window">
              <div class="window-bar">
                <div class="window-bar__brand"><span class="window-bar__brand-icon" aria-hidden="true"></span><span>bufferage-showcase 2080</span></div>
                <div class="window-bar__controls" aria-hidden="true">
                  <span class="window-bar__control window-bar__control--min"></span>
                  <span class="window-bar__control window-bar__control--max"></span>
                  <span class="window-bar__control window-bar__control--close"></span>
                </div>
              </div>
              <div class="window-menu">
                <span>File</span>
                <span>Edit</span>
                <span>View</span>
                <span>Help</span>
              </div>
              <div class="window-panel">
                <div class="question-card">
                  <div class="question-card__eyebrow">Capability Boundary</div>
                  <h2 class="question-title" data-full-text="Education should prioritize cultivating competitiveness over happiness?"></h2>
                  <p class="question-title-cn" data-full-text="教育是否应该优先培养竞争力，而不是幸福感？"></p>
                  <div class="decision-grid">
                    <button class="decision-button decision-button--true" type="button" data-choice="true">TRUE</button>
                    <button class="decision-button decision-button--false" type="button" data-choice="false">FALSE</button>
                  </div>
                  <button class="decision-return" type="button">RETURN</button>
                  <p class="question-card__body">You will answer alongside leading AI systems from China and abroad. Compare your judgment with theirs, and observe where certainty ends and hesitation begins.</p>
                  <div class="timer-board">
                    <span class="timer-board__label">Hesitation Timer</span>
                    <span class="timer-board__value">00:00.00</span>
                  </div>
                </div>
              </div>
              <div class="taskbar">
                <div class="taskbar__start">Start</div>
                <div class="taskbar__tab">My Showcase</div>
                <div class="taskbar__clock">3:44 PM</div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </main>
  </div>
`;
const canvas = app.querySelector(".scene-canvas");
const showcaseTitleCanvas = app.querySelector(".showcase-title-canvas");
const modelCanvas = app.querySelector(".model-canvas");
const enterButton = app.querySelector(".landing-enter");
const landingCanvas = app.querySelector(".landing-canvas");
const landingOverlay = app.querySelector(".landing-overlay");
const shell = app.querySelector(".shell");
const shellFrame = app.querySelector(".shell-frame");
const modelPage = app.querySelector(".model-page");
const screenShell = app.querySelector(".computer-screen");
const timerValue = app.querySelector(".timer-board__value");
const choiceButtons = Array.from(app.querySelectorAll(".decision-button"));
const returnButton = app.querySelector(".decision-return");
const questionTitle = app.querySelector(".question-title");
const questionTitleCn = app.querySelector(".question-title-cn");
const loaderFill = app.querySelector(".computer-screen__loader-fill");
const loaderProgress = app.querySelector(".computer-screen__loader-progress");
if (!canvas || !showcaseTitleCanvas || !modelCanvas || !shell || !shellFrame || !enterButton || !landingCanvas || !landingOverlay || !modelPage || !screenShell || !timerValue || !returnButton || !questionTitle || !questionTitleCn || !loaderFill || !loaderProgress) {
    throw new Error("Required showcase elements are missing");
}
let timerStart = 0;
let timerFrame = 0;
let booted = false;
let typewriterToken = 0;
let audioContext = null;
let lastClickAt = 0;
let loaderFrame = 0;
const renderTimer = (elapsedMs) => {
    const totalCentiseconds = Math.floor(elapsedMs / 10);
    const minutes = Math.floor(totalCentiseconds / 6000);
    const seconds = Math.floor((totalCentiseconds % 6000) / 100);
    const centiseconds = totalCentiseconds % 100;
    timerValue.textContent = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}.${String(centiseconds).padStart(2, "0")}`;
};
const tickTimer = (now) => {
    renderTimer(now - timerStart);
    timerFrame = window.requestAnimationFrame(tickTimer);
};
const startTimer = () => {
    if (timerFrame) {
        window.cancelAnimationFrame(timerFrame);
    }
    timerStart = performance.now();
    renderTimer(0);
    timerFrame = window.requestAnimationFrame(tickTimer);
};
const playTypeKey = () => {
    const now = performance.now();
    if (now - lastClickAt < 34) {
        return;
    }
    lastClickAt = now;
    try {
        if (!audioContext) {
            audioContext = new AudioContext();
        }
        if (audioContext.state === "suspended") {
            void audioContext.resume();
        }
        const oscillator = audioContext.createOscillator();
        const gain = audioContext.createGain();
        oscillator.type = "square";
        oscillator.frequency.value = 1320 + Math.random() * 160;
        gain.gain.setValueAtTime(0.0001, audioContext.currentTime);
        gain.gain.linearRampToValueAtTime(0.018, audioContext.currentTime + 0.002);
        gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.035);
        oscillator.connect(gain);
        gain.connect(audioContext.destination);
        oscillator.start();
        oscillator.stop(audioContext.currentTime + 0.04);
    }
    catch {
        // Ignore audio failures and keep the visual typing effect.
    }
};
const typeText = (element, text, delay, token, onComplete) => {
    element.textContent = "";
    element.classList.add("question-title--typing");
    let index = 0;
    const step = () => {
        if (token !== typewriterToken) {
            return;
        }
        if (index < text.length) {
            element.textContent += text[index];
            playTypeKey();
            index += 1;
            const nextDelay = /[?.,，。？]/.test(text[index - 1] ?? "") ? delay * 2.1 : delay;
            window.setTimeout(step, nextDelay);
            return;
        }
        element.classList.remove("question-title--typing");
        onComplete?.();
    };
    window.setTimeout(step, 120);
};
const startQuestionTypewriter = () => {
    typewriterToken += 1;
    const token = typewriterToken;
    const english = questionTitle.dataset.fullText ?? "";
    const chinese = questionTitleCn.dataset.fullText ?? "";
    questionTitleCn.classList.remove("question-title-cn--visible");
    questionTitleCn.textContent = chinese;
    typeText(questionTitle, english, 32, token, () => {
        if (token !== typewriterToken) {
            return;
        }
        questionTitleCn.classList.add("question-title-cn--visible");
    });
};
const startBootLoader = (onComplete) => {
    if (loaderFrame) {
        window.cancelAnimationFrame(loaderFrame);
    }
    const startedAt = performance.now();
    const duration = 1180;
    loaderFill.style.width = "0%";
    loaderProgress.textContent = "0%";
    const step = (now) => {
        const progress = Math.min((now - startedAt) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 2.4);
        const percent = Math.round(eased * 100);
        loaderFill.style.width = `${percent}%`;
        loaderProgress.textContent = `${percent}%`;
        if (progress < 1) {
            loaderFrame = window.requestAnimationFrame(step);
            return;
        }
        loaderFrame = 0;
        onComplete();
    };
    loaderFrame = window.requestAnimationFrame(step);
};
const bootComputerScreen = () => {
    if (booted) {
        return;
    }
    booted = true;
    modelPage.classList.add("model-page--booting");
    startBootLoader(() => {
        modelPage.classList.add("model-page--app-visible");
        startQuestionTypewriter();
        startTimer();
    });
};
choiceButtons.forEach((button) => {
    button.addEventListener("click", () => {
        choiceButtons.forEach((candidate) => {
            candidate.classList.toggle("decision-button--selected", candidate === button);
        });
    });
});
returnButton.addEventListener("click", () => {
    choiceButtons.forEach((candidate) => {
        candidate.classList.remove("decision-button--selected");
    });
});
const syncFixedStage = () => {
    const scale = Math.min(window.innerWidth / 1920, window.innerHeight / 1080);
    shellFrame.style.width = `${1920 * scale}px`;
    shellFrame.style.height = `${1080 * scale}px`;
    shell.style.transform = `scale(${scale})`;
};
syncFixedStage();
window.addEventListener("resize", syncFixedStage);
initShowcaseTitleParticles({
    canvas: showcaseTitleCanvas,
    interactionTarget: canvas,
});
initPortfolioShowcase({
    canvas,
    onSelect: () => {
        shell.classList.add("shell--model-active");
    },
});
initModelViewer({
    canvas: modelCanvas,
    onFocusLocked: bootComputerScreen,
});
initLandingExperience({
    canvas: landingCanvas,
    enterButton,
    overlay: landingOverlay,
    shellFrame,
});
