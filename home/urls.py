from django.contrib import admin
from django.urls import path, include
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('admin/', admin.site.urls),
    path('i18n/', include('django.conf.urls.i18n')),
    path("", include("about.urls")),
    path("i18n/", include("django.conf.urls.i18n")),
    path("accounts/", include("accounts.urls")),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
