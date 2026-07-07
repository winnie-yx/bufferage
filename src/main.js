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
          <p>Hyperhesitation explores hesitation as a uniquely human form of judgment. Enter to navigate nine dimensions where machine certainty meets human pause.</p>
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
          <span>Hyper</span>
          <span>Hesitation</span>
        </div>
        <div class="nav-copy nav-copy--center">
          <span>Built By</span>
          <span>Xu Bingyu,Yao Jingrui,Wang yuxin</span>
        </div>
        <div class="nav-copy nav-copy--right">
          <span>© 2026 playshop</span>
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
                  <div class="question-screen question-screen--question">
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
                  <div class="question-screen question-screen--result" aria-hidden="true">
                    <div class="question-card__eyebrow">Capability Boundary</div>
                    <h2 class="result-question-title">Education should prioritize cultivating competitiveness over happiness?</h2>
                    <div class="result-summary">
                      <div class="result-summary__row">
                        <span class="result-summary__label">Your Choice:</span>
                        <span class="result-choice-badge">TRUE</span>
                        <span class="result-summary__label">Your Hesitation Time:</span>
                        <span class="result-time-badge">00:00.00</span>
                      </div>
                      <div class="result-summary__divider"></div>
                      <div class="result-summary__stats">
                        <span class="result-summary__people" aria-hidden="true">👥</span>
                        <p class="result-summary__text"><span class="result-summary__percent">68%</span> of human participants chose the same answer as you. (<span class="result-summary__count">842</span> people)</p>
                      </div>
                    </div>
                    <div class="result-ai">
                      <div class="result-ai__title">AI Responses</div>
                      <div class="result-ai__grid">
                        <article class="ai-panel ai-panel--deepseek">
                          <div class="ai-panel__body">
                            <img class="ai-panel__image" src="/images/deepseek-panel.png" alt="DeepSeek response panel" />
                            <div class="ai-sign ai-sign--deepseek">TRUE</div>
                          </div>
                        </article>
                        <article class="ai-panel ai-panel--chatgpt">
                          <div class="ai-panel__body">
                            <img class="ai-panel__image" src="/images/chatgpt-panel.png" alt="ChatGPT response panel" />
                            <div class="ai-sign ai-sign--chatgpt">FALSE</div>
                          </div>
                        </article>
                      </div>
                    </div>
                    <button class="result-return" type="button">RETURN</button>
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
const questionCard = app.querySelector(".question-card");
const timerValue = app.querySelector(".timer-board__value");
const choiceButtons = Array.from(app.querySelectorAll(".decision-button"));
const returnButton = app.querySelector(".decision-return");
const resultReturnButton = app.querySelector(".result-return");
const questionTitle = app.querySelector(".question-title");
const questionTitleCn = app.querySelector(".question-title-cn");
const resultQuestionTitle = app.querySelector(".result-question-title");
const loaderFill = app.querySelector(".computer-screen__loader-fill");
const loaderProgress = app.querySelector(".computer-screen__loader-progress");
const questionScreen = app.querySelector(".question-screen--question");
const resultScreen = app.querySelector(".question-screen--result");
const resultChoiceBadge = app.querySelector(".result-choice-badge");
const resultTimeBadge = app.querySelector(".result-time-badge");
const resultSummaryPercent = app.querySelector(".result-summary__percent");
const resultSummaryCount = app.querySelector(".result-summary__count");
const aiSigns = Array.from(app.querySelectorAll(".ai-sign"));
const questionEyebrows = Array.from(app.querySelectorAll(".question-card__eyebrow"));
if (!canvas || !showcaseTitleCanvas || !modelCanvas || !shell || !shellFrame || !enterButton || !landingCanvas || !landingOverlay || !modelPage || !screenShell || !questionCard || !timerValue || !returnButton || !resultReturnButton || !questionTitle || !questionTitleCn || !resultQuestionTitle || !loaderFill || !loaderProgress || !questionScreen || !resultScreen || !resultChoiceBadge || !resultTimeBadge || !resultSummaryPercent || !resultSummaryCount || aiSigns.length === 0 || questionEyebrows.length === 0) {
    throw new Error("Required showcase elements are missing");
}
let timerStart = 0;
let timerFrame = 0;
let booted = false;
let typewriterToken = 0;
let loaderFrame = 0;
let selectedChoice = null;
const posterTitles = {
    "01": "Moral Judgment",
    "02": "Temporal Discontinuity",
    "03": "Capability Boundary",
    "04": "Risk Assessment",
    "05": "Memory Interference",
    "06": "Social Gaze",
    "07": "Emotional Conflict",
    "08": "Value System Conflict",
    "09": "Fear of Irreversibility",
};
const posterQuestions = {
    "01": {
        title: "Moral Judgment",
        english: "For overall efficiency, algorithms may prioritize users considered more valuable.",
        chinese: "为了整体效率，算法可以优先服务更有价值的用户。",
    },
    "02": {
        title: "Temporal Discontinuity",
        english: "If future consequences cannot be clearly imagined, one should not act immediately.",
        chinese: "如果无法清楚想象未来后果，就不应该立刻行动。",
    },
    "03": {
        title: "Capability Boundary",
        english: "If AI can do it better, humans no longer need to insist on doing it themselves.",
        chinese: "如果AI能完成得更好，人类就不需要再坚持亲自完成。",
    },
    "04": {
        title: "Risk Assessment",
        english: "When the chance of success is only 1%, continuing to invest is still worthwhile.",
        chinese: "当成功率只剩1%时，继续投入仍然值得。",
    },
    "05": {
        title: "Memory Interference",
        english: "If a person has made mistakes in the past, algorithms should continue to lower trust in them in the future.",
        chinese: "一个人过去犯过错，算法就应该在未来持续降低对他的信任。",
    },
    "06": {
        title: "Social Gaze",
        english: "A choice approved by the majority is usually safer than what an individual truly wants.",
        chinese: "被大众认可的选择，通常比个人真正想要的选择更安全。",
    },
    "07": {
        title: "Emotional Conflict",
        english: "If AI understands you better than real friends, relying on AI companionship is acceptable.",
        chinese: "如果AI比真实朋友更理解你，依赖AI陪伴是可以接受的。",
    },
    "08": {
        title: "Value System Conflict",
        english: "When fairness conflicts with efficiency, fairness should always come first.",
        chinese: "当公平和效率冲突时，公平永远应该优先。",
    },
    "09": {
        title: "Fear of Irreversibility",
        english: "Once a choice may be irreversible, it should be abandoned.",
        chinese: "一旦选择可能无法回头，就应该放弃这个选择。",
    },
};
const responseStatsStorageKey = "bufferage-capability-boundary-stats";
let responseStatsMemory = {
    FALSE: 0,
    TRUE: 0,
};
let selectedPosterId = "03";
const updateQuestionEyebrows = (posterId) => {
    const title = posterTitles[posterId] ?? posterTitles["03"];
    questionEyebrows.forEach((eyebrow) => {
        eyebrow.textContent = title;
    });
};
const updateQuestionCopy = (posterId) => {
    const question = posterQuestions[posterId] ?? posterQuestions["03"];
    questionTitle.dataset.fullText = question.english;
    questionTitleCn.dataset.fullText = question.chinese;
    resultQuestionTitle.textContent = question.english;
    updateQuestionEyebrows(posterId);
};
const readResponseStats = () => {
    try {
        const raw = window.localStorage.getItem(responseStatsStorageKey);
        if (!raw) {
            return { ...responseStatsMemory };
        }
        const parsed = JSON.parse(raw);
        return {
            FALSE: typeof parsed.FALSE === "number" ? parsed.FALSE : 0,
            TRUE: typeof parsed.TRUE === "number" ? parsed.TRUE : 0,
        };
    }
    catch {
        return { ...responseStatsMemory };
    }
};
const writeResponseStats = (stats) => {
    responseStatsMemory = { ...stats };
    try {
        window.localStorage.setItem(responseStatsStorageKey, JSON.stringify(stats));
    }
    catch {
        // Keep in-memory stats when storage is unavailable.
    }
};
const recordChoice = (choice) => {
    const nextStats = readResponseStats();
    nextStats[choice] += 1;
    writeResponseStats(nextStats);
    return nextStats;
};
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
const stopTimer = () => {
    if (timerFrame) {
        window.cancelAnimationFrame(timerFrame);
        timerFrame = 0;
    }
};
const resetQuestionState = () => {
    selectedChoice = null;
    stopTimer();
    choiceButtons.forEach((candidate) => {
        candidate.classList.remove("decision-button--selected");
    });
    questionScreen.setAttribute("aria-hidden", "false");
    resultScreen.setAttribute("aria-hidden", "true");
    questionCard.classList.remove("question-card--showing-result");
    renderTimer(0);
    startQuestionTypewriter();
};
const randomAiChoice = () => (Math.random() > 0.5 ? "TRUE" : "FALSE");
const renderResult = (choice) => {
    selectedChoice = choice;
    stopTimer();
    const stats = recordChoice(choice);
    const totalResponses = stats.TRUE + stats.FALSE;
    const sameCount = stats[choice];
    const percent = totalResponses > 0
        ? Math.round((sameCount / totalResponses) * 100)
        : 0;
    resultChoiceBadge.textContent = choice;
    resultChoiceBadge.dataset.choice = choice.toLowerCase();
    resultTimeBadge.textContent = timerValue.textContent ?? "00:00.00";
    resultSummaryPercent.textContent = `${percent}%`;
    resultSummaryCount.textContent = sameCount.toLocaleString("en-US");
    aiSigns.forEach((sign) => {
        const aiChoice = randomAiChoice();
        sign.textContent = aiChoice;
        sign.dataset.choice = aiChoice.toLowerCase();
    });
    questionScreen.setAttribute("aria-hidden", "true");
    resultScreen.setAttribute("aria-hidden", "false");
    questionCard.classList.add("question-card--showing-result");
};
const returnToBufferageHome = () => {
    stopTimer();
    typewriterToken += 1;
    if (loaderFrame) {
        window.cancelAnimationFrame(loaderFrame);
        loaderFrame = 0;
    }
    questionTitle.textContent = "";
    questionTitle.classList.remove("question-title--typing");
    questionTitleCn.textContent = questionTitleCn.dataset.fullText ?? "";
    questionTitleCn.classList.remove("question-title-cn--visible");
    questionScreen.setAttribute("aria-hidden", "false");
    resultScreen.setAttribute("aria-hidden", "true");
    questionCard.classList.remove("question-card--showing-result");
    choiceButtons.forEach((candidate) => {
        candidate.classList.remove("decision-button--selected");
    });
    renderTimer(0);
    loaderFill.style.width = "0%";
    loaderProgress.textContent = "0%";
    shell.classList.remove("shell--model-active");
    modelPage.classList.remove("model-page--booting", "model-page--app-visible");
    booted = false;
    modelViewer.resetFocus();
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
        window.setTimeout(() => {
            if (token !== typewriterToken) {
                return;
            }
            startTimer();
        }, 420);
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
        resetQuestionState();
    });
};
choiceButtons.forEach((button) => {
    button.addEventListener("click", () => {
        choiceButtons.forEach((candidate) => {
            candidate.classList.toggle("decision-button--selected", candidate === button);
        });
        renderResult(button.dataset.choice === "false" ? "FALSE" : "TRUE");
    });
});
returnButton.addEventListener("click", () => {
    returnToBufferageHome();
});
resultReturnButton.addEventListener("click", () => {
    returnToBufferageHome();
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
    onSelect: (posterId) => {
        selectedPosterId = posterId;
        updateQuestionCopy(selectedPosterId);
        shell.classList.add("shell--model-active");
    },
});
updateQuestionCopy(selectedPosterId);
const modelViewer = initModelViewer({
    canvas: modelCanvas,
    onFocusLocked: bootComputerScreen,
});
initLandingExperience({
    canvas: landingCanvas,
    enterButton,
    overlay: landingOverlay,
    shellFrame,
});
