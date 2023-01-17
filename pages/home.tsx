import React, { FC, Fragment } from "react";
import { DataStore } from "@aws-amplify/datastore";
import { User, Message, Room } from "../src/models";
import { useRouter } from "next/router";
import Chat from "../src/components/Chat";
// import  Router from "next/router";

const Home: FC = () => {
  const router = useRouter();
  const [usersOnline, setUsersOnline] = React.useState<any[]>([]);
  const [chatUserId, setChatUsersId] = React.useState<any>();
  const [roomInfo, setRoomInfo] = React.useState<any>();


  // console.log("🚀 ~ file: home.tsx:11 ~ home ~ usersOnline", usersOnline)

  const username: any = router.query.qKey;
  // console.log("🚀 ~ file: home.tsx:16 ~ home ~ username", typeof username)

  const fetchMessage = async () => {
    const _Messages = await DataStore.query(Message);
    // setMessages(_Messages);
  };

  const logout = async () => {
    const id: string = username;
    const original: any = await DataStore.query(User, id);
    await DataStore.save(
      User.copyOf(original, (updated) => {
        updated.isOnline = false;
      })
    );
    router.push("/");
  };

  const createChatRoom = async (userId: any) => {
    // console.log("userId", userId);
    const tempArr = [userId.id, username];
    // console.log("🚀 ~ file: home.tsx:39 ~ createChatRoom ~ tempArr", tempArr)

    const room = await DataStore.query(
      Room,
      (c) => c.and(c => [c.users.contains(tempArr[0]), c.users.contains(tempArr[1])])
    );


    console.log("room", room)

    if (room.length === 0) {
      console.log("creating new room")
      const newRoom = await DataStore.save(new Room({ users: tempArr }));
      console.log("newRoom", newRoom)
      setRoomInfo([newRoom])

    } else {
      setRoomInfo(room)
    }

    setChatUsersId(userId)


  };

  // React.useEffect(() => {
  //     fetchMessage();
  //     DataStore.observe(Message).subscribe(fetchMessage);
  //   }, []);

  React.useEffect(() => {
    // fetchMessage();
    (async () => {
      DataStore.observe(User).subscribe(async () => {
        try {
          const user = await DataStore.query(User);
          setUsersOnline(user);
        } catch (error) {
          console.error({ error });
        }
      });
    })();
  }, []);

  // console.log("first",usersOnline)

  return (
    <div style={{ height: "100vh", display: "flex" }}>
      {/* SIDEBAR */}
      <div style={{ borderRight: "2px solid black", width: "20%" }}>
        <h1>Online Users</h1>
        {usersOnline?.map((val, index) => (
          <div key={index}>
            {val.isOnline && val.id !== username && (
              <h3
                style={{ cursor: "pointer" }}
                onClick={() => createChatRoom(val)}
              >
                {val.name}
              </h3>
            )}
          </div>
        ))}

        <div>
          <button
            onClick={logout}
            style={{ marginTop: "10px", width: "100%", height: "40px" }}
          >
            LOGOUT
          </button>
        </div>
      </div>
      {/* MAIN SECTION */}
      <div style={{ width: "80%" }}>
        {
          roomInfo !== undefined && <Chat userId={chatUserId} username={username} roomInfo={roomInfo} />
        }
      </div>
    </div>
  );
};

export default Home;
