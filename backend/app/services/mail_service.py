import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from app.utils.config import settings

def send_email(to_email: str, subject: str, body: str, html_body: str = None) -> bool:
    if not settings.email_user or not settings.email_pass:
        print("Email configuration missing. skipping email send.")
        return False

    msg = MIMEMultipart("alternative")
    msg["From"] = f"EduDNA Neural Network <{settings.email_user}>"
    msg["To"] = to_email
    msg["Subject"] = subject

    # Attach plain text version
    msg.attach(MIMEText(body, "plain"))
    
    # Attach HTML version if provided
    if html_body:
        msg.attach(MIMEText(html_body, "html"))

    try:
        # Using Gmail SMTP settings as default
        server = smtplib.SMTP("smtp.gmail.com", 587)
        server.starttls()
        server.login(settings.email_user, settings.email_pass)
        server.send_message(msg)
        server.quit()
        return True
    except Exception as e:
        print(f"Email error: {e}")
        return False
