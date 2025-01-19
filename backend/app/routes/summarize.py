from fastapi import APIRouter, File, UploadFile
from pydantic import BaseModel
from backend.app.services.summarize import summarize_text, split_into_sections
import pdfplumber

router = APIRouter()

# Define the input model for summarization
class SummarizeRequest(BaseModel):
    input_text: str

@router.post("/summarize")
def summarizer(request: SummarizeRequest):
    return {"summary": summarize_text(request.input_text)}

@router.post("/upload-pdf")
async def upload_pdf(file: UploadFile = File(...)):
    print("PDF uploaded and endpoint called")  # Log each call
    try:
        with pdfplumber.open(file.file) as pdf:
            text = "".join(page.extract_text() or "" for page in pdf.pages)
    except Exception as e:
        return {"error": f"Failed to process PDF: {str(e)}"}


    sections = split_into_sections(text)
    summarized_sections = {
        section: summarize_text(content)
        for section, content in sections.items()
        if content.strip()
    }

    return {"sections": summarized_sections}

