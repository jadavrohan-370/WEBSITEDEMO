import React, { useState, useEffect } from "react";
import {
  Mail,
  Phone,
  Calendar,
  User,
  Search,
  Trash2,
  Reply,
  CheckCircle,
} from "lucide-react";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";
import { messageService } from "../services/apiClient";

const Messages = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const data = await messageService.getAll();
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
      toast.error("Failed to load messages");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  const handleSelect = async (msg) => {
    setSelectedMessage(msg);
    if (msg.status === "unread") {
      try {
        await messageService.markAsRead(msg._id);
        // Update local state
        setMessages(
          messages.map((m) =>
            m._id === msg._id ? { ...m, status: "read" } : m,
          ),
        );
      } catch (error) {
        console.error("Error marking message as read", error);
      }
    }
    setReplyText("");
  };

  const handleReply = async (e) => {
    if (e) e.preventDefault();
    if (!replyText.trim()) return;
    try {
      const data = await messageService.reply(selectedMessage._id, replyText);
      if (data.success) {
        toast.success(`Reply sent to ${selectedMessage.email}`);
        setReplyText("");
        // Update local state to show replied status
        setMessages(
          messages.map((m) =>
            m._id === selectedMessage._id ? { ...m, status: "replied" } : m,
          ),
        );
        setSelectedMessage({ ...selectedMessage, status: "replied" });
      }
    } catch (error) {
      console.error("Error sending reply:", error);
      toast.error("Failed to send reply");
    }
  };

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (window.confirm("Delete this message?")) {
      try {
        const data = await messageService.delete(id);
        if (data.success) {
          setMessages(messages.filter((m) => m._id !== id));
          if (selectedMessage && selectedMessage._id === id)
            setSelectedMessage(null);
          toast.info("Message deleted");
        }
      } catch (error) {
        console.error("Error deleting message:", error);
        toast.error("Failed to delete message");
      }
    }
  };

  const filteredMessages = messages.filter(
    (msg) =>
      msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      msg.message.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-slate-50/50">
      <Navbar title="Messages & Inquiries" />

      <div className="p-8 max-w-7xl mx-auto h-[calc(100vh-100px)]">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-100 h-full flex flex-col md:flex-row">
          {/* List */}
          <div
            className={`w-full md:w-1/3 border-r border-slate-100 flex flex-col ${selectedMessage ? "hidden md:flex" : "flex"}`}
          >
            <div className="p-4 border-b border-slate-100 bg-slate-50/50">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  className="w-full pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20"
                  placeholder="Search messages..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
            <div className="overflow-y-auto flex-1 p-2 space-y-2">
              {loading ? (
                Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="p-4 rounded-xl border border-slate-100 bg-white/50 animate-pulse"
                  >
                    <div className="h-4 bg-slate-200 rounded w-1/2 mb-2"></div>
                    <div className="h-3 bg-slate-100 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-slate-100 rounded w-1/4"></div>
                  </div>
                ))
              ) : filteredMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 text-slate-400 text-center px-4">
                  <Mail size={40} className="mb-2 opacity-20" />
                  <p className="text-sm">
                    {searchTerm
                      ? "No messages match your search"
                      : "No messages yet"}
                  </p>
                </div>
              ) : (
                filteredMessages.map((msg) => (
                  <div
                    key={msg._id}
                    onClick={() => handleSelect(msg)}
                    className={`p-4 rounded-xl cursor-pointer transition-all border border-transparent hover:bg-slate-50 group relative ${selectedMessage?._id === msg._id ? "bg-indigo-50 border-indigo-100 shadow-sm" : msg.status === "read" ? "opacity-75" : "bg-white shadow-sm border-slate-100"}`}
                  >
                    {msg.status === "unread" && (
                      <div className="absolute top-4 right-4 w-2 h-2 bg-indigo-500 rounded-full"></div>
                    )}
                    <div className="flex justify-between items-start mb-1">
                      <h4
                        className={`text-sm font-bold ${msg.status === "read" ? "text-slate-600" : "text-slate-900"}`}
                      >
                        {msg.name}
                      </h4>
                      <span className="text-xs text-slate-400 whitespace-nowrap">
                        {new Date(msg.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-sm font-medium text-slate-800 truncate mb-1">
                      {msg.subject}
                    </p>
                    <p className="text-xs text-slate-500 truncate">
                      {msg.message}
                    </p>

                    <button
                      onClick={(e) => handleDelete(msg._id, e)}
                      className="absolute bottom-2 right-2 p-1 text-slate-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity bg-white shadow-sm rounded-md"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Detail View */}
          <div
            className={`w-full md:w-2/3 flex flex-col ${selectedMessage ? "flex" : "hidden md:flex"}`}
          >
            {selectedMessage ? (
              <>
                <div className="p-6 border-b border-slate-100 flex justify-between items-start bg-slate-50/30">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <button
                        onClick={() => setSelectedMessage(null)}
                        className="md:hidden p-1 -ml-1 text-slate-400"
                      >
                        <Reply className="rotate-180" size={20} />
                      </button>
                      <h2 className="text-xl font-bold text-slate-800">
                        {selectedMessage.subject}
                      </h2>
                    </div>

                    <div className="flex items-center gap-6 text-sm text-slate-500">
                      <span className="flex items-center gap-2">
                        <User size={14} /> {selectedMessage.name}
                      </span>
                      <span className="flex items-center gap-2">
                        <Mail size={14} /> {selectedMessage.email}
                      </span>
                      <span className="flex items-center gap-2">
                        <Phone size={14} /> {selectedMessage.phone}
                      </span>
                      <span className="flex items-center gap-2">
                        <Calendar size={14} />{" "}
                        {new Date(
                          selectedMessage.createdAt,
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={(e) => handleDelete(selectedMessage._id, e)}
                      className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors border border-transparent hover:border-red-100"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>
                </div>

                <div className="flex-1 p-8 overflow-y-auto bg-slate-50/10">
                  <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-8 max-w-3xl">
                    <p className="text-slate-800 leading-relaxed whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>

                  {/* Reply Box */}
                  <form
                    onSubmit={handleReply}
                    className="mt-8 border-t border-slate-100 pt-8"
                  >
                    <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                      <Reply size={16} /> Reply to {selectedMessage.name}
                    </h3>
                    <div className="space-y-4">
                      <textarea
                        className="w-full p-4 bg-white border border-slate-200 rounded-2xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all shadow-sm"
                        rows="6"
                        placeholder="Type your reply here..."
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        required
                      ></textarea>
                      <div className="flex justify-end gap-3">
                        <button
                          type="submit"
                          className="bg-indigo-600 text-white px-8 py-3 rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-500/30 flex items-center gap-2 font-bold"
                        >
                          Send Reply <CheckCircle size={18} />
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </>
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-slate-300">
                <Mail size={64} className="mb-4 opacity-50" />
                <p className="text-lg font-medium">
                  Select a message to view details
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Messages;
