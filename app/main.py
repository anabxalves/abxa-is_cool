import os
import asyncio
import random
from typing import Optional
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse
from pydantic import BaseModel

app = FastAPI(
    title="IsCoolGPT API",
    description="Backend para o assistente de estudos em Cloud Computing",
    version="1.0.0"
)

origins = [
    "http://localhost:5173",
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "*"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChatRequest(BaseModel):
    message: str
    model: str = "gpt-4o"

class ChatResponse(BaseModel):
    response: str
    model_used: str

@app.get("/health")
async def health_check():
    return {"status": "ok", "service": "IsCoolGPT-Backend"}

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    delay = random.uniform(1.0, 3.0)
    await asyncio.sleep(delay)

    # api_key = os.getenv("OPENAI_API_KEY")

    mock_response = f"""
        Resposta Simulada ({request.model})
        Olá! Recebi sua pergunta: **"{request.message}"**
        """

    return ChatResponse(
        response=mock_response.strip(),
        model_used=request.model
    )

FRONTEND_STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")

if os.path.isdir(FRONTEND_STATIC_DIR):
    app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_STATIC_DIR, "assets")), name="assets")

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        index_file = os.path.join(FRONTEND_STATIC_DIR, "index.html")

        requested_file = os.path.join(FRONTEND_STATIC_DIR, full_path)
        if os.path.isfile(requested_file):
            return FileResponse(requested_file)

        if os.path.exists(index_file):
            return FileResponse(index_file)

        return JSONResponse(status_code=404, content={"error": "Frontend build not found"})
else:
    print(f"AVISO: Pasta estática '{FRONTEND_STATIC_DIR}' não encontrada. Rodando apenas API.")