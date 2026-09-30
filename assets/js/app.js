import {
  fallbackImage,
  getLocationPhotos,
  locations,
  siteDisplay,
  siteProfile,
} from "./site-data.js?v=20260929l";

const body = document.body;
const page = body.dataset.page;
const SVG_NS = "http://www.w3.org/2000/svg";

function withFallback(img) {
  img.addEventListener("error", () => {
    if (img.dataset.fallbackApplied === "true") {
      return;
    }
    img.dataset.fallbackApplied = "true";
    img.src = fallbackImage;
  });
}

function setImageSource(img, src, alt) {
  img.dataset.fallbackApplied = "false";
  img.alt = alt;
  img.src = src;
}

function renderSocialLinks(container) {
  if (!container) {
    return;
  }
  container.innerHTML = "";
  siteProfile.socialLinks.forEach((link) => {
    const anchor = document.createElement("a");
    anchor.href = link.url;
    anchor.target = anchor.href.startsWith("mailto:") ? "_self" : "_blank";
    anchor.rel = anchor.target === "_blank" ? "noreferrer" : "";
    anchor.textContent = link.label;
    container.append(anchor);
  });
}

function renderChips(container, items, chipClass = "chip") {
  if (!container) {
    return;
  }
  container.innerHTML = "";
  items.forEach((item) => {
    const chip = document.createElement("span");
    chip.className = chipClass;
    chip.textContent = item;
    container.append(chip);
  });
}

function trapFocus(container, event) {
  if (event.key !== "Tab") {
    return;
  }
  const controls = Array.from(
    container.querySelectorAll(
      'button:not([hidden]), a[href]:not([hidden]), [tabindex="0"]',
    ),
  ).filter((control) => !control.hasAttribute("disabled"));
  if (!controls.length) {
    return;
  }

  const first = controls[0];
  const last = controls[controls.length - 1];
  if (event.shiftKey && document.activeElement === first) {
    event.preventDefault();
    last.focus();
  } else if (!event.shiftKey && document.activeElement === last) {
    event.preventDefault();
    first.focus();
  }
}

function initHomePage() {
  const mapWidth = 1000;
  const mapHeight = 500;
  const zoomLevels = [1, 1.5, 2, 3];
  const state = {
    activeLocationIndex: 0,
    activePhotoIndex: 0,
    hidePreviewTimer: 0,
    lastMapTrigger: null,
    lastPhotoTrigger: null,
    zoomIndex: 0,
    viewX: 0,
    viewY: 0,
    focusPoint: null,
    drag: null,
    countryFocus: false,
  };

  const journeyCount = document.querySelector("#journey-count");
  const mapCanvas = document.querySelector("#map-canvas");
  const worldMap = document.querySelector("#world-map");
  const countryLayer = document.querySelector("#country-layer");
  const markerLayer = document.querySelector("#marker-layer");
  const mapStatus = document.querySelector("#map-status");
  const mapHoverCard = document.querySelector("#map-hover-card");
  const mapCardImage = document.querySelector("#map-card-image");
  const mapCardRegion = document.querySelector("#map-card-region");
  const mapCardTitle = document.querySelector("#map-card-title");
  const mapCardMeta = document.querySelector("#map-card-meta");
  const mapCardOpen = document.querySelector("#map-card-open");
  const mapZoomIn = document.querySelector("#map-zoom-in");
  const mapZoomOut = document.querySelector("#map-zoom-out");
  const mapReturn = document.querySelector("#map-return");
  const socialLinks = document.querySelector("#social-links");

  const journeyWall = document.querySelector("#journey-wall");
  const journeyWallClose = document.querySelector("#journey-wall-close");
  const journeyWallRegion = document.querySelector("#journey-wall-region");
  const journeyWallTitle = document.querySelector("#journey-wall-title");
  const journeyWallMeta = document.querySelector("#journey-wall-meta");
  const journeyWallSummary = document.querySelector("#journey-wall-summary");
  const journeyWallTags = document.querySelector("#journey-wall-tags");
  const journeyPhotoGrid = document.querySelector("#journey-photo-grid");

  const modal = document.querySelector("#photo-modal");
  const modalCard = document.querySelector(".modal-card");
  const modalImage = document.querySelector("#modal-image");
  const modalLocation = document.querySelector("#modal-location");
  const modalTitle = document.querySelector("#modal-title");
  const modalSubtitle = document.querySelector("#modal-subtitle");
  const modalDescription = document.querySelector("#modal-description");
  const modalTags = document.querySelector("#modal-tags");
  const modalDate = document.querySelector("#modal-date");
  const modalClose = document.querySelector("#modal-close");
  const modalPrev = document.querySelector("#modal-prev");
  const modalNext = document.querySelector("#modal-next");

  journeyCount.textContent = String(locations.length).padStart(2, "0");
  renderSocialLinks(socialLinks);
  withFallback(mapCardImage);
  withFallback(modalImage);

  function projectCoordinates(lng, lat) {
    return [((lng + 180) / 360) * mapWidth, ((90 - lat) / 180) * mapHeight];
  }

  function currentMapView() {
    const zoom = zoomLevels[state.zoomIndex];
    return {
      zoom,
      width: mapWidth / zoom,
      height: mapHeight / zoom,
    };
  }

  function clamp(value, minimum, maximum) {
    return Math.min(Math.max(value, minimum), maximum);
  }

  function applyMapView() {
    const view = currentMapView();
    state.viewX = clamp(state.viewX, 0, mapWidth - view.width);
    state.viewY = clamp(state.viewY, 0, mapHeight - view.height);
    worldMap.setAttribute(
      "viewBox",
      `${state.viewX.toFixed(2)} ${state.viewY.toFixed(2)} ${view.width.toFixed(2)} ${view.height.toFixed(2)}`,
    );
    worldMap.classList.toggle("is-zoomed", state.zoomIndex > 0);
    mapZoomIn.disabled = state.zoomIndex === zoomLevels.length - 1;
    mapZoomOut.disabled = state.zoomIndex === 0;
    mapReturn.hidden = !state.countryFocus;
  }

  function zoomMap(direction) {
    const nextZoomIndex = clamp(
      state.zoomIndex + direction,
      0,
      zoomLevels.length - 1,
    );
    if (nextZoomIndex === state.zoomIndex) {
      return;
    }

    const previousView = currentMapView();
    const focus = state.focusPoint || {
      x: state.viewX + previousView.width / 2,
      y: state.viewY + previousView.height / 2,
    };
    const anchorX = clamp((focus.x - state.viewX) / previousView.width, 0, 1);
    const anchorY = clamp((focus.y - state.viewY) / previousView.height, 0, 1);

    state.zoomIndex = nextZoomIndex;
    if (state.zoomIndex === 0) {
      state.countryFocus = false;
      clearMapSelection();
    }
    const nextView = currentMapView();
    state.viewX = focus.x - anchorX * nextView.width;
    state.viewY = focus.y - anchorY * nextView.height;
    hidePreview();
    applyMapView();
  }

  function resetMapView() {
    state.zoomIndex = 0;
    state.viewX = 0;
    state.viewY = 0;
    state.focusPoint = null;
    state.countryFocus = false;
    hidePreview();
    updateMapSelection(-1);
    applyMapView();
  }

  function mapPointFromPointer(event) {
    const matrix = worldMap.getScreenCTM();
    if (!matrix) {
      return null;
    }
    const point = worldMap.createSVGPoint();
    point.x = event.clientX;
    point.y = event.clientY;
    const mappedPoint = point.matrixTransform(matrix.inverse());
    return { x: mappedPoint.x, y: mappedPoint.y };
  }

  function startMapDrag(event) {
    const isInteractiveTarget =
      event.target instanceof Element &&
      event.target.closest(".map-marker, .map-country.is-visited");
    if (state.zoomIndex === 0 || event.button !== 0 || isInteractiveTarget) {
      return;
    }

    const view = currentMapView();
    state.drag = {
      pointerId: event.pointerId,
      clientX: event.clientX,
      clientY: event.clientY,
      viewX: state.viewX,
      viewY: state.viewY,
      viewWidth: view.width,
      viewHeight: view.height,
    };
    worldMap.setPointerCapture(event.pointerId);
    worldMap.classList.add("is-dragging");
    hidePreview();
    event.preventDefault();
  }

  function moveMapPointer(event) {
    if (!state.drag || state.drag.pointerId !== event.pointerId) {
      if (mapHoverCard.hidden) {
        const point = mapPointFromPointer(event);
        if (point) {
          state.focusPoint = point;
        }
      }
      return;
    }

    const bounds = worldMap.getBoundingClientRect();
    const deltaX = event.clientX - state.drag.clientX;
    const deltaY = event.clientY - state.drag.clientY;
    state.viewX = state.drag.viewX - (deltaX / bounds.width) * state.drag.viewWidth;
    state.viewY = state.drag.viewY - (deltaY / bounds.height) * state.drag.viewHeight;
    applyMapView();
  }

  function endMapDrag(event) {
    if (!state.drag || state.drag.pointerId !== event.pointerId) {
      return;
    }
    if (worldMap.hasPointerCapture(event.pointerId)) {
      worldMap.releasePointerCapture(event.pointerId);
    }
    state.drag = null;
    worldMap.classList.remove("is-dragging");
  }

  function ringToPath(ring) {
    let path = "";
    let previousLng = null;
    ring.forEach(([lng, lat], index) => {
      const [x, y] = projectCoordinates(lng, lat);
      const crossesEdge = previousLng !== null && Math.abs(lng - previousLng) > 180;
      path += index === 0 || crossesEdge ? `M${x.toFixed(2)},${y.toFixed(2)}` : `L${x.toFixed(2)},${y.toFixed(2)}`;
      previousLng = lng;
    });
    return `${path}Z`;
  }

  function geometryToPath(geometry) {
    if (!geometry) {
      return "";
    }
    if (geometry.type === "Polygon") {
      return geometry.coordinates.map(ringToPath).join("");
    }
    if (geometry.type === "MultiPolygon") {
      return geometry.coordinates
        .flatMap((polygon) => polygon.map(ringToPath))
        .join("");
    }
    return "";
  }

  function locationForCountry(countryCode) {
    return locations.findIndex((location) => location.countryCodes.includes(countryCode));
  }

  function previewPosition(location) {
    const [x, y] = projectCoordinates(location.lng, location.lat);
    const view = currentMapView();
    const relativeX = ((x - state.viewX) / view.width) * mapWidth;
    const relativeY = ((y - state.viewY) / view.height) * mapHeight;
    let translateX = "18px";
    let translateY = "-50%";
    if (relativeX > 700) {
      translateX = "calc(-100% - 18px)";
    }
    if (relativeY < 120) {
      translateY = "12px";
    } else if (relativeY > 400) {
      translateY = "calc(-100% - 12px)";
    }
    return { x: relativeX, y: relativeY, translateX, translateY };
  }

  function cancelPreviewHide() {
    if (state.hidePreviewTimer) {
      window.clearTimeout(state.hidePreviewTimer);
      state.hidePreviewTimer = 0;
    }
  }

  function hidePreview() {
    cancelPreviewHide();
    mapHoverCard.hidden = true;
  }

  function schedulePreviewHide() {
    cancelPreviewHide();
    state.hidePreviewTimer = window.setTimeout(hidePreview, 140);
  }

  function showPreview(index, trigger) {
    const location = locations[index];
    if (!location) {
      return;
    }
    state.activeLocationIndex = index;
    state.lastMapTrigger = trigger || null;
    const [focusX, focusY] = projectCoordinates(location.lng, location.lat);
    state.focusPoint = { x: focusX, y: focusY };
    const position = previewPosition(location);
    mapHoverCard.style.left = `${(position.x / mapWidth) * 100}%`;
    mapHoverCard.style.top = `${(position.y / mapHeight) * 100}%`;
    mapHoverCard.style.setProperty("--tooltip-x", position.translateX);
    mapHoverCard.style.setProperty("--tooltip-y", position.translateY);
    setImageSource(mapCardImage, location.heroImage, `${location.name}旅行照片`);
    mapCardRegion.textContent = location.country_or_region;
    mapCardTitle.textContent = `${location.name} / ${location.englishName}`;
    mapCardMeta.textContent = [
      location.travelDateLabel,
      `${location.featuredCount} 张照片`,
    ].filter(Boolean).join(" · ");
    mapHoverCard.hidden = false;
    cancelPreviewHide();
    updateMapSelection(index);
  }

  function clearMapSelection() {
    countryLayer.querySelectorAll(".map-country.is-selected").forEach((country) => {
      country.classList.remove("is-selected");
    });
    markerLayer.querySelectorAll(".map-marker.is-selected").forEach((marker) => {
      marker.classList.remove("is-selected");
    });
  }

  function updateMapSelection(index) {
    clearMapSelection();
    const location = locations[index];
    if (!location) {
      return;
    }
    location.countryCodes.forEach((code) => {
      countryLayer.querySelector(`[data-country-code="${code}"]`)?.classList.add("is-selected");
    });
    markerLayer.querySelector(`[data-location-index="${index}"]`)?.classList.add("is-selected");
  }

  function focusCountry(path, index) {
    const bounds = path.getBBox();
    const paddedWidth = Math.max(bounds.width * 1.35, 1);
    const paddedHeight = Math.max(bounds.height * 1.35, 1);
    const fittingZoom = Math.min(
      zoomLevels[zoomLevels.length - 1],
      mapWidth / paddedWidth,
      mapHeight / paddedHeight,
    );
    let nextZoomIndex = 0;
    zoomLevels.forEach((zoom, zoomIndex) => {
      if (zoom <= fittingZoom) {
        nextZoomIndex = zoomIndex;
      }
    });
    nextZoomIndex = Math.max(nextZoomIndex, 1);

    const centerX = bounds.x + bounds.width / 2;
    const centerY = bounds.y + bounds.height / 2;
    state.activeLocationIndex = index;
    state.zoomIndex = nextZoomIndex;
    state.focusPoint = { x: centerX, y: centerY };
    state.countryFocus = true;
    state.lastMapTrigger = path;
    const view = currentMapView();
    state.viewX = centerX - view.width / 2;
    state.viewY = centerY - view.height / 2;

    clearMapSelection();
    path.classList.add("is-selected");
    const countryCode = path.dataset.countryCode;
    locations.forEach((location, locationIndex) => {
      if (location.countryCodes.includes(countryCode)) {
        markerLayer
          .querySelector(`[data-location-index="${locationIndex}"]`)
          ?.classList.add("is-selected");
      }
    });
    hidePreview();
    applyMapView();
  }

  function addInteractiveHandlers(element, index, activate = openJourneyWall) {
    element.addEventListener("pointerenter", () => showPreview(index, element));
    element.addEventListener("pointerleave", schedulePreviewHide);
    element.addEventListener("focus", () => showPreview(index, element));
    element.addEventListener("blur", schedulePreviewHide);
    element.addEventListener("click", () => activate(index, element));
    element.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        activate(index, element);
      }
    });
  }

  function renderCountries(featureCollection) {
    const fragment = document.createDocumentFragment();
    featureCollection.features.forEach((feature) => {
      const countryCode =
        feature.properties.ISO_A2 === "-99"
          ? feature.properties.ISO_A2_EH
          : feature.properties.ISO_A2;
      const locationIndex = locationForCountry(countryCode);
      const path = document.createElementNS(SVG_NS, "path");
      path.setAttribute("d", geometryToPath(feature.geometry));
      path.setAttribute("class", "map-country");
      path.dataset.countryCode = countryCode;
      path.dataset.countryName = feature.properties.NAME_ZH || feature.properties.NAME || "";

      if (locationIndex >= 0) {
        path.classList.add("is-visited");
        path.setAttribute("role", "button");
        path.setAttribute("tabindex", "0");
        path.setAttribute("aria-label", `聚焦查看${path.dataset.countryName}`);
        addInteractiveHandlers(path, locationIndex, (index, element) => {
          focusCountry(element, index);
        });
      }
      fragment.append(path);
    });
    countryLayer.replaceChildren(fragment);
  }

  function renderMarkers() {
    const fragment = document.createDocumentFragment();
    locations.forEach((location, index) => {
      const [x, y] = projectCoordinates(location.lng, location.lat);
      const marker = document.createElementNS(SVG_NS, "g");
      marker.setAttribute("class", "map-marker");
      marker.setAttribute("transform", `translate(${x.toFixed(2)} ${y.toFixed(2)})`);
      marker.setAttribute("role", "button");
      marker.setAttribute("tabindex", "0");
      marker.setAttribute("aria-label", `打开${location.name}旅行照片墙`);
      marker.dataset.locationIndex = String(index);
      marker.dataset.countryCode = location.countryCodes[0] ?? "";

      const pulse = document.createElementNS(SVG_NS, "circle");
      pulse.setAttribute("class", "map-marker-pulse");
      pulse.setAttribute("r", "13");

      const dot = document.createElementNS(SVG_NS, "circle");
      dot.setAttribute("class", "map-marker-dot");
      dot.setAttribute("r", "4.5");

      const label = document.createElementNS(SVG_NS, "text");
      label.setAttribute("class", "map-marker-label");
      label.setAttribute("x", "10");
      label.setAttribute("y", "4");
      label.textContent = location.englishName;

      marker.append(pulse, dot, label);
      addInteractiveHandlers(marker, index);
      fragment.append(marker);
    });
    markerLayer.replaceChildren(fragment);
  }

  async function renderWorldMap() {
    renderMarkers();
    try {
      const response = await fetch("./assets/data/world-countries.geojson?v=20260928c");
      if (!response.ok) {
        throw new Error(`Map data request failed: ${response.status}`);
      }
      const featureCollection = await response.json();
      renderCountries(featureCollection);
      mapStatus.hidden = true;
      mapCanvas.setAttribute("aria-busy", "false");
    } catch (error) {
      mapStatus.textContent = "世界地图暂时无法载入，仍可通过地点标记浏览旅行。";
      mapCanvas.setAttribute("aria-busy", "false");
      console.error(error);
    }
  }

  function buildWallPhoto(photo, index) {
    const button = document.createElement("button");
    button.type = "button";
    button.className = `journey-photo-card${index === 0 ? " is-featured" : ""}`;
    button.setAttribute("aria-label", `查看${photo.title}`);

    const image = document.createElement("img");
    image.width = 1600;
    image.height = 1100;
    image.loading = index === 0 ? "eager" : "lazy";
    image.decoding = "async";
    setImageSource(image, photo.thumbnailUrl, photo.alt);
    withFallback(image);

    const copy = document.createElement("span");
    copy.className = "journey-photo-copy";
    const title = document.createElement("strong");
    title.textContent = photo.title;
    const subtitle = document.createElement("span");
    subtitle.textContent = photo.subtitle;
    copy.append(title, subtitle);

    button.append(image, copy);
    button.addEventListener("click", () => openModal(index, button));
    return button;
  }

  function renderJourneyWall(index) {
    const location = locations[index];
    const photos = getLocationPhotos(location.id);
    state.activeLocationIndex = index;
    journeyWallRegion.textContent = location.country_or_region;
    journeyWallTitle.textContent = `${location.name} / ${location.englishName}`;
    journeyWallMeta.textContent = [
      location.travelDateLabel,
      `${photos.length} 张照片`,
    ].filter(Boolean).join(" · ");
    journeyWallSummary.textContent = location.summary;
    journeyWallTags.innerHTML = "";
    location.heroTags.forEach((tag) => {
      const span = document.createElement("span");
      span.textContent = tag;
      journeyWallTags.append(span);
    });
    journeyPhotoGrid.replaceChildren(
      ...photos.map((photo, photoIndex) => buildWallPhoto(photo, photoIndex)),
    );
    document.title = `${siteProfile.siteTitle} | ${location.englishName}`;
  }

  function openJourneyWall(index, trigger) {
    renderJourneyWall(index);
    state.lastMapTrigger = trigger || state.lastMapTrigger;
    hidePreview();
    journeyWall.hidden = false;
    body.classList.add("journey-open");
    journeyWall.scrollTop = 0;
    journeyWallClose.focus();
  }

  function closeJourneyWall() {
    if (journeyWall.hidden) {
      return;
    }
    journeyWall.hidden = true;
    body.classList.remove("journey-open");
    document.title = siteProfile.siteTitle;
    if (state.lastMapTrigger instanceof Element) {
      state.lastMapTrigger.focus({ preventScroll: true });
    }
  }

  function openModal(photoIndex, trigger) {
    const location = locations[state.activeLocationIndex];
    const photos = getLocationPhotos(location.id);
    const photo = photos[photoIndex];
    if (!photo) {
      return;
    }

    state.activePhotoIndex = photoIndex;
    state.lastPhotoTrigger = trigger || null;
    modal.hidden = false;
    body.classList.add("modal-open");
    modalCard.scrollTop = 0;
    setImageSource(modalImage, photo.imageUrl, photo.alt);
    modalLocation.textContent = `${location.name} / ${location.country_or_region}`;
    modalTitle.textContent = photo.title;
    modalSubtitle.textContent = photo.subtitle;
    modalDescription.textContent = photo.description;
    renderChips(modalTags, [photo.slotLabel, ...photo.badges], "chip chip-light");
    const shouldShowDate = siteDisplay.showPhotoDate && Boolean(photo.captureDateLabel);
    modalDate.hidden = !shouldShowDate;
    modalDate.textContent = shouldShowDate ? `拍摄时间 · ${photo.captureDateLabel}` : "";
    modalClose.focus();
  }

  function closeModal() {
    if (modal.hidden) {
      return;
    }
    modal.hidden = true;
    body.classList.remove("modal-open");
    if (state.lastPhotoTrigger instanceof Element) {
      state.lastPhotoTrigger.focus({ preventScroll: true });
    }
  }

  function stepModal(direction) {
    const location = locations[state.activeLocationIndex];
    const photos = getLocationPhotos(location.id);
    const nextIndex = (state.activePhotoIndex + direction + photos.length) % photos.length;
    openModal(nextIndex, state.lastPhotoTrigger);
  }

  mapHoverCard.addEventListener("pointerenter", cancelPreviewHide);
  mapHoverCard.addEventListener("pointerleave", schedulePreviewHide);
  mapCardOpen.addEventListener("click", () => {
    openJourneyWall(state.activeLocationIndex, state.lastMapTrigger);
  });
  mapZoomIn.addEventListener("click", () => zoomMap(1));
  mapZoomOut.addEventListener("click", () => zoomMap(-1));
  mapReturn.addEventListener("click", resetMapView);
  worldMap.addEventListener("pointerdown", startMapDrag);
  worldMap.addEventListener("pointermove", moveMapPointer);
  worldMap.addEventListener("pointerup", endMapDrag);
  worldMap.addEventListener("pointercancel", endMapDrag);
  worldMap.addEventListener("pointerleave", schedulePreviewHide);

  journeyWallClose.addEventListener("click", closeJourneyWall);
  journeyWall.addEventListener("click", (event) => {
    if (event.target instanceof HTMLElement && event.target.dataset.closeWall === "true") {
      closeJourneyWall();
    }
  });

  modalClose.addEventListener("click", closeModal);
  modalPrev.addEventListener("click", () => stepModal(-1));
  modalNext.addEventListener("click", () => stepModal(1));
  modal.addEventListener("click", (event) => {
    if (event.target instanceof HTMLElement && event.target.dataset.closeModal === "true") {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (!modal.hidden) {
      if (event.key === "Escape") {
        closeModal();
      } else if (event.key === "ArrowLeft") {
        stepModal(-1);
      } else if (event.key === "ArrowRight") {
        stepModal(1);
      } else {
        trapFocus(modal, event);
      }
      return;
    }
    if (!journeyWall.hidden) {
      if (event.key === "Escape") {
        closeJourneyWall();
      } else {
        trapFocus(journeyWall, event);
      }
      return;
    }
    if (event.key === "Escape" && state.zoomIndex > 0) {
      resetMapView();
    }
  });

  applyMapView();
  renderWorldMap();

  const requestedPlace = new URLSearchParams(window.location.search).get("place");
  const requestedLocationIndex = locations.findIndex(
    (location) => location.slug === requestedPlace,
  );
  if (requestedLocationIndex >= 0) {
    openJourneyWall(requestedLocationIndex, null);
  }
}

function initAboutPage() {
  document.title = `关于 | ${siteProfile.siteTitle}`;
  const aboutText = document.querySelector("#about-text");
  const aboutLocations = document.querySelector("#about-locations");
  const placeSearch = document.querySelector("#about-place-search");
  const placeCount = document.querySelector("#about-place-count");
  const placeEmpty = document.querySelector("#about-place-empty");

  if (aboutText) {
    aboutText.innerHTML = siteProfile.aboutText
      .map((paragraph) => `<p>${paragraph}</p>`)
      .join("");
  }
  if (!aboutLocations) {
    return;
  }

  function renderLocationIndex(filteredLocations) {
    const countryGroups = new Map();
    filteredLocations.forEach((location) => {
      const country = location.countryLabel || location.country_or_region;
      if (!countryGroups.has(country)) {
        countryGroups.set(country, []);
      }
      countryGroups.get(country).push(location);
    });

    aboutLocations.innerHTML = [...countryGroups.entries()]
      .map(
        ([country, countryLocations]) => `
          <section class="about-country-group">
            <header>
              <h3>${country}</h3>
              <span>${String(countryLocations.length).padStart(2, "0")}</span>
            </header>
            <div class="about-city-links">
              ${countryLocations
                .map(
                  (location) => `
                    <a
                      class="about-city-link"
                      href="./index.html?place=${encodeURIComponent(location.slug)}"
                      aria-label="在地图查看${location.name}"
                    >
                      <strong>${location.name}</strong>
                      <small>${location.englishName}</small>
                    </a>
                  `,
                )
                .join("")}
            </div>
          </section>
        `,
      )
      .join("");

    if (placeCount) {
      placeCount.textContent = `${filteredLocations.length} 个地点 · ${countryGroups.size} 个国家或地区`;
    }
    if (placeEmpty) {
      placeEmpty.hidden = filteredLocations.length > 0;
    }
  }

  renderLocationIndex(locations);

  placeSearch?.addEventListener("input", () => {
    const query = placeSearch.value.trim().normalize("NFKC").toLocaleLowerCase("zh-CN");
    const filteredLocations = query
      ? locations.filter((location) =>
          [
            location.name,
            location.englishName,
            location.countryLabel,
            location.country_or_region,
          ]
            .join(" ")
            .normalize("NFKC")
            .toLocaleLowerCase("zh-CN")
            .includes(query),
        )
      : locations;
    renderLocationIndex(filteredLocations);
  });
}

if (page === "home") {
  initHomePage();
}

if (page === "about") {
  initAboutPage();
}
