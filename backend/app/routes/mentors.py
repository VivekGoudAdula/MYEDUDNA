from fastapi import APIRouter, Depends

from app.services.mentor_service import get_matched_mentors
from app.utils.security import get_current_user_email

router = APIRouter(prefix="/mentors", tags=["mentors"])


@router.get("/matched")
async def matched_mentors(
    current_user_email: str = Depends(get_current_user_email),
) -> list[dict]:
    return await get_matched_mentors(current_user_email)


@router.get("/sessions")
async def user_sessions(
    current_user_email: str = Depends(get_current_user_email),
):
    from app.services.mentor_service import get_user_sessions
    return await get_user_sessions(current_user_email)


@router.get("/sessions/accept/{session_id}")
async def accept_session(session_id: str):
    from app.services.mentor_service import accept_mentorship_session
    from fastapi.responses import HTMLResponse
    
    result = await accept_mentorship_session(session_id)
    
    if result.get("status") == "error":
        return HTMLResponse(content="<h1>Error accepting session</h1>", status_code=400)
    
    return HTMLResponse(content=f"""
    <html>
        <head>
            <style>
                body {{ font-family: sans-serif; display: flex; align-items: center; justify-content: center; height: 100vh; background: #f3f4f6; }}
                .card {{ background: white; padding: 50px; border-radius: 30px; text-align: center; box-shadow: 0 20px 40px rgba(0,0,0,0.1); }}
                .btn {{ display: inline-block; padding: 15px 30px; background: #8B5CF6; color: white; text-decoration: none; border-radius: 12px; margin-top: 20px; }}
            </style>
        </head>
        <body>
            <div class="card">
                <h1 style="color: #059669;">Session Accepted!</h1>
                <p>You have successfully accepted the mentorship request.</p>
                <p>The student has been notified with the meeting link:</p>
                <code style="background: #eee; padding: 10px; border-radius: 5px;">{result['meeting_link']}</code>
                <br><br>
                <a href="{result['meeting_link']}" class="btn">Open Google Meet</a>
            </div>
        </body>
    </html>
    """)


@router.post("/request")
async def request_mentorship(
    payload: dict,
    current_user_email: str = Depends(get_current_user_email),
):
    from app.services.mentor_service import send_mentorship_request
    return await send_mentorship_request(payload, current_user_email)
