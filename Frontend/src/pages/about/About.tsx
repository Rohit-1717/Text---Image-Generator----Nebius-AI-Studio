import Footer from "@/components/footer/Footer";
import NavBar from "@/components/nav/Navbar";
import { Cpu, Zap, Users } from "lucide-react";
function About() {
  return (
    <>
      <NavBar />
      <section className="py-16 md:py-32">
        <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16">
          {/* Heading */}
          <h2 className="relative z-10 max-w-xl text-4xl font-medium lg:text-5xl">
            About <span className="text-purple-500">Morphix</span> – Our Vision
            & Mission
          </h2>

          <div className="relative">
            {/* Left Content */}
            <div className="relative z-10 space-y-4 md:w-1/2">
              <p>
                At <span className="font-medium">Morphix</span>, we believe
                creativity should have no boundaries. Our platform is more than
                just AI models —{" "}
                <span className="font-medium">it’s a complete ecosystem</span>{" "}
                designed to empower creators, developers, and businesses to
                bring their boldest ideas to life.
              </p>
              <p>
                From intuitive tools to powerful APIs, Morphix provides
                everything you need to generate, customize, and scale stunning
                visuals effortlessly. Whether you’re an independent creator or
                an enterprise team, Morphix adapts seamlessly to your
                imagination.
              </p>

              {/* Highlights */}
              <div className="grid grid-cols-1 gap-6 pt-6 sm:grid-cols-2 lg:grid-cols-3">
                {/* Highlight 1 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Zap className="size-4 text-yellow-500" />
                    <h3 className="text-sm font-medium">Lightning Fast</h3>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Generate high-quality images in seconds with
                    industry-leading speed and performance.
                  </p>
                </div>

                {/* Highlight 2 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Cpu className="size-4 text-purple-500" />
                    <h3 className="text-sm font-medium">Powerful AI</h3>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Built on cutting-edge AI designed for realism, creativity,
                    and scalability at every level.
                  </p>
                </div>

                {/* Highlight 3 */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Users className="size-4 text-green-500" />
                    <h3 className="text-sm font-medium">
                      Designed for Everyone
                    </h3>
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Easy to use for beginners, yet powerful enough for
                    professionals and businesses worldwide.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Image */}
            <div className="mt-12 h-fit md:absolute md:-inset-y-12 md:inset-x-0 md:mt-0">
              <div
                aria-hidden
                className="bg-linear-to-l z-1 to-background absolute inset-0 hidden from-transparent to-55% md:block"
              ></div>
              <div className="border-border/50 relative rounded-2xl border border-dotted p-2">
                <img
                  src="/Image2.webp"
                  className=" rounded-[12px]"
                  alt="AI ecosystem illustration dark"
                  width={1207}
                  height={400}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default About;
