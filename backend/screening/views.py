
from rest_framework import generics
from rest_framework.response import Response
from rest_framework.exceptions import NotFound, ValidationError

from .models import ScreeningResult
from resumes.models import Resume
from ml.matcher import calculate_similarity, calculate_skill_match
from accounts.permissions import IsRecruiter


def refresh_screening_result(result):
    """Recalculate and save screening scores."""
    resume = result.resume
    job = result.job

    similarity_score = calculate_similarity(
        job.description,
        job.required_skills,
        resume.extracted_text,
    )

    skill_result = calculate_skill_match(
        job.required_skills,
        resume.extracted_text,
    )

    skill_score = skill_result["skill_score"]

    final_score = round(
        similarity_score * 0.4 + skill_score * 0.6,
        2,
    )

    missing_skills = ", ".join(
        skill_result["missing_skills"]
    )

    if (
        result.match_score != final_score
        or result.missing_skills != missing_skills
    ):
        result.match_score = final_score
        result.missing_skills = missing_skills
        result.save(
            update_fields=["match_score", "missing_skills"]
        )

    return {
        **skill_result,
        "skill_score": skill_score,
        "similarity_score": similarity_score,
        "final_score": final_score,
    }


class ScreeningCreateView(generics.CreateAPIView):
    queryset = ScreeningResult.objects.all()
    permission_classes = [IsRecruiter]

    def create(self, request, *args, **kwargs):
        resume_id = request.data.get("resume_id")

        if not resume_id:
            raise ValidationError({
                "resume_id": "Resume ID is required."
            })

        try:
            resume = Resume.objects.select_related(
                "job",
                "candidate",
            ).get(
                id=resume_id,
                job__recruiter=request.user,
            )
        except Resume.DoesNotExist:
            raise NotFound(
                "Resume not found or does not belong to your job."
            )

        job = resume.job

        similarity_score = calculate_similarity(
            job.description,
            job.required_skills,
            resume.extracted_text,
        )

        skill_result = calculate_skill_match(
            job.required_skills,
            resume.extracted_text,
        )

        skill_score = skill_result["skill_score"]

        final_score = round(
            similarity_score * 0.4 + skill_score * 0.6,
            2,
        )

        result, _ = ScreeningResult.objects.update_or_create(
            candidate=resume.candidate,
            job=job,
            defaults={
                "resume": resume,
                "match_score": final_score,
                "missing_skills": ", ".join(
                    skill_result["missing_skills"]
                ),
            },
        )

        return Response({
            "id": result.id,
            "candidate": result.candidate.username,
            "job": job.title,
            "skill_score": skill_score,
            "similarity_score": similarity_score,
            "match_score": final_score,
            "matched_skills": skill_result["matched_skills"],
            "missing_skills": skill_result["missing_skills"],
        })


class ScreeningListView(generics.ListAPIView):
    permission_classes = [IsRecruiter]

    def list(self, request, *args, **kwargs):
        results = ScreeningResult.objects.filter(
            job__recruiter=request.user
        ).select_related(
            "candidate",
            "job",
            "resume",
        )

        data = []

        for result in results:
            scores = refresh_screening_result(result)

            data.append({
                "id": result.id,
                "candidate": result.candidate.username,
                "email": result.candidate.email,
                "job": result.job.title,
                "skill_score": scores["skill_score"],
                "similarity_score": scores["similarity_score"],
                "match_score": scores["final_score"],
                "matched_skills": scores["matched_skills"],
                "missing_skills": scores["missing_skills"],
                "created_at": result.created_at,
            })

        data.sort(
            key=lambda item: item["match_score"],
            reverse=True,
        )

        return Response(data)


class ScreeningDetailView(generics.RetrieveAPIView):
    permission_classes = [IsRecruiter]

    def get(self, request, pk):
        try:
            result = ScreeningResult.objects.select_related(
                "candidate",
                "job",
                "resume",
            ).get(
                id=pk,
                job__recruiter=request.user,
            )
        except ScreeningResult.DoesNotExist:
            raise NotFound(
                "Candidate screening result not found."
            )

        scores = refresh_screening_result(result)

        return Response({
            "id": result.id,
            "candidate": {
                "id": result.candidate.id,
                "username": result.candidate.username,
                "email": result.candidate.email,
            },
            "job": {
                "id": result.job.id,
                "title": result.job.title,
                "description": result.job.description,
                "required_skills": result.job.required_skills,
            },
            "skill_score": scores["skill_score"],
            "similarity_score": scores["similarity_score"],
            "match_score": scores["final_score"],
            "matched_skills": scores["matched_skills"],
            "missing_skills": scores["missing_skills"],
            "resume": {
                "id": result.resume.id,
                "filename": result.resume.file.name,
                "uploaded_at": result.resume.uploaded_at,
                "extracted_text": result.resume.extracted_text,
            },
            "created_at": result.created_at,
        })
