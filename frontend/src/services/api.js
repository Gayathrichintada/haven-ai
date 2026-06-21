const API_BASE_URL = "http://127.0.0.1:8000";

export async function createProfile(
  profileData
) {
  const response = await fetch(
    `${API_BASE_URL}/profile`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(profileData),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to create profile"
    );
  }

  return response.json();
}

export async function sendMessage(data) {
  const token = localStorage.getItem("token");

  const response = await fetch(
    `${API_BASE_URL}/chat`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    throw new Error(
      "Failed to send message"
    );
  }

  return response.json();
}
export const createChatSession = async (profileId) => {
  const res = await api.post("/chat-session", {
    profile_id: profileId,
  });

  return res.data;
};

export const getChatSessions = async (profileId) => {
  const res = await api.get(
    `/chat-sessions/${profileId}`
  );

  return res.data;
};

export const deleteChatSession = async (chatId) => {
  await api.delete(`/chat-session/${chatId}`);
};