from rest_framework import serializers

from .models import Job


class JobSerializer(serializers.ModelSerializer):

    class Meta:
        model = Job
        fields = [
            'id',
            'recruiter',
            'title',
            'description',
            'required_skills',
            'created_at',
        ]
        read_only_fields = ['id', 'recruiter', 'created_at']