from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase
from pymongo.errors import DuplicateKeyError

from app.utils.config import settings

client: AsyncIOMotorClient | None = None
database: AsyncIOMotorDatabase | None = None


def get_database() -> AsyncIOMotorDatabase:
    if database is None:
        raise RuntimeError("Database connection has not been initialized.")
    return database


async def connect_to_mongo() -> None:
    global client, database
    client = AsyncIOMotorClient(settings.mongodb_uri)
    database = client[settings.mongodb_db_name]
    await ensure_collections_and_indexes()


async def close_mongo_connection() -> None:
    global client
    if client is not None:
        client.close()
        client = None


async def ensure_collections_and_indexes() -> None:
    db = get_database()
    existing = await db.list_collection_names()
    required_collections = ["users", "dna_questions", "roadmaps", "courses", "lab_results"]

    for collection_name in required_collections:
        if collection_name not in existing:
            await db.create_collection(collection_name)

    await db.users.create_index("email", unique=True)
    await db.roadmaps.create_index("user_id")
    await db.courses.create_index("user_id")
    await db.courses.create_index("roadmap_id")
    # Prevent duplicate course creation per roadmap/module/user (double-click / race conditions).
    try:
        await _dedupe_courses_for_unique_index()
        await db.courses.create_index(
            [("user_id", 1), ("roadmap_id", 1), ("module_name", 1)],
            unique=True,
        )
    except DuplicateKeyError:
        # If duplicates slip in between dedupe and index build, don't crash startup.
        # App will still be protected by the runtime DuplicateKeyError handling in store_course().
        pass
    await db.lab_results.create_index("user_id")
    await db.lab_results.create_index("roadmap_id")


async def _dedupe_courses_for_unique_index() -> None:
    """
    Keep newest course per (user_id, roadmap_id, module_name) and delete older duplicates.
    This allows building the unique compound index without failing startup.
    """
    db = get_database()
    pipeline = [
        {"$sort": {"created_at": -1}},
        {
            "$group": {
                "_id": {
                    "user_id": "$user_id",
                    "roadmap_id": "$roadmap_id",
                    "module_name": "$module_name",
                },
                "ids": {"$push": "$_id"},
                "count": {"$sum": 1},
            }
        },
        {"$match": {"count": {"$gt": 1}}},
    ]

    cursor = db.courses.aggregate(pipeline, allowDiskUse=True)
    async for row in cursor:
        ids = row.get("ids", [])
        if not isinstance(ids, list) or len(ids) < 2:
            continue
        # Keep first (newest due to sort), delete the rest.
        to_delete = ids[1:]
        await db.courses.delete_many({"_id": {"$in": to_delete}})
