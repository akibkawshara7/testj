const fs = require('fs');

const componentCode = `import React, { useState, useEffect, useMemo } from "react";
import {
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Reply,
  Trash2,
  Edit3,
  Eye,
  EyeOff,
  Send,
  AlertCircle,
  Clock,
  Sparkles,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import { useAuth } from "@/lib/auth";
import { UserAvatar } from "./UserAvatar";
import { SharedSelect } from "@/components/SharedSelect";
import { toast } from "sonner";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";

export interface CommentUser {
  id: string;
  username: string;
  avatarUrl: string;
  frameUrl?: string;
}

export interface CommentReply {
  id: string;
  userId: string;
  replyToUserName?: string;
  replyToId?: string;
  text: string;
  isSpoiler?: boolean;
  isEdited?: boolean;
  createdAt: number;
  likes: string[];
  dislikes: string[];
  author?: CommentUser;
}

export interface CommentItem {
  id: string;
  userId: string;
  epNum?: number;
  text: string;
  isSpoiler?: boolean;
  isEdited?: boolean;
  createdAt: number;
  likes: string[];
  dislikes: string[];
  replies: CommentReply[];
  author?: CommentUser;
  isDeleted?: boolean;
}

export interface CommentsSectionProps {
  mediaId: number | string;
  mediaType?: "anime" | "manga";
  currentEp?: number;
  currentCh?: number;
  title?: string;
}

function timeAgo(timestamp: number): string {
  if (!timestamp) return "just now";
  const now = Date.now();
  const diff = Math.max(0, now - timestamp);
  const seconds = Math.floor(diff / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  if (months < 12) return `${months}mo ago`;
  const years = Math.floor(months / 12);
  return `${years}y ago`;
}

export function CommentsSection({
  mediaId,
  mediaType = "anime",
  currentEp,
  currentCh,
  title,
}: CommentsSectionProps) {
  const { user, token, isAuthenticated, openAuthModal } = useAuth();
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<"top" | "newest" | "oldest">("top");

  // New comment state
  const [newCommentText, setNewCommentText] = useState("");
  const [isSpoiler, setIsSpoiler] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Active reply state
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [replyIsSpoiler, setReplyIsSpoiler] = useState(false);
  const [isSubmittingReply, setIsSubmittingReply] = useState(false);

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editText, setEditText] = useState("");
  const [editIsSpoiler, setEditIsSpoiler] = useState(false);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);

  // Revealed spoilers
  const [revealedSpoilers, setRevealedSpoilers] = useState<Record<string, boolean>>({});

  // Collapsed comment threads
  const [collapsedThreads, setCollapsedThreads] = useState<Record<string, boolean>>({});

  const epOrChNum = currentEp || currentCh;

  // Fetch comments
  const fetchComments = async () => {
    try {
      setIsLoading(true);
      const url = `/api/comments?id=${encodeURIComponent(String(mediaId))}${
        epOrChNum ? `&ep=${epOrChNum}` : ""
      }`;
      const res = await fetch(url);
      const data = await res.json();
      if (res.ok && Array.isArray(data.comments)) {
        setComments(data.comments);
      }
    } catch (e) {
      console.error("Failed to load comments:", e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (mediaId) {
      fetchComments();
    }
  }, [mediaId, epOrChNum]);

  // Post top-level comment
  const handlePostComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isAuthenticated || !token) {
      openAuthModal("signin");
      return;
    }

    const trimmed = newCommentText.trim();
    if (!trimmed) return;

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/comments/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mediaId: String(mediaId),
          epNum: epOrChNum,
          text: trimmed,
          isSpoiler,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        if (Array.isArray(data.comments)) {
          setComments(data.comments);
        } else if (data.comment) {
          setComments((prev) => [data.comment, ...prev]);
        }
        setNewCommentText("");
        setIsSpoiler(false);
        toast.success("Comment posted!");
      } else {
        toast.error(data.error || "Failed to post comment");
      }
    } catch (e) {
      toast.error("Failed to post comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Post reply to top-level comment
  const handlePostReply = async (parentCommentId: string) => {
    if (!isAuthenticated || !token) {
      openAuthModal("signin");
      return;
    }

    const trimmed = replyText.trim();
    if (!trimmed) return;

    setIsSubmittingReply(true);
    try {
      const res = await fetch("/api/comments/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mediaId: String(mediaId),
          parentId: parentCommentId,
          parentCommentId,
          text: trimmed,
          isSpoiler: replyIsSpoiler,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        if (Array.isArray(data.comments)) {
          setComments(data.comments);
        } else if (data.reply) {
          setComments((prev) =>
            prev.map((c) => {
              if (c.id === parentCommentId) {
                return {
                  ...c,
                  replies: [...(c.replies || []), data.reply],
                };
              }
              return c;
            })
          );
        }
        setReplyingToId(null);
        setReplyText("");
        setReplyIsSpoiler(false);
        setCollapsedThreads((prev) => ({ ...prev, [parentCommentId]: false }));
        toast.success("Reply posted!");
      } else {
        toast.error(data.error || "Failed to post reply");
      }
    } catch (e) {
      toast.error("Failed to post reply");
    } finally {
      setIsSubmittingReply(false);
    }
  };

  // React (Like / Dislike)
  const handleReact = async (commentId: string, reactionType: "like" | "dislike", replyId?: string) => {
    if (!isAuthenticated || !token) {
      openAuthModal("signin");
      return;
    }

    // Optimistic UI update
    setComments((prev) =>
      prev.map((c) => {
        if (replyId && c.replies) {
          const updatedReplies = c.replies.map((r) => {
            if (r.id === replyId) {
              const myId = user?.id || "";
              let likes = [...(r.likes || [])];
              let dislikes = [...(r.dislikes || [])];
              if (reactionType === "like") {
                if (likes.includes(myId)) {
                  likes = likes.filter((id) => id !== myId);
                } else {
                  likes.push(myId);
                  dislikes = dislikes.filter((id) => id !== myId);
                }
              } else {
                if (dislikes.includes(myId)) {
                  dislikes = dislikes.filter((id) => id !== myId);
                } else {
                  dislikes.push(myId);
                  likes = likes.filter((id) => id !== myId);
                }
              }
              return { ...r, likes, dislikes };
            }
            return r;
          });
          return { ...c, replies: updatedReplies };
        } else if (c.id === commentId) {
          const myId = user?.id || "";
          let likes = [...(c.likes || [])];
          let dislikes = [...(c.dislikes || [])];
          if (reactionType === "like") {
            if (likes.includes(myId)) {
              likes = likes.filter((id) => id !== myId);
            } else {
              likes.push(myId);
              dislikes = dislikes.filter((id) => id !== myId);
            }
          } else {
            if (dislikes.includes(myId)) {
              dislikes = dislikes.filter((id) => id !== myId);
            } else {
              dislikes.push(myId);
              likes = likes.filter((id) => id !== myId);
            }
          }
          return { ...c, likes, dislikes };
        }
        return c;
      })
    );

    try {
      await fetch("/api/comments/react", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mediaId: String(mediaId),
          commentId,
          replyId,
          reaction: reactionType,
          type: reactionType,
        }),
      });
    } catch (e) {
      console.error("React error:", e);
    }
  };

  // Delete Comment or Reply
  const handleDelete = async (commentId: string, replyId?: string) => {
    if (!isAuthenticated || !token) return;

    // Optimistic deletion
    if (replyId) {
      setComments((prev) =>
        prev.map((c) => {
          if (c.id === commentId && c.replies) {
            return { ...c, replies: c.replies.filter((r) => r.id !== replyId) };
          }
          return c;
        })
      );
    } else {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    }

    try {
      const res = await fetch("/api/comments/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mediaId: String(mediaId),
          commentId,
          replyId,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        if (Array.isArray(data.comments)) {
          setComments(data.comments);
        }
        toast.success("Comment deleted");
      } else {
        toast.error(data.error || "Failed to delete comment");
        fetchComments();
      }
    } catch (e) {
      toast.error("Failed to delete comment");
      fetchComments();
    }
  };

  // Edit Comment or Reply
  const handleSaveEdit = async (commentId: string, replyId?: string) => {
    if (!isAuthenticated || !token) return;
    const trimmed = editText.trim();
    if (!trimmed) return;

    setIsSubmittingEdit(true);
    try {
      const res = await fetch("/api/comments/edit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          mediaId: String(mediaId),
          commentId,
          replyId,
          text: trimmed,
          isSpoiler: editIsSpoiler,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        if (Array.isArray(data.comments)) {
          setComments(data.comments);
        }
        setEditingId(null);
        setEditText("");
        toast.success("Comment updated");
      } else {
        toast.error(data.error || "Failed to edit comment");
      }
    } catch (e) {
      toast.error("Failed to edit comment");
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const toggleSpoiler = (id: string) => {
    setRevealedSpoilers((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const toggleCollapse = (commentId: string) => {
    setCollapsedThreads((prev) => ({
      ...prev,
      [commentId]: !prev[commentId],
    }));
  };

  // Sort comments
  const sortedComments = useMemo(() => {
    const list = [...comments];
    if (sortBy === "newest") {
      list.sort((a, b) => b.createdAt - a.createdAt);
    } else if (sortBy === "oldest") {
      list.sort((a, b) => a.createdAt - b.createdAt);
    } else {
      // "top"
      list.sort((a, b) => {
        const scoreA = (a.likes?.length || 0) - (a.dislikes?.length || 0);
        const scoreB = (b.likes?.length || 0) - (b.dislikes?.length || 0);
        return scoreB - scoreA;
      });
    }
    return list;
  }, [comments, sortBy]);

  const totalCommentsCount = useMemo(() => {
    return comments.reduce(
      (acc, c) => acc + (c.isDeleted ? 0 : 1) + (c.replies?.filter((r) => !r.isDeleted).length || 0),
      0
    );
  }, [comments]);

  return (
    <section className="mt-8 border-t border-white/10 pt-6 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <MessageSquare className="size-5 text-[var(--brand,#df7426)]" />
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <span>Discussion</span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-white/10 text-white/70">
                {totalCommentsCount}
              </span>
            </h2>
          </div>
        </div>

        {/* Sort Controls */}
        <div className="w-[130px]">
          <SharedSelect
            value={sortBy}
            onChange={(v) => setSortBy(v as any)}
            options={[
              { value: "top", display: "Top" },
              { value: "newest", display: "Newest" },
              { value: "oldest", display: "Oldest" },
            ]}
          />
        </div>
      </div>

      {/* Main Comment Input Box */}
      <form onSubmit={handlePostComment} className="flex gap-3 relative">
        <div className="shrink-0 pt-1">
          <UserAvatar
            avatarUrl={user?.avatarUrl}
            frameUrl={user?.frameUrl}
            username={user?.username || "Guest"}
            size="md"
          />
        </div>

        <div className="flex-1 bg-[#101010] border border-white/10 rounded-2xl p-3 focus-within:border-white/25 transition">
          <textarea
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            placeholder={
              isAuthenticated
                ? epOrChNum
                  ? \`Add a comment for episode \${epOrChNum}...\`
                  : "Share your thoughts or theories on this show..."
                : "Sign in to join the conversation..."
            }
            disabled={!isAuthenticated || isSubmitting}
            rows={2}
            className="w-full bg-transparent text-sm text-white placeholder-white/40 focus:outline-none resize-none disabled:opacity-50"
          />

          <div className="flex items-center justify-between pt-2 border-t border-white/5 mt-1">
            <button
              type="button"
              onClick={() => setIsSpoiler(!isSpoiler)}
              disabled={!isAuthenticated}
              className={cn(
                "flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg border transition select-none cursor-pointer",
                isSpoiler
                  ? "border-amber-500/40 bg-amber-500/10 text-amber-400 font-medium"
                  : "border-white/10 text-white/50 hover:text-white/80 hover:border-white/20"
              )}
            >
              {isSpoiler ? <EyeOff className="size-3.5" /> : <Eye className="size-3.5" />}
              <span>{isSpoiler ? "Spoiler Marked" : "Spoiler"}</span>
            </button>

            {isAuthenticated ? (
              <button
                type="submit"
                disabled={!newCommentText.trim() || isSubmitting}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-black bg-white hover:bg-zinc-200 disabled:opacity-40 disabled:hover:bg-white transition cursor-pointer"
              >
                <Send className="size-3.5" />
                <span>{isSubmitting ? "Posting..." : "Comment"}</span>
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-white/40 hidden sm:inline">Sign in to comment</span>
                <button
                  type="button"
                  onClick={() => openAuthModal("signin")}
                  className="rounded-xl bg-white px-4 py-1.5 text-xs font-bold text-black hover:bg-zinc-200 transition cursor-pointer"
                >
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      </form>

      {/* Comment List */}
      <div className="space-y-4 pt-2">
        {isLoading ? (
          <div className="space-y-4 py-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3 animate-pulse">
                <div className="size-10 rounded-full bg-white/10 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-32 rounded bg-white/10" />
                  <div className="h-12 w-full rounded bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        ) : sortedComments.length === 0 ? (
          <div className="py-12 flex flex-col items-center justify-center text-center">
            <div className="size-14 rounded-2xl bg-white/5 ring-1 ring-white/10 grid place-items-center text-white/30 mb-3">
              <MessageSquare className="size-7" />
            </div>
            <p className="text-sm font-bold text-white/70">No comments yet</p>
            <p className="text-xs text-white/40 mt-1 max-w-xs">
              Be the first to share your thoughts, theories, or favorite moments!
            </p>
          </div>
        ) : (
          sortedComments.map((comment) => {
            const isAuthor = user?.id && String(user.id) === String(comment.userId);
            const hasReplies = comment.replies && comment.replies.length > 0;
            const isCollapsed = collapsedThreads[comment.id];
            const isEditingThis = editingId === comment.id;
            const isSpoilerHidden = comment.isSpoiler && !revealedSpoilers[comment.id];
            const hasLiked = user?.id ? comment.likes?.includes(user.id) : false;
            const hasDisliked = user?.id ? comment.dislikes?.includes(user.id) : false;

            return (
              <div key={comment.id} className="relative group/comment">
                {/* Main Comment Row */}
                <div className="flex gap-3 relative">
                  {/* Left Column: Avatar */}
                  <div className="shrink-0 pt-0.5">
                    <UserAvatar
                      avatarUrl={comment.author?.avatarUrl}
                      frameUrl={comment.author?.frameUrl}
                      username={comment.author?.username}
                      size="md"
                    />
                  </div>

                  {/* Right Column: Comment Content */}
                  <div className="flex-1 pb-1 overflow-hidden">
                    {/* Author Meta */}
                    <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-white">
                          {comment.author?.username || "User"}
                        </span>
                        <span className="text-[11px] text-white/40 flex items-center gap-1">
                          <Clock className="size-3" />
                          {timeAgo(comment.createdAt)}
                        </span>
                        {comment.isEdited && (
                          <span className="text-[10px] text-white/30 italic">(edited)</span>
                        )}
                      </div>

                      {/* Author action menu */}
                      {isAuthor && !isEditingThis && (
                        <div className="flex items-center gap-1 opacity-80 group-hover/comment:opacity-100 transition">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(comment.id);
                              setEditText(comment.text);
                              setEditIsSpoiler(Boolean(comment.isSpoiler));
                            }}
                            className="p-1 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition cursor-pointer"
                            title="Edit comment"
                          >
                            <Edit3 className="size-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(comment.id)}
                            className="p-1 rounded-md text-rose-400/60 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                            title="Delete comment"
                          >
                            <Trash2 className="size-3.5" />
                          </button>
                        </div>
                      )}
                    </div>

                    {/* Edit Form or Comment Body */}
                    {isEditingThis ? (
                      <div className="space-y-2 mt-2 bg-[#0a0a0a] p-3 rounded-2xl border border-white/10">
                        <textarea
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                          rows={2}
                          className="w-full rounded-xl bg-transparent text-sm text-white focus:outline-none resize-none"
                        />
                        <div className="flex items-center justify-between pt-1 border-t border-white/10">
                          <button
                            type="button"
                            onClick={() => setEditIsSpoiler(!editIsSpoiler)}
                            className={cn(
                              "text-xs px-2.5 py-1 rounded-lg border transition",
                              editIsSpoiler
                                ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
                                : "border-white/10 text-white/50"
                            )}
                          >
                            {editIsSpoiler ? "Spoiler" : "No Spoiler"}
                          </button>
                          <div className="flex gap-2">
                            <button
                              type="button"
                              onClick={() => setEditingId(null)}
                              className="px-3 py-1 rounded-lg text-xs font-semibold text-white/60 hover:text-white bg-white/5"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handleSaveEdit(comment.id)}
                              disabled={isSubmittingEdit}
                              className="px-3 py-1 rounded-lg text-xs font-bold text-white bg-[var(--brand,#df7426)]"
                            >
                              Save
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <>
                        {/* Text / Spoiler content */}
                        {isSpoilerHidden ? (
                          <div
                            onClick={() => toggleSpoiler(comment.id)}
                            className="my-1.5 p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-medium cursor-pointer hover:bg-amber-500/15 transition flex items-center justify-between select-none"
                          >
                            <span className="flex items-center gap-2">
                              <AlertCircle className="size-4 text-amber-400" />
                              Spoiler content. Click to reveal.
                            </span>
                            <Eye className="size-4 opacity-70" />
                          </div>
                        ) : (
                          <p className="text-sm text-white/90 leading-relaxed whitespace-pre-wrap break-words mt-0.5">
                            {comment.text}
                          </p>
                        )}

                        {/* Comment Actions: Like, Dislike, Reply, Toggle Replies */}
                        <div className="flex items-center gap-4 mt-2.5">
                          {/* Like */}
                          <button
                            type="button"
                            onClick={() => handleReact(comment.id, "like")}
                            className={cn(
                              "flex items-center gap-1.5 text-xs font-semibold transition cursor-pointer select-none",
                              hasLiked ? "text-[var(--brand,#df7426)]" : "text-white/40 hover:text-white/80"
                            )}
                          >
                            <ThumbsUp className={cn("size-3.5", hasLiked && "fill-current")} />
                            <span>{comment.likes?.length || 0}</span>
                          </button>

                          {/* Dislike */}
                          <button
                            type="button"
                            onClick={() => handleReact(comment.id, "dislike")}
                            className={cn(
                              "flex items-center gap-1.5 text-xs font-semibold transition cursor-pointer select-none",
                              hasDisliked ? "text-rose-400" : "text-white/40 hover:text-white/80"
                            )}
                          >
                            <ThumbsDown className={cn("size-3.5", hasDisliked && "fill-current")} />
                            <span>{comment.dislikes?.length || 0}</span>
                          </button>

                          {/* Reply Button (Only on top-level comments) */}
                          <button
                            type="button"
                            onClick={() => {
                              if (!isAuthenticated) {
                                openAuthModal("signin");
                                return;
                              }
                              setReplyingToId(replyingToId === comment.id ? null : comment.id);
                              setReplyText("");
                            }}
                            className={cn(
                              "flex items-center gap-1 text-xs font-semibold transition cursor-pointer",
                              replyingToId === comment.id
                                ? "text-[var(--brand,#df7426)]"
                                : "text-white/40 hover:text-white/80"
                            )}
                          >
                            <Reply className="size-3.5" />
                            <span>Reply</span>
                          </button>

                          {/* Show/Hide Replies Toggle Button */}
                          {hasReplies && (
                            <button
                              type="button"
                              onClick={() => toggleCollapse(comment.id)}
                              className="flex items-center gap-1 text-xs font-semibold text-[var(--brand,#df7426)] hover:brightness-110 transition cursor-pointer select-none ml-1"
                            >
                              {isCollapsed ? (
                                <>
                                  <ChevronDown className="size-3.5" />
                                  <span>{comment.replies.length} {comment.replies.length === 1 ? "reply" : "replies"}</span>
                                </>
                              ) : (
                                <>
                                  <ChevronUp className="size-3.5" />
                                  <span>Hide</span>
                                </>
                              )}
                            </button>
                          )}
                        </div>
                      </>
                    )}

                    {/* Inline Reply Input Box (Clean, no left orange line) */}
                    {replyingToId === comment.id && (
                      <div className="mt-3 space-y-2">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          placeholder="Write a reply..."
                          rows={2}
                          className="w-full rounded-xl bg-[#0a0a0a] border border-white/15 p-2.5 text-xs text-white placeholder-white/35 focus:border-white/30 focus:outline-none transition resize-none"
                        />
                        <div className="flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => setReplyIsSpoiler(!replyIsSpoiler)}
                            className={cn(
                              "text-xs px-2.5 py-1 rounded-lg border transition",
                              replyIsSpoiler
                                ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
                                : "border-white/10 text-white/50 hover:text-white/80"
                            )}
                          >
                            {replyIsSpoiler ? "Spoiler" : "No Spoiler"}
                          </button>

                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                setReplyingToId(null);
                                setReplyText("");
                              }}
                              className="px-3 py-1 rounded-lg text-xs text-white/50 hover:text-white bg-white/5 cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="button"
                              onClick={() => handlePostReply(comment.id)}
                              disabled={!replyText.trim() || isSubmittingReply}
                              className="px-3.5 py-1 rounded-lg text-xs font-bold text-black bg-white hover:bg-zinc-200 disabled:opacity-40 transition cursor-pointer"
                            >
                              {isSubmittingReply ? "Posting..." : "Reply"}
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Nested Replies with Smooth, Lag-Free Animation */}
                <AnimatePresence initial={false}>
                  {hasReplies && !isCollapsed && (
                    <motion.div
                      initial={{ opacity: 0, y: -4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -4 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="relative pl-3 sm:pl-5 ml-3 sm:ml-4 space-y-2.5 mt-2"
                    >
                      {comment.replies.map((reply) => {
                        const isReplyAuthor = user?.id && String(user.id) === String(reply.userId);
                        const isReplyEditing = editingId === reply.id;
                        const isReplySpoilerHidden = reply.isSpoiler && !revealedSpoilers[reply.id];
                        const rHasLiked = user?.id ? reply.likes?.includes(user.id) : false;
                        const rHasDisliked = user?.id ? reply.dislikes?.includes(user.id) : false;

                        return (
                          <div key={reply.id} className="relative flex gap-2.5 group/reply pt-0.5">
                            {/* Reply Avatar */}
                            <div className="shrink-0 pt-0.5">
                              <UserAvatar
                                avatarUrl={reply.author?.avatarUrl}
                                frameUrl={reply.author?.frameUrl}
                                username={reply.author?.username}
                                size="sm"
                              />
                            </div>

                            {/* Reply Content Box */}
                            <div className="flex-1 bg-[#101010] border border-white/5 p-3 rounded-2xl overflow-hidden">
                              {/* Author Row */}
                              <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                                <div className="flex items-center gap-1.5">
                                  <span className="text-xs font-bold text-white">
                                    {reply.author?.username || "User"}
                                  </span>
                                  <span className="text-[10px] text-white/40 flex items-center gap-1">
                                    <Clock className="size-2.5" />
                                    {timeAgo(reply.createdAt)}
                                  </span>
                                  {reply.isEdited && (
                                    <span className="text-[9px] text-white/30 italic">(edited)</span>
                                  )}
                                </div>

                                {/* Author actions for reply */}
                                {isReplyAuthor && !isReplyEditing && (
                                  <div className="flex items-center gap-1 opacity-80 group-hover/reply:opacity-100 transition">
                                    <button
                                      type="button"
                                      onClick={() => {
                                        setEditingId(reply.id);
                                        setEditText(reply.text);
                                        setEditIsSpoiler(Boolean(reply.isSpoiler));
                                      }}
                                      className="p-1 rounded-md text-white/40 hover:text-white hover:bg-white/10 transition cursor-pointer"
                                      title="Edit reply"
                                    >
                                      <Edit3 className="size-3" />
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleDelete(comment.id, reply.id)}
                                      className="p-1 rounded-md text-rose-400/60 hover:text-rose-400 hover:bg-rose-500/10 transition cursor-pointer"
                                      title="Delete reply"
                                    >
                                      <Trash2 className="size-3" />
                                    </button>
                                  </div>
                                )}
                              </div>

                              {/* Reply Body or Edit Form */}
                              {isReplyEditing ? (
                                <div className="space-y-2 mt-2 bg-[#0a0a0a] p-2.5 rounded-xl border border-white/10">
                                  <textarea
                                    value={editText}
                                    onChange={(e) => setEditText(e.target.value)}
                                    rows={2}
                                    className="w-full rounded-lg bg-transparent text-xs text-white focus:outline-none resize-none"
                                  />
                                  <div className="flex items-center justify-between pt-1 border-t border-white/10">
                                    <button
                                      type="button"
                                      onClick={() => setEditIsSpoiler(!editIsSpoiler)}
                                      className={cn(
                                        "text-[10px] px-2 py-0.5 rounded border transition",
                                        editIsSpoiler
                                          ? "border-amber-500/40 bg-amber-500/10 text-amber-400"
                                          : "border-white/10 text-white/50"
                                      )}
                                    >
                                      {editIsSpoiler ? "Spoiler" : "No Spoiler"}
                                    </button>
                                    <div className="flex gap-2">
                                      <button
                                        type="button"
                                        onClick={() => setEditingId(null)}
                                        className="px-2.5 py-0.5 rounded text-[11px] font-semibold text-white/60 bg-white/5"
                                      >
                                        Cancel
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => handleSaveEdit(comment.id, reply.id)}
                                        disabled={isSubmittingEdit}
                                        className="px-2.5 py-0.5 rounded text-[11px] font-bold text-white bg-[var(--brand,#df7426)]"
                                      >
                                        Save
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ) : (
                                <>
                                  {isReplySpoilerHidden ? (
                                    <div
                                      onClick={() => toggleSpoiler(reply.id)}
                                      className="my-1 p-2 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs cursor-pointer hover:bg-amber-500/15 transition flex items-center justify-between select-none"
                                    >
                                      <span className="flex items-center gap-1.5 text-[11px]">
                                        <AlertCircle className="size-3.5 text-amber-400" />
                                        Spoiler. Click to reveal.
                                      </span>
                                      <Eye className="size-3.5 opacity-70" />
                                    </div>
                                  ) : (
                                    <p className="text-xs text-white/85 leading-relaxed whitespace-pre-wrap break-words">
                                      {reply.text}
                                    </p>
                                  )}

                                  {/* Reply Reactions: Like, Dislike (No sub-reply button) */}
                                  <div className="flex items-center gap-3 mt-2">
                                    <button
                                      type="button"
                                      onClick={() => handleReact(comment.id, "like", reply.id)}
                                      className={cn(
                                        "flex items-center gap-1 text-[11px] font-semibold transition cursor-pointer select-none",
                                        rHasLiked ? "text-[var(--brand,#df7426)]" : "text-white/40 hover:text-white/80"
                                      )}
                                    >
                                      <ThumbsUp className={cn("size-3", rHasLiked && "fill-current")} />
                                      <span>{reply.likes?.length || 0}</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => handleReact(comment.id, "dislike", reply.id)}
                                      className={cn(
                                        "flex items-center gap-1 text-[11px] font-semibold transition cursor-pointer select-none",
                                        rHasDisliked ? "text-rose-400" : "text-white/40 hover:text-white/80"
                                      )}
                                    >
                                      <ThumbsDown className={cn("size-3", rHasDisliked && "fill-current")} />
                                      <span>{reply.dislikes?.length || 0}</span>
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
}
`;

fs.writeFileSync('src/components/CommentsSection.tsx', componentCode);
console.log('Successfully updated src/components/CommentsSection.tsx');
