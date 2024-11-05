"use client";

import React, { useState, useEffect } from "react";
import ProtectedRoute from "@/components/ProtectedRoute";
import apiClient from "@/utils/axios";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const [posts, setPosts] = useState<any[]>([]);
  const [content, setContent] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await apiClient.get("/posts/all?page=1&limit=5");
        setPosts(response.data.posts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      }
    };

    fetchPosts();
  }, []);

  if (loading) {
    return <p className="text-center text-gray-500 mt-4">Loading...</p>;
  }

  const handleCreatePost = async () => {
    if (!content) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token available");
      await apiClient.post(
        "/posts/create",
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setContent("");
      // Refresh posts after creating a new one
      const response = await apiClient.get("/posts/all?page=1&limit=5", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(response.data.posts);
    } catch (error) {
      console.error("Failed to create post:", error);
    }
  };

  const handleLikePost = async (postId: number) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token available");

      // Check if the post is already liked before making the request
      const post = posts.find((p) => p.id === postId);
      if (post?.isLiked) {
        console.warn("Post is already liked by this user.");
        return;
      }

      // Proceed with like request if post is not liked
      await apiClient.post(
        "/posts/like",
        { postId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update post list to reflect the new like status
      const updatedPosts = posts.map((p) =>
        p.id === postId ? { ...p, likes: (p.likes || 0) + 1, isLiked: true } : p
      );
      setPosts(updatedPosts);
    } catch (error) {
      console.error("Failed to like post:", error);
    }
  };

  const handleAddComment = async (postId: number, commentContent: string) => {
    if (!commentContent) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("No token available");

      // API request to add a comment
      await apiClient.post(
        "/posts/comment",
        { postId, content: commentContent },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Refresh posts after adding a comment
      const response = await apiClient.get("/posts/all?page=1&limit=5", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setPosts(response.data.posts);
    } catch (error) {
      console.error("Failed to add comment:", error);
    }
  };

  return (
    <ProtectedRoute>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-center mb-8">Dashboard</h1>
        <p className="text-lg text-center mb-4">Welcome, {user?.name || ""}!</p>

        {/* Create Post Section */}
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">Create a Post</h2>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Write something..."
            className="w-full p-3 border border-gray-300 rounded-md mb-4 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <button
            onClick={handleCreatePost}
            className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Create Post
          </button>
        </div>

        {/* Posts Section */}
        <div className="space-y-6">
          {posts.map((post) => (
            <div key={post.id} className="bg-white shadow-md rounded-lg p-6">
              <p className="text-lg font-semibold">
                <strong className="text-blue-600">{post.username}</strong>:{" "}
                {post.content}
              </p>
              <small className="text-gray-500 block mb-4">
                Posted on: {new Date(post.created_at).toLocaleString()}
              </small>
              <div className="flex items-center space-x-4 mb-4">
                <button
                  onClick={() => handleLikePost(post.id)}
                  className="bg-gray-200 text-gray-800 py-1 px-3 rounded hover:bg-gray-300"
                >
                  Like
                </button>
                <span className="text-gray-700">{post.likes || 0} Likes</span>
              </div>

              {/* Comments Section */}
              <div className="comments-section mt-4">
                <h4 className="text-lg font-semibold mb-2">Comments:</h4>
                <ul className="mb-4">
                  {post.comments?.map((comment, index) => (
                    <li key={index} className="mb-2">
                      <span className="font-semibold">{comment.username}:</span>{" "}
                      {comment.content}
                    </li>
                  ))}
                </ul>
                <input
                  type="text"
                  placeholder="Add a comment..."
                  className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleAddComment(post.id, e.currentTarget.value);
                      e.currentTarget.value = ""; // Clear input
                    }
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </ProtectedRoute>
  );
}
