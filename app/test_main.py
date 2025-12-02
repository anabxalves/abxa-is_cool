import os
import sys
from fastapi.testclient import TestClient
import pytest

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.main import app

client = TestClient(app)

def test_app_can_start():
    assert app is not None

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}

def test_api_keys_presence():
    missing_keys = []

    required_keys = ["GROQ_API_KEY", "GEMINI_API_KEY"]

    for key in required_keys:
        if not os.getenv(key):
            missing_keys.append(key)

    if missing_keys:
        pytest.fail(f"❌ ERRO CRÍTICO: As seguintes chaves de API não foram encontradas no ambiente: {', '.join(missing_keys)}")

def test_route_index():
    response = client.get("/")
    assert response.status_code in [200, 404]