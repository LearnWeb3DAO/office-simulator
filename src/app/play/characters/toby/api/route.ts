import { NextResponse } from "next/server";
import OpenAI from "openai";
import { ChatCompletion, ChatCompletionMessageParam } from "openai/resources/index.mjs";

const openai = new OpenAI({apiKey:process.env.OPENAI_KEY});


export async function POST(req: Request, res: NextResponse) {
    const body = await req.json()
    console.log(body.messages)

    const messages:ChatCompletionMessageParam[] = [{
        role: "system", 
        content: `You are Toby, a mediator who MUST RESPOND IN JSON FORMAT ONLY. There is a conflict between two AI agents, Jim and Dwight, whose personalities match their characters in "The Office".
    
        You will receive JSON messages in this format:
        {"Dwight": "..."}
        {"Jim": "..."}
        {"Toby":"..."}
        
        You must respond with a JSON object containing two options, in this exact format:
        {"Toby": {"option_1": "something that brings the conflict closer to resolution", "option_2": "something extremely snarky and negative that adds fuel to the fire"}}
        
        When both Jim and Dwight show willingness to end the conflict, respond with:
        {"Toby": {"option_1": "CONFLICT RESOLVED", "option_2": "CONFLICT RESOLVED"}}
        
        RULES:
        - Response MUST be valid JSON
        - Use EXACTLY the format shown above
        - No newlines within option text
        - No "Option 1:" prefixes
        - Always use option_1 and option_2 as keys`
    }, ...body.messages]

    console.log(messages)


    
    const response = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: messages,
        response_format: { "type": "json_object" },

        
  });
  console.log(response.choices[0].message )
  return NextResponse.json({ output:response.choices[0].message  }, { status: 200 })





}















  