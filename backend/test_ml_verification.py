from app.services.ai_engine import ai_engine

def test_inference():
    print("\n--- Testing RIDS ML Engine Inference ---")
    
    spam_sample = "WINNER!! As a valued network customer you have been selected to receive a £900 prize reward! To claim call 09061701461. Claim code KL341."
    ham_sample = "Hey mate, hope you're doing well. Let me know when you arrive at the station."
    
    prob_spam, pred_spam, conf_spam = ai_engine.predict_ml_spam_probability(spam_sample)
    score_spam, verdict_spam = ai_engine.resolve_risk_fusion("sms", 0.0, 1, 15.0, text_content=spam_sample)
    
    print(f"\n[Spam Test Sample]: '{spam_sample[:60]}...'")
    print(f" -> ML Spam Probability: {prob_spam}%")
    print(f" -> ML Prediction:       {pred_spam} (Confidence: {conf_spam}%)")
    print(f" -> RIDS Threat Index:   {score_spam}% (Verdict: {verdict_spam})")
    assert pred_spam == "spam", "Expected prediction to be 'spam'"
    assert verdict_spam in ["Critical", "Warning"], "Expected verdict to be Critical or Warning"
    
    prob_ham, pred_ham, conf_ham = ai_engine.predict_ml_spam_probability(ham_sample)
    score_ham, verdict_ham = ai_engine.resolve_risk_fusion("sms", 0.0, 0, 0.0, text_content=ham_sample)
    
    print(f"\n[Ham Test Sample]:  '{ham_sample}'")
    print(f" -> ML Spam Probability: {prob_ham}%")
    print(f" -> ML Prediction:       {pred_ham} (Confidence: {conf_ham}%)")
    print(f" -> RIDS Threat Index:   {score_ham}% (Verdict: {verdict_ham})")
    assert pred_ham == "ham", "Expected prediction to be 'ham'"
    assert verdict_ham == "Safe", "Expected verdict to be Safe"

    print("\n[SUCCESS] All RIDS ML Engine Verification Tests Passed Successfully!\n")

if __name__ == "__main__":
    test_inference()
