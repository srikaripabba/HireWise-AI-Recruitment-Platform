from django.urls import path

from .views import (
    ScreeningCreateView,
    ScreeningListView,
    ScreeningDetailView
)


urlpatterns = [
    path(
        '',
        ScreeningCreateView.as_view(),
        name='screening-create'
    ),

    path(
        'rankings/',
        ScreeningListView.as_view(),
        name='screening-rankings'
    ),

    path(
        'rankings/<int:pk>/',
        ScreeningDetailView.as_view(),
        name='screening-detail'
    ),
]