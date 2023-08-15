from django.core.mail import send_mail
from  django.conf import settings
from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags

email= settings.EMAIL_HOST_USER



def forgot_password_email(recipient_list, reset_link):
    subject = 'Password Reset Request'
    html_message = render_to_string('emails/forgot_password_email.html', {'reset_link': reset_link})
    plain_message = strip_tags(html_message)
    from_email = email  # Replace with your email address
    send_mail(subject, plain_message, from_email, recipient_list, html_message=html_message)


def passwordresetsucessfulemail(recipient_list):    
    subject = 'Password Reset Successful'
    message = "Your password has been successfully reset. If you did not make this request, please contact our support team immediately."
    from_email = email
    send_mail(subject, message, from_email, recipient_list,fail_silently=False)


def registrationemail(recipient_list, otp):
    subject = 'Account Activation  '
    message = f"You have successfully signed up. To complete your profile, use the code below:\n\n{otp}\n\n."
    from_email = email
    # Send HTML email
    html_message = render_to_string('emails/otp.html', {'otp': otp})
    send_mail(subject, strip_tags(html_message), from_email, recipient_list, html_message=html_message, fail_silently=False)

def completeprofileemail(recipient_list):
    subject = 'Account Active complete your profile'
    message = f"your account is active. Please complete your profile "
    from_email = email
    send_mail(subject, message, from_email, recipient_list,fail_silently=False)

