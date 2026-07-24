import re
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np

# A small corpus of verified scam scenarios for TF-IDF cosine similarity screening
SCAM_CORPUS = [
    # Phishing / Billing impersonations
    "verify your billing information immediately to avoid account suspension stripe checkout verify credentials link",
    "stripe security alert detected login from new device authorize payment gateway details within 24 hours",
    "update your business subscription portal details now wire transfer routing card details verify support",
    # SMS / OTP Scams
    "kotak bank account has been blocked claim your cash back rewards here verify OTP activation link details",
    "urgent notification rewards points expire today validate credit card details pin number mobile money",
    "otp sharing request verify authentication token code reactivate profile check balance transfer money limit",
    # VoIP / Phone Call Threats
    "compliance officer audit irregular files legal penalty warrant arrest jail wire transfer escrow account immediately",
    "court order mandate legal compliance department penalty fee transfer sum security deposit verify identity",
    "bank officer warning suspicious transaction cash conversion transfer fund to reserve account details"
]

SCAM_CATEGORIES = [
    "Stripe Impersonation Phishing",
    "Device spoofing & Authentication harvest",
    "Billing Subscription Phishing",
    "Bank Account Block OTP Scam",
    "Credit Reward Expiry Phishing",
    "Mobile Verification Code Impersonation",
    "Compliance Impersonation extortion",
    "Legal Enforcement Scams",
    "Asset Conversion Warnings"
]

class UnifiedAIEngine:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(stop_words="english")
        # Fit vectorizer on initial scam corpus
        self.vector_matrix = self.vectorizer.fit_transform(SCAM_CORPUS)

    def calculate_semantic_threat(self, text: str) -> tuple[float, str]:
        """
        Uses Scikit-Learn to compute TF-IDF Cosine Similarity of the input
        against known fraud templates. Returns (max_similarity, closest_template_description)
        """
        try:
            if not text or len(text.strip()) < 5:
                return 0.0, "Unknown clean signature"
                
            input_vector = self.vectorizer.transform([text])
            similarities = cosine_similarity(input_vector, self.vector_matrix)[0]
            max_idx = np.argmax(similarities)
            max_sim = float(similarities[max_idx])
            
            # Scale to 0-100 percentage
            similarity_pct = round(max_sim * 100, 1)
            
            if similarity_pct > 15:
                return similarity_pct, SCAM_CATEGORIES[max_idx]
            return similarity_pct, "General Unstructured Layout"
        except Exception:
            # Fallback if scikit-learn fails
            return 0.0, "General Heuristics"

    def scan_for_urgency_keywords(self, text: str) -> list[str]:
        """
        Parses text for pressure signals, urgency warnings, or payment markers.
        """
        keywords = [
            "immediate", "urgently", "blocked", "suspension", "warrant", "arrest", 
            "penalty", "wire transfer", "verify your otp", "claim reward", 
            "compliance department", "escrow", "security deposit"
        ]
        found = []
        for word in keywords:
            if re.search(r'\b' + re.escape(word) + r'\b', text.lower()):
                found.append(word.upper())
        return found

    def resolve_risk_fusion(
        self, 
        channel_type: str, 
        semantic_score: float, 
        urgency_count: int, 
        metadata_risk_weight: float
    ) -> tuple[int, str]:
        """
        Risk Fusion Engine: combines semantic threat vectors, text urgency weights, and
        metadata variables (like SPF/DKIM flags or VoIP caller ID check results) into a consolidated index.
        """
        # Base score starts with semantic similarities
        base = semantic_score
        
        # Add urgency weights (+10 per key term, max +35)
        urgency_addition = min(urgency_count * 10, 35)
        
        # Combine base, urgency, and specific metadata weight
        raw_index = base + urgency_addition + metadata_risk_weight
        
        # Cap at 99% for safety margin, floor at 5%
        threat_score = int(max(min(raw_index, 99.0), 5.0))
        
        # Assign Verdict
        if threat_score >= 75:
            verdict = "Critical"
        elif threat_score >= 40:
            verdict = "Warning"
        else:
            verdict = "Safe"
            
        return threat_score, verdict

ai_engine = UnifiedAIEngine()
