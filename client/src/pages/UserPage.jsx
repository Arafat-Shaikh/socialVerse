import React, { useEffect, useState } from "react";
import UserHeader from "../components/UserHeader";
import UserPost from "../components/UserPost";
import { Spinner, useToast } from "@chakra-ui/react";
import { useRecoilState } from "recoil";
import userAtom from "../atoms/userAtom";
import { useParams } from "react-router-dom";
import useGetUserProfile from "../hooks/useGetUserProfile";

const UserPage = () => {
  const toast = useToast();
  const [userPost, setUserPost] = useRecoilState(userAtom);
  const { username } = useParams();
  const { user,loading } = useGetUserProfile();

  console.log(user);

  async function fetchUserPosts() {
    console.log(username);
    try {
      const res = await fetch("/api/post/user/" + username);
      const data = await res.json();

      if (data.error) {
        toast({
          title: data.error,
          status: "error",
          isClosable: true,
        });
      } else {
        console.log(data);
      }
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchUserPosts();
  }, [userPost]);

  if (!user) return null;

  if (!loading && !user) return <p>User not found</p>;

  if (loading) return <Spinner size={24} />;

  return (
    <>
      {user && <UserHeader user={user} />}
      <UserPost />
      <UserPost />
      <UserPost />
      <UserPost />
    </>
  );
};

export default UserPage;
