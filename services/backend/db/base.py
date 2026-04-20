from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
import os

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql+asyncpg://postgres:postgres@localhost/synapseai")

engine = create_async_engine(DATABASE_URL, echo=False, pool_size=10, max_overflow=20)
SessionLocal = async_sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)


class Base(DeclarativeBase):
    pass


async def get_db():
    async with SessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise


async def init_db():
    from db import models  # noqa: F401 — ensure models are imported so metadata is populated
    from sqlalchemy import text
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        # Idempotent migrations for columns added after initial deploy
        for stmt in [
            "ALTER TABLE volunteer_profiles ADD COLUMN IF NOT EXISTS share_location BOOLEAN NOT NULL DEFAULT FALSE",
            "ALTER TABLE volunteer_profiles ADD COLUMN IF NOT EXISTS lat DOUBLE PRECISION",
            "ALTER TABLE volunteer_profiles ADD COLUMN IF NOT EXISTS lng DOUBLE PRECISION",
            "ALTER TABLE tasks ADD COLUMN IF NOT EXISTS lat DOUBLE PRECISION",
            "ALTER TABLE tasks ADD COLUMN IF NOT EXISTS lng DOUBLE PRECISION",
            "ALTER TABLE resources ADD COLUMN IF NOT EXISTS lat DOUBLE PRECISION",
            "ALTER TABLE resources ADD COLUMN IF NOT EXISTS lng DOUBLE PRECISION",
            "ALTER TABLE volunteer_profiles ADD COLUMN IF NOT EXISTS full_name VARCHAR(200)",
            "ALTER TABLE volunteer_profiles ADD COLUMN IF NOT EXISTS phone VARCHAR(30)",
            "ALTER TABLE volunteer_profiles ADD COLUMN IF NOT EXISTS city VARCHAR(100)",
            "ALTER TABLE volunteer_profiles ADD COLUMN IF NOT EXISTS bio TEXT",
            "ALTER TABLE volunteer_profiles ADD COLUMN IF NOT EXISTS date_of_birth DATE",
            "ALTER TABLE assignments ADD COLUMN IF NOT EXISTS accepted_at TIMESTAMP",
            "ALTER TABLE assignments ADD COLUMN IF NOT EXISTS completed_at TIMESTAMP",
        ]:
            try:
                await conn.execute(text(stmt))
            except Exception:
                pass
