// Retrieve summarized data from localStorage
const summarizedSections = JSON.parse(localStorage.getItem("summarizedSections"));

if (!summarizedSections) {
    document.getElementById("summary-section").innerHTML = "<p>No summarized data found. Please upload a PDF or search for papers.</p>";
} else {
    const summarySection = document.getElementById("summary-section");
    summarySection.innerHTML = "<h2>Summarized Sections</h2>";

    for (const [section, summary] of Object.entries(summarizedSections)) {
        const card = document.createElement("div");
        card.className = "summary-card";
        card.innerHTML = `
            <h3>${section}</h3>
            <p>${summary}</p>
        `;
        summarySection.appendChild(card);
    }
}

// Handle "Back to Upload" button
document.getElementById("back-button")?.addEventListener("click", () => {
    localStorage.removeItem("summarizedSections");
    window.location.href = "index.html";
});
