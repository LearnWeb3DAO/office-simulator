"use client";

import Image from "next/image";
import {
  ChatCompletionMessageParam,
} from "openai/resources/index.mjs";
import { useEffect, useState } from "react";
/* 
2 layers

1st layer will serve as mediator
2nd layer will have two agents

1st layer will coordinate and create options 
2 options for the user, one will bring the conflict closer to its end, one will fuel it on
as the number of interactions with the user increases, the second option gets closer to becoming one that will also bring the conflict closer to its end
*/

export default function Home() {
  type Dwight = {
    Dwight: string;
  };

  type Jim = {
    Jim: string;
  };
  const [isLoading, setIsLoading] = useState(0);
  const [allMessages, setAllMessages] = useState<
    undefined | ChatCompletionMessageParam[]
  >();
  const [options, setOptions] = useState<string[] | undefined>();
  const [tobyEntry, setTobyEntry] = useState(false);
  const [dwightLatestMessage, setDwightLatestMessage] = useState<
    Dwight | undefined
  >();
  const [jimLatestMessage, setJimLatestMessage] = useState<Jim | undefined>();
  const [tobyLatestMessage, setTobyLatestMessage] = useState("");
  const [conflictStarted, setConflictStarted] = useState(false);
  const [conflictEnded, setConflictEnded] = useState(false);



  useEffect(() => {
    async function retrieve() {
      if (localStorage.getItem("allMessages")) {
        setAllMessages(JSON.parse(localStorage.getItem("allMessages")!));
        setConflictStarted(true);
        setTobyEntry(true);
      }

      localStorage.getItem("options") &&
        setOptions(JSON.parse(localStorage.getItem("options")!));
      localStorage.getItem("dwightLatestMessage") &&
        setDwightLatestMessage(
          JSON.parse(localStorage.getItem("dwightLatestMessage")!)
        );
      localStorage.getItem("jimLatestMessage") &&
        setJimLatestMessage(
          JSON.parse(localStorage.getItem("jimLatestMessage")!)
        );
      localStorage.getItem("tobyLatestMessage") != "" &&
        setTobyLatestMessage(localStorage.getItem("tobyLatestMessage")!);
    }

    retrieve();
  }, []);


  const optionChosen = async (option: string) => {
    setTobyEntry(true);
    if (option === "CONFLICT RESOLVED") {
      setConflictEnded(true);

      return;
    }
    setTobyLatestMessage(option);
    localStorage.setItem("tobyLatestMessage", option);
    await getResponses({
      role: "assistant",
      content: '{"Toby":"' + option + '"}',
    });
  };

  const restart = () => {
    setDwightLatestMessage(undefined);
    setJimLatestMessage(undefined);
    setOptions(undefined);
    setTobyLatestMessage("");
    setConflictEnded(false);
    setConflictStarted(false);
    setAllMessages(undefined);
    setTobyEntry(false)
    localStorage.clear();
  };

  const getResponses = async (
    option: ChatCompletionMessageParam | undefined = undefined
  ) => {
    setDwightLatestMessage(undefined);
    setJimLatestMessage(undefined);
    setOptions(undefined);
    setConflictStarted(true);
    let temparray: undefined | ChatCompletionMessageParam[] = allMessages;
    if (option) {
      temparray?.push(option);
    }

    const getDwightResponse = async () => {
      setIsLoading(1);
      console.log("getting Dwight's statement");
      const newMessage: ChatCompletionMessageParam = {
        content: "Start the conflict",
        role: "user",
      };
      if (!allMessages) {
        setAllMessages([newMessage]);
        const response = await fetch("/play/characters/dwight/api", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({ messages: [newMessage] }),
        });
        const data = await response.json();
        const { output } = data;
        temparray = [output];
        setAllMessages([output]);
        localStorage.setItem("dwightLatestMessage", output.content);

        setDwightLatestMessage(JSON.parse(output.content));
      } else {
        const response = await fetch("/play/characters/dwight/api", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({ messages: temparray }),
        });
        const data = await response.json();
        const { output } = data;
        temparray?.push(output);
        setAllMessages(temparray);
        localStorage.setItem("dwightLatestMessage", output.content);

        setDwightLatestMessage(JSON.parse(output.content));
      }
      setIsLoading(0);

      console.log("Dwight done");
    };

    const getJimResponse = async () => {
      setIsLoading(2);
      console.log("getting Jim's statement");

      const response = await fetch("/play/characters/jim/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ messages: temparray }),
      });
      const data = await response.json();
      const output = data.output;
      temparray?.push(output);
      setAllMessages(temparray);
      setJimLatestMessage(JSON.parse(output.content));
      localStorage.setItem("jimLatestMessage", output.content);


      setIsLoading(0);
      console.log("Jim done");
    };

    const getTobyResponse = async () => {
      setIsLoading(3);
      console.log("getting Toby's statement");

      const response = await fetch("/play/characters/toby/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({ messages: temparray }),
      });
      const data = await response.json();
      const { output } = data;

      const outputAsObject = await JSON.parse(output.content);
      setOptions([outputAsObject.Toby.option_1, outputAsObject.Toby.option_2]);
      localStorage.setItem(
        "options",
        JSON.stringify([
          outputAsObject.Toby.option_1,
          outputAsObject.Toby.option_2,
        ])
      );

      setIsLoading(0);
      console.log("Toby done");

    };

    await getDwightResponse();
    await getJimResponse();
    await getTobyResponse();
    localStorage.setItem("allMessages", JSON.stringify(temparray));
  };

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center">
      
      {!conflictEnded ? (
        <div className="relative flex min-h-screen  w-full flex-col items-center justify-center">
          <div className="absolute -z-10 top-0 left-0">
            <Image
              className="relative  brightness-[0.21]"
              src="/playbg.jpg"
              alt="Office Background"
              width={1920}
              height={1080}
              priority
              style={{ height: "100vh", objectFit: "cover" }}
            />
          </div>

          <div className=" flex flex-col self-center">
            <div className="absolute -z-10  min-h-screen  bottom-0 w-80  left-7">
              <Image
                src="/Dwight.png"
                alt="Dwight"
                width={300}
                height={0}
                className={`pb-5 absolute top-0 bottom-0 right-0 left-0 mx-auto my-auto  border-red-500 ${isLoading===1&&"brightness-[0.7]"}`}
              />
              <div className=" pb-5 absolute  top-0 bottom-0 h-min pt-80 pl-5 text-left  right-0 left-0 mx-auto my-auto">
                <div
                  className={`${
                    dwightLatestMessage ? "bg-red-500" : ""
                  } pl-4 pr-2 rounded-md py-2`}
                >
                  {dwightLatestMessage
                    ? dwightLatestMessage.Dwight
                    : isLoading == 1 && (
                        <div className="flex justify-start">
                          <span className="flex rounded-full  border-t-white border-2  box-border animate-spin h-6 w-6"></span>
                        </div>
                      )}
                </div>
              </div>
            </div>
            <div className="absolute -z-10  min-h-screen  bottom-0  right-7 w-80">
              <Image
                src="/Jim.png"
                alt="Jim"
                width={300}
                height={0}
                className={`pb-5 absolute top-0 bottom-0 right-0 left-0 mx-auto my-auto   border-red-500 ${isLoading===2&&"brightness-[0.7]"}`}
              />
              <div className=" pb-5 absolute  top-0 bottom-0 h-min pt-80 pr-5 text-right  right-0 left-0 mx-auto my-auto">
                <div
                  className={`${
                    jimLatestMessage ? "bg-blue-500" : ""
                  }  pr-4 pl-2 rounded-md py-2`}
                >
                  {jimLatestMessage
                    ? jimLatestMessage.Jim
                    : isLoading == 2 && (
                        <div className=" flex justify-end">
                          <span className="flex rounded-full  border-t-white border-2  box-border animate-spin h-6 w-6"></span>
                        </div>
                      )}
                </div>
              </div>
            </div>

            {tobyEntry && (
              <div className="absolute -z-10  min-h-screen bottom-0 left-0 right-0 mx-auto my-0 w-80">
                <Image
                  src="/Toby.png"
                  alt="Toby"
                  width={300}
                  height={0}
                  className={`pb-5 absolute top-0 bottom-0 right-0 left-0 mx-auto my-auto   border-red-500 ${isLoading===3&&"brightness-[0.7]"}`}
                />
                <div className=" pb-5 absolute  top-0 bottom-0 h-min pt-80   text-center  right-0 left-0 mx-auto my-auto">
                  {tobyLatestMessage && (
                    <div className=" bg-green-500 pr-4 pl-2 rounded-md py-2">
                      {tobyLatestMessage}
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="text-center mt-4 text-lg"></div>
            {!conflictStarted&&            <div className="mt-5 flex items-center gap-12  justify-center">
              <button onClick={() => getResponses() } className="bg-red-700 hover:bg-red-800 px-4 py-2 rounded-md">Start!</button>
            </div>}        


            <div className="flex w-full">
              {options != undefined || isLoading === 3 ? (
                <div className="flex flex-col gap-4 bg-slate-800 px-8 py-6 rounded-md w-full ">
                  <span>Choose Toby's response:</span>
                  <div className="flex gap-6">
                    <button
                      className="bg-blue-700 w-80 p-4 rounded-md  hover:bg-blue-800 "
                      onClick={() => options && optionChosen(options[0])}
                    >
                      {options ? (
                        options[0]
                      ) : (
                        <span className="flex rounded-full  border-t-white border-2  box-border animate-spin h-6 w-6"></span>
                      )}
                    </button>
                    <button
                      className="bg-blue-700  w-80 p-4 rounded-md hover:bg-blue-800"
                      onClick={() => options && optionChosen(options[1])}
                    >
                      {options ? (
                        options[1]
                      ) : (
                        <span className="flex rounded-full  border-t-white border-2  box-border animate-spin h-6 w-6"></span>
                      )}
                    </button>
                  </div>
                </div>
              ) : (
                isLoading === 3 && "xakke"
              )}
            </div>
          </div>
        </div>
      ) : (
        <div>
          <div className="absolute -z-10 top-0 left-0">
            <Image
              className="relative  brightness-[0.21]"
              src="/playbg.jpg"
              alt="Office Background"
              width={1920}
              height={1080}
              priority
              style={{ height: "100vh", objectFit: "cover" }}
            />
          </div>
          <div className="text-center mb-4 text-lg">Thanks for playing!</div>
          <button
            className="bg-blue-700 w-40 p-4 rounded-md  hover:bg-blue-800 "
            onClick={restart}
          >
            Play again
          </button>
        </div>
      )}
    </main>
  );
}
