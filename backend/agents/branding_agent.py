import os
import json
import google.generativeai as genai

class BrandingAgent:
    def __init__(self):
        self.api_key = os.environ.get("GEMINI_API_KEY")
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-2.5-flash')
        else:
            self.model = None

    def generate_brand_identity(self, business_name: str, industry: str, target_audience: str, products: str) -> dict:
        prompt = f"""
        You are an expert Brand Identity Strategist Agent for MSMEs.
        Your goal is to build a cohesive brand identity for the following business:
        
        Business Name: {business_name}
        Industry: {industry}
        Target Audience: {target_audience}
        Products/Services: {products}

        Generate a complete brand strategy document in JSON format. Do not write any explanations before or after the JSON.
        The JSON must contain the exact keys:
        - "mission": A powerful mission statement.
        - "vision": A compelling vision statement.
        - "brand_voice": An array of 3-4 tone keywords (e.g., "Professional", "Friendly").
        - "positioning_statement": A clear positioning statement (X helps Y do Z through W).
        - "voice_guide": A description of how the brand should sound in their communications.
        - "personas": An array of 2 target customer personas, each with: "name", "role", "pain_points" (array), "goals" (array).
        """

        if self.model:
            try:
                response = self.model.generate_content(prompt)
                text = response.text.strip()
                # Clean up json wrapping if model wrapped it in ```json ... ```
                if text.startswith("```"):
                    text = text.split("```")[1]
                    if text.startswith("json"):
                        text = text[4:]
                return json.loads(text.strip())
            except Exception as e:
                print(f"Error calling Gemini: {e}")
                # Fallback to mock on error

        # Mock fallback
        return {
            "mission": f"To empower {target_audience} in the {industry} sector with high-quality {products}.",
            "vision": f"To be the leading innovator and trusted partner in {industry}, recognized for excellence and reliability.",
            "brand_voice": ["Innovative", "Empathetic", "Professional", "Growth-Oriented"],
            "positioning_statement": f"For {target_audience} who need premium solutions, {business_name} provides {products} that deliver exceptional results in the {industry} landscape.",
            "voice_guide": f"Our voice is confident yet accessible. We explain complex ideas simply, speak with authority on {industry}, and emphasize growth and support for our customers.",
            "personas": [
                {
                    "name": "Alex, the Busy Owner",
                    "role": "Founder & Managing Director",
                    "pain_points": [
                        "Limited budget for expensive marketing consultants",
                        "No time to write consistent content",
                        "Struggles to measure campaign return on investment"
                    ],
                    "goals": [
                        "Scale operations by 25% year-on-year",
                        "Build a recognizable local brand presence",
                        "Automate repetitive outreach tasks"
                    ]
                },
                {
                    "name": "Sarah, the Operations Manager",
                    "role": "Head of Growth",
                    "pain_points": [
                        "Managing disconnected software platforms",
                        "Difficulty keeping track of competitor product launches",
                        "Inconsistent messaging across email and social media"
                    ],
                    "goals": [
                        "Unify branding guidelines across all channels",
                        "Increase lead qualification rates",
                        "Receive automated alerts about competitor moves"
                    ]
                }
            ]
        }
