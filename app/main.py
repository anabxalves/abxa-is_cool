from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from fastapi.staticfiles import StaticFiles
from google import genai
from groq import Groq
from pydantic import BaseModel
from typing import List, Dict, Any
import os
import time

load_dotenv()

app = FastAPI(
    title="IsCoolGPT API",
    description="Backend para o assistente de estudos em Cloud Computing",
    version="1.0.0"
)

origins = [
    "http://localhost",
    "http://localhost:5173",
    "http://localhost:8000",
    "http://localhost:8080",
    "iscoolgpt-alb-1020494150.us-east-2.elb.amazonaws.com"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

gemini_client = genai.Client()

groq_client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

class ChatRequest(BaseModel):
    messages: List[Dict[str, str]]
    model: str = "gemini"

class ChatResponse(BaseModel):
    response: str
    model_used: str

def call_gemini(messages):
    if not gemini_client:
        raise Exception("API Key do Gemini não configurada")

    gemini_history = []
    for msg in messages:
        role = "user" if msg["role"] == "user" else "model"
        gemini_history.append({
            "role": role,
            "parts": [{"text": msg["content"]}]
        })

    response = gemini_client.models.generate_content(
        model="gemini-2.5-flash", contents=gemini_history
    )
    return response.text

def call_groq(messages, model):
    if not groq_client:
        raise Exception("API Key do Groq nao configurada")

    match model:
        case "llama":
            model_name = "llama-3.3-70b-versatile"
        case "moonshot":
            model_name = "moonshotai/kimi-k2-instruct"
        case "openai":
            model_name = "openai/gpt-oss-20b"

    clean_messages = []
    for msg in messages:
        content_value = msg.get("content", "")

        if isinstance(content_value, list) and len(content_value) > 0:
            if isinstance(content_value[0], dict) and "text" in content_value[0]:
                content_value = content_value[0]["text"]
            else:
                content_value = str(content_value)

        clean_messages.append({
            "role": msg["role"],
            "content": str(content_value)
        })

    response = groq_client.chat.completions.create(
        model=model_name,
        messages=clean_messages,
    )

    return response.choices[0].message.content

def get_mock_response(message, model):
    time.sleep(1.5)
    return f" [MOCK MODE] Estou simulando o {model}. Resposta para: '{message}'. (Configure as chaves de API para respostas reais)"

@app.get("/health")
async def health_check():
    return {"status": "ok"}

@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    last_user_message = request.messages[-1]["content"] if request.messages else ""
    try:
        if request.model == "gemini":
            try:
                response_text = call_gemini(request.messages)
            except Exception as e:
                print(f"Erro no Gemini: {repr(e)}")
                response_text = get_mock_response(last_user_message, f"Gemini ({e})")

        elif request.model == "llama" or request.model == "moonshot" or request.model == "openai":
            try:
                response_text = call_groq(request.messages, request.model)
            except Exception as e:
                print(f"Erro no Groq: {repr(e)}")
                response_text = get_mock_response(last_user_message, f"Groq/{request.model} ({e})")

        else:
            response_text = get_mock_response(last_user_message, "[Modelo Desconhecido]")

        return ChatResponse(response=response_text, model_used=request.model)

    except Exception as e:
        print(f"Erro geral: {str(e)}")

    return ChatResponse(response="Desculpe, ocorreu um erro interno no servidor.", model_used="error")

FRONTEND_STATIC_DIR = os.path.join(os.path.dirname(__file__), "static")
if os.path.isdir(FRONTEND_STATIC_DIR):
    app.mount("/assets", StaticFiles(directory=os.path.join(FRONTEND_STATIC_DIR, "assets")), name="assets")
    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        if os.path.isfile(os.path.join(FRONTEND_STATIC_DIR, full_path)):
            return FileResponse(os.path.join(FRONTEND_STATIC_DIR, full_path))
        return FileResponse(os.path.join(FRONTEND_STATIC_DIR, "index.html"))