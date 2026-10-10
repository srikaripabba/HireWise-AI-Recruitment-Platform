from django.contrib.auth.models import User
from django.db import models

from jobs.models import Job
from resumes.models import Resume


class ScreeningResult(models.Model):
    candidate = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    job = models.ForeignKey(
        Job,
        on_delete=models.CASCADE
    )

    resume = models.ForeignKey(
        Resume,
        on_delete=models.CASCADE
    )

    match_score = models.FloatField()

    missing_skills = models.TextField(
        blank=True
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    class Meta:
        constraints = [
            models.UniqueConstraint(
                fields=['candidate', 'job'],
                name='unique_candidate_job_screening'
            )
        ]

    def __str__(self):
        return (
            f"{self.candidate.username} - "
            f"{self.job.title} - "
            f"{self.match_score}%"
        )