
from django.db.models import Q
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .serializers import (
    RegisterSerializer,
    CandidateCreateSerializer,
)
from .models import UserProfile
from .permissions import IsRecruiter


class RegisterView(APIView):
    def post(self, request):
        serializer = RegisterSerializer(data=request.data)

        if serializer.is_valid():
            serializer.save()
            return Response(
                {'message': 'User registered successfully.'},
                status=status.HTTP_201_CREATED,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        profile = UserProfile.objects.get(user=request.user)

        return Response({
            'username': request.user.username,
            'email': request.user.email,
            'role': profile.role,
        })


class CandidateListView(APIView):
    permission_classes = [IsRecruiter]

    def get(self, request):
        candidates = UserProfile.objects.filter(
            Q(recruiter=request.user) | Q(recruiter__isnull=True),
            role='candidate',
        ).select_related('user')

        data = [
            {
                'id': profile.user.id,
                'username': profile.user.username,
                'email': profile.user.email,
            }
            for profile in candidates
        ]

        return Response(data)


class CandidateCreateView(APIView):
    permission_classes = [IsRecruiter]

    def post(self, request):
        serializer = CandidateCreateSerializer(data=request.data)

        if serializer.is_valid():
            user = serializer.save(recruiter=request.user)

            return Response(
                {
                    'id': user.id,
                    'username': user.username,
                    'email': user.email,
                    'role': 'candidate',
                },
                status=status.HTTP_201_CREATED,
            )

        return Response(
            serializer.errors,
            status=status.HTTP_400_BAD_REQUEST,
        )
