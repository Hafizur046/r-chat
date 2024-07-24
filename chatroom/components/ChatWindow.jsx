import { WS_ENDPOINT } from "./../constant/config";

const IMAGE_EXTENSIONS = new Set(["png", "jpg", "jpeg", "webp", "gif"]);
export default function ChatWindow({ messages, socket, chatWindowDiv }) {
  return (
    <div
      className="p-4 flex flex-col items-start gap-y-2 h-[80vh] md:h-[90vh] overflow-y-scroll"
      ref={chatWindowDiv}
    >
      {messages.map(
        ({ from, message, file, originalname, userId, time }, index) => {
          const extension = file && file.split(".").pop();
          const isImage = IMAGE_EXTENSIONS.has(extension);
          return (
            <SingleMessage
              key={index}
              name={from}
              msg={message}
              file={file}
              isImage={isImage}
              originalname={originalname}
              time={time}
              isOwnMessage={socket.current.id == userId}
            />
          );
        }
      )}
    </div>
  );
}

function SingleMessage({
  name,
  msg,
  isImage,
  file,
  originalname,
  time,
  isOwnMessage,
}) {
  return (
    <div
      className={`msg p-2 flex flex-col gap-1 ${isOwnMessage && "self-end"}`}
    >
      {!isImage && (
        <div
          className={`rounded-xl ${isOwnMessage ? "bg-sky-400" : "bg-teal-600"} p-2 flex flex-col gap-y-2`}
        >
          <p className="text-wrap break-all max-w-80">{msg}</p>
          {file && !isImage && (
            <a
              href={`${WS_ENDPOINT}/${file}`}
              target="new"
              className="break-all underline text-white"
            >
              {originalname}
            </a>
          )}
        </div>
      )}
      {isImage && (
        <img
          src={`${WS_ENDPOINT}/${file}`}
          style={{
            maxWidth: "60%",
            alignSelf: "inherit",
          }}
        />
      )}
      <div className="flex justify-between items-center px-2 gap-x-2">
        {!isOwnMessage && (
          <p className="text-sm text-gray-400 font-bold">{name}</p>
        )}
        <p className="text-xs text-gray-400 w-full text-right">
          {new Date(time).toLocaleTimeString()}
        </p>
      </div>
    </div>
  );
}
