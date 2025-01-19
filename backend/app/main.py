from fastapi import FastAPI
from backend.app.routes.papers import router as paper
from backend.app.routes.summarize import router as summary
from fastapi.middleware.cors import CORSMiddleware

# Initialize FastAPI application
app = FastAPI()

# Add CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins (replace with specific origins for better security)
    allow_credentials=True,
    allow_methods=["*"],  # Allows all HTTP methods
    allow_headers=["*"],  # Allows all headers
)

# Include routers for API endpoints
app.include_router(paper)
app.include_router(summary)
