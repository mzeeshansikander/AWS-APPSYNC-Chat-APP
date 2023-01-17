import Head from "next/head";
import Image from "next/image";
import { Inter } from "@next/font/google";
import styles from "../styles/Home.module.css";
import React from "react";
import { DataStore } from "@aws-amplify/datastore";
import { User, Message } from "../src/models";
import { Chat } from "react-demos";
import Router from "next/router";


// DataStore.setConflictHandler((model, local, remote) => {
//     return remote;
// });


export default function Index() {

  const [currentUser, setCurrentUser] = React.useState<any>(null);
  const [usersOnline, setUsersOnline] = React.useState<any[]>([]);
  const [messages, setMessages] = React.useState<any[]>([]);
  const [userName, setUserName] = React.useState<any>("");

  const loginUser = async () => {
    // console.log("first");

    if (!userName) return;
    // await DataStore.clear();
    const user = await DataStore.query(User, (u) => u.name.eq(userName));

    console.log("user", user);

    if (user.length === 0) {
      console.log("new User")
      const newUser = await DataStore.save(
        new User({ name: userName, isOnline: true })
      );
      console.log("New User", newUser);
      setCurrentUser(newUser);
      Router.push({
        pathname: "/home",
        query: { qKey: newUser.id },
      });
    } else {
      console.log("same user");
      const id: string = user[0].id;
      const original: any = await DataStore.query(User, id);
      await DataStore.save(
        User.copyOf(original, (updated) => {
          updated.isOnline = true;
        })
      );
      setCurrentUser(user);
      Router.push({
        pathname: "/home",
        query: { qKey: user[0].id },
      });
    }
  };

  const sendMessage = async (text: any) => {
    await DataStore.save(
      new Message({
        user: currentUser.name,
        text,
      })
    );
  };

  const fetchMessage = async () => {
    const _Messages = await DataStore.query(Message);
    setMessages(_Messages);
  };

  // React.useEffect(() => {
  //   fetchMessage();
  //   DataStore.observe(Message).subscribe(fetchMessage);
  // }, []);
  // React.useEffect(() => {
  //   fetchMessage();
  //   DataStore.observe(User).subscribe(() =>
  //     DataStore.query(User).then(setUsersOnline)
  //   );
  // }, []);

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main
        style={{
          height: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <div style={{ display: "flex", flexDirection: "column" }}>
          <input
            onChange={(e) => setUserName(e.target.value)}
            style={{ height: "50px", width: "300px" }}
            placeholder="Enter Your Username"
          />
          <button
            style={{ marginTop: "10px", height: "30px" }}
            onClick={loginUser}
          >
            Sign IN
          </button>
        </div>
        {/* <Chat
        {...{
          currentUser,
          sendMessage,
          loginUser,
          messages,
          usersOnline,
        }}
      /> */}
      </main>
    </>
  );
}