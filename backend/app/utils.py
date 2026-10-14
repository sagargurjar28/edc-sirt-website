def slugify(text: str) -> str:
    """
    Convert a title into a URL-safe slug.
    Rules:
      - lowercase
      - replace any run of characters that are not a-z, 0-9 with a single hyphen
      - strip leading/trailing hyphens
      - collapse multiple hyphens
      - if the result is empty, return 'post'
    """
    import re
    s = text.lower()
    s = re.sub(r'[^a-z0-9]+', '-', s)
    s = s.strip('-')
    s = re.sub(r'-+', '-', s)
    return s or 'post'


def unique_slug(base: str, existing: set[str]) -> str:
    """
    Given a base slug and a set of slugs already in use, return the base
    if free, otherwise base-2, base-3, ... until free.
    """
    if base not in existing:
        return base
    n = 2
    while f"{base}-{n}" in existing:
        n += 1
    return f"{base}-{n}"
