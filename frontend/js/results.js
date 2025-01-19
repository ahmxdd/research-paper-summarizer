// Extract the keyword from the query string
const params = new URLSearchParams(window.location.search);
const keyword = params.get("keyword");

if (!keyword || keyword.trim() === "") {
    document.getElementById("results-section").innerHTML = "<p>No keyword provided for search.</p>";
} else {
    // Fetch papers based on the keyword
    fetch(`http://127.0.0.1:8000/papers?keyword=${encodeURIComponent(keyword)}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to fetch papers.");
            }
            return response.json();
        })
        .then(data => {
            console.log("API Response:", data); // Debugging
            displayResults(data.papers); // Pass the papers array to displayResults
        })
        .catch(error => {
            console.error("Error:", error);
            document.getElementById("results-section").innerHTML = "<p>Something went wrong. Please try again.</p>";
        });
}
function displayResults(papers) {
    const resultsSection = document.getElementById("results-section");
    resultsSection.innerHTML = ""; // Clear previous content

    if (!Array.isArray(papers) || papers.length === 0) {
        resultsSection.innerHTML = "<p>No results found.</p>";
        return;
    }

    papers.forEach(paper => {
        const card = document.createElement("div");
        card.className = "result-card";

        const abstract = paper.summary
            ? paper.summary.substring(0, 150) + "..."
            : "No summary available.";

        // Extract arXiv ID from the paper's URL
        const arxivId = paper.id.split('/').pop(); // Extracts '1911.06612v1' from 'http://arxiv.org/abs/1911.06612v1'

        card.innerHTML = `
            <h3>${paper.title}</h3>
            <p><strong>Abstract:</strong> ${abstract}</p>
            <button onclick="summarizePaper('${arxivId}')">Summarize Paper</button>
        `;

        resultsSection.appendChild(card);
    });
}

function summarizePaper(arxivId) {
    console.log(`Summarizing paper with arXiv ID: ${arxivId}`);
    const spinner = document.getElementById("loading-spinner");
    spinner.classList.remove("hidden"); // Show spinner

    fetch(`http://127.0.0.1:8000/retrieve-paper/${arxivId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to retrieve paper.");
            }
            return response.json();
        })
        .then(data => {
            spinner.classList.add("hidden"); // Hide spinner
            localStorage.setItem("summarizedSections", JSON.stringify(data.sections));
            window.location.href = "summary.html";
        })
        .catch(error => {
            spinner.classList.add("hidden"); // Hide spinner
            console.error("Error:", error);
            alert("Something went wrong while summarizing the paper. Please try again.");
        });
}
