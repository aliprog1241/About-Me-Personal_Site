from django.http import JsonResponse
from django.shortcuts import render, get_object_or_404
from .forms import ContactForm
from .models import Post, Portfolio
from django.core.mail import send_mail
from django.conf import settings
import logging

logger = logging.getLogger(__name__)

def home_view(request):
    return render(request, "about/index.html")

def contact_view(request):
    if request.method == "POST":
        form = ContactForm(request.POST)
        if form.is_valid():
            obj = form.save()
            logger.info("Contact saved: id=%s name=%s email=%s", obj.id, obj.name, obj.email)

            # ✉️ ارسال ایمیل به ادمین
            subject = f"New Contact Message: {obj.subject or 'No Subject'}"
            message = f"""
You have received a new contact message.

From: {obj.name} <{obj.email}>
Subject: {obj.subject or 'No Subject'}

Message:
{obj.message}
"""
            try:
                send_mail(
                    subject,
                    message,
                    settings.DEFAULT_FROM_EMAIL,
                    ["miri03369@gmail.com"],  # ایمیل مقصد (تو)
                    fail_silently=False,
                )
                logger.info("Email sent successfully to admin.")
            except Exception as e:
                logger.error("Failed to send email: %s", e)

            # AJAX response
            if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                return JsonResponse({'ok': True})

            # Non-AJAX response
            return render(request, "about/contact_success.html")
        else:
            logger.warning("Contact form errors: %s", dict(form.errors))
            if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                return JsonResponse({'ok': False, 'errors': form.errors}, status=400)

    # GET یا POST نامعتبر
    form = ContactForm()
    return render(request, "about/index.html", {"form": form})


def blog_list(request):
    posts = Post.objects.all().order_by('-created_at')
    return render(request, "about/blog_list.html", {"posts": posts})

def blog_detail(request, slug):
    post = get_object_or_404(Post, slug=slug)
    return render(request, "about/blog_detail.html", {"post": post})


def portfolio_list(request):
    items = Portfolio.objects.all().order_by("-created_at")
    return render(request, "about/portfolio_list.html", {"items": items})
