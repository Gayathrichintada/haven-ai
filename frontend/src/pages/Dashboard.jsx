import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getHavenProfile } from "../utils/profile";
import { themes } from "../utils/themes";
import { Mic } from "lucide-react";
import {
  LineChart,
  Line,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";


export default function Dashboard() {
 
  const [recentChats, setRecentChats] = useState([]);
  const navigate = useNavigate();
 
  const profile = getHavenProfile();
  const currentTheme =
  themes[profile?.theme] || themes.midnight;

const showHearts = profile?.theme === "love";
const showFrost = profile?.theme === "frost";
  const startListening = () => {
  if (!recognitionRef.current) {
    alert(
      "Voice input is not supported in this browser."
    );
    return;
  }

  if (!isListening) {
    recognitionRef.current.start();
  }
};
  const topPreference =
    profile.support_ranking?.[0] || "Friend";

  const [messages, setMessages] = useState([]);
  const [isListening, setIsListening] = useState(false);
  const [isVoiceMessage, setIsVoiceMessage] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [currentChatId, setCurrentChatId] =
  useState(() => {
    const existing =
      localStorage.getItem("chatId");

    if (existing) return existing;

    const newId = crypto.randomUUID();

    localStorage.setItem(
      "chatId",
      newId
    );

    return newId;
  });

  const [input, setInput] = useState("");
  const [sessions, setSessions] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [failedMessage, setFailedMessage] =
    useState(null);

  const [dominantMood, setDominantMood] =
    useState("neutral");

  const [moodHistory, setMoodHistory] =
    useState([]);
  const recognitionRef = useRef(null);

useEffect(() => {
  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  if (!SpeechRecognition) return;

  const recognition = new SpeechRecognition();

  recognition.lang = "en-US";
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onstart = () => {
    setIsListening(true);
  };

  recognition.onend = () => {
    setIsListening(false);
  };

  recognition.onresult = (event) => {
  const transcript = Array.from(event.results)
    .map((result) => result[0].transcript)
    .join("");

  setInput(transcript);
  setIsVoiceMessage(true);
};
  recognitionRef.current = recognition;
}, []);

  const messagesEndRef = useRef(null);
  const deleteSession = async (chatId) => {
  try {
    await fetch(
      `http://127.0.0.1:8000/chat-session/${chatId}`,
      {
        method: "DELETE",
      }
    );

    await loadSessions();

    if (currentChatId === chatId) {
      const newChatId = crypto.randomUUID();

      localStorage.setItem(
        "chatId",
        newChatId
      );

      setCurrentChatId(newChatId);
      setMessages([]);
    }
  } catch (error) {
    console.error(error);
  }
}; 
  

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [messages, isTyping]);

  useEffect(() => {
    const draft =
      localStorage.getItem("draftMessage");

    if (draft) {
      setInput(draft);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(
      "draftMessage",
      input
    );
  }, [input]);

  const fetchInsights = async () => {
    try {
      const profileId =
        localStorage.getItem("profileId");

      if (!profileId) return;

      const response = await fetch(
        `http://127.0.0.1:8000/insights/${profileId}`
      );

      if (!response.ok) return;

      const data = await response.json();
    

      setDominantMood(
        data.dominant_mood || "neutral"
      );

      setMoodHistory(
        data.mood_history || []
      );
    } catch (error) {
      console.error(error);
    }
  };

  const loadHistory = async () => {
  try {
    const profileId =
      localStorage.getItem("profileId");

    if (!profileId) return;

    const response = await fetch(
  `http://127.0.0.1:8000/conversations/${profileId}/${currentChatId}`
);

    const data = await response.json();

    const history = data.messages || [];

    if (history.length === 0) {
      setMessages([
        {
          role: "assistant",
          text: `Hello ${profile.name} 👋

I'm Haven.

How are you feeling today?`,
        },
      ]);

      return;
    }

    const formatted = history.flatMap(
      (item) => {
        const result = [];

        if (item.user_message) {
          result.push({
            role: "user",
            text: item.user_message,
          });
        }

        if (item.ai_reply) {
          result.push({
            role: "assistant",
            text: item.ai_reply,
          });
        }

        return result;
      }
    );

    setMessages(formatted);
  } catch (error) {
    console.error(
      "Failed to load history:",
      error
    );
  }
};
  
const loadSessions = async () => {
  try {
    const profileId =
      localStorage.getItem("profileId");

    const response = await fetch(
      `http://127.0.0.1:8000/chat-sessions/${profileId}`
    );

    const data = await response.json();

    setSessions(data.sessions || []);
  } catch (error) {
    console.error(
      "Failed to load sessions:",
      error
    );
  }
};
  useEffect(() => {
  loadHistory();
  loadSessions();
  fetchInsights();
}, [currentChatId]);

  const fetchWithRetry = async (
    url,
    options,
    retries = 2
  ) => {
    try {
      const response = await fetch(
        url,
        options
      );

      if (
        response.status === 429 ||
        response.status === 503
      ) {
        const data = await response.json();

        throw new Error(
          data.detail ||
            `Retryable:${response.status}`
        );
      }

      return response;
    } catch (error) {
      if (retries > 0) {
        await new Promise((resolve) =>
          setTimeout(resolve, 2000)
        );

        return fetchWithRetry(
          url,
          options,
          retries - 1
        );
      }

      throw error;
    }
  };
  
  const handleSend = async () => {
    if (!input.trim() || isTyping) return;

    const currentInput = input;

    setFailedMessage(null);

    setMessages((prev) => [
      ...prev,
      {
        role: "user",
        text: currentInput,
      },
    ]);

    setInput("");

    localStorage.removeItem(
      "draftMessage"
    );

    setIsTyping(true);

    const profileId =
      localStorage.getItem("profileId");

    const token =
      localStorage.getItem("token");

    try {
      const formData = new FormData();

formData.append(
  "message",
  currentInput
);

formData.append(
  "profile_id",
  profileId
);

formData.append(
  "chat_id",
  currentChatId
);

formData.append(
  "profile",
  JSON.stringify(profile)
);

if (selectedImage) {
  formData.append(
    "image",
    selectedImage
  );
}

const response =
  await fetchWithRetry(
    "http://127.0.0.1:8000/chat",
    {
      method: "POST",

      headers: {
        Authorization: `Bearer ${token}`,
      },

      body: formData,
    }
  );
const data = await response.json();
      if (!response.ok) {
        throw new Error(
          data.detail ||
            "Unable to contact Haven."
        );
      }
      setMessages((prev) => [
  ...prev,
  {
    role: "assistant",
    text: data.reply,
  },
  
]);
if (isVoiceMessage) {
  window.speechSynthesis.cancel();

  const utterance =
    new SpeechSynthesisUtterance(data.reply);

  utterance.lang = "en-US";
  utterance.rate = 1;
  utterance.pitch = 1;

  window.speechSynthesis.speak(utterance);

  setIsVoiceMessage(false);
}
      setSelectedImage(null);

      await fetchInsights();
      await loadSessions();
    } catch (error) {
      setFailedMessage(currentInput);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          text:
            error.message ||
            "I'm having trouble connecting right now.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("profileId");
    localStorage.removeItem("havenProfile");

    window.location.href = "/login";
  };

  const getMoodEmoji = (mood) => {
    switch (mood) {
      case "happy":
        return "😊";
      case "stressed":
        return "😟";
      case "anxious":
        return "😰";
      case "sad":
        return "😔";
      case "motivated":
        return "💪";
      default:
        return "🌱";
    }
  };

  const moodScore = {
    sad: 1,
    anxious: 2,
    stressed: 3,
    neutral: 4,
    happy: 5,
    motivated: 6,
  };

  const chartData = moodHistory.map((item) => ({
    time: new Date(
      item.timestamp
    ).toLocaleDateString(),
    score: moodScore[item.mood] || 4,
  }));

  return (
    <div
  className={`h-screen overflow-hidden bg-gradient-to-br ${currentTheme.background} flex`}
style={{
  color: currentTheme.text,
}}
>
      <div
  className={`w-72 h-screen shrink-0 border-r border-white/10 p-6 flex flex-col gap-6 overflow-y-auto ${currentTheme.sidebar}`}
>

        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">
            🌱 Haven
          </h1>

          <button
            onClick={handleLogout}
            className="bg-red-500/20 hover:bg-red-500 px-3 py-2 rounded-xl text-sm transition"
          >
            Logout
          </button>
        </div>

        <button
          onClick={() =>
            navigate("/profile/edit")
          }
          className="p-3 rounded-xl transition"
style={{ backgroundColor: currentTheme.card }}
        >
          Edit Profile
        </button>

      
        <button
  onClick={() => {
    const newChatId =
      crypto.randomUUID();

    localStorage.setItem(
      "chatId",
      newChatId
    );

    setCurrentChatId(newChatId);

    setMessages([]);
  }}
  className={`w-full ${currentTheme.primary} text-black font-bold py-3 rounded-2xl mb-4`}
>
  + New Chat
</button>

<div
  className={`rounded-3xl p-5 ${currentTheme.border} ${currentTheme.shadow}`}
  style={{ backgroundColor: currentTheme.card }}
>
  <h3
  className="font-semibold mb-3"
  style={{ color: currentTheme.text }}
>
    Recent Chats
  </h3>

  <div className="space-y-2 max-h-64 overflow-y-auto">
    {sessions.map((chat) => (
  <div
    key={chat._id}
    className="flex items-center justify-between"
  >
  <div
    className="flex-1"
    onClick={() => {
      localStorage.setItem(
        "chatId",
        chat._id
      );

      setCurrentChatId(chat._id);
    }}
  >
    <p
  className="truncate text-sm"
  style={{ color: currentTheme.text }}
>
      {chat.title}
    </p>

    <p className="text-xs text-gray-400">
      {new Date(
        chat.timestamp
      ).toLocaleDateString()}
    </p>
  </div>

  <button
    onClick={(e) => {
      e.stopPropagation();

      deleteSession(chat._id);
    }}
    className="ml-2 text-gray-400 hover:text-red-400"
  >
    🗑️
  </button>
</div>
))}
  
  </div>
</div>
  
        <div
  className="p-4 rounded-xl"
  style={{ backgroundColor: currentTheme.card }}
>
          <h2 className="text-xl font-bold mb-3">
            👋 {profile.name}
          </h2>

          <div
  className="space-y-2 text-sm"
  style={{ color: currentTheme.text }}
>
            <p>🎓 Role: {profile.role}</p>

            {profile.field && (
              <p>
                📚 Field: {profile.field}
              </p>
            )}

            <p>
              🎯 Goals:{" "}
              {profile.goals?.join(", ")}
            </p>

            <p>
              🤝 Style:{" "}
              {profile.support_style}
            </p>
          </div>
        </div>

        {chartData.length > 0 && (
          <div
  className={`p-4 rounded-xl ${currentTheme.border} ${currentTheme.shadow}`}
  style={{ backgroundColor: currentTheme.card }}
>
            <h3 className="font-semibold mb-4">
              Mood Trend
            </h3>

            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={chartData}>
                  <XAxis hide dataKey="time" />
                  <YAxis hide domain={[1, 6]} />
                  <Tooltip />

                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#22c55e"
                    strokeWidth={3}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 flex flex-col h-screen relative overflow-hidden">
        {showHearts && (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    {[...Array(15)].map((_, i) => (
      <span
        key={i}
        className="absolute animate-heart-float text-pink-300 opacity-20"
        style={{
          left: `${Math.random() * 100}%`,
          fontSize: `${20 + Math.random() * 20}px`,
          animationDelay: `${i * 1.5}s`,
        }}
      >
        ❤️
      </span>
    ))}
  </div>
)}

{showFrost && (
  <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
    {[...Array(25)].map((_, i) => (
      <div
        key={i}
        className="absolute rounded-full bg-cyan-200 opacity-20 animate-frost-float"
        style={{
          width: `${4 + Math.random() * 10}px`,
          height: `${4 + Math.random() * 10}px`,
          left: `${Math.random() * 100}%`,
          animationDelay: `${i * 0.5}s`,
        }}
      />
    ))}
  </div>
)}

        <div className="flex-1 overflow-y-auto p-8 relative z-10">
          <div className="space-y-4">

            {messages.map((message, index) => (
  <div
    key={`${message.role}-${index}`}
    className={`flex ${
      message.role === "user"
        ? "justify-end"
        : "justify-start"
    }`}
  >
    <div
      className={`max-w-xl p-4 rounded-2xl whitespace-pre-line ${
        message.role === "user"
          ? `${currentTheme.bubble} ${
    profile?.theme === "love"
      ? "text-black"
      : "text-white"
  }`
          : ""
      }`}
      style={
        message.role === "assistant"
          ? {
              backgroundColor: currentTheme.card,
              color: currentTheme.text,
            }
          : {}
      }
    >
      {message.text}
    </div>
  </div>
))}

            {isTyping && (
              <div className="flex justify-start">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
style={{ backgroundColor: currentTheme.card }}>
                  🌱 Haven is thinking...
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>
        </div>

        {failedMessage && (
          <div className="px-6 pb-2">
            <button
              onClick={() => {
                setInput(failedMessage);
                setFailedMessage(null);
              }}
              className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold px-4 py-2 rounded-xl"
            >
              Retry Last Message
            </button>
          </div>
        )}
        
<div className="px-6 pb-2">
  <input
  id="image-upload"
  type="file"
  accept="image/*"
  className="hidden"
  onChange={(e) =>
    setSelectedImage(e.target.files[0])
  }
/>
{selectedImage && (
  <div className="px-6 pb-2">
    <div
  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm"
  style={{ backgroundColor: currentTheme.card }}
>
      📷 {selectedImage.name}

      <button
        onClick={() => setSelectedImage(null)}
        className="text-red-400 hover:text-red-300"
      >
        ✕
      </button>
    </div>
  </div>
)}
  
</div>
        <div className="p-6 border-t border-white/10">
  <div className="flex items-center gap-4">

            <label
    htmlFor="image-upload"
    className={`cursor-pointer h-14 w-14 flex items-center justify-center rounded-2xl ${currentTheme.primary} ${currentTheme.border} ${currentTheme.shadow}`}
  >
    +
  </label>

  <button
    onClick={startListening}
    className={`h-14 w-14 rounded-2xl flex items-center justify-center ${
  isListening ? "bg-red-500 animate-pulse" : currentTheme.primary
} ${currentTheme.border} ${currentTheme.shadow}`}
    
  >
    <Mic
  size={22}
  style={{
  color: isListening
    ? currentTheme.text
    : "black",
}}
/>
  </button>

  <input
  value={input}
  onChange={(e) => {
    setInput(e.target.value);
    setIsVoiceMessage(false);
  }}
    placeholder="Message Haven..."
   className="flex-1 p-4 rounded-2xl outline-none"
style={{
  backgroundColor: currentTheme.card,
  color: currentTheme.text,
}}
  />

  <button
    onClick={handleSend}
    className={`px-6 py-4 rounded-2xl font-semibold ${
  currentTheme.primary
} ${
  profile?.theme === "love"
    ? "text-black"
    : "text-white"
}`}
  >
    Send
  </button>

</div>
        </div>

      </div>
    </div>
  );}
