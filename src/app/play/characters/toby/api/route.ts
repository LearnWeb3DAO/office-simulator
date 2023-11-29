import { NextResponse } from "next/server";
import OpenAI from "openai";
import { ChatCompletion, ChatCompletionMessageParam } from "openai/resources/index.mjs";

const openai = new OpenAI({apiKey:process.env.OPENAI_KEY});


export async function POST(req: Request, res: NextResponse) {
    const body = await req.json()
    console.log(body.messages)

    const messages:ChatCompletionMessageParam[] =  [{role:"system", content:
    `There is a conflict between two ai agents. They are called Jim and Dwight and their personalities match their characters in the show "The Office".  Dwight has started the conflict. You will get messages as an array of JavaScript objects like so:

    {"Dwight": "..."}
    {"Jim": "..."}
    {"Toby":"..."}
    
    You are Toby, and you have to act as the mediator. You have to give two options to the user. Your job is to just output JSON in this format:
    
    {"Toby": {"option_1": "something that brings the conflict closer to resolution", {"option_2": "something extremely SNARKY and unnecessarily NEGATIVE that adds fuel to the fire"}
    
    Stick to the format. Once the messages from both Jim and Dwight indicate that they want the conflict to end,  just output:
    {Toby: {option_1:  "CONFLICT RESOLVED", option_2: "CONFLICT RESOLVED"}
    
    Remember, you are only and only allowed to output JSON in the specified format, nothing else `


}, ...body.messages]
    
    console.log(messages)


    
    const response = await openai.chat.completions.create({
        model: "gpt-4",
        messages: messages
  });
  console.log(response.choices[0].message )
  return NextResponse.json({ output:response.choices[0].message  }, { status: 200 })





}















  