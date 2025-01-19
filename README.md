# Research Paper Summarizer

This project showcases a web application I developed that integrates advanced natural language processing (NLP) models to simplify research papers for easier understanding. The primary goals of this project were to:

1. Explore the challenges of implementing backend and frontend systems for the first time.
2. Apply and understand the functionality of transformer-based NLP models, specifically Hugging Face’s BART model.
3. Experiment with features such as section-based summarization, PDF processing, and dynamic front-end content rendering.
4. Gain hands-on experience in building and deploying a full-stack web application.

---

## **Features**

### 1. **Search and Abstract Summarization**
- Users can search for research papers using keywords.
- Abstracts are retrieved via APIs (e.g., Semantic Scholar) and summarized using Hugging Face’s BART model.

### 2. **PDF Upload and Summarization**
- Users can upload research papers in PDF format.
- Extracted text is processed and summarized dynamically.

### 3. **Section-Based Summarization**
- Text is automatically split into sections (e.g., "Introduction," "Methods," "Results") using regular expressions.
- Each section is summarized separately, allowing for focused understanding.

### 4. **Dynamic Frontend**
- The frontend dynamically updates to display results, summaries, and user interactions in real-time.
- Built with HTML, CSS, and vanilla JavaScript to keep dependencies minimal.

---

## **Technologies and Libraries Used**

### **Frontend:**
- **HTML, CSS, JavaScript**: Implemented the user interface and client-side functionality.

### **Backend:**
- **Python (FastAPI)**: Built RESTful API endpoints for summarization and PDF processing.
- **Hugging Face Transformers**: Leveraged the BART model for text summarization.
- **pdfplumber**: Extracted text from uploaded PDFs for further processing.

### **NLP Model:**
- **BART (Bidirectional and Auto-Regressive Transformers)**:
  - Hugging Face’s pre-trained `facebook/bart-large-cnn` model was utilized for summarization.
  - Key hyperparameters (e.g., `max_length`, `min_length`) were dynamically adjusted to handle varying input sizes.

---

## **My Experience**

### **Challenges Faced**

1. **Learning Backend Development**
   - Before this project, I had limited experience with backend development. Learning FastAPI, understanding RESTful APIs, and implementing endpoints were significant learning curves.

2. **Model Integration and Token Limits**
   - Transformer models like BART have token limits (1024 tokens), which caused errors when processing large inputs. I implemented a chunking system to split long texts into manageable sizes for summarization.

3. **Frontend Dynamics**
   - Managing real-time updates in the frontend using vanilla JavaScript was challenging but rewarding. I ensured smooth integration between user actions and API responses.

4. **Debugging Excessive Requests**
   - Initial iterations caused repeated API requests, leading to server overload. Debugging this issue required careful inspection of event listeners and API call logic.

### **What I Learned**
- How to build and connect a frontend and backend system.
- Effective error handling and dynamic input processing for machine learning models.
- The importance of logging and debugging tools to identify and resolve performance.

---

## **Future Ideas**

This project serves as a foundation for exploring more advanced concepts:

1. **Graphical Insights**
   - Extract figures and tables from PDFs and display them dynamically in the frontend.

2. **Summarization by Domain**
   - Fine-tune BART or use domain-specific models for better performance on medical or technical papers.

3. **User Accounts and Storage**
   - Implement user authentication to allow users to save and revisit their summaries.
   - Use databases like PostgreSQL or MongoDB for persistent storage.

4. **Interactive UI**
   - Gamify the user experience with badges for summarizing specific topics or exploring featured research papers.

---

## **How to Run the Project**

### **Installation**

NOTE: The venv folder was too large to upload to github due to the CNN model used for summarization. So start your own venv and install any dependencies via requirements.txt.

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/<your-username>/research-paper-summarizer.git
   cd research-paper-summarizer
   ```

2. **Set Up the Backend**:
   - Create a virtual environment:
     ```bash
     python3 -m venv venv
     source venv/bin/activate  # For Linux/Mac
     venv\Scripts\activate     # For Windows
     ```
   - Install dependencies:
     ```bash
     pip install -r requirements.txt
     ```
   - Run the backend server:
     ```bash
     uvicorn backend.app.main:app --reload
     ```

3. **Set Up the Frontend**:
   - Open `index.html` in a browser or use a local HTTP server (e.g., VS Code Live Server).

4. **Test the Application**:
   - Navigate to `http://127.0.0.1:8000` for backend API and use the frontend to interact with the app.

---

## **Things I've Used a Lot in this Project**

- **Hugging Face**: For providing pre-trained models and an excellent NLP library.
- **FastAPI Documentation**: A comprehensive resource for building APIs.
- **pdfplumber**: For simplifying PDF text extraction.
