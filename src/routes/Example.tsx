import { Footer } from "@/components/Layout/Footer";
import Header from "../components/Layout/Header";
import { Login01 } from "./Examples/Login01";
import { Login04 } from "./Examples/Login04";

export default function ExamplePage() {
  return (
    <div className="relative flex h-auto min-h-screen w-full flex-1 flex-col items-center justify-start bg-background">
      <Header />

      <div className="relative flex w-full flex-1 flex-col items-center justify-start border-accent border-b border-dashed">
        <div className="flex min-h-[calc(100vh-4rem)] w-full max-w-screen-2xl flex-col gap-4 border-accent border-dashed px-1 pt-4 *:max-w-[100vw] *:overflow-auto 2xl:border-x 2xl:px-4">
          <div className=" flex flex-col items-start gap-10 py-4 md:p-2">
            <h1 className="font-bold text-2xl leading-tight tracking-tighter md:text-3xl lg:leading-[1.1]">
              Check out some examples
            </h1>

            <div className="flex h-screen w-full flex-col items-center justify-center overflow-auto rounded-md bg-muted p-6 shadow md:p-10">
              <Login01 className="w-full max-w-lg" />
            </div>

            <div className="flex h-screen w-full flex-col items-center justify-center overflow-auto rounded-md bg-muted p-6 shadow md:p-10">
              <Login04 className="w-full max-w-3xl" />
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
