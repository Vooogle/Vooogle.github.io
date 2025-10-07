async function loadJSON(path) {
  const res = await fetch(path);
  return res.json();
}

async function buildNav() {
  const nav = document.getElementById("category-nav");
  const categoryList = await loadJSON("categories/category_list.json");

  for (const catPath of categoryList) {
    const catData = await loadJSON(catPath);
    const categoryFolder = catPath.split("/")[1]; // e.g. "clothing"
    const subsPath = `categories/${categoryFolder}/${categoryFolder}_subs.json`;
    const subList = await loadJSON(subsPath);

    const catWrapper = document.createElement("div");
    catWrapper.className = "nav-category";

    const catButton = document.createElement("button");
    catButton.textContent = catData.name;
    catButton.className = "category-button";
    catButton.onclick = () => {
      window.location.href = catPath.replace(".json", ".html");
    };

    const subMenu = document.createElement("div");
    subMenu.className = "subcategory-menu";

    for (const subPath of subList) {
      const subData = await loadJSON(subPath);
      const subLink = document.createElement("a");
      subLink.textContent = subData.name;
      subLink.href = subPath.replace(".json", ".html");
      subMenu.appendChild(subLink);
    }

    catWrapper.appendChild(catButton);
    catWrapper.appendChild(subMenu);
    nav.appendChild(catWrapper);
  }
}

async function buildRecommended() {
  const globalList = await loadJSON("categories/global_item_list.json");
  const picks = [];

  while (picks.length < 6 && globalList.length > 0) {
    const idx = Math.floor(Math.random() * globalList.length);
    picks.push(globalList.splice(idx, 1)[0]);
  }

  const container = document.getElementById("recommended-items");

  for (const path of picks) {
    const item = await loadJSON(path);

    const card = document.createElement("a");
    card.className = "item-card";
    card.href = path.replace(".json", ".html");

    const img = document.createElement("img");
    img.src = path.replace(`${item.id}.json`, item.images.thumbnail);
    img.alt = item.name;

    const title = document.createElement("h3");
    title.textContent = item.name;

    const desc = document.createElement("p");
    desc.className = "description";
    desc.textContent = item.description;

    const price = document.createElement("p");
    price.className = "price";
    const [dollars, cents] = item.price.toFixed(2).split(".");
    price.innerHTML = `
    <span class="currency">$</span>
    <span class="dollars">${dollars}</span>
    <span class="cents">${cents}</span>
    `;


    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(price);

    container.appendChild(card);
  }
}

document.getElementById("search-button").addEventListener("click", runSearch);

async function runSearch() {
  const query = document.getElementById("search-input").value.trim().toLowerCase();
  if (!query) return;

  const overlay = document.getElementById("overlay");
  overlay.style.display = "block";
  overlay.style.opacity = "0";
  overlay.style.backdropFilter = "blur(4px)";
  setTimeout(() => {
    overlay.style.opacity = "1";
  }, 10);

  const globalList = await loadJSON("categories/global_item_list.json");
  const results = [];

  for (const path of globalList) {
    const item = await loadJSON(path);

    const haystack = [
      item.name,
      item.description,
      ...(item.tags || [])
    ].join(" ").toLowerCase();

    if (haystack.includes(query)) {
      results.push({ path, item });
    }
  }

  displaySearchResults(results);
}

function displaySearchResults(results) {
  const container = document.getElementById("search-items");
  container.innerHTML = "";
  document.getElementById("search-results").style.display = "block";

  if (results.length === 0) {
    container.innerHTML = "<p>No items found.</p>";
    return;
  }

  for (const { path, item } of results) {
    const card = document.createElement("a");
    card.className = "item-card";
    card.href = path.replace(".json", ".html");

    const img = document.createElement("img");
    img.src = path.replace(`${item.id}.json`, item.images.thumbnail);
    img.alt = item.name;

    const title = document.createElement("h3");
    title.textContent = item.name;

    const desc = document.createElement("p");
    desc.className = "description";
    desc.textContent = item.description;

    const price = document.createElement("p");
    price.className = "price";
    const [dollars, cents] = item.price.toFixed(2).split(".");
    price.innerHTML = `
    <span class="currency">$</span>
    <span class="dollars">${dollars}</span>
    <span class="cents">${cents}</span>
    `;


    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(price);

    container.appendChild(card);
  }

  document.getElementById("overlay").onclick = () => {
    document.getElementById("overlay").style.opacity = "0";
    setTimeout(() => {
      document.getElementById("overlay").style.display = "none";
      document.getElementById("search-results").style.display = "none";
    }, 300);
  };
}
const searchInput = document.getElementById("search-input");
const body = document.body;

searchInput.addEventListener("focus", () => {
  body.classList.add("blur-active");
});

searchInput.addEventListener("blur", () => {
  body.classList.remove("blur-active");
});

async function buildFlashDeals() {
  const globalList = await loadJSON("categories/global_item_list.json");
  const picks = [];

  while (picks.length < 4 && globalList.length > 0) {
    const idx = Math.floor(Math.random() * globalList.length);
    picks.push(globalList.splice(idx, 1)[0]);
  }

  const container = document.getElementById("flash-items");

  for (const path of picks) {
    const item = await loadJSON(path);

    const card = document.createElement("a");
    card.className = "item-card";
    card.href = path.replace(".json", ".html");

    const img = document.createElement("img");
    img.src = path.replace(`${item.id}.json`, item.images.thumbnail);
    img.alt = item.name;

    const title = document.createElement("h3");
    title.textContent = item.name;

    const desc = document.createElement("p");
    desc.className = "description";
    desc.textContent = item.description;

    const price = document.createElement("p");
    price.className = "price";
// Old price (small + gray, no strikethrough)
const oldPrice = document.createElement("span");
oldPrice.className = "old-price";
oldPrice.textContent = `$${item.price.toFixed(2)}`;

// New discounted price (red)
const newPrice = document.createElement("span");
newPrice.className = "flash-price";
// Pick a random discount between 25% and 75%
const discountPercent = Math.floor(Math.random() * 51) + 25; // 25–75
const discounted = (item.price * (1 - discountPercent / 100)).toFixed(2);
const [newDollars, newCents] = discounted.split(".");
newPrice.innerHTML = `
  <span class="currency">$</span>
  <span class="dollars">${newDollars}</span>
  <span class="cents">${newCents}</span>
`;



    price.appendChild(oldPrice);
    price.appendChild(newPrice);

    card.appendChild(img);
    card.appendChild(title);
    card.appendChild(desc);
    card.appendChild(price);

    container.appendChild(card);
  }

  // Show section
  document.getElementById("flash-deals").style.display = "block";
}
async function buildHeroCarousel() {
  const globalList = await loadJSON("categories/global_item_list.json");
  const picks = globalList.slice(0, 4); // pick first 4 for demo

  const slidesContainer = document.querySelector("#hero-carousel .slides");
  const indicatorsContainer = document.getElementById("carousel-indicators");
  
    function truncate(str, limit = 1700) {
    return str.length > limit ? str.slice(0, limit) + "…" : str;
    }

  for (let i = 0; i < picks.length; i++) {
    const path = picks[i];
    const item = await loadJSON(path);

    // Fetch details.txt
    const detailsPath = path.replace(`${item.id}.json`, "details.txt");
    let detailsText = "";
    try {
      const res = await fetch(detailsPath);
      if (res.ok) detailsText = await res.text();
    } catch {}

    // Build slide
    const slide = document.createElement("div");
    slide.className = "slide";

slide.innerHTML = `
  <img src="${path.replace(`${item.id}.json`, item.images.thumbnail)}" alt="${item.name}">
  <div class="slide-content">
    <h2>${item.name}</h2>
    <p>${truncate(item.description, 1700)}</p>
    <div class="details-box">${truncate(detailsText || "No extra details.", 1700)}</div>
    <p class="price">
      <span class="currency">$</span>
      <span class="dollars">${Math.floor(item.price)}</span>
      <span class="cents">${(item.price % 1).toFixed(2).split(".")[1]}</span>
    </p>
  </div>
`;

    slidesContainer.appendChild(slide);

    // Indicator
    const indicator = document.createElement("span");
    if (i === 0) indicator.classList.add("active");
    indicator.addEventListener("click", () => showSlide(i));
    indicatorsContainer.appendChild(indicator);
  }

  let currentIndex = 0;
  function showSlide(index) {
    currentIndex = index;
    slidesContainer.style.transform = `translateX(-${index * 100}%)`;
    document.querySelectorAll("#carousel-indicators span").forEach((dot, idx) => {
      dot.classList.toggle("active", idx === index);
    });
  }

  // Auto-scroll every 5s
  setInterval(() => {
    currentIndex = (currentIndex + 1) % picks.length;
    showSlide(currentIndex);
  }, 5000);
}

buildHeroCarousel();
buildNav();
buildRecommended();
buildFlashDeals(); // show immediately and stay visible