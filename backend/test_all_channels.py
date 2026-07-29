import asyncio
from app.routers import email, sms, call, phone, document
from pydantic import BaseModel

async def run_checks():
    # 1. SMS
    res_sms = await sms.analyze_sms(sms.SmsScanRequest(sender="KOTAK", body="URGENT OTP link http://pay.in/otp"))
    print(f"SMS Check  -> Score: {res_sms.score}% | Verdict: {res_sms.verdict}")
    assert res_sms.verdict != "Safe"

    # 2. Call
    res_call = await call.analyze_call(call.CallScanRequest(caller="+1800-VoIP", transcript="Warrant arrest wire transfer"))
    print(f"Call Check -> Score: {res_call.score}% | Verdict: {res_call.verdict}")
    assert res_call.verdict != "Safe"

    # 3. Phone
    res_phone = await phone.verify_phone_number(phone.PhoneVerifyRequest(phone="+1800-VoIP"))
    print(f"Phone Check-> Trust: {res_phone.trustScore}% | Verdict: {res_phone.reputationVerdict}")
    assert res_phone.trustScore < 80

    # 4. Email
    res_email = await email.analyze_email(email.EmailScanRequest(sender="alert@stripe-fake.xyz", subject="Urgent", body="Verify http://fake.xyz"))
    print(f"Email Check-> Score: {res_email.score}% | Verdict: {res_email.verdict}")
    assert res_email.verdict != "Safe"

    print("\n[ALL 4 CHANNELS PASSED CLEANLY]\n")

if __name__ == "__main__":
    asyncio.run(run_checks())
