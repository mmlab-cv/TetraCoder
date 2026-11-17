/* Progressive enhancements for the static TetraCoder project page. */
(() => {
  "use strict";

  const media = window.TETRACODER_MEDIA || {};
  const byId = (id) => document.getElementById(id);
  const setText = (id, text) => {
    const element = byId(id);
    if (element) element.textContent = text;
  };
  const announce = (text) => setText("media-status", text);
  const pressedButton = (buttons) => buttons.find((button) => button.getAttribute("aria-pressed") === "true") || buttons[0];
  const setPressed = (buttons, current) => buttons.forEach((button) => {
    button.type = "button";
    button.setAttribute("aria-pressed", String(button === current));
  });
  const preloadImage = (src) => new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Image could not be loaded"));
    image.src = src;
  });

  const updateComparisonLabels = (comparison, before, after) => {
    if (!comparison) return;
    comparison.dataset.beforeLabel = before;
    comparison.dataset.afterLabel = after;
    const leftLabel = comparison.querySelector(".comparison-before .method-label");
    const rightLabel = comparison.querySelector(".comparison-after .method-label");
    if (leftLabel) leftLabel.textContent = before;
    if (rightLabel) {
      const badge = rightLabel.querySelector("small");
      rightLabel.textContent = `${after} `;
      if (badge) rightLabel.append(badge);
    }
    const range = byId(comparison.dataset.range);
    const row = range && range.closest(".comparison-range");
    if (row) {
      const labels = row.querySelectorAll("label");
      if (labels[0]) labels[0].textContent = before;
      if (labels[1]) labels[1].textContent = after;
    }
    if (range) {
      range.setAttribute("aria-label", `Reveal ${before} and ${after}`);
      range.dispatchEvent(new Event("input"));
    }
  };

  // Image-fitting pairs and their reported metrics always change together.
  const toyComparison = byId("toy-comparison");
  const toyBefore = byId("toy-before");
  const toyAfter = byId("toy-after");
  const toySceneButtons = Array.from(document.querySelectorAll("[data-toy-scene]"));
  const toyViewButtons = Array.from(document.querySelectorAll("[data-toy-view]"));
  let toyRequest = 0;

  const loadToyScene = async (button, quiet = false) => {
    const scene = (media.imageScenes || []).find((entry) => entry.id === button?.dataset.toyScene);
    if (!scene || !toyComparison || !toyBefore || !toyAfter) return;
    const request = ++toyRequest;
    toyComparison.setAttribute("aria-busy", "true");
    try {
      const [before, after] = await Promise.all([
        preloadImage(scene.before.src), preloadImage(scene.after.src)
      ]);
      if (request !== toyRequest) return;
      if (!before.naturalWidth || !before.naturalHeight ||
          before.naturalWidth !== after.naturalWidth || before.naturalHeight !== after.naturalHeight) {
        throw new Error("Image-fitting comparisons require matching image dimensions");
      }
      toyBefore.src = scene.before.src;
      toyAfter.src = scene.after.src;
      toyBefore.alt = `${scene.label} image fitting — Hash encoding`;
      toyAfter.alt = `${scene.label} image fitting — TetraCoder`;
      for (const [element, loaded] of [[toyBefore, before], [toyAfter, after]]) {
        element.setAttribute("width", String(loaded.naturalWidth));
        element.setAttribute("height", String(loaded.naturalHeight));
      }
      setText("toy-before-psnr", scene.before.psnr);
      setText("toy-before-parameters", scene.before.parameters);
      setText("toy-after-psnr", scene.after.psnr);
      setText("toy-after-parameters", scene.after.parameters);
      setPressed(toySceneButtons, button);
      toyComparison.dispatchEvent(new Event("comparisonchange"));
      if (!quiet) setText("toy-status", "");
    } catch {
      if (request === toyRequest) {
        setText("toy-status", "This image pair could not load. The previous images and reported metrics are still shown. Comparison images must have matching dimensions.");
      }
    } finally {
      if (request === toyRequest) toyComparison.removeAttribute("aria-busy");
    }
  };
  toySceneButtons.forEach((button) => button.addEventListener("click", () => loadToyScene(button)));

  const selectToyView = (button) => {
    if (!button || !toyComparison) return;
    const sideBySide = button.dataset.toyView === "side-by-side";
    toyComparison.classList.toggle("side-by-side", sideBySide);
    const rangeRow = byId("toy-range")?.closest(".comparison-range");
    if (rangeRow) rangeRow.hidden = sideBySide;
    setPressed(toyViewButtons, button);
    toyComparison.dispatchEvent(new Event("comparisonchange"));
  };
  toyViewButtons.forEach((button) => button.addEventListener("click", () => selectToyView(button)));
  selectToyView(pressedButton(toyViewButtons));

  const initialToyButton = pressedButton(toySceneButtons);
  if (initialToyButton) loadToyScene(initialToyButton, true);

  const geometry = byId("geometry-comparison");
  const beforeImage = byId("geometry-before");
  const afterImage = byId("geometry-after");
  const missingGeometry = byId("geometry-missing");
  const sceneButtons = Array.from(document.querySelectorAll("[data-scene]"));
  const baselineButtons = Array.from(document.querySelectorAll("[data-baseline]"));
  let desiredScene = pressedButton(sceneButtons)?.dataset.scene;
  let desiredBaseline = pressedButton(baselineButtons)?.dataset.baseline || "tetrasdf";
  let committedScene = desiredScene;
  let committedBaseline = desiredBaseline;
  let geometryRequest = 0;

  const loadGeometry = async (quiet = false) => {
    const scene = (media.meshScenes || []).find((entry) => entry.id === desiredScene);
    if (!scene || !geometry || !beforeImage || !afterImage) return;
    const baselines = scene.baselines || [{ id: "tetrasdf", label: scene.beforeLabel || "TetraSDF", src: scene.before }];
    const baseline = baselines.find((entry) => entry.id === desiredBaseline);
    if (!baseline) return;
    const request = ++geometryRequest;
    geometry.setAttribute("aria-busy", "true");
    try {
      // Do not mix a newly loaded side with a previous scene if a request fails.
      const [ours, reference] = await Promise.all([
        preloadImage(scene.after), baseline.src ? preloadImage(baseline.src) : Promise.resolve(null)
      ]);
      if (request !== geometryRequest) return;
      if (reference && (ours.naturalWidth !== reference.naturalWidth || ours.naturalHeight !== reference.naturalHeight)) {
        throw new Error("Comparison images must use matching dimensions");
      }
      if (!reference && !missingGeometry) throw new Error("Missing-media placeholder unavailable");
      afterImage.src = scene.after;
      afterImage.alt = `${scene.alt} — ${scene.afterLabel || "TetraCoder"}`;
      beforeImage.hidden = !reference;
      if (reference) {
        beforeImage.src = baseline.src;
        beforeImage.alt = `${scene.alt} — ${baseline.label}`;
      }
      if (missingGeometry) {
        missingGeometry.hidden = Boolean(reference);
        const missingTitle = document.createElement("strong");
        const missingInstruction = document.createElement("span");
        missingTitle.textContent = `${scene.label} · ${baseline.label}`;
        missingInstruction.textContent = "Matched render needed.";
        missingGeometry.replaceChildren(missingTitle, missingInstruction);
      }
      const beforeLabel = reference ? baseline.label : `${baseline.id === "mc" ? "MC" : baseline.label} · awaiting media`;
      const oursLabel = scene.afterLabel || "TetraCoder";
      const description = `Compare TetraSDF Large, Marching Cubes, and ${oursLabel}.`;
      setText("geometry-description", `Analytic surface reconstruction on five meshes from the Stanford 3D Scanning Repository. ${reference
        ? description
        : `A matched ${baseline.label} render is still needed for ${scene.label}.`}`);
      updateComparisonLabels(geometry, beforeLabel, oursLabel);
      committedScene = scene.id;
      committedBaseline = baseline.id;
      setPressed(sceneButtons, sceneButtons.find((button) => button.dataset.scene === scene.id));
      setPressed(baselineButtons, baselineButtons.find((button) => button.dataset.baseline === baseline.id));
      baselineButtons.forEach((button) => {
        const option = baselines.find((entry) => entry.id === button.dataset.baseline);
        const availability = button.querySelector("small");
        if (availability) availability.hidden = Boolean(option?.src);
      });
      geometry.dispatchEvent(new Event("comparisonchange"));
      if (!quiet) announce(reference ? "" : `${scene.label}: ${baseline.label} render is awaiting media.`);
    } catch {
      if (request === geometryRequest) {
        desiredScene = committedScene;
        desiredBaseline = committedBaseline;
        announce("The new comparison could not load. The previous scene is still shown. Use images with identical dimensions.");
      }
    } finally {
      if (request === geometryRequest) geometry.removeAttribute("aria-busy");
    }
  };
  sceneButtons.forEach((button) => button.addEventListener("click", () => {
    desiredScene = button.dataset.scene;
    loadGeometry();
  }));
  baselineButtons.forEach((button) => button.addEventListener("click", () => {
    desiredBaseline = button.dataset.baseline;
    loadGeometry();
  }));
  const viewButtons = Array.from(document.querySelectorAll("[data-view]"));
  viewButtons.forEach((button) => button.addEventListener("click", () => {
    if (!geometry) return;
    const sideBySide = button.dataset.view === "side-by-side";
    geometry.classList.toggle("side-by-side", sideBySide);
    const row = byId("geometry-range")?.closest(".comparison-range");
    if (row) row.hidden = sideBySide;
    setPressed(viewButtons, button);
    geometry.dispatchEvent(new Event("comparisonchange"));
  }));
  loadGeometry(true);

  // Play each demonstration when it first enters view. Native
  // controls remain usable without JavaScript and after a blocked autoplay.
  const demoLoops = [
    { video: "encoder-adaptation-video", fallback: "encoder-animation-fallback", status: "encoder-animation-status", error: "The video could not load. Open the initial and final states below to inspect the encoding." },
    { video: "editing-cycle-video", fallback: "editing-animation-fallback", status: "animation-status", error: "The video could not load. A still frame is shown instead." },
    { video: "geometry-editing-video", fallback: "geometry-editing-fallback", status: "geometry-editing-status", error: "The video could not load. A still frame is shown instead." }
  ];
  demoLoops.forEach((entry) => {
    const demoVideo = byId(entry.video);
    if (!demoVideo) return;
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    let observer;
    const playLoop = () => {
      if (!reducedMotion.matches) demoVideo.play().catch(() => {});
    };
    if (!reducedMotion.matches) {
      if ("IntersectionObserver" in window) {
        observer = new IntersectionObserver((entries) => {
          if (entries.some((entry) => entry.isIntersecting)) {
            observer.disconnect();
            playLoop();
          }
        }, { threshold: 0.25 });
        observer.observe(demoVideo);
      } else {
        playLoop();
      }
    }
    reducedMotion.addEventListener("change", (event) => {
      if (event.matches) {
        observer?.disconnect();
        demoVideo.pause();
      }
    });
    const showAnimationFallback = () => {
      observer?.disconnect();
      demoVideo.hidden = true;
      const still = byId(entry.fallback);
      if (still) still.hidden = false;
      setText(entry.status, entry.error);
    };
    demoVideo.addEventListener("error", showAnimationFallback);
    if (demoVideo.error) showAnimationFallback();
  });

  const videoSection = byId("video-showcase");
  const videoGrid = byId("video-grid");
  if (videoSection && videoGrid && Array.isArray(media.videoShowcase)) {
    media.videoShowcase.filter((entry) => entry.src).forEach((entry) => {
      const figure = document.createElement("figure");
      const title = document.createElement("h3");
      const video = document.createElement("video");
      const status = document.createElement("p");
      status.className = "status-message";
      status.setAttribute("role", "status");
      title.textContent = entry.title || "Video demonstration";
      video.src = entry.src;
      video.controls = true;
      video.playsInline = true;
      video.preload = "metadata";
      video.setAttribute("aria-label", title.textContent);
      if (entry.poster) video.poster = entry.poster;
      video.textContent = "Your browser does not support this video.";
      video.addEventListener("error", () => {
        status.textContent = "Video unavailable.";
      });
      figure.append(title, video, status);
      videoGrid.append(figure);
    });
    videoSection.hidden = videoGrid.children.length === 0;
  }

  const copyButton = byId("copy-bibtex");
  const bibtex = byId("bibtex");
  copyButton?.addEventListener("click", async () => {
    if (!bibtex) return;
    try {
      if (!navigator.clipboard?.writeText) throw new Error("Clipboard unavailable");
      await navigator.clipboard.writeText(bibtex.textContent.trim());
      setText("copy-status", "BibTeX copied.");
    } catch {
      const selection = window.getSelection();
      if (selection) {
        const range = document.createRange();
        range.selectNodeContents(bibtex);
        selection.removeAllRanges();
        selection.addRange(range);
      }
      setText("copy-status", "Select and copy the citation below with Ctrl+C or ⌘C.");
    }
  });
})();
