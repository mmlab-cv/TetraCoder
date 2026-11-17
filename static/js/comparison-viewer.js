/* Synchronized image inspection for each independent comparison viewer.
 * CSS: centered, object-fit:contain images use
 * transform: translate(var(--view-x), var(--view-y)) scale(var(--view-scale)).
 * Dispatch comparisonchange after committing a scene or changing its layout.
 */
(() => {
  "use strict";

  const MIN_ZOOM = 1;
  const MAX_ZOOM = 8;
  const EPSILON = 0.00001;
  const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));

  document.querySelectorAll(".comparison[data-range]").forEach((comparison) => {
    const range = document.getElementById(comparison.dataset.range);
    const afterLayer = comparison.querySelector(".comparison-after");
    const beforeLayer = comparison.querySelector(".comparison-before");
    const sourceImage = afterLayer?.querySelector("img");
    if (!range || !afterLayer || !sourceImage) return;

    const output = document.getElementById(range.id.replace(/-range$/, "-position"));
    const vertical = comparison.dataset.orientation === "vertical";
    const controls = Array.from(document.querySelectorAll("[data-comparison-controls]"))
      .filter((element) => element.dataset.comparisonControls === comparison.id);
    const state = { zoom: 1, centerX: 0.5, centerY: 0.5 };
    let gesture = null;

    // The image element may contain letterboxing. Bounds use the actual fitted
    // image, never the full element box, so zooming cannot expose extra blank space.
    const measure = () => {
      const rectangle = afterLayer.getBoundingClientRect();
      const width = rectangle.width;
      const height = rectangle.height;
      const imageWidth = sourceImage.naturalWidth || Number(sourceImage.getAttribute("width"));
      const imageHeight = sourceImage.naturalHeight || Number(sourceImage.getAttribute("height"));
      if (!(width > 0 && height > 0 && imageWidth > 0 && imageHeight > 0)) return null;
      const fit = Math.min(width / imageWidth, height / imageHeight);
      return { width, height, contentWidth: imageWidth * fit, contentHeight: imageHeight * fit };
    };

    const updateRange = (value) => {
      const numeric = Number(value);
      const position = Math.round(clamp(Number.isFinite(numeric) ? numeric : 50, 0, 100));
      const before = comparison.dataset.beforeLabel || "Before";
      const after = comparison.dataset.afterLabel || "After";
      range.value = String(position);
      comparison.style.setProperty("--position", `${position}%`);
      range.setAttribute("aria-valuetext", vertical
        ? `${position}% ${before} above, ${100 - position}% ${after} below`
        : `${position}% ${before}, ${100 - position}% ${after}`);
      if (output) output.textContent = `${position}% / ${100 - position}%`;
    };

    const cancelGesture = () => {
      const previous = gesture;
      gesture = null;
      comparison.classList.remove("is-panning");
      if (previous && comparison.hasPointerCapture(previous.id)) {
        comparison.releasePointerCapture(previous.id);
      }
    };

    const updateControls = () => {
      controls.forEach((toolbar) => {
        const value = toolbar.querySelector("[data-zoom-value]");
        if (value) value.textContent = `${Math.round(state.zoom * 100)}%`;
        toolbar.querySelectorAll("[data-zoom-out]").forEach((button) => {
          button.disabled = state.zoom <= MIN_ZOOM + EPSILON;
        });
        toolbar.querySelectorAll("[data-zoom-in]").forEach((button) => {
          button.disabled = state.zoom >= MAX_ZOOM - EPSILON;
        });
        toolbar.querySelectorAll("[data-zoom-preset]").forEach((button) => {
          button.setAttribute("aria-pressed", String(Math.abs(state.zoom - Number(button.dataset.zoomPreset)) < EPSILON));
        });
      });
    };

    const applyView = (geometry = measure()) => {
      let x = 0;
      let y = 0;
      if (geometry) {
        const scaledWidth = geometry.contentWidth * state.zoom;
        const scaledHeight = geometry.contentHeight * state.zoom;
        const limitX = Math.max(0, (scaledWidth - geometry.width) / 2);
        const limitY = Math.max(0, (scaledHeight - geometry.height) / 2);
        x = clamp((0.5 - state.centerX) * scaledWidth, -limitX, limitX);
        y = clamp((0.5 - state.centerY) * scaledHeight, -limitY, limitY);
        state.centerX = 0.5 - x / scaledWidth;
        state.centerY = 0.5 - y / scaledHeight;
      }
      comparison.style.setProperty("--view-scale", String(state.zoom));
      comparison.style.setProperty("--view-x", `${x}px`);
      comparison.style.setProperty("--view-y", `${y}px`);
      const zoomed = state.zoom > MIN_ZOOM + EPSILON;
      comparison.classList.toggle("is-zoomed", zoomed);
      // One-finger gestures pan only while zoomed. Browser pinch zoom remains
      // permitted; this controller does not capture secondary touch pointers.
      comparison.style.touchAction = zoomed ? "pinch-zoom" : "pan-y pinch-zoom";
      updateControls();
      return { geometry, x, y };
    };

    // In side-by-side mode the clicked half is its own viewport. Map its local
    // coordinates to the shared after-layer viewport before finding a source pixel.
    const paneForEvent = (event) => {
      if (!comparison.classList.contains("side-by-side")) return afterLayer;
      const targetPane = event.target?.closest?.(".comparison-before, .comparison-after");
      if (targetPane === beforeLayer || targetPane === afterLayer) return targetPane;
      const before = beforeLayer?.getBoundingClientRect();
      if (before && event.clientX >= before.left && event.clientX <= before.right) return beforeLayer;
      return afterLayer;
    };
    const pointInPane = (event, geometry, pane = paneForEvent(event)) => {
      const bounds = pane.getBoundingClientRect();
      return {
        x: bounds.width ? (event.clientX - bounds.left) * geometry.width / bounds.width : geometry.width / 2,
        y: bounds.height ? (event.clientY - bounds.top) * geometry.height / bounds.height : geometry.height / 2
      };
    };

    const reset = () => {
      cancelGesture();
      state.zoom = MIN_ZOOM;
      state.centerX = state.centerY = 0.5;
      applyView();
    };
    const zoomTo = (value, event) => {
      const numeric = Number(value);
      if (!Number.isFinite(numeric)) return;
      cancelGesture();
      const nextZoom = clamp(numeric, MIN_ZOOM, MAX_ZOOM);
      if (nextZoom <= MIN_ZOOM + EPSILON) {
        reset();
        return;
      }
      const geometry = measure();
      if (geometry && event) {
        const current = applyView(geometry);
        const point = pointInPane(event, geometry);
        const focalX = 0.5 + (point.x - geometry.width / 2 - current.x) / (geometry.contentWidth * state.zoom);
        const focalY = 0.5 + (point.y - geometry.height / 2 - current.y) / (geometry.contentHeight * state.zoom);
        const nextX = point.x - geometry.width / 2 - (focalX - 0.5) * geometry.contentWidth * nextZoom;
        const nextY = point.y - geometry.height / 2 - (focalY - 0.5) * geometry.contentHeight * nextZoom;
        state.centerX = 0.5 - nextX / (geometry.contentWidth * nextZoom);
        state.centerY = 0.5 - nextY / (geometry.contentHeight * nextZoom);
      }
      state.zoom = nextZoom;
      applyView(geometry);
    };
    const panBy = (x, y, geometry = measure()) => {
      if (!geometry || state.zoom <= MIN_ZOOM + EPSILON) return;
      state.centerX -= x / (geometry.contentWidth * state.zoom);
      state.centerY -= y / (geometry.contentHeight * state.zoom);
      applyView(geometry);
    };

    range.addEventListener("input", () => updateRange(range.value));
    if (vertical) {
      range.setAttribute("aria-orientation", "vertical");
      range.addEventListener("keydown", (event) => {
        const value = Number(range.value);
        const positions = {
          ArrowUp: value - 1, ArrowDown: value + 1,
          ArrowLeft: value - 1, ArrowRight: value + 1,
          PageUp: value - 10, PageDown: value + 10,
          Home: 0, End: 100
        };
        if (!(event.key in positions)) return;
        event.preventDefault();
        updateRange(positions[event.key]);
      });
    }
    const rangeFromPointer = (event) => {
      const bounds = comparison.getBoundingClientRect();
      if (vertical && bounds.height) updateRange((event.clientY - bounds.top) / bounds.height * 100);
      else if (!vertical && bounds.width) updateRange((event.clientX - bounds.left) / bounds.width * 100);
    };
    const onDivider = (event) => Boolean(event.target?.closest?.(".comparison-divider"));
    const onControl = (event) => Boolean(event.target?.closest?.("button, input, select, textarea, a"));
    comparison.querySelectorAll(".comparison-divider").forEach((divider) => {
      divider.style.touchAction = "pinch-zoom";
    });

    comparison.addEventListener("pointerdown", (event) => {
      if (!event.isPrimary) {
        if (event.pointerType === "touch") cancelGesture();
        return;
      }
      if (event.button !== 0 || onControl(event)) return;
      const sideBySide = comparison.classList.contains("side-by-side");
      const divider = onDivider(event) && !sideBySide;
      const zoomed = state.zoom > MIN_ZOOM + EPSILON;
      if (!divider && !zoomed && (vertical || sideBySide)) return;
      const type = divider || !zoomed ? "divider" : "pan";
      cancelGesture();
      gesture = { id: event.pointerId, type, x: event.clientX, y: event.clientY, pane: paneForEvent(event) };
      comparison.setPointerCapture(event.pointerId);
      if (type === "divider") rangeFromPointer(event);
      else {
        comparison.classList.add("is-panning");
        comparison.focus({ preventScroll: true });
      }
      // Keep native scrolling available for unzoomed image swipes. CSS handles
      // the permitted touch directions and pointercancel when scrolling wins.
      if (type === "pan" || divider) event.preventDefault();
    });
    const movePointer = (event) => {
      if (!gesture || gesture.id !== event.pointerId) return;
      if (gesture.type === "divider") {
        rangeFromPointer(event);
      } else {
        const geometry = measure();
        if (!geometry) return;
        const pane = gesture.pane.getBoundingClientRect();
        const x = (event.clientX - gesture.x) * (pane.width ? geometry.width / pane.width : 1);
        const y = (event.clientY - gesture.y) * (pane.height ? geometry.height / pane.height : 1);
        panBy(x, y, geometry);
        gesture.x = event.clientX;
        gesture.y = event.clientY;
      }
    };
    comparison.addEventListener("pointermove", movePointer);
    comparison.addEventListener("pointerup", (event) => {
      if (!gesture || gesture.id !== event.pointerId) return;
      movePointer(event);
      cancelGesture();
    });
    comparison.addEventListener("pointercancel", (event) => {
      if (gesture?.id === event.pointerId) cancelGesture();
    });
    comparison.addEventListener("lostpointercapture", (event) => {
      if (gesture?.id === event.pointerId) {
        gesture = null;
        comparison.classList.remove("is-panning");
      }
    });
    comparison.addEventListener("dragstart", (event) => event.preventDefault());
    comparison.addEventListener("dblclick", (event) => {
      // At fit size the first click moves the divider under the pointer. The
      // second click can therefore target its handle; still honor the zoom.
      if (event.button !== 0 || onControl(event)) return;
      event.preventDefault();
      zoomTo(state.zoom >= MAX_ZOOM - EPSILON ? MIN_ZOOM : state.zoom * 2, event);
    });
    comparison.addEventListener("wheel", (event) => {
      if (!(event.ctrlKey || event.metaKey) || !event.deltaY) return;
      event.preventDefault();
      const geometry = measure();
      const unit = event.deltaMode === 1 ? 16 : event.deltaMode === 2 ? (geometry?.height || 600) : 1;
      const delta = clamp(event.deltaY * unit, -240, 240);
      zoomTo(state.zoom * Math.exp(-delta * 0.002), event);
    }, { passive: false });

    if (!comparison.hasAttribute("tabindex")) comparison.setAttribute("tabindex", "0");
    comparison.addEventListener("keydown", (event) => {
      if (event.target !== comparison || event.altKey || event.ctrlKey || event.metaKey) return;
      if (["+", "=", "Add"].includes(event.key)) {
        event.preventDefault();
        zoomTo(state.zoom * Math.SQRT2);
      } else if (["-", "_", "Subtract"].includes(event.key)) {
        event.preventDefault();
        zoomTo(state.zoom / Math.SQRT2);
      } else if (event.key === "0" || event.key === "Escape") {
        event.preventDefault();
        reset();
      } else if (state.zoom > MIN_ZOOM + EPSILON && ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
        event.preventDefault();
        cancelGesture();
        const distance = event.shiftKey ? 80 : 40;
        panBy(event.key === "ArrowRight" ? distance : event.key === "ArrowLeft" ? -distance : 0,
          event.key === "ArrowDown" ? distance : event.key === "ArrowUp" ? -distance : 0);
      }
    });
    controls.forEach((toolbar) => {
      toolbar.querySelectorAll("[data-zoom-in]").forEach((button) => button.addEventListener("click", () => zoomTo(state.zoom * Math.SQRT2)));
      toolbar.querySelectorAll("[data-zoom-out]").forEach((button) => button.addEventListener("click", () => zoomTo(state.zoom / Math.SQRT2)));
      toolbar.querySelectorAll("[data-zoom-reset]").forEach((button) => button.addEventListener("click", reset));
      toolbar.querySelectorAll("[data-zoom-preset]").forEach((button) => button.addEventListener("click", () => zoomTo(Number(button.dataset.zoomPreset))));
    });

    const refresh = () => {
      cancelGesture();
      applyView();
      updateRange(range.value);
    };
    comparison.addEventListener("comparisonchange", refresh);
    comparison.querySelectorAll("img").forEach((image) => image.addEventListener("load", refresh));
    if (typeof ResizeObserver !== "undefined") {
      const observer = new ResizeObserver(refresh);
      observer.observe(comparison);
      observer.observe(afterLayer);
    } else {
      window.addEventListener("resize", refresh);
    }
    window.addEventListener("blur", cancelGesture);
    updateRange(range.value);
    applyView();
    controls.forEach((toolbar) => { toolbar.hidden = false; });
  });
})();
