
import re

from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity


# Skill names that can reasonably be treated as equivalent.
# Keep this list conservative to avoid inflating candidate scores.
SKILL_ALIASES = {
    "data structures and algorithms": (
        "dsa",
        "data structures algorithms",
    ),
    "oop concepts": (
        "oop",
        "oops",
        "object oriented programming",
        "object oriented programming concepts",
    ),
    "object oriented programming": (
        "oop",
        "oops",
        "object oriented programming concepts",
    ),
    "postgresql": (
        "postgres",
    ),
    "power bi": (
        "powerbi",
    ),
    "javascript": (
        "js",
    ),
    "typescript": (
        "ts",
    ),
}


def normalize_skill(skill):
    """Normalize a skill name for case- and punctuation-independent comparison."""
    skill = str(skill or "").strip().lower()
    skill = re.sub(r"[^a-z0-9+#]+", " ", skill)
    return re.sub(r"\s+", " ", skill).strip()


def _normalize_resume_text(text):
    """Normalize text without splitting JavaScript into Java Script."""
    text = str(text or "").lower()
    text = re.sub(r"[^a-z0-9+#]+", " ", text)
    return re.sub(r"\s+", " ", text).strip()


def split_required_skills(required_skills):
    """Split skill lists, comma-separated values, and explicit alternatives."""
    if isinstance(required_skills, (list, tuple, set)):
        items = list(required_skills)
    else:
        items = re.split(r"[,;/\\|\n\r]+", str(required_skills or ""))

    skills = []
    seen = set()

    for item in items:
        alternatives = re.split(
            r"\s+\bor\b\s+",
            str(item),
            flags=re.IGNORECASE,
        )

        for alternative in alternatives:
            skill = re.sub(r"\s+", " ", alternative.strip())
            skill = skill.strip(" .,:;|/-")

            key = normalize_skill(skill)
            if key and key not in seen:
                skills.append(skill)
                seen.add(key)

    return skills


def _skill_variants(skill):
    """Return the skill itself plus configured aliases."""
    normalized = normalize_skill(skill)
    variants = [normalized]

    # Include aliases when the requested skill matches a configured name.
    for canonical, aliases in SKILL_ALIASES.items():
        group = {normalize_skill(canonical)}
        group.update(normalize_skill(alias) for alias in aliases)

        if normalized in group:
            variants.extend(group)

    # Preserve order while removing duplicates.
    return list(dict.fromkeys(v for v in variants if v))


def skill_is_present(skill, resume_text):
    """Match a skill as a complete phrase, including known aliases."""
    target = normalize_skill(skill)

    if not target or not str(resume_text or "").strip():
        return False

    text = _normalize_resume_text(resume_text)

    for variant in _skill_variants(target):
        # Match complete phrases rather than partial words.
        # For example, Java must not match JavaScript.
        pattern = (
            r"(?<![a-z0-9])"
            + re.escape(variant)
            + r"(?![a-z0-9])"
        )

        if re.search(pattern, text):
            return True

    return False


def calculate_similarity(job_description, required_skills, resume_text):
    """Calculate TF-IDF cosine similarity between job and resume text."""
    job_text = " ".join(
        part for part in (
            str(job_description or ""),
            str(required_skills or ""),
        )
        if part.strip()
    )
    resume_text = str(resume_text or "")

    if not job_text.strip() or not resume_text.strip():
        return 0.0

    try:
        vectorizer = TfidfVectorizer(stop_words="english")
        matrix = vectorizer.fit_transform([
            job_text.lower(),
            resume_text.lower(),
        ])

        score = cosine_similarity(
            matrix[0:1],
            matrix[1:2],
        )[0][0]

        return round(float(score) * 100, 2)

    except ValueError:
        # For example, both inputs may contain no usable vocabulary.
        return 0.0


def calculate_skill_match(required_skills, resume_text):
    """Return the skill match percentage and matched/missing skill lists."""
    skills = split_required_skills(required_skills)
    matched = []
    missing = []

    for skill in skills:
        if skill_is_present(skill, resume_text):
            matched.append(skill)
        else:
            missing.append(skill)

    score = (
        len(matched) / len(skills) * 100
        if skills
        else 0.0
    )

    return {
        "skill_score": round(score, 2),
        "matched_skills": matched,
        "missing_skills": missing,
    }
