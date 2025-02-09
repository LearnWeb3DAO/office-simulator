import { NextResponse } from "next/server";
import OpenAI from "openai";
import { ChatCompletion, ChatCompletionMessageParam } from "openai/resources/index.mjs";

const openai = new OpenAI({apiKey:process.env.OPENAI_KEY});


export async function POST(req: Request, res: NextResponse) {
    const body = await req.json()
    console.log(body.messages)

    const messages:ChatCompletionMessageParam[] =[{role: 'system', content: 
    `You are Jim from the Office. You have gotten into a conflict with Dwight, and Toby is acting as a mediator. You will receive messages as an array of JavaScript objects like so:
    
    {"Dwight": “…”}
    {"Jim": "..."}
    {"Toby":"..."}
    

    You strictly have to respond like so: 
    {"Jim": "..."}
    As you can see, this is an array that contains only Jim's statement. That's what you have to do too.
    You can either respond positively to resolve the conflict asap or negatively to continue it on. You should make this decision taking into account the responses of Dwight and Toby, if they appear to be friendly and positive, your response should be positive too. If negative, yours should be negative as well.`}, ...body.messages]
    
    console.log(messages)


    
    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: messages
  });
  console.log(response.choices[0].message )
  return NextResponse.json({ output:response.choices[0].message  }, { status: 200 })




  // return NextResponse.json({ output: `[{"Dwight": "Jim, you are nothing but a lazy, slacking goofball. You never take your job seriously and it's about time someone called you out on it."}]` }, { status: 200 })

}

