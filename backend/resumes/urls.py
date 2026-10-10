from django.urls import path

from .views import (
    ResumeCreateView,
    CandidateResumeHistoryView
)


urlpatterns = [
    path(
        '',
        ResumeCreateView.as_view(),
        name='resume-create'
    ),

    path(
        'candidate/<int:candidate_id>/history/',
        CandidateResumeHistoryView.as_view(),
        name='candidate-resume-history'
    ),
]