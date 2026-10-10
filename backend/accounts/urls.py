from django.urls import path

from .views import (
    RegisterView,
    ProfileView,
    CandidateListView,
    CandidateCreateView
)


urlpatterns = [
    path(
        'register/',
        RegisterView.as_view(),
        name='register'
    ),

    path(
        'profile/',
        ProfileView.as_view(),
        name='profile'
    ),

    path(
        'candidates/',
        CandidateListView.as_view(),
        name='candidate-list'
    ),

    path(
        'candidates/create/',
        CandidateCreateView.as_view(),
        name='candidate-create'
    ),
]