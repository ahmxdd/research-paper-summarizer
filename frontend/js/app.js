document.getElementById("search-button").addEventListener("click", searchPapers);

document.getElementById("upload-button")?.addEventListener("click", () => {
    const fileInput = document.getElementById("pdf-input");
    const file = fileInput.files[0];

    if (!file) {
        alert("Please upload a PDF file.");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    const spinner = document.getElementById("loading-spinner");
    spinner.classList.remove("hidden"); // Show spinner

    fetch("http://127.0.0.1:8000/upload-pdf", {
        method: "POST",
        body: formData,
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to upload and process PDF.");
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
            document.getElementById("pdf-summary-section").innerHTML = "<p>Something went wrong. Please try again.</p>";
        });
});


function searchPapers() {
    const keyword = document.getElementById("search-input").value.trim();

    if (!keyword) {
        alert("Please enter a keyword to search.");
        return;
    }

    // Redirect to results.html with the keyword in the query parameter
    window.location.href = `results.html?keyword=${encodeURIComponent(keyword)}`;
}


function summarizePaper(paperId) {
    console.log(`Summarizing paper with ID: ${paperId}`);

    fetch(`http://127.0.0.1:8000/retrieve-paper/${paperId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to retrieve paper.");
            }
            return response.blob(); // Get the PDF as a Blob
        })
        .then(pdfBlob => {
            const formData = new FormData();
            formData.append("file", pdfBlob, `${paperId}.pdf`); // Attach the PDF Blob

            return fetch("http://127.0.0.1:8000/upload-pdf", {
                method: "POST",
                body: formData,
            });
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to summarize paper.");
            }
            return response.json();
        })
        .then(data => {
            console.log("Redirecting to summary page...");
            // Save summarized sections in localStorage and redirect
            localStorage.setItem("summarizedSections", JSON.stringify(data.sections));
            window.location.href = "summary.html";
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Something went wrong while summarizing the paper. Please try again.");
        });
}


function summarizeSections() {
    console.log("Summarizing sections...");

    const fileInput = document.getElementById("pdf-input");
    const file = fileInput.files[0]; // Get the selected file

    if (!file) {
        alert("Please upload a valid PDF file.");
        return;
    }

    const formData = new FormData();
    formData.append("file", file); // Append the file to FormData

    fetch("http://127.0.0.1:8000/upload-pdf", {
        method: "POST",
        body: formData, // Send FormData (multipart/form-data)
    })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to summarize sections.");
            }
            return response.json();
        })
        .then(data => {
            console.log("Summary received:", data); // Debug log
            const summarySection = document.getElementById("pdf-summary-section");
            summarySection.innerHTML = ""; // Clear previous content

            for (const [section, summary] of Object.entries(data.sections)) {
                const card = document.createElement("div");
                card.className = "summary-card";
                card.innerHTML = `
                    <h3>${section}</h3>
                    <p>${summary}</p>
                `;
                summarySection.appendChild(card);
            }
        })
        .catch(error => {
            console.error("Error:", error);
            document.getElementById("pdf-summary-section").innerHTML = "<p>Something went wrong while summarizing. Please try again.</p>";
        });
}

