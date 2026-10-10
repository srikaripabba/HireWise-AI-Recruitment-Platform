
import re

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


def normalize_skill(skill):
    """Normalize skill names for case- and spacing-independent matching."""
    skill = (skill or "").lower().strip()
    return re.sub(r"[^a-z0-9+#]", "", skill)


def split_required_skills(required_skills):
    """Split skill lists and alternatives such as Power BI or Tableau."""
    if isinstance(required_skills, (list, tuple, set)):
        items = list(required_skills)
    else:
        items = re.split(r"[,;/\\|\n\r]+", required_skills or "")

    skills = []

    for item in items:
        # Split alternatives without splitting ordinary multiword skills.
        alternatives = re.split(r"\s+\bor\b\s+", str(item), flags=re.I)

        for alternative in alternatives:
            skill = re.sub(r"\s+", " ", alternative.strip())
            skill = skill.strip(" .,:;|/-")
            key = normalize_skill(skill)

            if key and not any(
                normalize_skill(existing) == key
                for existing in skills
            ):
                skills.append(skill)

    return skills


def skill_is_present(skill, resume_text):
    """Find a complete skill while tolerating spaces and punctuation."""
    target = normalize_skill(skill)

    if not target:
        return False

    text = (resume_text or "").lower()

    # Compare normalized text but retain word boundaries to prevent
    # Java from matching JavaScript.
    normalized_text = re.sub(r"[^a-z0-9+#]+", " ", text)

    for match in re.finditer(r"[a-z0-9+#]+(?:\s+[a-z0-9+#]+)*", normalized_text):
        candidate = normalize_skill(match.group())

        if candidate == target:
            return True

    # Handle skills written without spaces, such as DjangoRESTAPI.
    compact_text = re.sub(r"[^a-z0-9+#]", "", text)

    # Require alphanumeric boundaries around the skill.
    pattern = (
        r"(?<![a-z0-9])"
        + r"[\W_]*".join(re.escape(char) for char in target)
        + r"(?![a-z0-9])"
    )

    return bool(re.search(pattern, text, flags=re.I))


def calculate_similarity(job_description, required_skills, resume_text):
    job_text = f"{job_description or ''} {required_skills or ''}"

    try:
        vectorizer = TfidfVectorizer(stop_words="english")
        matrix = vectorizer.fit_transform([
            job_text.lower(),
            (resume_text or "").lower(),
        ])
        score = cosine_similarity(matrix[0:1], matrix[1:2])[0][0]
        return round(score * 100, 2)
    except ValueError:
        return 0.0


def calculate_skill_match(required_skills, resume_text):
    skills = split_required_skills(required_skills)
    matched = []
    missing = []

    for skill in skills:
        if skill_is_present(skill, resume_text):
            matched.append(skill)
        else:
            missing.append(skill)

    score = len(matched) / len(skills) * 100 if skills else 0.0

    return {
        "skill_score": round(score, 2),
        "matched_skills": matched,
        "missing_skills": missing,
    }
