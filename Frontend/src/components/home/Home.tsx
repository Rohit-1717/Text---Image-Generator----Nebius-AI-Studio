import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Menu, SendHorizonal, X, Wand } from "lucide-react";
import Footer from "../footer/Footer";
import Features from "../features/Features";
import Multi_Modal from "../multi-modal/Multi_Modal";
import Testimonials from "../testimonials/Testimonials";
import Faqs from "../faqs/Faqs";
import Call_To_Action from "../call_to_action/Call_To_Action";

const menuItems = [
  { name: "Features", href: "/features" },
  { name: "Use Cases", href: "/use-cases" },
  { name: "Pricing", href: "/pricing" },
  { name: "About", href: "/about" },
];

export default function HeroSection() {
  const [menuState, setMenuState] = useState(false);

  return (
    <>
      <header>
        <nav
          data-state={menuState ? "active" : undefined}
          className="fixed z-20 w-full border-b border-dashed bg-white backdrop-blur md:relative dark:bg-zinc-950/50 lg:dark:bg-transparent"
        >
          <div className="m-auto max-w-5xl px-6">
            <div className="flex flex-wrap items-center justify-between gap-6 py-3 lg:gap-0 lg:py-4">
              <div className="flex w-full justify-between lg:w-auto">
                <a
                  href="/"
                  aria-label="home"
                  className="flex items-center space-x-2 text-center"
                >
                  <img
                    src="/logo.webp" // replace with your logo path
                    alt="Morphix Logo"
                    className="h-8 w-auto" // adjust size as needed
                  />
                  <span className="text-center">Morphix</span>
                </a>

                <button
                  onClick={() => setMenuState(!menuState)}
                  aria-label={menuState ? "Close Menu" : "Open Menu"}
                  className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
                >
                  <Menu className="in-data-[state=active]:rotate-180 in-data-[state=active]:scale-0 in-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                  <X className="in-data-[state=active]:rotate-0 in-data-[state=active]:scale-100 in-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
                </button>
              </div>

              <div className="bg-background in-data-[state=active]:block lg:in-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
                <div className="lg:pr-4">
                  <ul className="space-y-6 text-base lg:flex lg:gap-8 lg:space-y-0 lg:text-sm">
                    {menuItems.map((item, index) => (
                      <li key={index}>
                        <a
                          href={item.href}
                          className="text-muted-foreground hover:text-accent-foreground block duration-150"
                        >
                          <span>{item.name}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit lg:border-l lg:pl-6">
                  <Button asChild variant="outline" size="sm">
                    <a href="/login">
                      <span>Login</span>
                    </a>
                  </Button>

                  <Button asChild size="sm">
                    <a href="/signup">
                      <span>Get Started</span>
                    </a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </nav>
      </header>

      <main>
        <section className="overflow-hidden">
          <div className="relative mx-auto max-w-5xl px-6 py-28 lg:py-20">
            <div className="lg:flex lg:items-center lg:gap-12">
              <div className="relative z-10 mx-auto max-w-xl text-center lg:ml-0 lg:w-1/2 lg:text-left">
                <a
                  href="/"
                  className="rounded-(--radius) mx-auto flex w-fit items-center gap-2 border p-1 pr-3 lg:ml-0"
                >
                  <span className="bg-muted rounded-[calc(var(--radius)-0.25rem)] px-2 py-1 text-xs">
                    New
                  </span>
                  <span className="text-sm">Dream Image Maker</span>
                  <span className="bg-(--color-border) block h-4 w-px"></span>
                  <ArrowRight className="size-4" />
                </a>

                <h1 className="mt-10 text-balance text-4xl font-bold md:text-5xl xl:text-5xl">
                  Turn Your Ideas into Stunning Images in Seconds
                </h1>
                <p className="mt-8">
                  Describe your idea in words. Our AI instantly transforms it
                  into stunning images — simple, fast, and creative.
                </p>

                <div>
                  <form
                    onSubmit={(e) => e.preventDefault()}
                    className="mx-auto my-10 max-w-sm lg:my-12 lg:ml-0 lg:mr-auto"
                  >
                    <div className="bg-background has-[input:focus]:ring-muted relative grid grid-cols-[1fr_auto] items-center rounded-[calc(var(--radius)+0.75rem)] border pr-3 shadow shadow-zinc-950/5 has-[input:focus]:ring-2">
                      <Wand className="text-caption pointer-events-none absolute inset-y-0 left-5 my-auto size-5" />

                      <input
                        placeholder="Describe your image idea..."
                        className="h-14 w-full bg-transparent pl-12 focus:outline-none"
                        type="email"
                      />

                      <div className="md:pr-1.5 lg:pr-0">
                        <Button
                          aria-label="submit"
                          className="rounded-(--radius)"
                          type="submit"
                        >
                          <span className="hidden md:block">Generate</span>
                          <SendHorizonal
                            className="relative mx-auto size-5 md:hidden"
                            strokeWidth={2}
                          />
                        </Button>
                      </div>
                    </div>
                  </form>

                  <ul className="list-inside list-disc space-y-2">
                    <li>Lightning-fast AI generations</li>
                    <li>HD & customizable outputs</li>
                    <li>Multiple AI Models</li>
                  </ul>
                </div>
              </div>
            </div>
            <div className="absolute inset-0 -mx-4 rounded-3xl p-3 lg:col-span-3">
              <div className="relative">
                <div className="bg-radial-[at_65%_25%] to-background z-1 -inset-17 absolute from-transparent to-40%"></div>
                <img
                  className="hidden dark:block"
                  src="/image1.webp"
                  alt="app illustration"
                  width={2796}
                  height={2008}
                />
                <img
                  className="dark:hidden"
                  src="/music-light.png"
                  alt="app illustration"
                  width={2796}
                  height={2008}
                />
              </div>
            </div>
          </div>
        </section>
        <Features />
        <Multi_Modal />
        <Testimonials />
        <Faqs />
        <Call_To_Action />
        <Footer />
      </main>
    </>
  );
}
