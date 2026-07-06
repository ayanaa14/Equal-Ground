const STORAGE_KEY = "voices-for-change-articles";

function loadArticles() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function saveArticles(articles) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
}

function renderArticles() {
  const articles = loadArticles();
  const pendingList = document.getElementById("pendingList");
  const approvedList = document.getElementById("approvedList");

  const pendingArticles = articles.filter(article => article.status === "pending");
  const approvedArticles = articles.filter(article => article.status === "approved");

  if (pendingList) {
    pendingList.innerHTML = pendingArticles.length
      ? pendingArticles.map(article => `
          <div class="article-item">
            <h3>${article.title}</h3>
            <p>${article.content}</p>
            <div class="article-meta">By ${article.author}</div>
            <button class="approve-btn" data-id="${article.id}">Approve</button>
          </div>
        `).join("")
      : '<div class="article-item"><p>No submissions awaiting approval yet.</p></div>';
  }

  if (approvedList) {
    approvedList.innerHTML = approvedArticles.length
      ? approvedArticles.map(article => `
          <div class="article-item">
            <h3>${article.title}</h3>
            <p>${article.content}</p>
            <div class="article-meta">By ${article.author}</div>
          </div>
        `).join("")
      : '<div class="article-item"><p>No approved articles yet.</p></div>';
  }
}

document.getElementById("articleForm")?.addEventListener("submit", function (e) {
  e.preventDefault();

  const title = document.getElementById("articleTitle")?.value.trim();
  const author = document.getElementById("articleAuthor")?.value.trim();
  const content = document.getElementById("articleContent")?.value.trim();
  const message = document.getElementById("submissionMessage");

  if (!title || !author || !content) {
    if (message) message.textContent = "Please fill in all fields before submitting.";
    return;
  }

  const articles = loadArticles();
  articles.push({
    id: Date.now(),
    title,
    author,
    content,
    status: "pending"
  });

  saveArticles(articles);
  renderArticles();
  this.reset();

  if (message) {
    message.textContent = "✅ Your article has been submitted and is waiting for approval.";
  }

  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=ayanaa1414@gmail.com&su=${encodeURIComponent("New article submission pending approval")}&body=${encodeURIComponent(`A new article submission is waiting for your review.\n\nTitle: ${title}\nAuthor: ${author}\n\nContent:\n${content}`)}`;
  window.open(gmailUrl, "_blank", "noopener,noreferrer");
});

document.addEventListener("click", function (event) {
  if (event.target.classList.contains("approve-btn")) {
    const articleId = Number(event.target.dataset.id);
    const articles = loadArticles();
    const updatedArticles = articles.map(article =>
      article.id === articleId ? { ...article, status: "approved" } : article
    );

    saveArticles(updatedArticles);
    renderArticles();
  }
});

renderArticles();