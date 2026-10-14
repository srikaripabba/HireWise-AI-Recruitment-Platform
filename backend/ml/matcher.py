
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
    """Match skills using normalized text and common skill aliases."""
    target = normalize_skill(skill)
    text = (resume_text or "").lower()

    if not target or not text.strip():
        return False

    # Normalize punctuation and whitespace while preserving word boundaries.
    normalized_text = re.sub(r"[^a-z0-9+#]+", " ", text)
    normalized_text = re.sub(r"\s+", " ", normalized_text).strip()

    # Common abbreviations and equivalent skill names.
    aliases = {
        "datastructuresandalgorithms": [
            "dsa",
            "datastructuresalgorithms",
        ],
        "postgresql": ["postgres"],
        "powerbi": ["power bi"],
        "javascript": ["js"],
        "typescript": ["ts"],
    }

    targets = [target]
    targets.extend(aliases.get(target, []))

    # Compare complete normalized words/phrases, not partial words.
    compact_text = normalize_skill(normalized_text)

    for candidate in targets:
        candidate = normalize_skill(candidate)
        if not candidate:
            continue

        # Exact normalized phrase match.
        pattern = (
            r"(?<![a-z0-9])"
            + r"\s+".join(
                re.escape(part)
                for part in re.findall(
                    r"[a-z0-9+#]+",
                    candidate
                )
            )
            + r"(?![a-z0-9])"
        )

        if re.search(pattern, normalized_text):
            return True

        # Handle compact forms such as DjangoRESTAPI.
        compact_pattern = (
            r"(?<![a-z0-9])"
            + re.escape(candidate)
            + r"(?![a-z0-9])"
        )

        if re.search(compact_pattern, text, flags=re.I):
            return True

    return False


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
