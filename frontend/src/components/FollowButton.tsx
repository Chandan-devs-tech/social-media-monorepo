// "use client";

// import React, { useState } from "react";
// import apiClient from "@/utils/axios";

// type FollowButtonProps = {
//   targetUserId: number;
//   isFollowing: boolean;
// };

// export default function FollowButton({
//   targetUserId,
//   isFollowing,
// }: FollowButtonProps) {
//   const [following, setFollowing] = useState(isFollowing);

//   const handleFollow = async () => {
//     try {
//       const endpoint = following ? "/users/unfollow" : "/users/follow";
//       await apiClient.post(
//         endpoint,
//         { targetUserId },
//         {
//           headers: {
//             Authorization: `Bearer ${localStorage.getItem("token")}`,
//           },
//         }
//       );
//       setFollowing(!following);
//     } catch (error: any) {
//       console.error(
//         "Failed to follow/unfollow:",
//         error.response?.data || error.message
//       );
//     }
//   };

//   return (
//     <button
//       onClick={handleFollow}
//       className={`px-4 py-2 rounded ${
//         following ? "bg-red-500" : "bg-blue-500"
//       } text-white`}
//     >
//       {following ? "Unfollow" : "Follow"}
//     </button>
//   );
// }
