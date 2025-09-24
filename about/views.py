from django.shortcuts import render, redirect
from .forms import ContactForm

def contact_view(request):
    if request.method == "POST":
        form = ContactForm(request.POST)
        if form.is_valid():
            form.save()
            return render(request, "contact_success.html")
    else:
        form = ContactForm()

    return render(request, "index.html", {"form": form})


def home_view(request):
    return render(request, "index.html")