
from django.contrib.auth.models import User
from django.db import transaction
from rest_framework import serializers

from .models import UserProfile


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        style={'input_type': 'password'},
    )
    email = serializers.EmailField(required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    def validate_email(self, value):
        value = value.strip().lower()

        if User.objects.filter(email__iexact=value).exists():
            raise serializers.ValidationError(
                'An account with this email already exists.'
            )

        return value

    @transaction.atomic
    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        UserProfile.objects.create(
            user=user,
            role='recruiter',
        )
        return user


class CandidateCreateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(
        write_only=True,
        min_length=8,
        style={'input_type': 'password'},
    )

    class Meta:
        model = User
        fields = ['username', 'email', 'password']

    @transaction.atomic
    def create(self, validated_data):
        recruiter = self.context.get('recruiter')

        user = User.objects.create_user(**validated_data)
        UserProfile.objects.create(
            user=user,
            role='candidate',
            recruiter=recruiter,
        )
        return user

    def save(self, **kwargs):
        recruiter = kwargs.pop('recruiter', None)
        self.context['recruiter'] = recruiter
        return super().save(**kwargs)
