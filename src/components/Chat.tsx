import { DataStore } from "aws-amplify";
import React, { FC } from "react";
import { User, Message, Room } from "../../src/models";

const Chat: FC<any> = ({ userId, username, roomInfo }) => {
  // console.log("roomInfo", roomInfo)
  const [text, setText] = React.useState("");
  const [messages, setMessages] = React.useState<any[]>([]);

  const messagesEndRef: any = React.useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" })
  }

  //   type Message @model {
  //     id: ID!
  //     user: String!
  //     room: String
  //     text: String
  //   }
  //   console.log("userId", userId);
  //   console.log("messages", messages);

  const saveMessage = async (e: any) => {
    e.preventDefault();
    console.log(text);
    await DataStore.save(
      new Message({
        user: username,
        room: roomInfo[0]?.id,
        text: text,
      })
    );

    setText("")
  };

  const fetchMessage = async () => {
    const roomId = roomInfo[0]?.id;
    // const _Messages = await DataStore.query(Message, (c) =>
    //   c.or((c) => [c.user.eq(userId.id), c.user.eq(username)])
    // );

    const _Messages = await DataStore.query(
      Message,
      (c) =>
        c.and((c) => [
          c.room.eq(roomId),
          c.or((c) => [c.user.eq(userId.id), c.user.eq(username)]),
        ])
      //   c.or((c) => [c.user.eq(userId.id), c.user.eq(username)])
    );

    setMessages(_Messages);
  };

  //   console.log("first", roomInfo);

  React.useEffect(() => {
    DataStore.observe(Message).subscribe(fetchMessage);
    fetchMessage();
  }, [roomInfo]);

  React.useEffect(() => {
    scrollToBottom()
  }, [messages]);
  return (
    <div>
      <div style={{ height: "5vh" }}>
        <h2 style={{ padding: "10px" }}>{userId.name}</h2>
        <hr />
      </div>

      <div
        style={{ height: "90vh", overflowY: "auto", wordBreak: "break-all" }}
      >
        {messages.length !== 0 &&
          messages?.map((val, index) => (
            <div key={index} style={{ display: "flex", justifyContent: val.user === username ? "flex-end" : "" }} >
              <h2
                style={{
                  width: "fit-content",
                  maxWidth: "500px",
                  backgroundColor: "white",
                  marginTop: "10px",
                  padding: "5px",
                  borderRadius: "10px",
                }}

              >
                {val.text}
              </h2>
            </div>
          ))}
        <div ref={messagesEndRef} />
      </div>

      <div
        style={{
          //   position: "absolute",
          height: "5vh",
          bottom: "5px",
          width: "100%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <form onSubmit={saveMessage} style={{ width: "100%" }}>
          <input
            style={{ width: "100%", height: "40px" }}
            placeholder="Enter Message"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />
        </form>
      </div>
    </div>
  );
};

export default Chat;
