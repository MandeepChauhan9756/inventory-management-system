import os
from dotenv import load_dotenv

load_dotenv()

class Config:

    # SQLALCHEMY_DATABASE_URI = os.getenv("DATABASE_URL")
    database_url = os.getenv("DATABASE_URL")

    if database_url and database_url.startswith("postgres://"):
        database_url = database_url.replace(
            "postgres://",
            "postgresql://",
            1
        )

    SQLALCHEMY_DATABASE_URI = database_url

    SQLALCHEMY_TRACK_MODIFICATIONS = False

    JWT_SECRET_KEY = os.getenv(
        "JWT_SECRET_KEY",
        "inventory_secret_key"
        )