from pydantic import BaseModel, Field, EmailStr
from typing import Optional
from datetime import datetime


class SwotAnalysis(BaseModel):
    strengths: list[str]
    weaknesses: list[str]
    opportunities: list[str]
    threats: list[str]


class AnalysisResult(BaseModel):
    market_analysis: str
    competitors: str
    target_users: str
    swot: SwotAnalysis
    monetization: str
    technical_architecture: str
    viability_score: int  # 0-100


class AnalysisRequest(BaseModel):
    idea: str
    description: Optional[str] = ""


class AnalysisDocument(BaseModel):
    id: Optional[str] = None
    user_id: str
    idea_text: str
    description: Optional[str] = ""
    analysis_results: AnalysisResult
    viability_score: int
    timestamp: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_encoders = {datetime: lambda v: v.isoformat()}


class PivotRequest(BaseModel):
    idea: str
    viability_score: int


class PivotStrategy(BaseModel):
    title: str
    description: str


class PivotResponse(BaseModel):
    strategies: list[PivotStrategy]


# --- Auth Models ---

class User(BaseModel):
    id: Optional[str] = None
    identifier: str  # Email or phone number
    created_at: datetime = Field(default_factory=datetime.utcnow)

    class Config:
        json_encoders = {datetime: lambda v: v.isoformat()}


class OTPRequest(BaseModel):
    identifier: str  # Email or phone number


class OTPVerify(BaseModel):
    identifier: str
    otp: str


class Token(BaseModel):
    access_token: str
    token_type: str
