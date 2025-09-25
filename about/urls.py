from django.urls import path
from .views import home_view, contact_view, blog_list, blog_detail

urlpatterns = [
    path("", home_view, name="home"),
    path("contact/", contact_view, name="contact"),
    path("blog/", blog_list, name="blog_list"),
    path("blog/<slug:slug>/", blog_detail, name="blog_detail"),
]
