import secrets
import string


def generate_id(prefix: str = "", length: int = 12) -> str:
    alphabet = string.ascii_lowercase + string.digits
    token = "".join(secrets.choice(alphabet) for _ in range(length))
    return f"{prefix}{token}" if prefix else token
