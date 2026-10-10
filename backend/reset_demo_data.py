from pathlib import Path
from django.conf import settings
from django.contrib.auth.models import User
from django.db import transaction
from accounts.models import UserProfile
from jobs.models import Job
from resumes.models import Resume
from screening.models import ScreeningResult

backup = settings.BASE_DIR / "db_backup_before_demo_reset.sqlite3"
database = settings.BASE_DIR / "db.sqlite3"
resume_dir = settings.BASE_DIR / "resumes"

if not backup.exists() or not database.exists():
    raise RuntimeError("Database or backup not found. Nothing deleted.")

if backup.stat().st_size != database.stat().st_size:
    raise RuntimeError(
        "Backup and database sizes differ. Stop and verify the backup."
    )

user_ids = list(
    User.objects.filter(
        userprofile__role__in=["recruiter", "candidate"]
    ).values_list("id", flat=True).distinct()
)

pdf_files = list(resume_dir.glob("*.pdf")) if resume_dir.exists() else []

print("\nDEMO DATA RESET PREVIEW")
print("Recruiter/candidate accounts:", len(user_ids))
print("Jobs:", Job.objects.count())
print("Screening results:", ScreeningResult.objects.count())
print("Resume records:", Resume.objects.count())
print("PDF files in backend/resumes:", len(pdf_files))
print("Database backup:", backup.name)

confirmation = input(
    "\nType DELETE DEMO DATA to proceed: "
).strip()

if confirmation != "DELETE DEMO DATA":
    print("Cancelled. No data was deleted.")
else:
    with transaction.atomic():
        ScreeningResult.objects.all().delete()
        Resume.objects.all().delete()
        Job.objects.all().delete()
        UserProfile.objects.filter(
            role__in=["recruiter", "candidate"]
        ).delete()
        User.objects.filter(id__in=user_ids).delete()

    deleted_files = 0
    failed_files = []

    for pdf in pdf_files:
        try:
            pdf.unlink()
            deleted_files += 1
        except OSError as exc:
            failed_files.append(f"{pdf.name}: {exc}")

    print("\nCLEANUP FINISHED")
    print("Remaining recruiter/candidate profiles:",
          UserProfile.objects.filter(
              role__in=["recruiter", "candidate"]
          ).count())
    print("Remaining jobs:", Job.objects.count())
    print("Remaining screening results:", ScreeningResult.objects.count())
    print("Remaining resume records:", Resume.objects.count())
    print("PDF files deleted:", deleted_files)
    print("Database backup preserved:", backup.exists())

    if failed_files:
        print("Files that could not be deleted:")
        for failure in failed_files:
            print(failure)
