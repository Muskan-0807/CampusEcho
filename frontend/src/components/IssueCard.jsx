import { useState } from "react";
import axios from "axios";
import { BASE_URL3 } from "../utils/constants";

const IssueCard = ({ issue }) => {
  const [agreeCount, setAgreeCount] = useState(issue.agreeCount);
  const [disagreeCount, setDisagreeCount] = useState(issue.disagreeCount);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState(issue.comments || []);

  const [commentsCount, setCommentsCount] = useState(issue.comments.length);
  const [loading, setLoading] = useState(false);
  
  const handleAgree = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${BASE_URL3}/${issue._id}/agree`,
        {},
        { withCredentials: true }
      );

      setAgreeCount(res.data.agreeCount);
      setDisagreeCount(res.data.disagreeCount);
    } catch (err) {
      alert("Failed to agree");
    } finally {
      setLoading(false);
    }
  };
  const handleDisagree = async () => {
    try {
      setLoading(true);
      const res = await axios.post(
        `${BASE_URL3}/${issue._id}/disagree`,
        {},
        { withCredentials: true }
      );

      setAgreeCount(res.data.agreeCount);
      setDisagreeCount(res.data.disagreeCount);
    } catch (err) {
      alert("Failed to disagree");
    } finally {
      setLoading(false);
    }
  };
  const handleComment = async () => {
    if (!commentText.trim()) return;

    try {
      setLoading(true);
      const res = await axios.post(
        `${BASE_URL3}/${issue._id}/comment`,
        { text: commentText },
        { withCredentials: true }
      );
      setComments(res.data.comments);
      setCommentsCount(res.data.comments.length);
      setCommentText("");
    } catch (err) {
      alert("Failed to add comment");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="bg-white rounded-lg p-5 border mb-5">
    
      <div className="flex justify-between items-start">
        <div className="flex gap-2">
          <span className="text-md px-2 py-1 bg-gray-300 rounded">
            {issue.category}
          </span>

          <span className="text-md px-2 py-1 bg-yellow-300 rounded">
            {issue.status}
          </span>

          {issue.isMyIssue && (
            <span className="text-md px-2 py-1 bg-blue-300 rounded">
              My
            </span>
          )}
        </div>

        <span className="text-sm text-gray-500">
          {new Date(issue.createdAt).toLocaleDateString()}
        </span>
      </div>

      {/* Title */}
      <h2 className="text-xl font-semibold mt-2">{issue.title}</h2>

      {/* Description */}
      <p className="text-gray-700 text-lg mt-1">{issue.description}</p>

      {/* Management Response (if exists) */}
      {issue.adminResponse && (
        <div className="mt-4 bg-green-100 border-l-4 border-green-500 p-3">
          <p className="text-md font-medium text-green-800">
            Management Response:
          </p>
          <p className="text-md text-green-700">{issue.adminResponse}</p>
        </div>
      )}

      
      <div className="flex gap-3 mt-4 text-sm items-baseline">
        <button
          onClick={handleAgree}
          className={"px-5 py-2 border rounded font-semibold hover:bg-green-600 text-black bg-gray-100 "}
  
        >
          Agree ({agreeCount})
        </button>

        <button
          onClick={handleDisagree}
          className={"px-5 py-2 border rounded font-semibold hover:bg-red-600 text-black bg-gray-100 "}
  
        >
          Disagree ({disagreeCount})
        </button>

        <span className="px-3 py-1 text-gray-600 font-semibold">
          Comments: {commentsCount}
        </span>
      </div>
      {comments.length > 0 && (
        <div className="mt-4">
          <p className="text-md font-medium text-gray-700 mb-2">Comments:</p>

          <div className="space-y-2">
            {comments.map((comment, index) => (
              <div key={index} className="text-md text-gray-800">
                <p>{comment.text}</p>
                <p className="text-xs text-gray-500">
                  {new Date(comment.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

    
      <div className="mt-4 flex gap-2">
        <input
          type="text"
          placeholder="Add a comment..."
          value={commentText}
          onChange={(e) => setCommentText(e.target.value)}
          className="flex-1 border rounded px-3 py-2 text-sm"
        />

        <button
          onClick={handleComment}
          disabled={loading}
          className="px-4 py-2 bg-indigo-900 hover:bg-indigo-800 text-white rounded"
        >
          Post
        </button>
      </div>
    </div>
  );
};

export default IssueCard;
