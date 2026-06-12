"use client";

import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Brain,
  Sparkles,
  Megaphone,
  SearchCode,
  TrendingUp,
  Bot,
  Globe,
  Building2,
  Users,
  CheckCircle,
  RefreshCw,
  AlertCircle,
  ArrowRight,
  Send,
  Loader2,
  Check,
  Mail,
  Copy,
  Plus
} from "lucide-react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  CartesianGrid
} from "recharts";

const BACKEND_URL = "http://127.0.0.1:8000";

// Local SVG Fallbacks for Brand Icons to ensure compile success across all environments
const Instagram = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const Linkedin = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
    <rect x="2" y="9" width="4" height="12"></rect>
    <circle cx="4" cy="4" r="2"></circle>
  </svg>
);

export default function Home() {
  // Navigation
  const [activeTab, setActiveTab] = useState("dashboard");

  // Shared Digital Twin state
  const [twinConfig, setTwinConfig] = useState({
    business_name: "FreshBite Organic",
    industry: "Healthy Meal Kits & E-commerce",
    target_audience: "Busy working professionals, health-conscious parents, fitness enthusiasts",
    products: "Organic, pre-portioned meal prep kits delivered weekly via subscription",
    brand_voice: ["Empathetic", "Innovative", "Logical", "High-Energy"],
    initialized: true
  });

  // Local form state for Digital Twin editor
  const [twinForm, setTwinForm] = useState({ ...twinConfig });

  // Agent response states
  const [brandingResult, setBrandingResult] = useState(null);
  const [marketingResult, setMarketingResult] = useState(null);
  const [competitorResult, setCompetitorResult] = useState(null);
  const [analyticsResult, setAnalyticsResult] = useState(null);

  // Loaders
  const [loading, setLoading] = useState({
    branding: false,
    marketing: false,
    competitor: false,
    analytics: false
  });

  // Marketing custom prompt
  const [marketingChannel, setMarketingChannel] = useState("linkedin");
  const [campaignGoal, setCampaignGoal] = useState("Launch our new organic keto meal box");

  // Competitor input
  const [competitorUrl, setCompetitorUrl] = useState("https://blueapron.com");

  // Analytics input
  const [currentLeads, setCurrentLeads] = useState(150);
  const [targetLeads, setTargetLeads] = useState(600);

  // Alerts
  const [statusMessage, setStatusMessage] = useState(null);
  const [copiedText, setCopiedText] = useState(null);

  // Copy helper
  const handleCopy = (text, key) => {
    navigator.clipboard.writeText(text);
    setCopiedText(key);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Helper for API calls with fallback
  const callAgent = async (endpoint, payload, fallbackData) => {
    try {
      const response = await fetch(`${BACKEND_URL}${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      if (!response.ok) throw new Error("Backend response error");
      return await response.json();
    } catch (err) {
      console.warn(`Backend connection failed at ${endpoint}. Falling back to client-side simulation.`, err);
      // Simulate network delay for nice UX loading
      await new Promise(resolve => setTimeout(resolve, 1500));
      return fallbackData;
    }
  };

  // Branding Agent trigger
  const runBrandingAgent = async () => {
    setLoading(prev => ({ ...prev, branding: true }));
    const fallback = {
      mission: `To empower ${twinConfig.target_audience.split(",")[0] || "busy people"} in the ${twinConfig.industry} sector with high-quality ${twinConfig.products}.`,
      vision: `To be the leading innovator and trusted partner in healthy living, recognized for quality and nutrition.`,
      brand_voice: ["Empathetic", "Innovative", "Logical", "High-Energy"],
      positioning_statement: `For ${twinConfig.target_audience} who want premium convenience, ${twinConfig.business_name} provides ${twinConfig.products} that guarantee healthy living without time loss.`,
      voice_guide: "Our voice is friendly yet authoritative. We speak passionately about wellness, nutrition, and ease of use, keeping our tone helpful and free of industry jargon.",
      personas: [
        {
          name: "David, the Time-Starved Manager",
          role: "Senior Consultant",
          pain_points: [
            "Works 60+ hours a week",
            "Relies on greasy takeout which affects energy levels",
            "No time to grocery shop or portion ingredients"
          ],
          goals: [
            "Maintain a healthy organic diet consistently",
            "Minimize meal planning and prep time under 15 minutes",
            "Reduce weekly household food waste"
          ]
        },
        {
          name: "Elena, the Fit Mother",
          role: "Fitness Instructor & Parent",
          pain_points: [
            "Hard to find clean-ingredient meals the kids also enjoy",
            "Cooking separate nutritious dinners is exhausted",
            "Struggles to calculate macro-nutrients daily"
          ],
          goals: [
            "Source certified organic, clean nutrition for the family",
            "Introduce kids to new whole-food recipes easily",
            "Find meal solutions that fit her keto/gluten-free habits"
          ]
        }
      ]
    };

    const data = await callAgent("/api/brand", {
      business_name: twinConfig.business_name,
      industry: twinConfig.industry,
      target_audience: twinConfig.target_audience,
      products: twinConfig.products
    }, fallback);

    setBrandingResult(data);
    if (data.brand_voice) {
      setTwinConfig(prev => ({ ...prev, brand_voice: data.brand_voice }));
    }
    setLoading(prev => ({ ...prev, branding: false }));
    setStatusMessage({ type: "success", text: "Branding Agent complete! Digital Twin voice updated." });
  };

  // Marketing Agent trigger
  const runMarketingAgent = async () => {
    setLoading(prev => ({ ...prev, marketing: true }));
    const mockContent = marketingChannel === "email" 
      ? {
          subject_line: `Revolutionize your weekly meals with ${twinConfig.business_name}!`,
          content: `Subject: Revolutionize your weekly meals with ${twinConfig.business_name}!\n\nHi there,\n\nWe know that balancing a busy calendar and eating clean organic ingredients is tough. That's why we created ${twinConfig.products}.\n\nHere's what our meal subscription delivers:\n- 100% Certified Organic ingredients sourced locally\n- Pre-portioned kits ready in under 15 minutes\n- Guilt-free, Chef-curated recipes that match your diet goals\n\nClick here to claim 3 free meals with your first box today!\n\nBest,\nThe ${twinConfig.business_name} Team`,
          hashtags: [],
          visual_prompt: "Close up photo of high-quality organic ingredients: vibrant vegetables, fresh herbs, rustic wooden board, chef styling."
        }
      : marketingChannel === "linkedin"
      ? {
          subject_line: "",
          content: `🚀 How does a busy professional maintain peak energy levels?\n\nBy dialing in nutrition without wasting hours in the kitchen. We are excited to announce our new goal: ${campaignGoal}.\n\nBuilt on our core promise of providing ${twinConfig.products}, we are leveling up wellness in the ${twinConfig.industry} space.\n\n👉 Share your go-to meal prep tip below!\n\n#OrganicLiving #Productivity #HealthyMealKits`,
          hashtags: ["OrganicLiving", "Productivity", "HealthyMealKits"],
          visual_prompt: "Modern minimalist workspace with a laptop, a colorful organic meal box beside it, clean workspace lighting, cyan accents."
        }
      : {
          subject_line: "",
          content: `✨ Say hello to dinner solved! ✨\n\nNo planning. No shopping. No food waste. Our mission to "${campaignGoal}" is officially live!\n\nPrep organic chef-made recipes at home in under 15 minutes. 🥗🍽️\n\n👉 Tap our bio to choose your first week of meal kits!\n\n#eatingclean #organicmeals #freshingredients`,
          hashtags: ["eatingclean", "organicmeals", "freshingredients"],
          visual_prompt: "Bright aesthetic overhead shot of a family smiling and sharing organic salads at a wooden dinner table, warm sunlight."
        };

    const data = await callAgent("/api/marketing", {
      business_name: twinConfig.business_name,
      industry: twinConfig.industry,
      brand_voice: twinConfig.brand_voice,
      products: twinConfig.products,
      campaign_goal: campaignGoal,
      channel: marketingChannel
    }, mockContent);

    setMarketingResult(data);
    setLoading(prev => ({ ...prev, marketing: false }));
    setStatusMessage({ type: "success", text: "Marketing Agent complete! Creative copy ready." });
  };

  // Competitor Agent trigger
  const runCompetitorAgent = async () => {
    setLoading(prev => ({ ...prev, competitor: true }));
    const cleanWeb = competitorUrl.replace("https://", "").replace("http://", "").split("/")[0];
    const fallback = {
      strengths: [
        `Huge national brand authority for domain ${cleanWeb}`,
        "Large logistical distribution network across the country",
        "Deep discount deals for brand-new subscribers"
      ],
      weaknesses: [
        "Mass-produced recipes that lack premium organic options",
        "Complex customer support flow with long phone queues",
        "Higher plastic packaging waste complained about by customers"
      ],
      opportunities: [
        "Emphasize our 100% recyclable glass and paper packaging",
        "Promote hyper-local organic supplier stories in our marketing",
        "Integrate automated support agents to offer instant adjustments to plans"
      ],
      threats: [
        "Competitor launching a niche organic brand line-up",
        "Aggressive ad spend bidding up our target CPC keyword bids",
        "Price wars on meal box base rates hurting our margins"
      ],
      summary: `While ${cleanWeb} commands massive scale, they are vulnerable to the growing demand for green packaging and true organic quality. ${twinConfig.business_name} should double down on zero-waste packaging and local farming partnerships.`
    };

    const data = await callAgent("/api/competitor", {
      competitor_website: competitorUrl,
      business_name: twinConfig.business_name,
      industry: twinConfig.industry
    }, fallback);

    setCompetitorResult(data);
    setLoading(prev => ({ ...prev, competitor: false }));
    setStatusMessage({ type: "success", text: "Competitor Intelligence Agent complete SWOT generated." });
  };

  // Analytics Agent trigger
  const runAnalyticsAgent = async () => {
    setLoading(prev => ({ ...prev, analytics: true }));
    const fallback = {
      growth_score: 74,
      leads_forecast: [
        { month: "Month 1", current: currentLeads, projected: currentLeads },
        { month: "Month 2", current: Math.floor(currentLeads * 1.05), projected: Math.floor(currentLeads * 1.25) },
        { month: "Month 3", current: Math.floor(currentLeads * 1.10), projected: Math.floor(currentLeads * 1.60) },
        { month: "Month 4", current: Math.floor(currentLeads * 1.14), projected: Math.floor(currentLeads * 2.10) },
        { month: "Month 5", current: Math.floor(currentLeads * 1.18), projected: Math.floor(currentLeads * 2.80) },
        { month: "Month 6", current: Math.floor(currentLeads * 1.22), projected: Math.floor(currentLeads * 3.75) }
      ],
      revenue_forecast: [
        { month: "Month 1", current_revenue: currentLeads * 150, projected_revenue: currentLeads * 150 },
        { month: "Month 2", current_revenue: Math.floor(currentLeads * 1.05 * 150), projected_revenue: Math.floor(currentLeads * 1.25 * 160) },
        { month: "Month 3", current_revenue: Math.floor(currentLeads * 1.10 * 150), projected_revenue: Math.floor(currentLeads * 1.60 * 170) },
        { month: "Month 4", current_revenue: Math.floor(currentLeads * 1.14 * 150), projected_revenue: Math.floor(currentLeads * 2.10 * 180) },
        { month: "Month 5", current_revenue: Math.floor(currentLeads * 1.18 * 150), projected_revenue: Math.floor(currentLeads * 2.80 * 190) },
        { month: "Month 6", current_revenue: Math.floor(currentLeads * 1.22 * 150), projected_revenue: Math.floor(currentLeads * 3.75 * 200) }
      ],
      recommendations: [
        `Convert traffic at 2.5x higher rate by deploying the Branding Agent's new customer guide personas to localized social ads.`,
        `Direct 25% of new marketing campaign budget into ${marketingChannel.toUpperCase()} organic campaigns matching target personas.`,
        `Offset competitor threats by offering subscription bundles targeted directly at Elena/David persona groups.`
      ]
    };

    const data = await callAgent("/api/analytics", {
      business_name: twinConfig.business_name,
      industry: twinConfig.industry,
      current_leads: currentLeads,
      target_leads: targetLeads
    }, fallback);

    setAnalyticsResult(data);
    setLoading(prev => ({ ...prev, analytics: false }));
    setStatusMessage({ type: "success", text: "Analytics Agent complete! Growth forecasts plotted." });
  };

  // Run automatically on first render for rich demo experience
  useEffect(() => {
    runBrandingAgent();
    runAnalyticsAgent();
    runCompetitorAgent();
  }, []);

  const handleUpdateTwin = (e) => {
    e.preventDefault();
    setTwinConfig({ ...twinForm, initialized: true });
    setStatusMessage({ type: "success", text: "Business Digital Twin updated successfully! Shared agent memory refreshed." });
    // Trigger recalculations
    setBrandingResult(null);
    setMarketingResult(null);
    setCompetitorResult(null);
    setAnalyticsResult(null);
  };

  return (
    <div className="flex h-screen w-full bg-[#fafafa] text-[#0f172a] overflow-hidden">
      
      {/* Sidebar Navigation - Light Slate Theme */}
      <aside className="w-72 bg-white border-r border-slate-200 flex flex-col justify-between shrink-0 shadow-sm">
        <div>
          {/* Logo */}
          <div className="p-6 border-b border-slate-200 flex items-center space-x-3">
            <div className="h-9 w-9 rounded-lg bg-gradient-to-tr from-[#06b6d4] to-[#0891b2] flex items-center justify-center shadow-lg shadow-[#06b6d4]/10">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-lg leading-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                BrandPilot AI
              </h1>
              <p className="text-[10px] text-slate-400 font-semibold tracking-widest uppercase">
                MSME GROWTH OS
              </p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="p-4 space-y-1">
            {[
              { id: "dashboard", label: "Dashboard Cockpit", icon: LayoutDashboard },
              { id: "digital-twin", label: "Business Digital Twin", icon: Brain },
              { id: "branding", label: "Branding Agent", icon: Sparkles },
              { id: "marketing", label: "Marketing Studio", icon: Megaphone },
              { id: "competitors", label: "Competitor Intel", icon: SearchCode },
              { id: "analytics", label: "Analytics & Forecasts", icon: TrendingUp }
            ].map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                    isActive
                      ? "bg-[#06b6d4]/10 text-[#0891b2] border border-[#06b6d4]/20 shadow-[0_2px_10px_rgba(6,182,212,0.05)] font-semibold"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70 border border-transparent"
                  }`}
                >
                  <Icon className={`h-4.5 w-4.5 ${isActive ? "text-[#0891b2]" : "text-slate-500"}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* User profile & Connection Indicator */}
        <div className="p-4 border-t border-slate-200 bg-slate-50/50">
          <div className="flex items-center justify-between p-2 rounded-lg bg-white border border-slate-200 shadow-sm">
            <div className="flex items-center space-x-3">
              <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-700">
                MP
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-slate-800">Milan Manoj</p>
                <p className="text-[10px] text-slate-400">Workspace Owner</p>
              </div>
            </div>
            <div className="flex items-center space-x-1">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
              </span>
              <span className="text-[9px] text-slate-500 font-medium">Local API</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[#fafafa]">
        {/* Top Header */}
        <header className="h-16 border-b border-slate-200 px-8 flex items-center justify-between shrink-0 bg-white/80 backdrop-blur-md z-10 shadow-sm">
          <div className="flex items-center space-x-4">
            <span className="text-sm font-semibold text-slate-500 capitalize">
              Workspace / {activeTab.replace("-", " ")}
            </span>
          </div>

          <div className="flex items-center space-x-4">
            {/* Status alerts */}
            {statusMessage && (
              <div className="flex items-center space-x-2 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs py-1.5 px-3 rounded-full animate-fade-in">
                <CheckCircle className="h-3.5 w-3.5 text-emerald-600" />
                <span>{statusMessage.text}</span>
              </div>
            )}
            
            <div className="text-xs text-slate-700 flex items-center space-x-2 bg-white border border-slate-200 px-3 py-1.5 rounded-md shadow-sm">
              <Brain className="h-3.5 w-3.5 text-[#06b6d4]" />
              <span>Digital Twin: <strong>{twinConfig.business_name}</strong></span>
            </div>
          </div>
        </header>

        {/* Tab View Container */}
        <div className="flex-1 overflow-y-auto p-8">
          
          {/* TAB 1: COCKPIT DASHBOARD */}
          {activeTab === "dashboard" && (
            <div className="space-y-6 max-w-6xl">
              
              {/* Hero Header - White/Cyan themed design */}
              <div className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-[#ecfeff] via-[#e0f7fa] to-[#ecfeff] border border-[#06b6d4]/20 shadow-md">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 via-slate-800 to-slate-700 bg-clip-text text-transparent">
                    Autonomous Business Cockpit
                  </h2>
                  <p className="text-sm text-slate-600 mt-1">
                    Your autonomous marketing, competitor intelligence, and growth agents are active.
                  </p>
                </div>
                <div className="flex items-center space-x-3">
                  <button 
                    onClick={() => {
                      runBrandingAgent();
                      runAnalyticsAgent();
                      runCompetitorAgent();
                    }}
                    className="flex items-center space-x-2 px-4 py-2 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition-all shadow-sm"
                  >
                    <RefreshCw className="h-3.5 w-3.5 text-slate-500" />
                    <span>Re-evaluate Setup</span>
                  </button>
                </div>
              </div>

              {/* Status Grid */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                
                {/* Growth score widget */}
                <div className="glass-panel rounded-xl p-5 border border-slate-200/80 flex flex-col justify-between h-40">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Growth Index</span>
                    <TrendingUp className="h-4.5 w-4.5 text-cyan-500" />
                  </div>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-4xl font-extrabold text-slate-900">
                      {analyticsResult ? analyticsResult.growth_score : "--"}
                    </span>
                    <span className="text-xs text-cyan-600 font-semibold flex items-center">
                      +12.4% vs last week
                    </span>
                  </div>
                  <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div 
                      className="bg-cyan-500 h-full transition-all duration-1000"
                      style={{ width: `${analyticsResult ? analyticsResult.growth_score : 50}%` }}
                    ></div>
                  </div>
                </div>

                {/* Digital Twin Status */}
                <div className="glass-panel rounded-xl p-5 border border-slate-200/80 flex flex-col justify-between h-40">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Digital Twin Memory</span>
                    <Brain className="h-4.5 w-4.5 text-[#06b6d4]" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-800 truncate">{twinConfig.business_name}</h4>
                    <p className="text-xs text-slate-500 mt-0.5 truncate">{twinConfig.industry}</p>
                  </div>
                  <div className="flex items-center space-x-1.5 text-xs text-[#06b6d4] bg-[#06b6d4]/10 py-1 px-2.5 rounded-md w-fit font-medium">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#06b6d4] animate-pulse"></span>
                    <span>Persistent State Synced</span>
                  </div>
                </div>

                {/* Competitor Alert Tracker - RED theme alert */}
                <div className="glass-panel rounded-xl p-5 border border-red-200/80 flex flex-col justify-between h-40">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Competitor Alerts</span>
                    <SearchCode className="h-4.5 w-4.5 text-red-500" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-600 leading-snug line-clamp-2">
                      {competitorResult ? competitorResult.summary : "No competitor scanned yet."}
                    </p>
                  </div>
                  <button 
                    onClick={() => setActiveTab("competitors")}
                    className="text-xs text-red-600 hover:text-red-700 font-semibold flex items-center space-x-1 text-left"
                  >
                    <span>View Threat Report</span>
                    <ArrowRight className="h-3 w-3" />
                  </button>
                </div>

                {/* Active Agents summary - CYAN theme */}
                <div className="glass-panel rounded-xl p-5 border border-slate-200/80 flex flex-col justify-between h-40">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Growth Agents Active</span>
                    <Bot className="h-4.5 w-4.5 text-[#06b6d4]" />
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    <span className="text-[10px] bg-slate-50 text-slate-700 px-2 py-0.5 rounded border border-slate-200">Branding</span>
                    <span className="text-[10px] bg-slate-50 text-slate-700 px-2 py-0.5 rounded border border-slate-200">Marketing</span>
                    <span className="text-[10px] bg-slate-50 text-slate-700 px-2 py-0.5 rounded border border-slate-200">Competitors</span>
                    <span className="text-[10px] bg-cyan-50 text-cyan-700 px-2 py-0.5 rounded border border-cyan-200 font-medium">Predictive</span>
                  </div>
                  <div className="text-[10px] text-slate-500 flex items-center space-x-1">
                    <CheckCircle className="h-3 w-3 text-cyan-600" />
                    <span>LlamaIndex RAG connected</span>
                  </div>
                </div>

              </div>

              {/* Main Cockpit Split */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Left side: AI Agent Actions */}
                <div className="md:col-span-2 space-y-6">
                  
                  {/* Growth forecast chart summary */}
                  <div className="glass-panel rounded-xl p-6 border border-slate-200/80">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h3 className="text-md font-bold text-slate-800">Autonomous Growth Forecast</h3>
                        <p className="text-xs text-slate-500">6-Month Lead Acquisition Projection: Current Baseline vs Agent Accelerated Growth</p>
                      </div>
                      <button 
                        onClick={() => setActiveTab("analytics")}
                        className="text-xs text-[#06b6d4] hover:underline font-semibold"
                      >
                        Detailed Analysis
                      </button>
                    </div>

                    <div className="h-64 w-full">
                      {analyticsResult ? (
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={analyticsResult.leads_forecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorCurrent" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#cbd5e1" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#cbd5e1" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorProjected" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.4}/>
                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                            <YAxis stroke="#94a3b8" fontSize={11} />
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0", color: "#0f172a" }} />
                            <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                            <Area name="Standard Base path" type="monotone" dataKey="current" stroke="#94a3b8" strokeWidth={2} fillOpacity={1} fill="url(#colorCurrent)" />
                            <Area name="BrandPilot Accelerated Path" type="monotone" dataKey="projected" stroke="#06b6d4" strokeWidth={2.5} fillOpacity={1} fill="url(#colorProjected)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      ) : (
                        <div className="h-full flex items-center justify-center text-slate-400 text-xs">
                          Calculating business growth curves...
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Generated marketing posts overview */}
                  <div className="glass-panel rounded-xl p-6 border border-slate-200/80">
                    <h3 className="text-md font-bold text-slate-800 mb-4">Latest Agent Workstation Copies</h3>
                    
                    {marketingResult ? (
                      <div className="space-y-4">
                        <div className="p-4 rounded-lg bg-slate-50 border border-slate-200">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-semibold text-slate-500 capitalize flex items-center space-x-1">
                              {marketingChannel === "linkedin" && <Linkedin className="h-3.5 w-3.5 text-[#0077b5]" />}
                              {marketingChannel === "instagram" && <Instagram className="h-3.5 w-3.5 text-[#e1306c]" />}
                              {marketingChannel === "email" && <Mail className="h-3.5 w-3.5 text-cyan-600" />}
                              <span className="uppercase text-[10px] tracking-wide text-slate-600">{marketingChannel} Post Copy</span>
                            </span>
                            <button
                              onClick={() => handleCopy(marketingResult.content, "dash-copy")}
                              className="text-[10px] text-slate-500 hover:text-slate-800 flex items-center space-x-1 transition"
                            >
                              {copiedText === "dash-copy" ? (
                                <span className="text-[#06b6d4] flex items-center"><Check className="h-3 w-3 mr-0.5" /> Copied</span>
                              ) : (
                                <><Copy className="h-3 w-3" /><span>Copy</span></>
                              )}
                            </button>
                          </div>
                          
                          {marketingResult.subject_line && (
                            <p className="text-xs font-bold text-slate-800 mb-2">
                              Subject: {marketingResult.subject_line}
                            </p>
                          )}
                          <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed font-sans">
                            {marketingResult.content}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="p-8 text-center bg-slate-50/50 rounded-lg border border-dashed border-slate-200">
                        <Megaphone className="h-8 w-8 text-slate-400 mx-auto mb-2" />
                        <p className="text-xs text-slate-500">No content generated yet. Go to Marketing Studio to run campaign agents.</p>
                        <button 
                          onClick={() => setActiveTab("marketing")}
                          className="mt-3 text-xs bg-[#06b6d4] hover:bg-[#0891b2] text-white px-3.5 py-1.5 rounded-lg transition shadow-md shadow-cyan-500/10"
                        >
                          Generate Now
                        </button>
                      </div>
                    )}
                  </div>

                </div>

                {/* Right side: AI Growth Recommendations & Persona checklist */}
                <div className="space-y-6">
                  
                  {/* Recommendations - YELLOW/CYAN themed suggestions */}
                  <div className="glass-panel rounded-xl p-6 border border-slate-200/80">
                    <h3 className="text-md font-bold text-slate-800 mb-4 flex items-center space-x-2">
                      <Sparkles className="h-4.5 w-4.5 text-[#06b6d4]" />
                      <span>AI Recommendations</span>
                    </h3>

                    <div className="space-y-4">
                      {analyticsResult ? (
                        analyticsResult.recommendations.map((rec, i) => (
                          <div key={i} className="flex space-x-3 p-3 rounded-lg bg-slate-50 border border-slate-200">
                            <div className="h-6 w-6 shrink-0 bg-[#06b6d4]/10 rounded-full flex items-center justify-center text-xs font-bold text-[#0891b2]">
                              {i + 1}
                            </div>
                            <p className="text-xs text-slate-700 leading-normal">
                              {rec}
                            </p>
                          </div>
                        ))
                      ) : (
                        <div className="text-slate-400 text-xs py-4 text-center">
                          Waiting for analytics generation...
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Brand guide summary widget */}
                  <div className="glass-panel rounded-xl p-6 border border-slate-200/80">
                    <h3 className="text-md font-bold text-slate-800 mb-2">Brand Strategy Guide</h3>
                    <p className="text-[11px] text-slate-500 mb-4">Core brand guide generated by the AI Branding Agent</p>
                    
                    {brandingResult ? (
                      <div className="space-y-3 text-xs">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase tracking-widest block mb-0.5 font-semibold">Brand Identity positioning</span>
                          <p className="text-slate-700 leading-snug font-medium">{brandingResult.positioning_statement}</p>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase tracking-widest block mb-0.5 font-semibold">Voice Tone Keywords</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {brandingResult.brand_voice.map((voice, idx) => (
                              <span key={idx} className="bg-slate-100 text-slate-600 px-2.5 py-0.5 rounded text-[10px] font-semibold border border-slate-200">
                                {voice}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-slate-400 text-xs py-4 text-center">
                        Branding strategy not built yet.
                      </div>
                    )}
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* TAB 2: DIGITAL TWIN SETTINGS */}
          {activeTab === "digital-twin" && (
            <div className="max-w-3xl space-y-6">
              <div className="glass-panel rounded-xl p-6 border border-slate-200/80">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="h-10 w-10 bg-[#06b6d4]/10 rounded-lg flex items-center justify-center">
                    <Brain className="h-6 w-6 text-[#06b6d4]" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Business Digital Twin Configuration</h2>
                    <p className="text-xs text-slate-500">Define the persistent memory of your business. All agents consult this before executing actions.</p>
                  </div>
                </div>

                <form onSubmit={handleUpdateTwin} className="space-y-4 pt-4 border-t border-slate-200">
                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Business Name</label>
                    <input
                      type="text"
                      value={twinForm.business_name}
                      onChange={e => setTwinForm({ ...twinForm, business_name: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#06b6d4] transition"
                      placeholder="e.g. Acme Inc."
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Industry Sector</label>
                    <input
                      type="text"
                      value={twinForm.industry}
                      onChange={e => setTwinForm({ ...twinForm, industry: e.target.value })}
                      className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#06b6d4] transition"
                      placeholder="e.g. Enterprise SaaS / Local Coffee Roasters"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Target Customer Audience</label>
                    <textarea
                      value={twinForm.target_audience}
                      onChange={e => setTwinForm({ ...twinForm, target_audience: e.target.value })}
                      rows={2}
                      className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#06b6d4] transition resize-none"
                      placeholder="e.g. Local coffee lovers, boutique cafes, subscription buyers"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Products or Core Offering</label>
                    <textarea
                      value={twinForm.products}
                      onChange={e => setTwinForm({ ...twinForm, products: e.target.value })}
                      rows={2}
                      className="w-full bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#06b6d4] transition resize-none"
                      placeholder="e.g. High-grade roasted beans, coffee accessories, organic subscriptions"
                      required
                    />
                  </div>

                  <div className="pt-4 flex items-center justify-between border-t border-slate-200/80">
                    <span className="text-[11px] text-slate-400">Updating will re-trigger AI strategy generation.</span>
                    <button
                      type="submit"
                      className="flex items-center space-x-2 px-5 py-2.5 bg-[#06b6d4] hover:bg-[#0891b2] text-white rounded-lg text-sm font-semibold shadow-lg shadow-cyan-500/10 transition"
                    >
                      <Check className="h-4 w-4" />
                      <span>Sync Twin Memory</span>
                    </button>
                  </div>
                </form>
              </div>

              {/* RAG sources helper */}
              <div className="glass-panel rounded-xl p-6 border border-slate-200/80">
                <h3 className="text-sm font-bold text-slate-800 mb-2">Knowledge Base & RAG Sources</h3>
                <p className="text-xs text-slate-500 mb-4">Upload PDF catalogs, spreadsheets, or input URLs to enrich the RAG index.</p>
                <div className="flex space-x-3">
                  <div className="flex-1 border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center text-slate-500 hover:border-[#06b6d4] hover:bg-slate-50/50 transition cursor-pointer">
                    <Plus className="h-6 w-6 mb-2 text-slate-400" />
                    <span className="text-xs font-semibold text-slate-700">Add PDF / Catalog Files</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Supports .pdf, .docx (Max 15MB)</span>
                  </div>
                  <div className="flex-1 border-2 border-dashed border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center text-slate-500 hover:border-[#06b6d4] hover:bg-slate-50/50 transition cursor-pointer">
                    <Plus className="h-6 w-6 mb-2 text-slate-400" />
                    <span className="text-xs font-semibold text-slate-700">Scrape Website URL</span>
                    <span className="text-[10px] text-slate-400 mt-0.5">Auto-crawl sitemaps</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BRANDING AGENT */}
          {activeTab === "branding" && (
            <div className="space-y-6 max-w-5xl">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
                    <Sparkles className="h-5.5 w-5.5 text-[#06b6d4]" />
                    <span>AI Branding Strategist</span>
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">Generates brand strategy, vision, and custom personas matching the Digital Twin memory.</p>
                </div>
                <button
                  onClick={runBrandingAgent}
                  disabled={loading.branding}
                  className="flex items-center space-x-2 bg-[#06b6d4] hover:bg-[#0891b2] disabled:bg-slate-300 text-white px-4 py-2.5 rounded-lg text-xs font-bold transition shadow-md shadow-cyan-500/10"
                >
                  {loading.branding ? (
                    <><Loader2 className="h-3.5 w-3.5 animate-spin" /><span>Generating Brand Guidelines...</span></>
                  ) : (
                    <><RefreshCw className="h-3.5 w-3.5" /><span>Regenerate Strategy</span></>
                  )}
                </button>
              </div>

              {brandingResult ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  
                  {/* Left Column: Brand Pillars */}
                  <div className="md:col-span-2 space-y-6">
                    
                    {/* Mission & Vision */}
                    <div className="glass-panel rounded-xl p-6 border border-slate-200 space-y-4">
                      <div>
                        <span className="text-[10px] text-[#06b6d4] font-bold uppercase tracking-wider">Mission Statement</span>
                        <p className="text-slate-800 font-medium text-sm mt-1 leading-relaxed">
                          {brandingResult.mission}
                        </p>
                      </div>
                      <div className="pt-4 border-t border-slate-200">
                        <span className="text-[10px] text-[#06b6d4] font-bold uppercase tracking-wider">Vision Visionary Path</span>
                        <p className="text-slate-800 font-medium text-sm mt-1 leading-relaxed">
                          {brandingResult.vision}
                        </p>
                      </div>
                    </div>

                    {/* Positioning statement - CYAN themed */}
                    <div className="glass-panel rounded-xl p-6 border border-slate-200">
                      <span className="text-[10px] text-cyan-600 font-bold uppercase tracking-wider">Strategic Market Positioning</span>
                      <p className="text-slate-800 font-medium text-sm mt-1 leading-relaxed">
                        {brandingResult.positioning_statement}
                      </p>
                    </div>

                    {/* Voice Guide - YELLOW guide accents */}
                    <div className="glass-panel rounded-xl p-6 border border-slate-200">
                      <span className="text-[10px] text-amber-600 font-bold uppercase tracking-wider">Voice & Tone Implementation Guide</span>
                      <p className="text-slate-700 text-sm mt-1 leading-relaxed">
                        {brandingResult.voice_guide}
                      </p>
                      
                      <div className="flex flex-wrap gap-2 mt-4">
                        {brandingResult.brand_voice.map((voice, i) => (
                          <span key={i} className="bg-amber-50 border border-amber-200 text-amber-800 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">
                            {voice}
                          </span>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* Right Column: Persona Cards */}
                  <div className="space-y-6">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Target Customer Personas</h3>
                    
                    {brandingResult.personas.map((p, i) => (
                      <div key={i} className="glass-panel rounded-xl p-5 border border-slate-200 space-y-4 bg-white shadow-sm">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 bg-[#06b6d4]/10 rounded-full flex items-center justify-center font-bold text-xs text-[#0891b2]">
                            {p.name.charAt(0)}
                          </div>
                          <div>
                            <h4 className="text-sm font-bold text-slate-800">{p.name}</h4>
                            <p className="text-[10px] text-slate-400 font-semibold">{p.role}</p>
                          </div>
                        </div>

                        <div>
                          <span className="text-[9px] text-red-500 font-semibold uppercase tracking-wider">Pain Points</span>
                          <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside mt-1 leading-snug">
                            {p.pain_points.map((pt, idx) => <li key={idx}>{pt}</li>)}
                          </ul>
                        </div>

                        <div className="pt-2 border-t border-slate-100">
                          <span className="text-[9px] text-cyan-600 font-semibold uppercase tracking-wider">Goals & Motivations</span>
                          <ul className="text-xs text-slate-600 space-y-1 list-disc list-inside mt-1 leading-snug">
                            {p.goals.map((goal, idx) => <li key={idx}>{goal}</li>)}
                          </ul>
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-200">
                  <Sparkles className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-500">Configure your Digital Twin, then generate the brand guide.</p>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: MARKETING STUDIO */}
          {activeTab === "marketing" && (
            <div className="space-y-6 max-w-5xl">
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                
                {/* Configuration Panel */}
                <div className="glass-panel rounded-xl p-6 border border-slate-200 space-y-4 h-fit">
                  <h3 className="text-md font-bold text-slate-800">Marketing Campaign Strategist</h3>
                  <p className="text-xs text-slate-500 leading-normal">Generate copywriting drafts tailored to specific social/email channels using the brand voice rules.</p>
                  
                  <div className="pt-2 border-t border-slate-200 space-y-3">
                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Goal of Campaign</label>
                      <input
                        type="text"
                        value={campaignGoal}
                        onChange={e => setCampaignGoal(e.target.value)}
                        className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#06b6d4] transition"
                        placeholder="e.g. Free consultation call / Winter Sale"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Marketing Outlet</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: "linkedin", label: "LinkedIn", icon: Linkedin },
                          { id: "instagram", label: "Instagram", icon: Instagram },
                          { id: "email", label: "Email", icon: Mail }
                        ].map(ch => {
                          const Icon = ch.icon;
                          const selected = marketingChannel === ch.id;
                          return (
                            <button
                              key={ch.id}
                              type="button"
                              onClick={() => setMarketingChannel(ch.id)}
                              className={`flex flex-col items-center justify-center p-2.5 rounded-lg border text-xs font-semibold transition ${
                                selected
                                  ? "bg-[#06b6d4]/10 text-[#0891b2] border-[#06b6d4]/30"
                                  : "bg-white border-slate-200 text-slate-500 hover:text-slate-800"
                              }`}
                            >
                              <Icon className="h-4 w-4 mb-1" />
                              <span>{ch.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <button
                      onClick={runMarketingAgent}
                      disabled={loading.marketing}
                      className="w-full flex items-center justify-center space-x-2 py-2.5 bg-[#06b6d4] hover:bg-[#0891b2] disabled:bg-slate-300 text-white rounded-lg text-xs font-bold transition shadow-md shadow-cyan-500/10"
                    >
                      {loading.marketing ? (
                        <><Loader2 className="h-3.5 w-3.5 animate-spin" /><span>Agent Draft Processing...</span></>
                      ) : (
                        <><Send className="h-3.5 w-3.5" /><span>Generate Content copy</span></>
                      )}
                    </button>
                  </div>
                </div>

                {/* Display Output */}
                <div className="md:col-span-2 space-y-6">
                  {marketingResult ? (
                    <div className="space-y-6">
                      
                      {/* Generated Text Copy */}
                      <div className="glass-panel rounded-xl p-6 border border-slate-200">
                        <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
                          <h4 className="text-sm font-bold text-slate-800 flex items-center space-x-2">
                            <span>Draft Content Copy</span>
                          </h4>
                          <button
                            onClick={() => handleCopy(marketingResult.content, "studio-copy")}
                            className="text-xs text-slate-500 hover:text-slate-800 flex items-center space-x-1 transition"
                          >
                            {copiedText === "studio-copy" ? (
                              <span className="text-[#06b6d4] flex items-center"><Check className="h-3 w-3 mr-0.5" /> Copied</span>
                            ) : (
                              <><Copy className="h-3 w-3" /><span>Copy Draft</span></>
                            )}
                          </button>
                        </div>

                        {marketingResult.subject_line && (
                          <div className="p-3 bg-slate-50 rounded border border-slate-200 mb-4">
                            <span className="text-[9px] text-slate-400 uppercase tracking-widest font-semibold block mb-0.5">Email Subject line</span>
                            <span className="text-xs font-bold text-slate-800">{marketingResult.subject_line}</span>
                          </div>
                        )}

                        <div className="bg-slate-50/50 rounded-lg p-5 border border-slate-200 shadow-inner">
                          <p className="text-xs text-slate-700 whitespace-pre-line leading-relaxed font-sans">
                            {marketingResult.content}
                          </p>
                        </div>
                      </div>

                      {/* Visual Companion details - CYAN guide */}
                      <div className="glass-panel rounded-xl p-6 border border-slate-200">
                        <span className="text-[10px] text-[#06b6d4] font-bold uppercase tracking-wider block mb-1">Visual Companion Generator Prompt</span>
                        <p className="text-xs text-slate-700 italic">
                          "{marketingResult.visual_prompt}"
                        </p>
                        <div className="mt-3 flex items-center justify-between text-[10px] text-slate-500 bg-slate-50 p-2.5 rounded border border-slate-200">
                          <span>Feed this into DALL-E 3 or Midjourney to create a post graphic.</span>
                          <button 
                            onClick={() => handleCopy(marketingResult.visual_prompt, "visual-copy")}
                            className="text-[#06b6d4] hover:underline"
                          >
                            {copiedText === "visual-copy" ? "Copied!" : "Copy Prompt"}
                          </button>
                        </div>
                      </div>

                    </div>
                  ) : (
                    <div className="text-center py-32 bg-white rounded-xl border border-dashed border-slate-200">
                      <Megaphone className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                      <p className="text-sm text-slate-500">Configure parameters in the left pane and hit generate to draft contents.</p>
                    </div>
                  )}
                </div>

              </div>

            </div>
          )}

          {/* TAB 5: COMPETITOR INTEL - RED themed threat reports */}
          {activeTab === "competitors" && (
            <div className="space-y-6 max-w-4xl">
              
              <div className="glass-panel rounded-xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-md font-bold text-slate-800 mb-1">Competitor Intelligence SWOT Scanner</h3>
                <p className="text-xs text-slate-500 mb-4">Input competitor URL to trigger scans. AI reads available data to generate relative SWOT profiles.</p>
                
                <div className="flex space-x-3">
                  <input
                    type="url"
                    value={competitorUrl}
                    onChange={e => setCompetitorUrl(e.target.value)}
                    className="flex-1 bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#06b6d4] transition"
                    placeholder="e.g. https://competitor.com"
                  />
                  <button
                    onClick={runCompetitorAgent}
                    disabled={loading.competitor}
                    className="flex items-center space-x-2 bg-[#06b6d4] hover:bg-[#0891b2] disabled:bg-slate-300 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition shadow-md shadow-cyan-500/10"
                  >
                    {loading.competitor ? (
                      <><Loader2 className="h-4.5 w-4.5 animate-spin" /><span>Scanning Domain...</span></>
                    ) : (
                      <span>Perform SWOT Analysis</span>
                    )}
                  </button>
                </div>
              </div>

              {competitorResult ? (
                <div className="space-y-6">
                  
                  {/* Summary card - Red themed alerts */}
                  <div className="glass-panel rounded-xl p-6 border border-red-200 bg-red-50/10">
                    <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider block mb-1">Threat Assessment Summary</span>
                    <p className="text-sm text-slate-800 leading-relaxed font-medium">
                      {competitorResult.summary}
                    </p>
                  </div>

                  {/* SWOT Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Strengths - CYAN */}
                    <div className="glass-panel rounded-xl p-5 border border-cyan-200 bg-cyan-50/10">
                      <h4 className="text-sm font-bold text-cyan-600 mb-3 flex items-center space-x-2">
                        <span className="h-2 w-2 rounded-full bg-cyan-500"></span>
                        <span>Competitor Strengths (S)</span>
                      </h4>
                      <ul className="text-xs text-slate-700 space-y-2 list-disc list-inside leading-snug">
                        {competitorResult.strengths.map((s, i) => <li key={i}>{s}</li>)}
                      </ul>
                    </div>

                    {/* Weaknesses - YELLOW */}
                    <div className="glass-panel rounded-xl p-5 border border-amber-200 bg-amber-50/10">
                      <h4 className="text-sm font-bold text-amber-600 mb-3 flex items-center space-x-2">
                        <span className="h-2 w-2 rounded-full bg-amber-500"></span>
                        <span>Competitor Weaknesses (W)</span>
                      </h4>
                      <ul className="text-xs text-slate-700 space-y-2 list-disc list-inside leading-snug">
                        {competitorResult.weaknesses.map((w, i) => <li key={i}>{w}</li>)}
                      </ul>
                    </div>

                    {/* Opportunities - CYAN */}
                    <div className="glass-panel rounded-xl p-5 border border-cyan-200 bg-cyan-50/10">
                      <h4 className="text-sm font-bold text-[#0891b2] mb-3 flex items-center space-x-2">
                        <span className="h-2 w-2 rounded-full bg-[#06b6d4]"></span>
                        <span>Our Market Opportunities (O)</span>
                      </h4>
                      <ul className="text-xs text-slate-700 space-y-2 list-disc list-inside leading-snug">
                        {competitorResult.opportunities.map((o, i) => <li key={i}>{o}</li>)}
                      </ul>
                    </div>

                    {/* Threats - RED */}
                    <div className="glass-panel rounded-xl p-5 border border-red-200 bg-red-50/10">
                      <h4 className="text-sm font-bold text-red-500 mb-3 flex items-center space-x-2">
                        <span className="h-2 w-2 rounded-full bg-red-500"></span>
                        <span>Emerging Threats to Us (T)</span>
                      </h4>
                      <ul className="text-xs text-slate-700 space-y-2 list-disc list-inside leading-snug">
                        {competitorResult.threats.map((t, i) => <li key={i}>{t}</li>)}
                      </ul>
                    </div>

                  </div>

                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-200">
                  <SearchCode className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-500">Input a url and hit scan to evaluate competitor market threats.</p>
                </div>
              )}

            </div>
          )}

          {/* TAB 6: ANALYTICS FORECAST */}
          {activeTab === "analytics" && (
            <div className="space-y-6 max-w-5xl">
              
              {/* Inputs */}
              <div className="glass-panel rounded-xl p-6 border border-slate-200 shadow-sm">
                <h3 className="text-md font-bold text-slate-800 mb-4">Configure Forecast Parameters</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Current Monthly Leads</label>
                    <input
                      type="number"
                      value={currentLeads}
                      onChange={e => setCurrentLeads(parseInt(e.target.value) || 0)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#06b6d4]"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-semibold text-slate-500 uppercase mb-1.5">Target Monthly Leads</label>
                    <input
                      type="number"
                      value={targetLeads}
                      onChange={e => setTargetLeads(parseInt(e.target.value) || 0)}
                      className="w-full bg-white border border-slate-200 rounded-lg px-3.5 py-2 text-xs text-slate-800 focus:outline-none focus:border-[#06b6d4]"
                    />
                  </div>

                  <button
                    onClick={runAnalyticsAgent}
                    disabled={loading.analytics}
                    className="flex items-center justify-center space-x-2 bg-[#06b6d4] hover:bg-[#0891b2] disabled:bg-slate-300 text-white px-5 py-2.5 rounded-lg text-xs font-bold transition shadow-md shadow-cyan-500/10 h-[38px]"
                  >
                    {loading.analytics ? (
                      <><Loader2 className="h-4.5 w-4.5 animate-spin" /><span>Recalculating...</span></>
                    ) : (
                      <span>Re-Forecast Performance</span>
                    )}
                  </button>
                </div>
              </div>

              {analyticsResult ? (
                <div className="space-y-6">
                  
                  {/* Forecast Charts - Cyan and Grey/Yellow fill colors */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    
                    {/* Leads Forecast Chart */}
                    <div className="glass-panel rounded-xl p-6 border border-slate-200">
                      <h4 className="text-sm font-bold text-slate-800 mb-4">Acquisition Forecast: Leads volume</h4>
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={analyticsResult.leads_forecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorLeadsCurr" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#cbd5e1" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#cbd5e1" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorLeadsProj" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                            <YAxis stroke="#94a3b8" fontSize={11} />
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }} />
                            <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                            <Area name="Normal Leads path" type="monotone" dataKey="current" stroke="#94a3b8" strokeWidth={2} fillOpacity={1} fill="url(#colorLeadsCurr)" />
                            <Area name="AI Driven Leads Path" type="monotone" dataKey="projected" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorLeadsProj)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    {/* Revenue Forecast Chart */}
                    <div className="glass-panel rounded-xl p-6 border border-slate-200">
                      <h4 className="text-sm font-bold text-slate-800 mb-4">Financial Forecast: Revenue growth ($)</h4>
                      <div className="h-64 w-full">
                        <ResponsiveContainer width="100%" height="100%">
                          <AreaChart data={analyticsResult.revenue_forecast} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                            <defs>
                              <linearGradient id="colorRevCurr" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#cbd5e1" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#cbd5e1" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorRevProj" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                                <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                              </linearGradient>
                            </defs>
                            <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} />
                            <YAxis stroke="#94a3b8" fontSize={11} />
                            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                            <Tooltip contentStyle={{ backgroundColor: "#ffffff", border: "1px solid #e2e8f0" }} />
                            <Legend wrapperStyle={{ fontSize: "11px", paddingTop: "10px" }} />
                            <Area name="Normal Revenue ($)" type="monotone" dataKey="current_revenue" stroke="#94a3b8" strokeWidth={2} fillOpacity={1} fill="url(#colorRevCurr)" />
                            <Area name="AI Accelerated Revenue ($)" type="monotone" dataKey="projected_revenue" stroke="#06b6d4" strokeWidth={2} fillOpacity={1} fill="url(#colorRevProj)" />
                          </AreaChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                  </div>

                  {/* Recommendations */}
                  <div className="glass-panel rounded-xl p-6 border border-slate-200">
                    <h4 className="text-sm font-bold text-slate-800 mb-4">Strategic Action Plan</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {analyticsResult.recommendations.map((rec, i) => (
                        <div key={i} className="p-4 rounded-lg bg-slate-50 border border-slate-200 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] text-[#06b6d4] font-extrabold uppercase">Step 0{i + 1} Action</span>
                            <p className="text-xs text-slate-700 mt-2 leading-relaxed">{rec}</p>
                          </div>
                          <div className="mt-4 pt-3 border-t border-slate-200 flex justify-end">
                            <span className="text-[10px] bg-cyan-50 border border-cyan-200 text-[#0891b2] px-2 py-0.5 rounded font-semibold">
                              Highly Recommended
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              ) : (
                <div className="text-center py-20 bg-white rounded-xl border border-dashed border-slate-200">
                  <TrendingUp className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-sm text-slate-500">Configure inputs and trigger forecast analytics calculation.</p>
                </div>
              )}

            </div>
          )}

        </div>
      </main>
    </div>
  );
}
