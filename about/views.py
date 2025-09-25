from django.http import JsonResponse
from django.shortcuts import render
from .forms import ContactForm
import logging

logger = logging.getLogger(__name__)

def home_view(request):
    return render(request, "about/index.html")

def     contact_view(request):
    if request.method == "POST":
        form = ContactForm(request.POST)
        if form.is_valid():
            obj = form.save()
            logger.info("Contact saved: id=%s name=%s email=%s", obj.id, obj.name, obj.email)

            # AJAX
            if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                return JsonResponse({'ok': True})

            # Non-AJAX
            return render(request, "about/contact_success.html")
        else:
            logger.warning("Contact form errors: %s", dict(form.errors))
            if request.headers.get('x-requested-with') == 'XMLHttpRequest':
                return JsonResponse({'ok': False, 'errors': form.errors}, status=400)

    # GET یا POST نامعتبر
    form = ContactForm()
    return render(request, "about/index.html", {"form": form})
