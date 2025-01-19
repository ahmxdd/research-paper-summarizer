from fastapi import APIRouter, HTTPException
from starlette.responses import StreamingResponse
import requests
import xml.etree.ElementTree as ET
from io import BytesIO
from backend.app.services.summarize import summarize_text, split_into_sections

router = APIRouter()

@router.get("/papers")
def search_papers(keyword: str):
    """Search for papers on arXiv using the given keyword."""
    url = f"http://export.arxiv.org/api/query?search_query=all:{keyword}&start=0&max_results=15"
    response = requests.get(url)

    if response.status_code != 200:
        raise HTTPException(status_code=500, detail="Failed to fetch papers from arXiv")

    # Parse the XML response
    root = ET.fromstring(response.content)
    papers = []

    for entry in root.findall("{http://www.w3.org/2005/Atom}entry"):
        paper = {
            "id": entry.find("{http://www.w3.org/2005/Atom}id").text,
            "title": entry.find("{http://www.w3.org/2005/Atom}title").text.strip(),
            "summary": entry.find("{http://www.w3.org/2005/Atom}summary").text.strip(),
            "pdf_url": next(link.attrib["href"] for link in entry.findall("{http://www.w3.org/2005/Atom}link") if link.attrib.get("type") == "application/pdf"),
        }
        papers.append(paper)

    return {"papers": papers}

@router.get("/retrieve-paper/{arxiv_id}")
async def retrieve_paper(arxiv_id: str):
    """Retrieve the full PDF of a paper from arXiv and summarize it."""
    pdf_url = f"https://arxiv.org/pdf/{arxiv_id}.pdf"
    response = requests.get(pdf_url, stream=True)

    if response.status_code != 200:
        raise HTTPException(status_code=404, detail="Paper not found on arXiv")

    pdf_content = BytesIO(response.content)
    summarized_data = process_pdf(pdf_content)

    return summarized_data

def process_pdf(pdf_content):
    """Process the PDF: extract text, split into sections, and summarize."""
    import pdfplumber

    try:
        with pdfplumber.open(pdf_content) as pdf:
            text = ""
            for page in pdf.pages:
                text += page.extract_text() or ""

        sections = split_into_sections(text)
        summarized_sections = {
            section: summarize_text(content) for section, content in sections.items()
        }
        return {"sections": summarized_sections}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to process PDF: {str(e)}")
