import os
import json
import google.generativeai as genai

class MarketingAgent:
    def __init__(self):
        self.api_key = os.environ.get("GEMINI_API_KEY")
        if self.api_key:
            genai.configure(api_key=self.api_key)
            self.model = genai.GenerativeModel('gemini-2.5-flash')
        else:
            self.model = None

    def generate_campaign(self, business_name: str, industry: str, brand_voice: list, products: str, campaign_goal: str, channel: str) -> dict:
        voice_str = ", ".join(brand_voice) if isinstance(brand_voice, list) else brand_voice
        prompt = f"""
        You are an expert Social Media & Copywriting Agent.
        Your goal is to write custom marketing copy matching this business profile:
        
        Business Name: {business_name}
        Industry: {industry}
        Brand Voice / Tone: {voice_str}
        Products: {products}
        Campaign Goal: {campaign_goal}
        Marketing Channel: {channel} (LinkedIn, Instagram, or Email)

        Generate a complete campaign content response in JSON format. Do not write any explanations before or after the JSON.
        The JSON must contain the exact keys:
        - "subject_line": For Email (set to empty string if LinkedIn/Instagram).
        - "content": The main copywriting text. For LinkedIn/Instagram include spacing, emojis, and a clear call to action. For Email, include a Subject line and full email draft.
        - "hashtags": An array of relevant hashtags (empty for Email).
        - "visual_prompt": A prompt for an AI image generator to create the background/visual for this post.
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
        if channel.lower() == "email":
            return {
                "subject_line": f"Accelerate your business with {business_name}'s new {products}!",
                "content": f"Hi there,\n\nAre you looking to revolutionize how you operate in the {industry} sector? At {business_name}, we've designed our latest offering, {products}, specifically to address your growth goals.\n\nHere is how we can help:\n- Tailored, professional outcomes\n- Saving hours of execution time every week\n- Empowering your team to focus on scaling\n\nClick here to book a live demo with us today!\n\nBest regards,\nThe {business_name} Team",
                "hashtags": [],
                "visual_prompt": f"A clean, modern workspace with a laptop open showing growth charts, styled in {industry} branding colors, professional and sleek lighting."
            }
        elif channel.lower() == "linkedin":
            return {
                "subject_line": "",
                "content": f"🚀 Exciting news from the frontlines of {industry}!\n\nWe know that scaling a business requires consistent, high-fidelity execution. That's why we at {business_name} are thrilled to spotlight our flagship solution: {products}.\n\nDesigned to align with a {voice_str} philosophy, this is how we help modern MSMEs level up.\n\n👇 What's your biggest bottleneck this quarter? Let us know below!\n\n#Growth #Innovation #{business_name.replace(' ', '')}",
                "hashtags": ["Growth", "Innovation", business_name.replace(" ", "")],
                "visual_prompt": f"A professional group collaborating in a tech boardroom, high-tech glass screens showing metrics, modern UI/UX vibes."
            }
        else: # Instagram
            return {
                "subject_line": "",
                "content": f"✨ Say hello to the future of {industry}! ✨\n\nStruggling to manage your daily growth workflows? We have you covered. {business_name} introduces {products} — engineered to bring you results without the headache. 💡\n\n👉 Tap the link in our bio to learn more! \n\n#branding #design #businesshacks",
                "hashtags": ["branding", "design", "businesshacks", business_name.replace(" ", "")],
                "visual_prompt": f"Vibrant neon layout with a phone mockup showcasing a beautiful dashboard interface, high energy, glassmorphism aesthetics."
            }
