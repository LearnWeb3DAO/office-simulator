"use client";
import Image from "next/image";
import Link from "next/link";
/* 
2 layers

1st layer will serve as mediator
2nd layer will have two agents

1st layer will coordinate and create options 
2 options for the user, one will bring the conflict closer to its end, one will fuel it on
as the number of interactions with the user increases, the second option gets closer to becoming one that will also bring the conflict closer to its end
By 10 user interactions, both options will try to resolve the conflict as quickly as possible



*/

export default function Home() {


  return (
    <main className="relative flex min-h-screen flex-col items-center content justify-center">
        <div className="absolute -z-10 top-0 left-0">
          <Image
            className="relative dark:drop-shadow-[0_0_0.3rem_#ffffff70] brightness-[0.21]"
            src="/background.jpg"
            alt="Office Background"
            width={1920}
            height={1080}
            priority
            style={{ height: "100vh", objectFit: "cover" }}
          />
        </div>
        <div className=" flex flex-col self-center max-w-xl">
          <div className="text-4xl font-office text-center">HR Training Simulator</div>
          <div className="text-center mt-4 text-lg">Dwight just got mad at Jim and is now in a heated argument with him. The goal of this game is simple: you have to act as Toby 
            and resolve this conflict as quickly as possible </div>
          <div className="mt-5 flex items-center  justify-center"><Link href="/play"><button className=" text-gray-100 rounded-md bg-blue-700 text-lg py-1 px-3">Play</button></Link></div>
        </div>
    </main>
  );
}
