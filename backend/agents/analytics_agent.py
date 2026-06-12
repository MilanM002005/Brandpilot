import os
import json
import random
import google.generativeai as genai

class AnalyticsAgent:
    def __init__(self):
        self.api_key = os.environ.get("GEMINI_API_KEY")
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-2.5-flash')
        else:
            self.model = None

    def analyze_growth(self, business_name: str, industry: str, current_leads: int, target_leads: int) -> dict:
        prompt = f"""
        You are an expert Business Growth Analytics Agent.
        Analyze the growth potential and generate a forecast dashboard for this business:
        
        Business Name: {business_name}
        Industry: {industry}
        Current Monthly Leads: {current_leads}
        Target Monthly Leads: {target_leads}

        Generate a complete business analytics output in JSON format. Do not write any explanations before or after the JSON.
        The JSON must contain the exact keys:
        - "growth_score": An integer score from 1 to 100 representing the growth index.
        - "leads_forecast": An array of 6 objects, each containing: "month" (e.g., "Jan", "Feb"), "current" (integer), "projected" (integer).
        - "revenue_forecast": An array of 6 objects, each containing: "month" (e.g., "Jan", "Feb"), "current_revenue" (integer), "projected_revenue" (integer).
        - "recommendations": An array of 3 specific, detailed growth suggestions.
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
        months = ["Month 1", "Month 2", "Month 3", "Month 4", "Month 5", "Month 6"]
        leads_data = []
        rev_data = []
        
        curr_lead_run = current_leads
        proj_lead_run = current_leads
        curr_rev_run = current_leads * 150
        proj_rev_run = current_leads * 150

        for m in months:
            curr_lead_run = int(curr_lead_run * (1 + random.uniform(0.01, 0.05)))
            proj_lead_run = int(proj_lead_run * (1 + random.uniform(0.12, 0.22)))
            curr_rev_run = int(curr_rev_run * (1 + random.uniform(0.01, 0.05)))
            proj_rev_run = int(proj_rev_run * (1 + random.uniform(0.15, 0.25)))
            
            leads_data.append({
                "month": m,
                "current": curr_lead_run,
                "projected": proj_lead_run
            })
            rev_data.append({
                "month": m,
                "current_revenue": curr_rev_run,
                "projected_revenue": proj_rev_run
            })

        return {
            "growth_score": 78 if current_leads > 0 else 45,
            "leads_forecast": leads_data,
            "revenue_forecast": rev_data,
            "recommendations": [
                f"Implement automated conversational outreach using social channels to close the gap between your current {current_leads} leads and target {target_leads}.",
                f"Reallocate 15% of marketing budget from high-competition broad keywords to hyper-local search phrases to boost inbound traffic organically.",
                "Build dynamic customer persona landing pages to double email capture rates for product catalogs."
            ]
        }
