from transformers import pipeline, BartForConditionalGeneration, BartTokenizer
import re
from nltk.tokenize import sent_tokenize
from concurrent.futures import ThreadPoolExecutor

model_name = "sshleifer/distilbart-cnn-12-6"
model = BartForConditionalGeneration.from_pretrained(model_name)
tokenizer = BartTokenizer.from_pretrained(model_name)


summarizer = pipeline("summarization", model=model, tokenizer=tokenizer, framework="pt")

POSSIBLE_HEADINGS = [
    "Introduction", "Background", "Overview",
    "Methods", "Materials", "Procedure",
    "Results", "Findings", "Observations",
    "Discussion", "Analysis", "Interpretation",
    "Conclusion", "Summary", "Future Work", "Abstract", "Literature Review", "Method", "Discussion and conclusions"
]

def chunk_text(text, max_chunk_size=1024):
    sentences = sent_tokenize(text)
    chunks = []
    current_chunk = ""

    for sentence in sentences:
        if len(current_chunk) + len(sentence) <= max_chunk_size:
            current_chunk += " " + sentence
        else:
            chunks.append(current_chunk.strip())
            current_chunk = sentence
    if current_chunk:
        chunks.append(current_chunk.strip())

    return chunks

def summarize_text(text):
    chunks = chunk_text(text)
    summaries = []

    with ThreadPoolExecutor(max_workers=4) as executor:
        futures = [
            executor.submit(
                summarizer,
                chunk,
                max_length=min(len(chunk) // 3, 150),
                min_length=min(len(chunk) // 5, 50),
            )
            for chunk in chunks
        ]
        for future in futures:
            try:
                summaries.append(future.result()[0]["summary_text"])
            except Exception as e:
                summaries.append("[Error summarizing this chunk]")
                print(f"Error summarizing chunk: {str(e)}")

    return " ".join(summaries)

def split_into_sections(text):
    pattern = "|".join(POSSIBLE_HEADINGS)
    regex = rf"({pattern})"
    sections = re.split(regex, text, flags=re.IGNORECASE)

    section_dict = {}
    for i in range(1, len(sections), 2):
        section_name = sections[i].strip().capitalize()
        section_content = sections[i + 1].strip() if i + 1 < len(sections) else ""

        if section_content:
            section_dict[section_name] = section_content

    if not section_dict:
        section_dict["Entire Document"] = text

    return section_dict
