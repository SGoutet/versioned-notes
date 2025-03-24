from datetime import datetime, timezone
from uuid import uuid4, UUID
from typing import Any, AsyncIterator

from sqlalchemy import create_engine, String, Text, DateTime, ForeignKey
from sqlalchemy.orm import declarative_base, Mapped, mapped_column

# from app.config import settings
# from sqlalchemy.ext.asyncio import (
#     AsyncConnection,
#     AsyncSession,
#     async_sessionmaker,
#     create_async_engine,
# )

SQLALCHEMY_DATABASE_URL = "sqlite:///./notes.db"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False}
)

Base = declarative_base()


class Note(Base):
    __tablename__ = "notes"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    note_id: Mapped[UUID] = mapped_column(String(36), default=lambda: str(uuid4()), index=True)
    version_number: Mapped[int] = mapped_column(default=1)
    current_version: Mapped[bool] = mapped_column(default=True)
    created: Mapped[datetime] = mapped_column(default=datetime.now(timezone.utc), index=True)
    content: Mapped[str] = mapped_column(Text, nullable=False)

# Create the table
Base.metadata.create_all(engine)
