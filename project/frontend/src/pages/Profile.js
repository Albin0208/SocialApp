import { useAuth } from "../utils/AuthContext";
import { baseUrl } from "../shared";
import { useEffect } from "react";
import { PostCard } from "../components/PostCard";
import { useState } from "react";

export const Profile = () => {
  const { user, logoutUser } = useAuth();
  const [posts, setPosts] = useState([]);

  const fetchUser = async () => {
    try {
      const response = await fetch(baseUrl + "user/" + user._id, {
        method: "GET",
        credentials: "include", // Send cookies along with the request
      });

      if (!response.ok) {
        throw new Error(`HTTP Error! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data.posts);

      // const response2 = await fetch(baseUrl + "posts/", {
      //   method: "GET",
      //   credentials: "include", // Send cookies along with the request
      // });

      // const postData = await response2.json();
      // setPosts(postData);

      // setUser(data);
    } catch (error) {
      console.error("Error:", error);
    }
  }

  

  // const 

  useEffect(() => {
    fetchUser();

    // fetchPosts();
  }, []);



  return (
    <>
    <h1>{user.username}</h1>
    <h2>Posts</h2>
    <hr />
    {user.posts.map(post => (
      <PostCard key={post._id} post={post} />
    ))}
    </>
  );
};
