from __future__ import annotations

import asyncio
from functools import lru_cache


@lru_cache(maxsize=512)
def _search_sync(query: str) -> dict | None:
    """
    Use yt-dlp to resolve a real videoId for a search query.
    Cached to reduce repeated lookups.
    """
    try:
        from yt_dlp import YoutubeDL  # type: ignore
    except Exception:
        return None

    ydl_opts = {
        "quiet": True,
        "noplaylist": True,
        "extract_flat": "in_playlist",
        "default_search": "ytsearch1",
        "skip_download": True,
    }

    with YoutubeDL(ydl_opts) as ydl:
        info = ydl.extract_info(query, download=False)
        if not isinstance(info, dict):
            return None
        entries = info.get("entries")
        if not isinstance(entries, list) or not entries:
            return None
        first = entries[0]
        if not isinstance(first, dict):
            return None
        video_id = first.get("id")
        title = first.get("title")
        if not isinstance(video_id, str) or not video_id:
            return None
        return {
            "video_id": video_id,
            "title": title if isinstance(title, str) else None,
        }


async def search_youtube_video(query: str) -> dict | None:
    # Run yt-dlp in thread to avoid blocking event loop.
    return await asyncio.to_thread(_search_sync, query)

