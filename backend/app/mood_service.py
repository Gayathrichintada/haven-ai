def detect_mood(message: str):
    text = message.lower()

    stressed_words = [
        "stress",
        "stressed",
        "overwhelmed",
        "burnout",
        "pressure",
        "exam"
    ]

    anxious_words = [
        "anxious",
        "anxiety",
        "worried",
        "nervous",
        "panic",
        "fear"
    ]

    happy_words = [
        "happy",
        "excited",
        "great",
        "good",
        "joy",
        "amazing"
    ]

    motivated_words = [
        "motivated",
        "productive",
        "focused",
        "determined",
        "confident"
    ]

    sad_words = [
        "sad",
        "lonely",
        "down",
        "depressed",
        "upset",
        "hurt"
    ]

    affectionate_words = [
        "sweet",
        "love",
        "thank you",
        "thanks",
        "cute",
        "kind"
    ]

    if any(word in text for word in stressed_words):
        return "stressed"

    if any(word in text for word in anxious_words):
        return "anxious"

    if any(word in text for word in happy_words):
        return "happy"

    if any(word in text for word in motivated_words):
        return "motivated"

    if any(word in text for word in sad_words):
        return "sad"

    if any(word in text for word in affectionate_words):
        return "happy"

    return "neutral"