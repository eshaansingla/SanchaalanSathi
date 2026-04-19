import os
import logging
from fastapi import APIRouter, HTTPException, Header, Depends
from services.neo4j_service import neo4j_service

logger = logging.getLogger(__name__)
router = APIRouter()

SEED_ADMIN_SECRET = os.getenv("SEED_ADMIN_SECRET", "")


def _require_seed_secret(x_seed_secret: str = Header(default=None)):
    """Reject any request that does not carry the correct SEED_ADMIN_SECRET header."""
    if not SEED_ADMIN_SECRET:
        raise HTTPException(
            status_code=503,
            detail="Seed endpoint disabled — set SEED_ADMIN_SECRET env var to enable.",
        )
    if x_seed_secret != SEED_ADMIN_SECRET:
        logger.warning("Seed endpoint accessed with invalid secret")
        raise HTTPException(status_code=401, detail="Invalid seed admin secret")


@router.post("", dependencies=[Depends(_require_seed_secret)])
async def seed_graph():
    cypher_path = os.path.join(os.path.dirname(__file__), "../../../data/seed_graph.cypher")
    try:
        with open(cypher_path, "r") as f:
            queries = [q.strip() for q in f.read().split('\n\n') if q.strip() and not q.strip().startswith('//')]
    except FileNotFoundError:
        raise HTTPException(status_code=404, detail=f"Seed file not found at {cypher_path}")

    success_count = 0
    try:
        driver = neo4j_service.get_driver()
        async with driver.session() as session:
            for query in queries:
                await session.run(query)
                success_count += 1
        logger.info(f"Graph seeded: {success_count} statements executed")
        return {"success": True, "statements_executed": success_count}
    except Exception as e:
        logger.error(f"Seed error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error during DB seeding.")


@router.delete("", dependencies=[Depends(_require_seed_secret)])
async def clear_graph():
    cypher = "MATCH (n) DETACH DELETE n"
    try:
        await neo4j_service.run_query(cypher)
        logger.warning("Graph database cleared by seed admin")
        return {"success": True, "message": "Graph database cleared."}
    except Exception as e:
        logger.error(f"Clear graph error: {e}")
        raise HTTPException(status_code=500, detail="Internal server error clearing graph.")
