import google.generativeai as genai
import json
import re
from config import settings
from models import AnalysisResult, SwotAnalysis, PivotResponse, PivotStrategy


def configure_gemini():
    genai.configure(api_key=settings.gemini_api_key)


def build_prompt(idea: str, description: str) -> str:
    return f"""You are an expert startup advisor and experienced venture capitalist with deep knowledge of markets, technology, and business strategy.

Analyze the following startup idea and return a detailed, structured JSON response.

Startup Idea: {idea}
Additional Description: {description if description else "None provided"}

Return ONLY a valid JSON object (no markdown, no code blocks, no extra text) with this exact structure:
{{
  "market_analysis": "Detailed analysis of the market size, trends, growth potential, and market dynamics. At least 3-4 sentences.",
  "competitors": "Overview of key existing competitors, their strengths/weaknesses, and how this idea differentiates. At least 3-4 sentences.",
  "target_users": "Detailed description of the primary and secondary target user segments, their demographics, needs, and pain points. At least 3-4 sentences.",
  "swot": {{
    "strengths": ["strength 1", "strength 2", "strength 3", "strength 4"],
    "weaknesses": ["weakness 1", "weakness 2", "weakness 3"],
    "opportunities": ["opportunity 1", "opportunity 2", "opportunity 3", "opportunity 4"],
    "threats": ["threat 1", "threat 2", "threat 3"]
  }},
  "monetization": "Detailed explanation of viable monetization models (subscription, freemium, marketplace fees, advertising, etc.) with reasoning for which would work best. At least 3-4 sentences.",
  "technical_architecture": "Recommended tech stack and system architecture including frontend, backend, database, APIs, cloud infrastructure, and any AI/ML components needed. At least 3-4 sentences.",
  "viability_score": 75
}}

The viability_score must be an integer between 0 and 100 reflecting the overall startup viability based on market opportunity, competition, technical feasibility, and business model strength.
Be honest, thorough, critical, and insightful like a real VC. Do not return anything except the JSON object."""


def build_pivot_prompt(idea: str, viability_score: int) -> str:
    return f"""You are an expert startup advisor and experienced venture capitalist. A founder just pitched a startup idea that received a low viability score ({viability_score}/100) and needs to PIVOT.

Original Startup Idea: {idea}

Generate 3 entirely distinct, highly specific, and creative pivot strategies. These pivots should either focus on a different target audience, a different monetization model, a stripped-down core feature, or a different application of the same underlying technology.

Return ONLY a valid JSON object (no markdown, no code blocks, no extra text) with this exact structure:
{{
  "strategies": [
    {{
      "title": "Categorical Title (e.g., Target B2B Enterprise, Gamify the Core, API First)",
      "description": "2-3 sentences explaining exactly how this pivot works and why it has a better chance of success."
    }},
    {{
      "title": "Another Distinct Pivot",
      "description": "..."
    }},
    {{
      "title": "A Third Wildcard Pivot",
      "description": "..."
    }}
  ]
}}
"""


async def analyze_idea(idea: str, description: str) -> AnalysisResult:
    configure_gemini()
    model = genai.GenerativeModel("gemini-flash-latest")

    prompt = build_prompt(idea, description)

    response = model.generate_content(
        prompt,
        generation_config=genai.types.GenerationConfig(
            temperature=0.7,
            max_output_tokens=4096,
        ),
    )

    raw_text = response.text.strip()
    raw_text = re.sub(r"^```(?:json)?\s*", "", raw_text)
    raw_text = re.sub(r"\s*```$", "", raw_text)
    raw_text = raw_text.strip()

    data = json.loads(raw_text)

    swot = SwotAnalysis(
        strengths=data["swot"]["strengths"],
        weaknesses=data["swot"]["weaknesses"],
        opportunities=data["swot"]["opportunities"],
        threats=data["swot"]["threats"],
    )

    return AnalysisResult(
        market_analysis=data["market_analysis"],
        competitors=data["competitors"],
        target_users=data["target_users"],
        swot=swot,
        monetization=data["monetization"],
        technical_architecture=data["technical_architecture"],
        viability_score=int(data["viability_score"]),
    )


async def generate_pivot_strategies(idea: str, viability_score: int) -> PivotResponse:
    configure_gemini()
    model = genai.GenerativeModel("gemini-flash-latest")

    prompt = build_pivot_prompt(idea, viability_score)

    response = model.generate_content(
        prompt,
        generation_config=genai.types.GenerationConfig(
            temperature=0.9,
            max_output_tokens=2048,
        ),
    )

    raw_text = response.text.strip()
    raw_text = re.sub(r"^```(?:json)?\s*", "", raw_text)
    raw_text = re.sub(r"\s*```$", "", raw_text)
    raw_text = raw_text.strip()

    data = json.loads(raw_text)

    strategies = [
        PivotStrategy(title=s["title"], description=s["description"])
        for s in data["strategies"]
    ]

    return PivotResponse(strategies=strategies)
