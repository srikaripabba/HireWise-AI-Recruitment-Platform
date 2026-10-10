
import logging

from django.contrib.auth.models import User
from django.db.models import Q

from rest_framework import generics
from rest_framework.exceptions import NotFound, ValidationError
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response

from .models import Resume
from .serializers import ResumeSerializer
from .pdf_parser import extract_text_from_pdf

from jobs.models import Job
from accounts.permissions import IsRecruiter


logger = logging.getLogger(__name__)
MAX_RESUME_SIZE = 5 * 1024 * 1024


class ResumeCreateView(generics.CreateAPIView):
    serializer_class = ResumeSerializer
    permission_classes = [IsRecruiter]
    parser_classes = [MultiPartParser, FormParser]

    def perform_create(self, serializer):
        resume_file = self.request.FILES.get('file')
        candidate_id = self.request.data.get('candidate')
        job_id = self.request.data.get('job')

        if not resume_file:
            raise ValidationError({
                'file': 'Resume PDF is required.'
            })

        if not candidate_id:
            raise ValidationError({
                'candidate': 'Candidate is required.'
            })

        if not job_id:
            raise ValidationError({
                'job': 'Job is required.'
            })

        if not resume_file.name.lower().endswith('.pdf'):
            raise ValidationError({
                'file': 'Only PDF resumes are allowed.'
            })

        if resume_file.size > MAX_RESUME_SIZE:
            raise ValidationError({
                'file': 'Resume file must not exceed 5 MB.'
            })

        try:
            candidate = User.objects.get(
                Q(userprofile__recruiter=self.request.user)
                | Q(userprofile__recruiter__isnull=True),
                id=candidate_id,
                userprofile__role='candidate',
            )
        except User.DoesNotExist:
            raise ValidationError({
                'candidate': (
                    'Invalid candidate or candidate is assigned '
                    'to another recruiter.'
                )
            })

        try:
            job = Job.objects.get(
                id=job_id,
                recruiter=self.request.user,
            )
        except Job.DoesNotExist:
            raise ValidationError({
                'job': 'Invalid job or job does not belong to you.'
            })

        try:
            extracted_text = extract_text_from_pdf(resume_file)
        except Exception:
            logger.exception(
                'Failed to extract text from uploaded resume PDF.'
            )
            raise ValidationError({
                'file': (
                    'The uploaded file is invalid or could not '
                    'be read as a PDF.'
                )
            })

        if not extracted_text:
            raise ValidationError({
                'file': 'Could not extract text from the PDF resume.'
            })

        serializer.save(
            candidate=candidate,
            job=job,
            extracted_text=extracted_text,
        )


class CandidateResumeHistoryView(generics.ListAPIView):
    permission_classes = [IsRecruiter]

    def list(self, request, *args, **kwargs):
        candidate_id = kwargs.get('candidate_id')

        resumes = list(
            Resume.objects.filter(
                candidate_id=candidate_id,
                job__recruiter=request.user,
            ).select_related(
                'candidate',
                'job',
            ).order_by('-uploaded_at')
        )

        data = []

        for index, resume in enumerate(resumes):
            data.append({
                'id': resume.id,
                'candidate': resume.candidate.username,
                'job': resume.job.title,
                'filename': resume.file.name,
                'uploaded_at': resume.uploaded_at,
                'is_latest': index == 0,
            })

        return Response(data)
