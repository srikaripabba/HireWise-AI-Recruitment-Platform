from rest_framework.permissions import BasePermission

from .models import UserProfile


class IsRecruiter(BasePermission):
    """
    Allows access only to authenticated users
    whose profile role is recruiter.
    """

    def has_permission(self, request, view):

        if not request.user.is_authenticated:
            return False

        try:
            profile = UserProfile.objects.get(
                user=request.user
            )
        except UserProfile.DoesNotExist:
            return False

        return profile.role == 'recruiter'