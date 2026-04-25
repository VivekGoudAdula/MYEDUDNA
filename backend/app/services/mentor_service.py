from fastapi import HTTPException, status

from app.db.mongodb import get_database


def normalize_terms(values: list[str]) -> set[str]:
    terms: set[str] = set()
    for value in values:
        if not isinstance(value, str):
            continue
        chunks = value.lower().replace("/", " ").replace("-", " ").split()
        terms.update(chunk.strip() for chunk in chunks if chunk.strip())
    return terms


def overlap_score(user_terms: set[str], mentor_terms: set[str]) -> float:
    if not user_terms:
        return 0.0
    overlap = len(user_terms.intersection(mentor_terms))
    return round((overlap / len(user_terms)) * 100, 2)


async def get_matched_mentors(user_email: str) -> list[dict]:
    db = get_database()
    user = await db.users.find_one({"email": user_email})
    if not user:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="User not found.",
        )

    # Get DNA Profile
    dna_profile = user.get("dna_profile", {}).get("profile", {})
    learning_style = dna_profile.get("learningStyle", "").lower()
    strengths = [s.lower() for s in dna_profile.get("strengths", [])]

    # Fetch all mentors
    mentors = await db.mentors.find().to_list(100)
    
    matched = []
    for mentor in mentors:
        score = 0
        mentor_tags = [t.lower() for t in mentor.get("tags", [])]
        
        # Match learning style (High weight)
        if learning_style in mentor_tags:
            score += 35

        # Match strengths (Moderate weight)
        for s in strengths:
            if s in mentor_tags:
                score += 20
        
        # Domain relevance (Bonus)
        domain = mentor.get("domain", "").lower()
        if "ai" in domain or "ml" in domain:
            score += 15
        elif "web" in domain or "frontend" in domain:
            score += 10
            
        reason = []
        if learning_style in mentor_tags:
            reason.append("Matches your learning style")
        if "ai" in domain or "ml" in domain:
            reason.append("Aligned with your career interest")
        elif score > 30:
            reason.append("Strong domain match")
            
        if not reason:
            reason.append("Broad match")
            
        # Include all mentor fields for the details view
        mentor_data = {k: v for k, v in mentor.items() if k != "_id"}
        mentor_data["match_score"] = min(score, 100)
        mentor_data["match_reason"] = " + ".join(reason)
        matched.append(mentor_data)

    # Sort by score
    matched = sorted(matched, key=lambda x: x["match_score"], reverse=True)

    # Handle Empty Case / Fallback: If no strong matches, return top mentors anyway
    if not matched or (len(matched) > 0 and matched[0]["match_score"] < 20):
        # Return first 5 mentors as fallback if score is too low
        fallback = await db.mentors.find({}, {"_id": 0}).limit(5).to_list(5)
        # Give fallback mentors a default baseline score if they don't have one
        return [{**m, "match_score": 15, "match_reason": "General Mentor"} for m in fallback]

    return matched


async def send_mentorship_request(payload: dict, user_email: str) -> dict:
    db = get_database()
    from app.services.mail_service import send_email
    import uuid
    
    student_name = payload.get("student_name", "A Student")
    student_email = payload.get("student_email", user_email)
    mentor_name = payload.get("mentor_name")
    mentor_email = payload.get("mentor_email")
    message = payload.get("message", "")

    # Store request in DB
    request_data = {
        "student_name": student_name,
        "student_email": student_email,
        "mentor_name": mentor_name,
        "mentor_email": mentor_email,
        "message": message,
        "status": "pending",
        "created_at": "2026-04-25T13:31:19Z"
    }
    req_result = await db.mentorship_requests.insert_one(request_data)
    request_id = str(req_result.inserted_id)

    # Create a Session Record automatically
    session_data = {
        "student_email": student_email,
        "student_name": student_name,
        "mentor_email": mentor_email,
        "mentor_name": mentor_name,
        "status": "pending",
        "meeting_link": None,
        "preferred_slot": payload.get("preferred_slot", "Not specified"),
        "created_at": "2026-04-25T13:31:19Z"
    }
    session_result = await db.mentorship_sessions.insert_one(session_data)
    session_id = str(session_result.inserted_id)
    
    # Send Email Notification to Mentor
    if mentor_email:
        # Link to accept the session (Simulated endpoint)
        accept_link = f"http://localhost:8000/mentors/sessions/accept/{session_id}"
        
        subject = f"New Mentorship Request from {student_name} 🧬"
        
        # Plain text fallback
        body = f"Hello {mentor_name},\n\nYou have a new mentorship request from {student_name} ({student_email}).\n\nPreferred Slot: {payload.get('preferred_slot', 'Not specified')}\n\nMessage: {message}\n\nAccept link: {accept_link}"
        
        # Premium HTML Template
        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap');
                body {{ font-family: 'Inter', sans-serif; background-color: #f3f4f6; margin: 0; padding: 40px 0; }}
                .container {{ max-width: 600px; margin: 0 auto; background: white; border-radius: 24px; overflow: hidden; box-shadow: 0 20px 50px rgba(0,0,0,0.1); }}
                .header {{ background: linear-gradient(135deg, #8B5CF6 0%, #EC4899 100%); padding: 40px; text-align: center; color: white; }}
                .content {{ padding: 40px; color: #1f2937; }}
                .student-card {{ background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 16px; padding: 24px; margin: 20px 0; }}
                .label {{ font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #6b7280; font-weight: 700; margin-bottom: 4px; }}
                .value {{ font-size: 16px; font-weight: 700; color: #111827; }}
                .message-box {{ border-left: 4px solid #8B5CF6; padding-left: 20px; font-style: italic; color: #4b5563; margin-top: 20px; }}
                .footer {{ padding: 20px 40px; background: #f9fafb; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; }}
                .btn {{ display: inline-block; padding: 14px 28px; background: #8B5CF6; color: white; text-decoration: none; border-radius: 12px; font-weight: 700; margin-top: 20px; box-shadow: 0 10px 20px rgba(139, 92, 246, 0.2); }}
                .btn-accept {{ background: #059669; box-shadow: 0 10px 20px rgba(5, 150, 105, 0.2); }}
            </style>
        </head>
        <body>
            <div class="container">
                <div class="header">
                    <h1 style="margin:0; font-size: 24px;">New Mentorship Request</h1>
                    <p style="margin:10px 0 0; opacity: 0.8;">EduDNA Neural Matching System</p>
                </div>
                <div class="content">
                    <p>Hello <strong>{mentor_name}</strong>,</p>
                    <p>A student has matched with your profile and is requesting a neural connection session.</p>
                    
                    <div class="student-card">
                        <div style="margin-bottom: 15px;">
                            <div class="label">Student Name</div>
                            <div class="value">{student_name}</div>
                        </div>
                        <div style="margin-bottom: 15px;">
                            <div class="label">Student Email</div>
                            <div class="value">{student_email}</div>
                        </div>
                        <div>
                            <div class="label">Requested Slot</div>
                            <div class="value" style="color: #8B5CF6;">{payload.get('preferred_slot', 'Not specified')}</div>
                        </div>
                    </div>

                    <div class="label">Message from Student</div>
                    <div class="message-box">
                        "{message}"
                    </div>

                    <div style="text-align: center; margin-top: 30px;">
                        <a href="{accept_link}" class="btn btn-accept">Accept & Confirm Slot</a>
                        <p style="font-size: 11px; color: #9ca3af; margin-top: 10px;">Accepting will automatically notify the student and share the meeting link.</p>
                    </div>
                </div>
                <div class="footer">
                    &copy; 2026 EduDNA Hope Works Foundation. All rights reserved. <br>
                    You are receiving this because you are a registered mentor on our neural network.
                </div>
            </div>
        </body>
        </html>
        """
        send_email(mentor_email, subject, body, html_body)
    
    return {"message": "Request sent successfully", "status": "success", "session_id": session_id}


async def get_user_sessions(user_email: str) -> list[dict]:
    db = get_database()
    sessions = await db.mentorship_sessions.find({"student_email": user_email}).sort("created_at", -1).to_list(100)
    return [{**s, "_id": str(s["_id"])} for s in sessions]


async def accept_mentorship_session(session_id: str) -> dict:
    db = get_database()
    from bson import ObjectId
    from app.services.mail_service import send_email
    
    # Use static link provided by user
    meeting_link = "https://meet.google.com/gqo-ohqy-hgo"
    
    result = await db.mentorship_sessions.find_one_and_update(
        {"_id": ObjectId(session_id)},
        {"$set": {"status": "accepted", "meeting_link": meeting_link}},
        return_document=True
    )
    
    if not result:
        return {"status": "error", "message": "Session not found"}
    
    # Notify Student
    student_email = result.get("student_email")
    student_name = result.get("student_name")
    mentor_name = result.get("mentor_name")
    preferred_slot = result.get("preferred_slot", "Scheduled Time")
    
    if student_email:
        subject = f"Mentorship Confirmed with {mentor_name}! 🚀"
        body = f"Great news {student_name}!\n\n{mentor_name} has accepted your request for {preferred_slot}. Your meeting link is: {meeting_link}"
        
        html_body = f"""
        <!DOCTYPE html>
        <html>
        <head>
            <style>
                body {{ font-family: sans-serif; background-color: #f3f4f6; padding: 20px; }}
                .card {{ background: white; padding: 40px; border-radius: 20px; text-align: center; max-width: 500px; margin: 0 auto; box-shadow: 0 10px 30px rgba(0,0,0,0.05); }}
                .btn {{ display: inline-block; padding: 15px 30px; background: #8B5CF6; color: white; text-decoration: none; border-radius: 12px; font-weight: bold; margin-top: 20px; }}
                .slot {{ color: #8B5CF6; font-weight: bold; font-size: 18px; }}
            </style>
        </head>
        <body>
            <div class="card">
                <h1 style="color: #8B5CF6;">Session Confirmed!</h1>
                <p>Hello {student_name}, your request to connect with <strong>{mentor_name}</strong> has been accepted.</p>
                
                <div style="margin: 20px 0;">
                    <p style="margin: 0; font-size: 11px; color: #9ca3af; text-transform: uppercase;">Confirmed Time</p>
                    <p class="slot">{preferred_slot}</p>
                </div>

                <div style="background: #f9fafb; padding: 20px; border-radius: 12px; margin: 20px 0;">
                    <p style="margin: 0; font-size: 12px; color: #6b7280;">MEETING LINK</p>
                    <p style="margin: 5px 0 0; font-size: 16px; font-weight: bold; color: #111827; word-break: break-all;">{meeting_link}</p>
                </div>
                <a href="{meeting_link}" class="btn">Join Session Now</a>
            </div>
        </body>
        </html>
        """
        send_email(student_email, subject, body, html_body)
    
    return {"status": "accepted", "meeting_link": meeting_link}
