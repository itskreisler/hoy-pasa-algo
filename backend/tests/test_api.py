import requests

BASE_URL = "http://localhost:5000"


def test_endpoint_status_and_body():
    resp = requests.get(f"{BASE_URL}/docs")
    assert resp.status_code == 200
    data = resp.json()
    assert "endpoints" in data and "message" in data
    assert data["message"] == "API Backend funcionando"
