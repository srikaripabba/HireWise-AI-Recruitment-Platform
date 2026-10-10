from rest_framework import generics

from .models import Job
from .serializers import JobSerializer
from accounts.permissions import IsRecruiter


class JobListCreateView(generics.ListCreateAPIView):
    serializer_class = JobSerializer
    permission_classes = [IsRecruiter]

    def get_queryset(self):
        return Job.objects.filter(
            recruiter=self.request.user
        )

    def perform_create(self, serializer):
        serializer.save(
            recruiter=self.request.user
        )