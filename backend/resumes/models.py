from django.contrib.auth.models import User
from django.db import models

from jobs.models import Job


class Resume(models.Model):
    candidate = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='resumes'
    )
    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE,
        related_name='resumes'
    )
    file = models.FileField(upload_to='resumes/')
    extracted_text = models.TextField(blank=True)
    uploaded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.candidate.username} - {self.job.title}"