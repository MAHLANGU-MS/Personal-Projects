from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List
import numpy as np
from services.focus_analyzer import FocusAnalyzer
from services.text_simplifier import TextSimplifier


app = FastAPI(title="FocusFlow ML Service")


focus_analyzer = FocusAnalyzer()
text_simplifier = TextSimplifier()


class GazePoint(BaseModel):
    x: float
    y: float
    timestamp: int


class FocusAnalysisRequest(BaseModel):
    gaze_points: List[GazePoint]
    session_id: str


class FocusAnalysisResponse(BaseModel):
    is_focused: bool
    confidence: float
    regression_count: int
    recommended_mode: str


@app.post("/analyze-focus", response_model=FocusAnalysisResponse)
async def analyze_focus(request: FocusAnalysisRequest):
    """
    Analyze gaze patterns to detect focus state
    """
    gaze_data = np.array([[p.x, p.y, p.timestamp] for p in request.gaze_points])
    
    result = focus_analyzer.analyze(gaze_data)
    
    return FocusAnalysisResponse(
        is_focused=result['is_focused'],
        confidence=result['confidence'],
        regression_count=result['regression_count'],
        recommended_mode=result['recommended_mode']
    )


@app.post("/simplify-text")
async def simplify_text(text: str):
    """
    Simplify text using NLP model
    """
    simplified = text_simplifier.simplify(text)
    return {"original": text, "simplified": simplified}


@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "FocusFlow ML"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5000)
