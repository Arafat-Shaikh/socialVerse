import React, { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";
import { Flex, Spinner, useToast } from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { Navigate, useParams } from "react-router-dom";
import useGetUserProfile from "../hooks/useGetUserProfile";
import postsAtom from "../atoms/postsAtom";

const UserPage = () => {
  const toast = useToast();
  const { username } = useParams();
  const { user, loading } = useGetUserProfile();
  const [userPosts, setUserPosts] = useRecoilState(postsAtom);
  const [loggedInUser, setLoggedInUser] = useRecoilState(userAtom);
  const [isReplyPosts, setIsReplyPosts] = useState(false);
  const [repLoading, setRepLoading] = useState(false);

  console.log(userPosts);

  function handleChangePosts(val) {
    setIsReplyPosts(val);
  }

  async function fetchUserPosts() {
    if (repLoading) return;

    setRepLoading(true);
    console.log(username);
    try {
      const res = await fetch("api/post/user/" + username);
      const data = await res.json();

      if (data.error) {
        toast({
          title: data.error,
          status: "error",
          isClosable: true,
        });
      } else {
        console.log(data);
        setUserPosts(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setRepLoading(false);
    }
  }

  async function fetchUserRepliedPosts() {
    if (repLoading) return;

    setRepLoading(true);

    try {
      const response = await fetch("/api/post/replied/" + username);
      const data = await response.json();

      if (data.error) {
        toast({
          status: "error",
          description: data.error,
          isClosable: true,
        });
      } else {
        setUserPosts(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setRepLoading(false);
    }
  }

  useEffect(() => {
    if (!isReplyPosts) {
      fetchUserPosts();
    } else {
      fetchUserRepliedPosts();
    }
  }, [user, isReplyPosts]);

  if (loading && !user) {
    return (
      <Flex justifyContent={"center"}>
        <Spinner size={"xl"} />
      </Flex>
    );
  }

  if (!user) return null;

  if (user) {
    <Flex justifyContent={"center"}>
      <Spinner size={"xl"} />
    </Flex>;
  }

  if (!loggedInUser) {
    return <Navigate to={"/auth"} replace={true}></Navigate>;
  }

  return (
    <>
      {user && (
        <UserHeader
          user={user}
          handleChangePosts={handleChangePosts}
          isReplyPosts={isReplyPosts}
        />
      )}

      {repLoading && (
        <Flex justifyContent={"center"} mt={10}>
          <Spinner size={"xl"} />
        </Flex>
      )}
      {userPosts &&
        userPosts.map((userPost) => (
          <UserPost key={userPost.id} post={userPost} />
        ))}
      {!userPosts.length && (
        <Flex justifyContent={"center"} mt={2}>
          <h1>No post yet</h1>
        </Flex>
      )}
    </>
  );
};

export default UserPage;
