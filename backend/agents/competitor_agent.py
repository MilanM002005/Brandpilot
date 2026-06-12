import os
import json
import google.generativeai as genai

class CompetitorAgent:
    def __init__(self):
        self.api_key = os.environ.get("GEMINI_API_KEY")
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-2.5-flash')
        else:
            self.model = None

    def analyze_competitor(self, competitor_website: str, business_name: str, industry: str) -> dict:
        prompt = f"""
        You are a Competitor Intelligence Agent.
        Perform a SWOT analysis for the competitor listed below relative to our business, {business_name}:
        
        Competitor Website: {competitor_website}
        Our Business Industry: {industry}

        Generate a complete SWOT analysis in JSON format. Do not write any explanations before or after the JSON.
        The JSON must contain the exact keys:
        - "strengths": An array of 3 strengths this competitor has.
        - "weaknesses": An array of 3 weaknesses we can exploit.
        - "opportunities": An array of 3 market gaps or opportunities.
        - "threats": An array of 3 threats this competitor poses to us.
        - "summary": A 2-3 sentence strategic summary and action recommendation.
        """

        if self.model:
            try:
                response = self.model.generate_content(prompt)
                text = response.text.strip()
                if text.startswith("```"):
                    text = text.split("```")[1]
                    if text.startswith("json"):
                        text = text[4:]
                return json.loads(text.strip())
            except Exception as e:
                print(f"Error calling Gemini: {e}")
                # Fallback to mock

        # Mock fallback
        clean_web = competitor_website.replace("https://", "").replace("http://", "").split("/")[0]
        return {
            "strengths": [
                f"Established brand authority and search rank under domain '{clean_web}'",
                "Wide product catalog with years of customer review history",
                "Aggressive pricing model with bulk discount incentives"
            ],
            "weaknesses": [
                "Poor mobile layout design and lack of modern digital features",
                "Slow customer response times and complaints on review forums",
                "Lack of hyper-personalized options for niche segments"
            ],
            "opportunities": [
                "Capture dissatisfied customers by offering 24/7 autonomous support chat",
                "Target local keywords where competitor lacks geo-focused landing pages",
                "Integrate advanced AI-driven recommendations which they lack"
            ],
            "threats": [
                "Competitor initiating aggressive ad spending on identical search terms",
                "Dumping pricing to clear inventory, hurting our margins temporarily",
                "Acquisition of smaller local distributors to monopolize supply chain"
            ],
            "summary": f"While {clean_web} possesses strong search presence, their outdated mobile UI and slow support leave them vulnerable. {business_name} can capture market share by emphasizing user experience and automated engagement."
        }
