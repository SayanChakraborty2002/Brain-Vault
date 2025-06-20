import { useEffect, useState } from "react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { ComponentModal } from "../components/ui/ComponentModal";
import { PlusIcon } from "../icons/Plusicon";
import { ShareIcon } from "../icons/ShareIcon";
import { SideBar } from "../components/ui/Sidebar";
import { InputBox } from "../components/ui/Input";
import { SearchIcon } from "../icons/Search";
import { URL } from "../config";
import axios from "axios";

export function DashBoard() {
  const [isShareEnable, setIsShareEnable] = useState(false);
  const [link, setLink] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [content, setContent] = useState<any[]>([]);
  const [error, setError] = useState("");
  const [showShareBox, setShowShareBox] = useState(false);

  // RAG search state
  const [queryText, setQueryText] = useState("");
  const [ragResults, setRagResults] = useState<any[]>([]);
  const [aiAnswer, setAiAnswer] = useState("");
  const [searchError, setSearchError] = useState("");
  const [loadingRag, setLoadingRag] = useState(false);
  const [showAiModal, setShowAiModal] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { role: "user" | "assistant"; content: string }[]
  >([]);
  const [isAiTyping, setIsAiTyping] = useState(false);

  const [filterType, setFilterType] = useState("all"); // ✅ NEW

  const filteredContent = content.filter((item) => {
    if (filterType === "all") return true;
    if (filterType === "others") {
      return !["youtube", "twitter", "linkedin", "note", "article"].includes(
        item.type
      );
    }
    if (filterType === "note") {
      return item.type === "note" || item.type === "article";
    }
    return item.type === filterType;
  });

  const fetchContent = () => {
    setError("");
    axios
      .get(`${URL}/content/getcontent`, {
        headers: {
          Authorization: localStorage.getItem("Authorization"),
        },
      })
      .then((response) => {
        const data = response.data.content;
        setContent(data);
      })
      .catch((e: any) => {
        if (e.response?.data?.message) {
          setError(e.response?.data?.message);
        } else {
          setError("Internal server Error");
        }
      });
  };
  useEffect(() => {
    fetchContent();
    fetchShareStatus();
  }, []);

  async function deleteItem(itemId: String) {
    setError("");
    try {
      const response = await axios.delete(`${URL}/content/deletecontent`, {
        data: {
          contentId: itemId,
        },
        headers: {
          Authorization: localStorage.getItem("Authorization"),
        },
      });
      if (response.status === 200) {
        setContent((prevContent) =>
          prevContent.filter((item) => item._id !== itemId)
        );
        setError("");
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Failed to delete content.");
      }
    }
  }

  async function handleShare() {
    setError("");
    if (isShareEnable === false) {
      try {
        const response = await axios.post(
          `${URL}/sharebrain/share`,
          {
            share: !isShareEnable,
          },
          {
            headers: {
              Authorization: localStorage.getItem("Authorization"),
            },
          }
        );
        if (response.status === 200) {
          setIsShareEnable(!isShareEnable);
          setLink(response.data.link || "");
        }
      } catch (err: any) {
        if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError("Failed to enable Share.");
        }
      }
    } else {
      try {
        const response = await axios.post(
          `${URL}/sharebrain/share`,
          {
            share: !isShareEnable,
          },
          {
            headers: {
              Authorization: localStorage.getItem("Authorization"),
            },
          }
        );
        if (response.status === 200) {
          setIsShareEnable(false);
          setLink("");
        }
      } catch (err: any) {
        if (err.response?.data?.message) {
          setError(err.response.data.message);
        } else {
          setError("Failed to enable Share.");
        }
      }
    }
  }

  async function fetchShareStatus() {
    setError("");
    try {
      const response = await axios.get(
        `${URL}/sharebrain/get/usersharestatus`,
        {
          headers: {
            Authorization: localStorage.getItem("Authorization"),
          },
        }
      );
      if (response.status === 200) {
        setIsShareEnable(response.data.isShareEnable);
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        console.log(err);
        setError("User not found");
      }
    }
  }
  async function getLink() {
    setError("");

    try {
      const hash = link.split("/").pop(); // get only the hash part
      console.log(hash);
      const response = await axios.get(`${URL}/sharebrain/${hash}`);
      if (response.status === 200) {
        console.log("Shared content:", response.data);
        setShowShareBox(true);
      }
    } catch (err: any) {
      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        console.log(err);
        setError("Failed to fetch shared content.");
      }
    }
  }

  function copyToClipboard(text: string) {
    navigator.clipboard.writeText(text).then(() => {
      alert("Link copied to clipboard!");
    });
  }

  async function handleRagSearch() {
    setSearchError("");
    setLoadingRag(true);
    setAiAnswer("");
    setRagResults([]);
    setChatHistory([]);

    if (!queryText.trim()) {
      setSearchError("Please enter something to search.");
      setLoadingRag(false);
      return;
    }

    try {
      const response = await axios.post(
        `${URL}/content/ragsearch`,
        { queryText },
        {
          headers: {
            Authorization: localStorage.getItem("Authorization"),
          },
        }
      );

      if (response.status === 200) {
        const aiInitial = response.data.answer || "No answer generated.";
        setRagResults(response.data.results || []);
        setChatHistory([
          { role: "user", content: queryText },
          { role: "assistant", content: aiInitial },
        ]);
        setShowAiModal(true); // Open the popup
      }
    } catch (err: any) {
      setSearchError(
        err.response?.data?.message || "Failed to perform smart search."
      );
    } finally {
      setLoadingRag(false);
    }
  }

  async function sendChatMessage() {
    if (!chatInput.trim()) return;

    const newUserMsg = { role: "user" as const, content: chatInput };
    const updatedChat = [...chatHistory, newUserMsg];
    setChatHistory(updatedChat);
    setChatInput("");
    setIsAiTyping(true);

    try {
      const context = ragResults
        .map(
          (meta) => `Title: ${meta.title}
Type: ${meta.type}
Link: ${meta.link}
Tags: ${Array.isArray(meta.tag) ? meta.tag.join(", ") : ""}
Description: ${meta.description || "No description"}`
        )
        .join("\n---\n");

      const fullConversation = updatedChat
        .map((m) => `${m.role === "user" ? "User" : "AI"}: ${m.content}`)
        .join("\n");

      const prompt = `
Use the following saved content:

${context}

Conversation so far:
${fullConversation}

Respond to the latest user message.
    `.trim();

      console.log("🟦 Prompt sent to /groqchat:\n", prompt);

      const response = await axios.post(`${URL}/groqchat`, { prompt });

      console.log("🟩 Response from Groq API:", response.data);

      const aiReply = response.data?.answer;

      if (!aiReply || typeof aiReply !== "string") {
        throw new Error("Groq returned no valid answer");
      }

      setChatHistory((prev) => [
        ...prev,
        { role: "assistant", content: aiReply },
      ]);
    } catch (err: any) {
      console.error("Chat error (frontend):", err);
      setChatHistory((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            " AI failed to respond.\n" +
            (err?.response?.data?.message || err.message || "Unknown error"),
        },
      ]);
    } finally {
      setIsAiTyping(false);
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <div className="sticky top-0 z-50 flex flex-col md:flex-row gap-2 md:gap-0 justify-between items-center p-2 bg-blue-600 shadow">
        <div className="flex items-center font-extrabold text-blue-300 font-mono text-2xl gap-1">
          <a href="/home" className=" flex gap-3">
            <img
              className="ml-4 max-w-10"
              src="/logo/brainLogo.png"
              alt="brain logo"
            />
            Brain Vault
          </a>
        </div>
        <div className="flex w-full md:w-auto items-center gap-2">
          <div className="flex-1 min-w-0">
            {" "}
            {/* Allows input to shrink */}
            <InputBox
              placeHolder="Ask something..."
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              className="w-full" // Ensures input takes available space
            />
          </div>
          <div className="mt-3"><Button
            variant="secondary"
            size="md" // Changed to sm for mobile
            onClick={handleRagSearch}
            startIcon={<SearchIcon />}
            title="search" // Remove text on small screens
            className="shrink-0" // Prevents button from shrinking
          /></div>
        </div>
        <div className="flex gap-1 sm:gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={handleShare}
            title={isShareEnable ? "Disable Share" : "Enable Share"}
          />
          <Button
            variant="secondary"
            size="sm"
            onClick={getLink}
            title="Share Brain"
            disabled={!isShareEnable}
            startIcon={<ShareIcon />}
          />
          <Button
            variant="secondary"
            size="md"
            onClick={() => setModalOpen(true)}
            title="Add Content"
            startIcon={<PlusIcon />}
          />
        </div>
      </div>

      <div className="flex flex-1">
        <SideBar setFilter={setFilterType} />
        <div className="bg-gray-200 flex-1 md:ml-64 p-4">
          <h1 className="font-semibold text-2xl pb-5">All Notes</h1>

          <ComponentModal
            onContentAdd={fetchContent}
            open={modalOpen}
            onClose={() => setModalOpen(false)}
          />

          {showAiModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-lg shadow-lg w-[95%] md:w-[50%] max-h-[90%] flex flex-col overflow-hidden">
                <div className="flex justify-between items-center p-4 border-b">
                  <h2 className="text-xl font-bold text-blue-700">
                    AI Assistant
                  </h2>
                  <button
                    onClick={() => setShowAiModal(false)}
                    className="text-gray-500 hover:text-red-600 text-lg font-bold"
                  >
                    ✕
                  </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                  {chatHistory.map((msg, i) => (
                    <div
                      key={i}
                      className={`p-2 rounded-md max-w-[80%] ${
                        msg.role === "user"
                          ? "bg-blue-100 self-end ml-auto"
                          : "bg-gray-200 self-start mr-auto"
                      }`}
                    >
                      {msg.content}
                    </div>
                  ))}
                  {isAiTyping && (
                    <div className="text-gray-400 italic">AI is typing...</div>
                  )}
                </div>

                <div className="p-4 border-t flex gap-2">
                  <input
                    type="text"
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-1 p-2 border border-gray-300 rounded-md"
                    placeholder="Type your message..."
                    onKeyDown={(e) => e.key === "Enter" && sendChatMessage()}
                  />
                  <Button
                    variant="secondary"
                    title="Send"
                    size="sm"
                    onClick={sendChatMessage}
                  />
                </div>
              </div>
            </div>
          )}

          {showShareBox && (
            <div className="absolute right-10 top-20 bg-white border border-gray-300 shadow-lg p-4 rounded-md z-50 w-96">
              <p className="text-blue-500 text-base font-semibold hover:underline">
                {link}
              </p>
              <div className="flex mt-2 gap-2">
                <Button
                  onClick={() => copyToClipboard(link)}
                  size="sm"
                  variant="primary"
                  title="Copy"
                />
                <Button
                  onClick={() => setShowShareBox(false)}
                  size="sm"
                  variant="secondary"
                  title="Close"
                />
              </div>
            </div>
          )}

          {/* AI Answer */}
          {loadingRag && (
            <div className="text-blue-600 mb-4">Searching with AI...</div>
          )}

          {aiAnswer && (
            <div className="bg-white p-4 rounded-md shadow mb-6">
              <h2 className="text-xl font-bold text-blue-700 mb-2">
                AI Answer:
              </h2>
              <p className="text-gray-800 whitespace-pre-line">{aiAnswer}</p>
            </div>
          )}

          {/*  RAG Results */}
          {ragResults.length > 0 && (
            <div className="mb-6">
              <h2 className="text-xl font-bold text-blue-700 mb-2">
                Matched Notes:
              </h2>
              <div className="flex flex-wrap gap-4 items-start max-w-72">
                {ragResults.map((item, i) => (
                  <Card
                    key={i}
                    title={item.title}
                    link={item.link}
                    type={item.type}
                    description={item.description}
                    tags={item.tag}
                  />
                ))}
              </div>

              <div className="mt-4">
                <Button
                  variant="secondary"
                  size="sm"
                  title="Clear Results"
                  onClick={() => {
                    setRagResults([]);
                    setAiAnswer("");
                    setQueryText("");
                  }}
                />
              </div>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredContent && filteredContent.length > 0 ? (
              filteredContent.map((item) => (
                <div key={item._id} className="relative">
                  <Card
                    deleteItem={() => void deleteItem(item._id)}
                    title={item.title}
                    link={item.link}
                    type={item.type}
                    description={item.description}
                    tags={item.tag}
                  />
                </div>
              ))
            ) : (
              <div className="text-gray-600 text-lg">
                No content found for{" "}
                <span className="font-semibold">{filterType}</span>.
              </div>
            )}
          </div>

          {/*  Errors */}
          {error && <div className="text-red-500 text-base">{error}</div>}
          {searchError && (
            <div className="text-red-500 text-base">{searchError}</div>
          )}
        </div>
      </div>
    </div>
  );
}
