import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from dotenv import load_dotenv

# Load env variables from root or local config
load_dotenv()

# Import our agents
from agents.branding_agent import BrandingAgent
from agents.marketing_agent import MarketingAgent
from agents.competitor_agent import CompetitorAgent
from agents.analytics_agent import AnalyticsAgent

app = FastAPI(title="BrandPilot AI API", description="Autonomous MSME Growth Operating System API")

# Add CORS Middleware to support localhost frontend connection
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # In production, restrict to frontend domain
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Instantiate Agents
branding_agent = BrandingAgent()
marketing_agent = MarketingAgent()
competitor_agent = CompetitorAgent()
analytics_agent = AnalyticsAgent()

# Pydantic schemas for request validation
class BrandRequest(BaseModel):
    business_name: str
    industry: str
    target_audience: str
    products: str

class MarketingRequest(BaseModel):
    business_name: str
    industry: str
    brand_voice: list = Field(default_factory=list)
    products: str
    campaign_goal: str
    channel: str

class CompetitorRequest(BaseModel):
    competitor_website: str
    business_name: str
    industry: str

class AnalyticsRequest(BaseModel):
    business_name: str
    industry: str
    current_leads: int = 0
    target_leads: int = 10

@app.get("/")
def read_root():
    return {
        "status": "online",
        "service": "BrandPilot AI Autonomous Engine",
        "has_gemini_key": os.environ.get("GEMINI_API_KEY") is not None
    }

@app.post("/api/brand")
def create_brand_profile(req: BrandRequest):
    try:
        result = branding_agent.generate_brand_identity(
            business_name=req.business_name,
            industry=req.industry,
            target_audience=req.target_audience,
            products=req.products
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/marketing")
def create_marketing_campaign(req: MarketingRequest):
    try:
        result = marketing_agent.generate_campaign(
            business_name=req.business_name,
            industry=req.industry,
            brand_voice=req.brand_voice,
            products=req.products,
            campaign_goal=req.campaign_goal,
            channel=req.channel
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/competitor")
def scan_competitor(req: CompetitorRequest):
    try:
        result = competitor_agent.analyze_competitor(
            competitor_website=req.competitor_website,
            business_name=req.business_name,
            industry=req.industry
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analytics")
def generate_growth_metrics(req: AnalyticsRequest):
    try:
        result = analytics_agent.analyze_growth(
            business_name=req.business_name,
            industry=req.industry,
            current_leads=req.current_leads,
            target_leads=req.target_leads
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
