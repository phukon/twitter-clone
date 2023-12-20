import { useSession } from "next-auth/react";
import { Button } from "./Button";
import { ProfileImage } from "./ProfileImage";
import {
  FormEvent,
  useCallback,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { api } from "~/utils/api";

function updateTextAreaSize(textArea?: HTMLTextAreaElement) {
  if (textArea == null) return;
  textArea.style.height = "0";
  textArea.style.height = `${textArea.scrollHeight}px`;
}

function Form() {
  const session = useSession();
  const [inputValue, setInputValue] = useState("");

  const textAreaRef = useRef<HTMLTextAreaElement>();

  const inputRef = useCallback((textArea: HTMLTextAreaElement) => {
    updateTextAreaSize(textArea);
    textAreaRef.current = textArea;
  }, []);

  useLayoutEffect(() => {
    //use this hook when changing the height of something
    updateTextAreaSize(textAreaRef.current);
  }, [inputValue]);

  const createTweet = api.tweet.create.useMutation({
    onSuccess: (newTweet) => {
      console.log(newTweet);
      setInputValue("");
    },
  });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();

    createTweet.mutate({ content: inputValue });
  }

  if (session.status !== "authenticated") return null;
  return (
    <>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-2 border-b px-4 py-2"
      >
        <div className="flex gap-4">
          <ProfileImage src={session.data.user.image} />
          <textarea
            ref={inputRef}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            style={{ height: 0 }}
            className="flex-grow resize-none overflow-hidden p-4 text-lg outline-none"
            placeholder="Whats happening?"
          />
        </div>
        <Button className="self-end">Tweet</Button>
      </form>
    </>
  );
}

export function NewTweetForm() {
  const session = useSession();
  if (session.status !== "authenticated") return;

  return <Form />;
}
