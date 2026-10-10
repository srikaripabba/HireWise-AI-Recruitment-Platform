
from django.contrib.auth.models import User
from django.db import models


class UserProfile(models.Model):
    ROLE_CHOICES = (
        ('recruiter', 'Recruiter'),
        ('candidate', 'Candidate'),
    )

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE,
    )
    role = models.CharField(
        max_length=20,
        choices=ROLE_CHOICES,
    )
    recruiter = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name='managed_candidates',
        null=True,
        blank=True,
    )

    def __str__(self):
        return f"{self.user.username} - {self.role}"
