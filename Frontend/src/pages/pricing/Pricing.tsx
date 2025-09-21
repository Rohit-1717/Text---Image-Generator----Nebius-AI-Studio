import Footer from "@/components/footer/Footer";
import NavBar from "@/components/nav/Navbar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";

export default function Pricing() {
  return (
    <>
      <NavBar />
      <section className="py-16 md:py-32">
        <div className="mx-auto max-w-6xl px-6">
          {/* Header */}
          <div className="mx-auto max-w-2xl space-y-6 text-center">
            <h1 className="text-center text-4xl font-semibold lg:text-5xl">
              Simple, Transparent Pricing
            </h1>
            <p>
              Choose a plan that scales with your creativity. Unlock access to
              the most powerful AI models including Gemini, OpenAI, Midjourney,
              Runway, X-ai, Nebius, and even 3D image generation.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="mt-8 grid gap-6 md:mt-20 md:grid-cols-3">
            {/* Free Plan */}
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="font-medium">Free</CardTitle>
                <span className="my-3 block text-2xl font-semibold">
                  ₹ 0 / mo
                </span>
                <CardDescription className="text-sm">
                  Perfect to get started
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <hr className="border-dashed" />
                <ul className="list-outside space-y-3 text-sm">
                  {[
                    "50 AI-generated images / month",
                    "Access to Gemini & Nebius (basic)",
                    "Community Support",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="size-3" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="mt-auto">
                <Button variant="outline" className="w-full">
                  Get Started
                </Button>
              </CardFooter>
            </Card>

            {/* Pro Plan */}
            <Card className="relative">
              <span className="bg-linear-to-br/increasing absolute inset-x-0 -top-3 mx-auto flex h-6 w-fit items-center rounded-full from-purple-400 to-amber-300 px-3 py-1 text-xs font-medium text-amber-950 ring-1 ring-inset ring-white/20 ring-offset-1 ring-offset-gray-950/5">
                Popular
              </span>

              <div className="flex flex-col">
                <CardHeader>
                  <CardTitle className="font-medium">Pro</CardTitle>
                  <span className="my-3 block text-2xl font-semibold">
                    ₹ 1,499 / mo
                  </span>
                  <CardDescription className="text-sm">
                    For creators & designers
                  </CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  <hr className="border-dashed" />
                  <ul className="list-outside space-y-3 text-sm">
                    {[
                      "Unlimited AI-generated images",
                      "Full access: Gemini, OpenAI, Runway-AI",
                      "Advanced Styles: Anime, Realism, Abstract",
                      "Priority Rendering",
                      "Custom Prompts & Filters",
                      "Download in HD",
                      "Regular Feature Updates",
                      "Standard Security Features",
                    ].map((item, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <Check className="size-3" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>

                <CardFooter>
                  <Button className="w-full mt-5">Get Started</Button>
                </CardFooter>
              </div>
            </Card>

            {/* Startup Plan */}
            <Card className="flex flex-col">
              <CardHeader>
                <CardTitle className="font-medium">Startup</CardTitle>
                <span className="my-3 block text-2xl font-semibold">
                  ₹ 2,499 / mo
                </span>
                <CardDescription className="text-sm">
                  For small teams & studios
                </CardDescription>
              </CardHeader>

              <CardContent className="space-y-4">
                <hr className="border-dashed" />
                <ul className="list-outside space-y-3 text-sm">
                  {[
                    "Everything in Pro Plan",
                    "Access to Midjourney & X-ai models",
                    "3D Image Generation",
                    "Team Collaboration Tools",
                    "Shared Workspace",
                    "Early Access to Beta Features",
                  ].map((item, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <Check className="size-3" />
                      {item}
                    </li>
                  ))}
                </ul>
              </CardContent>

              <CardFooter className="mt-auto">
                <Button variant="outline" className="w-full">
                  Get Started
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
