import React from "react";
import { useChat } from "../../hooks/useChat";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { toast } from "sonner";

// Icons
import {
  RiUserSettingsLine,
  RiAddLine,
  RiSendPlaneFill,
  RiLogoutBoxLine,
  RiRobot2Line,
  RiMenu3Line,
  RiFlashlightLine,
  RiCloseLine,
} from "@remixicon/react";

const Dashboard = () => {
  const {
    chatRef,
    conversations,
    messages,
    activeConversationId,
    status,
    aiMessageTitle,
    humanMessage,
    mobileOpen,
    startNewConversation,
    showAndStartConversation,
    logoutUser,
    sendMessageToNodeViaSocket,
    handleKeyDown,
    setHumanMessage,
    setMobileOpen,
    navigate,
  } = useChat();

  return (
    <div className="h-screen flex bg-[#050505] text-white font-['Gilroy']">
      {/* ── Mobile Top Bar ── */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-14 flex items-center justify-between px-4 border-b border-white/10 bg-[#0b0b0b] z-50">
        <RiMenu3Line onClick={() => setMobileOpen(true)} />
        <span className="font-semibold">Luminous AI</span>
        <RiFlashlightLine />
      </div>

      {/* ── Sidebar ── */}
      <aside
        className={`fixed md:static z-40 top-0 left-0 h-full w-[280px]
        bg-[#0b0b0b] border-r border-white/10 flex flex-col
        transition-transform duration-300
        ${mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        <div className="md:hidden p-4 flex justify-end">
          <RiCloseLine onClick={() => setMobileOpen(false)} />
        </div>

        <div className="p-5 flex-1 overflow-y-auto custom-scroll">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-yellow-500 flex items-center justify-center">
              <RiFlashlightLine />
            </div>
            <h1 className="text-lg font-semibold">Luminous AI</h1>
          </div>

          <button
            onClick={startNewConversation}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-orange-500 to-yellow-500 text-black font-semibold"
          >
            <RiAddLine className="inline mr-2" />
            New Chat
          </button>

          <div className="mt-6 space-y-2">
            {conversations.map((c) => (
              <div
                key={c._id}
                onClick={() => showAndStartConversation(c._id)}
                className={`p-2 rounded hover:bg-white/10 cursor-pointer ${
                  activeConversationId === c._id
                    ? "bg-white/10 border-l-2 border-orange-500"
                    : ""
                }`}
              >
                {c.title ? c.title : "New Chat"}
              </div>
            ))}
          </div>

          <p className="text-xs text-gray-500 mt-4">
            {aiMessageTitle ? aiMessageTitle : "New Chat"}
          </p>
        </div>

        <div className="p-4 border-t flex flex-col gap-y-2 border-white/10">
          <button
            onClick={() => navigate("/profile")}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-white/10 mt-3"
          >
            <RiUserSettingsLine />
            Manage Profile
          </button>
          <button
            onClick={logoutUser}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-red-500/20 hover:bg-red-500/30"
          >
            <RiLogoutBoxLine />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Main Chat Area ── */}
      <main className="flex-1 flex flex-col md:ml-0 pt-14 md:pt-0">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 md:px-8 py-10 custom-scroll bg-[#050505]">
          <div className="max-w-4xl mx-auto space-y-8">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex ${
                  msg.type === "human" ? "justify-end" : "justify-start"
                } mb-4`}
              >
                {msg.type === "human" ? (
                  <div className="max-w-[85%] md:max-w-[70%] bg-[#1a1a1a] border border-white/5 px-5 py-3 rounded-2xl rounded-tr-sm text-gray-200 shadow-lg">
                    <p className="leading-relaxed">{msg.text}</p>
                  </div>
                ) : (
                  <div className="flex gap-4 w-full flex-col max-w-[90%] group">
                    <div className="flex gap-x-3">
                      <div className="flex-shrink-0">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-orange-600 to-yellow-500 flex items-center justify-center shadow-orange-500/20 shadow-lg">
                          <RiRobot2Line size={20} className="text-black" />
                        </div>
                      </div>

                      <div className="flex-1 px-5 py-0 rounded-2xl rounded-tl-sm shadow-xl overflow-hidden">
                        <div className="max-w-none text-gray-300 text-[15px] leading-8">
                          <Markdown
                            remarkPlugins={[remarkGfm]}
                            components={{
                              h1: ({ node, ...props }) => (
                                <h1
                                  className="text-2xl font-bold mt-6 mb-4 text-white"
                                  {...props}
                                />
                              ),
                              h2: ({ node, ...props }) => (
                                <h2
                                  className="text-xl font-semibold mt-5 mb-3 text-white"
                                  {...props}
                                />
                              ),
                              h3: ({ node, ...props }) => (
                                <h3
                                  className="text-lg font-semibold mt-4 mb-2 text-white"
                                  {...props}
                                />
                              ),
                              p: ({ node, ...props }) => (
                                <p
                                  className="mb-4 leading-8 text-gray-300"
                                  {...props}
                                />
                              ),
                              ul: ({ node, ...props }) => (
                                <ul
                                  className="list-disc pl-6 mb-4 space-y-2"
                                  {...props}
                                />
                              ),
                              ol: ({ node, ...props }) => (
                                <ol
                                  className="list-decimal pl-6 mb-4 space-y-2"
                                  {...props}
                                />
                              ),
                              li: ({ node, ...props }) => (
                                <li className="leading-8" {...props} />
                              ),
                              strong: ({ node, ...props }) => (
                                <strong
                                  className="text-white font-semibold"
                                  {...props}
                                />
                              ),
                              blockquote: ({ node, ...props }) => (
                                <blockquote
                                  className="border-l-4 border-orange-500 pl-4 italic my-4 text-gray-400"
                                  {...props}
                                />
                              ),
                              code({
                                node,
                                inline,
                                className,
                                children,
                                ...props
                              }) {
                                const match = /language-(\w+)/.exec(
                                  className || ""
                                );
                                const codeContent = String(children).replace(
                                  /\n$/,
                                  ""
                                );

                                return !inline && match ? (
                                  <div className="relative my-6 group rounded-xl overflow-hidden border border-white/10 shadow-2xl">
                                    <div className="flex items-center justify-between px-4 py-2 bg-[#1e1e1e] border-b border-white/5">
                                      <span className="text-[10px] uppercase tracking-widest text-gray-400 font-bold">
                                        {match[1]}
                                      </span>
                                      <div className="flex gap-3">
                                        {(match[1] === "html" ||
                                          match[1] === "javascript" ||
                                          match[1] === "jsx") && (
                                          <button
                                            onClick={() =>
                                              handleLivePreview(
                                                codeContent,
                                                match[1]
                                              )
                                            }
                                            className="text-[10px] text-orange-400 hover:text-orange-300 font-bold"
                                          >
                                            LIVE PREVIEW
                                          </button>
                                        )}
                                        <button
                                          onClick={() => {
                                            navigator.clipboard.writeText(
                                              codeContent
                                            );
                                            toast.success("Code copied!");
                                          }}
                                          className="text-[10px] text-gray-400 hover:text-white"
                                        >
                                          COPY
                                        </button>
                                      </div>
                                    </div>

                                    <SyntaxHighlighter
                                      className="code-scrollbar"
                                      style={vscDarkPlus}
                                      language={match[1]}
                                      PreTag="div"
                                      customStyle={{
                                        margin: 0,
                                        padding: "1.5rem",
                                        fontSize: "13px",
                                        backgroundColor: "#0d0d0d",
                                      }}
                                      {...props}
                                    >
                                      {codeContent}
                                    </SyntaxHighlighter>
                                  </div>
                                ) : (
                                  <code
                                    className="bg-white/10 px-1.5 py-0.5 rounded text-orange-400 font-mono text-sm"
                                    {...props}
                                  >
                                    {children}
                                  </code>
                                );
                              },
                            }}
                          >
                            {msg.text}
                          </Markdown>
                        </div>
                      </div>
                    </div>

                    {/* Sources */}
                    {msg.sources && msg.sources.length > 0 && (
                      <div className="mt-6 pt-4 border-t border-white/5">
                        <p className="text-[10px] text-orange-500 uppercase font-bold mb-3 tracking-widest">
                          Verified Sources
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {msg.sources.map((src, idx) => (
                            <a
                              key={idx}
                              href={src.url}
                              target="_blank"
                              rel="noreferrer"
                              className="flex flex-col gap-1 p-3 rounded-xl bg-white/5 border border-white/10 hover:border-orange-500/50 hover:bg-orange-500/5 transition-all group"
                            >
                              <span className="text-[10px] text-gray-500 group-hover:text-orange-400">
                                {new URL(src.url).hostname}
                              </span>
                              <h4 className="text-sm font-semibold text-gray-200 line-clamp-1">
                                {src.title}
                              </h4>
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))}

            {/* Thinking Indicator */}
            {status && (
              <div className="flex gap-4 items-center animate-pulse pl-2">
                <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center">
                  <RiFlashlightLine size={18} className="text-orange-500" />
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] uppercase tracking-tighter text-orange-500 font-bold">
                    Luminous Engine
                  </span>
                  <p className="text-sm text-gray-500 italic">{status}...</p>
                </div>
              </div>
            )}
            <div ref={chatRef} className="h-10" />
          </div>
        </div>

        {/* Input */}
        <div className="p-4 border-t border-white/10">
          <div className="max-w-3xl mx-auto flex items-center gap-3 bg-white/5 border border-white/10 rounded-full px-5 py-3">
            <input
              value={humanMessage}
              onChange={(e) => setHumanMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Type your message..."
              className="flex-1 bg-transparent outline-none"
            />
            <button
              onClick={sendMessageToNodeViaSocket}
              className="w-10 h-10 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500 flex items-center justify-center"
            >
              <RiSendPlaneFill />
            </button>
          </div>
        </div>
      </main>

      {/* Mobile Backdrop */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/60 md:hidden"
        />
      )}

      {/* Styles */}
      <style>{`
        .custom-scroll::-webkit-scrollbar { width: 6px; }
        .custom-scroll::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.1); border-radius: 10px; }
        .code-scrollbar::-webkit-scrollbar { height: 8px; }
        .code-scrollbar::-webkit-scrollbar-track { background: #111; border-radius: 10px; }
        .code-scrollbar::-webkit-scrollbar-thumb { background: linear-gradient(to right, #f97316, #eab308); border-radius: 10px; }
        .code-scrollbar::-webkit-scrollbar-thumb:hover { background: linear-gradient(to right, #fb923c, #facc15); }
      `}</style>
    </div>
  );
};

export default Dashboard;