import Image from "next/image";

export default function Home() {
  return (
    <main className="flex  flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:size-auto lg:bg-none">
          <a
            className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
            href="https://www.hallos.io"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Image
              src="/HallosWhite.svg"
              alt="Vercel Logo"
              width={100}
              height={24}
              priority
            />
          </a>
        </div>
        <div>

        </div>
      </div>

      <div className="">

        <h1 className="text-4xl font-bold">Tu Primera Dapp en Base</h1>

      </div>
    </main>
  );
}
