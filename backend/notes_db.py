import contextlib

from datetime import datetime, timezone
from uuid import uuid4, UUID
from typing import Any, AsyncIterator

from sqlalchemy import String, Text
from sqlalchemy.orm import declarative_base, Mapped, mapped_column


# from app.config import settings
from sqlalchemy.ext.asyncio import (
    AsyncConnection,
    AsyncSession,
    async_sessionmaker,
    create_async_engine,
)

SQLALCHEMY_DATABASE_URL = "sqlite+aiosqlite:///d:/dev/notes/back/notes.db"

engine = create_async_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_size=10,
    max_overflow=0,
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


class DatabaseSessionManager:
    def __init__(self, host: str, engine_kwargs: dict[str, Any] = {}):
        self._engine = create_async_engine(host, **engine_kwargs)
        self._sessionmaker = async_sessionmaker(autocommit=False, bind=self._engine, autoflush=True)

    async def close(self):
        if self._engine is None:
            raise Exception("DatabaseSessionManager is not initialized")
        await self._engine.dispose()

        self._engine = None
        self._sessionmaker = None

    @contextlib.asynccontextmanager
    async def connect(self) -> AsyncIterator[AsyncConnection]:
        if self._engine is None:
            raise Exception("DatabaseSessionManager is not initialized")

        async with self._engine.begin() as connection:
            try:
                yield connection
            except Exception:
                await connection.rollback()
                raise

    @contextlib.asynccontextmanager
    async def session(self) -> AsyncIterator[AsyncSession]:
        if self._sessionmaker is None:
            raise Exception("DatabaseSessionManager is not initialized")

        session = self._sessionmaker()
        try:
            yield session
        except Exception:
            await session.rollback()
            raise
        finally:
            await session.close()


sessionmanager = DatabaseSessionManager(SQLALCHEMY_DATABASE_URL, {})


async def get_db_session():
    async with sessionmanager.session() as session:
        yield session
