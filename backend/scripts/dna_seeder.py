import asyncio
import copy
import os
import sys

from motor.motor_asyncio import AsyncIOMotorClient

# Allow running this script directly: python scripts/dna_seeder.py
sys.path.append(os.path.dirname(os.path.dirname(__file__)))

from app.utils.config import settings

CLASS_1_QUESTIONS = [
    {
        "question": "Which number is bigger?",
        "options": ["3", "7", "5", "2"],
        "answer": "7",
        "category": "logical",
    },
    {
        "question": "What comes next: A, B, C, ?",
        "options": ["D", "E", "F", "G"],
        "answer": "D",
        "category": "pattern",
    },
    {
        "question": "If you have 2 apples and get 1 more, how many apples?",
        "options": ["2", "3", "4", "5"],
        "answer": "3",
        "category": "numerical",
    },
    {
        "question": "Which is a fruit?",
        "options": ["Car", "Apple", "Chair", "Pen"],
        "answer": "Apple",
        "category": "general",
    },
    {
        "question": "Which shape has 4 sides?",
        "options": ["Triangle", "Circle", "Square", "Line"],
        "answer": "Square",
        "category": "spatial",
    },
]

CLASS_5_QUESTIONS = [
    {
        "question": "What is 12 + 8?",
        "options": ["18", "20", "22", "16"],
        "answer": "20",
        "category": "numerical",
    },
    {
        "question": "Find the odd one out: Dog, Cat, Cow, Car",
        "options": ["Dog", "Cat", "Cow", "Car"],
        "answer": "Car",
        "category": "logical",
    },
    {
        "question": "If a book costs ₹50 and you buy 2, total cost?",
        "options": ["100", "150", "80", "120"],
        "answer": "100",
        "category": "numerical",
    },
    {
        "question": "Which planet do we live on?",
        "options": ["Mars", "Earth", "Venus", "Jupiter"],
        "answer": "Earth",
        "category": "general",
    },
    {
        "question": "What comes next: 2, 4, 6, ?",
        "options": ["7", "8", "9", "10"],
        "answer": "8",
        "category": "pattern",
    },
]

CLASS_8_QUESTIONS = [
    {
        "question": "What is 15 × 3?",
        "options": ["30", "45", "60", "50"],
        "answer": "45",
        "category": "numerical",
    },
    {
        "question": "Which is a prime number?",
        "options": ["9", "15", "11", "21"],
        "answer": "11",
        "category": "logical",
    },
    {
        "question": "If speed increases, time taken to cover same distance?",
        "options": ["Increases", "Decreases", "Same", "Zero"],
        "answer": "Decreases",
        "category": "conceptual",
    },
    {
        "question": "Find next: 3, 9, 27, ?",
        "options": ["54", "81", "72", "90"],
        "answer": "81",
        "category": "pattern",
    },
    {
        "question": "Which gas is essential for breathing?",
        "options": ["CO2", "Oxygen", "Nitrogen", "Hydrogen"],
        "answer": "Oxygen",
        "category": "general",
    },
]

CLASS_10_QUESTIONS = [
    {
        "question": "Solve: 2x + 3 = 7",
        "options": ["1", "2", "3", "4"],
        "answer": "2",
        "category": "numerical",
    },
    {
        "question": "Which law explains force = mass × acceleration?",
        "options": ["Newton 1st", "Newton 2nd", "Newton 3rd", "Ohm’s Law"],
        "answer": "Newton 2nd",
        "category": "conceptual",
    },
    {
        "question": "Find next: 5, 10, 20, 40, ?",
        "options": ["60", "80", "100", "120"],
        "answer": "80",
        "category": "pattern",
    },
    {
        "question": "Which is NOT a programming language?",
        "options": ["Python", "Java", "HTML", "C++"],
        "answer": "HTML",
        "category": "logical",
    },
    {
        "question": "If a train moves at constant speed, acceleration is?",
        "options": ["Zero", "Positive", "Negative", "Infinite"],
        "answer": "Zero",
        "category": "conceptual",
    },
]

CLASS_12_QUESTIONS = [
    {
        "question": "Derivative of x²?",
        "options": ["x", "2x", "x²", "2"],
        "answer": "2x",
        "category": "numerical",
    },
    {
        "question": "Which data structure uses FIFO?",
        "options": ["Stack", "Queue", "Tree", "Graph"],
        "answer": "Queue",
        "category": "logical",
    },
    {
        "question": "If voltage increases and resistance constant, current?",
        "options": ["Decreases", "Increases", "Same", "Zero"],
        "answer": "Increases",
        "category": "conceptual",
    },
    {
        "question": "Binary of 5?",
        "options": ["101", "110", "111", "100"],
        "answer": "101",
        "category": "logical",
    },
    {
        "question": "Which is a sorting algorithm?",
        "options": ["Dijkstra", "Bubble Sort", "DFS", "BFS"],
        "answer": "Bubble Sort",
        "category": "cs",
    },
]

BTECH_1_QUESTIONS = [
    {
        "question": "Time complexity of linear search?",
        "options": ["O(1)", "O(n)", "O(log n)", "O(n²)"],
        "answer": "O(n)",
        "category": "cs",
    },
    {
        "question": "Which is a compiled language?",
        "options": ["Python", "JavaScript", "C", "HTML"],
        "answer": "C",
        "category": "logical",
    },
    {
        "question": "If resistance doubles, current becomes?",
        "options": ["Double", "Half", "Same", "Zero"],
        "answer": "Half",
        "category": "conceptual",
    },
    {
        "question": "Stack follows?",
        "options": ["FIFO", "LIFO", "Random", "None"],
        "answer": "LIFO",
        "category": "cs",
    },
    {
        "question": "Find next: 2, 6, 12, 20, ?",
        "options": ["28", "30", "32", "36"],
        "answer": "30",
        "category": "pattern",
    },
]

BTECH_3_QUESTIONS = [
    {
        "question": "Time complexity of binary search?",
        "options": ["O(n)", "O(log n)", "O(n²)", "O(1)"],
        "answer": "O(log n)",
        "category": "cs",
    },
    {
        "question": "Which algorithm is used for shortest path?",
        "options": ["DFS", "BFS", "Dijkstra", "Merge Sort"],
        "answer": "Dijkstra",
        "category": "cs",
    },
    {
        "question": "Which layer handles routing in OSI?",
        "options": ["Transport", "Network", "Session", "Data Link"],
        "answer": "Network",
        "category": "conceptual",
    },
    {
        "question": "Overfitting occurs when?",
        "options": ["Model too simple", "Model too complex", "No data", "Random"],
        "answer": "Model too complex",
        "category": "ml",
    },
    {
        "question": "Find next: 1, 4, 9, 16, ?",
        "options": ["20", "25", "30", "36"],
        "answer": "25",
        "category": "pattern",
    },
]


def build_seed_data() -> list[dict]:
    template_by_level = {
        "class_1": CLASS_1_QUESTIONS,
        "class_2": CLASS_1_QUESTIONS,
        "class_3": CLASS_1_QUESTIONS,
        "class_4": CLASS_1_QUESTIONS,
        "class_5": CLASS_5_QUESTIONS,
        "class_6": CLASS_5_QUESTIONS,
        "class_7": CLASS_5_QUESTIONS,
        "class_8": CLASS_8_QUESTIONS,
        "class_9": CLASS_8_QUESTIONS,
        "class_10": CLASS_10_QUESTIONS,
        "class_11": CLASS_12_QUESTIONS,
        "class_12": CLASS_12_QUESTIONS,
        "btech_1": BTECH_1_QUESTIONS,
        "btech_2": BTECH_1_QUESTIONS,
        "btech_3": BTECH_3_QUESTIONS,
        "btech_4": BTECH_3_QUESTIONS,
    }
    return [
        {"level": level, "questions": copy.deepcopy(questions)}
        for level, questions in template_by_level.items()
    ]


async def seed_dna_questions() -> None:
    client = AsyncIOMotorClient(settings.mongodb_uri)
    db = client[settings.mongodb_db_name]
    collection = db.dna_questions

    documents = build_seed_data()
    for doc in documents:
        await collection.update_one(
            {"level": doc["level"]},
            {"$set": doc},
            upsert=True,
        )

    print(f"Seeded {len(documents)} level documents in dna_questions.")
    client.close()


if __name__ == "__main__":
    asyncio.run(seed_dna_questions())
