import { useState } from "react";
import Footer from "@/components/footer/Footer";
import NavBar from "@/components/nav/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Sparkles, Wand, ImageIcon, Palette } from "lucide-react";
import { BorderBeam } from "@/components/magicui/border-beam";
function Use_Cases() {
  type ImageKey = "item-1" | "item-2" | "item-3" | "item-4";
  const [activeItem, setActiveItem] = useState<ImageKey>("item-1");

  const images = {
    "item-1": {
      image: "/Creative_Image_Styles.png",
      alt: "Creative_Image_Styles",
    },
    "item-2": {
      image: "/Stunning_AI.png",
      alt: "Stunning AI Image",
    },
    "item-3": {
      image: "/Customization_Editing.png",
      alt: "Customization_Editing",
    },
    "item-4": {
      image: "/AI-Powered_Inspiration.png",
      alt: "AI-Powered_Inspiration",
    },
  };
  return (
    <>
      <NavBar />
      <section className="py-12 md:py-20 lg:py-32">
        <div className="bg-linear-to-b absolute inset-0 -z-10 sm:inset-6 sm:rounded-b-3xl dark:block dark:to-[color-mix(in_oklab,var(--color-zinc-900)_75%,var(--color-background))]"></div>
        <div className="mx-auto max-w-5xl space-y-8 px-6 md:space-y-16 lg:space-y-20 dark:[--color-border:color-mix(in_oklab,var(--color-white)_10%,transparent)]">
          {/* Section Header */}
          <div className="relative z-10 mx-auto max-w-2xl space-y-6 text-center">
            <h2 className="text-balance text-4xl font-semibold lg:text-6xl">
              AI-Powered Visual Creations
            </h2>
            <p>
              Our platform delivers AI-powered image generation, supporting
              creative workflows and tools that help designers, brands, and
              developers build visuals faster.
            </p>
          </div>

          <div className="grid gap-12 sm:px-12 md:grid-cols-2 lg:gap-20 lg:px-0">
            {/* Accordion Section */}
            <Accordion
              type="single"
              value={activeItem}
              onValueChange={(value) => setActiveItem(value as ImageKey)}
              className="w-full"
            >
              {/* Item 1 */}
              <AccordionItem value="item-1">
                <AccordionTrigger>
                  <div className="flex items-center gap-2 text-base">
                    <ImageIcon className="size-4" />
                    Creative Image Styles
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  Generate visuals in diverse styles — from photorealism and
                  anime to sketches, surrealism, and abstract art.
                  <br />
                  <strong>Image Idea:</strong> Split canvas showing one prompt
                  rendered in multiple artistic styles.
                </AccordionContent>
              </AccordionItem>
              {/* Item 2 */}
              <AccordionItem value="item-2">
                <AccordionTrigger>
                  <div className="flex items-center gap-2 text-base">
                    <Wand className="size-4" />
                    Create Stunning AI Art
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  Instantly turn your prompts into breathtaking visuals with
                  multiple AI models in one place.
                  <br />
                  <strong>Image Idea:</strong> A vibrant digital artwork
                  (abstract neon cityscape or surreal landscape).
                </AccordionContent>
              </AccordionItem>

              {/* Item 3 */}
              <AccordionItem value="item-3">
                <AccordionTrigger>
                  <div className="flex items-center gap-2 text-base">
                    <Palette className="size-4" />
                    Customization & Editing
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  Refine and edit AI-generated images with filters, color
                  grading, and prompt-based modifications.
                  <br />
                  <strong>Image Idea:</strong> A side-by-side before/after
                  showing original AI art vs enhanced/customized version.
                </AccordionContent>
              </AccordionItem>

              {/* Item 4 */}
              <AccordionItem value="item-4">
                <AccordionTrigger>
                  <div className="flex items-center gap-2 text-base">
                    <Sparkles className="size-4" />
                    AI-Powered Inspiration
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  Discover fresh ideas with AI-assisted suggestions to push your
                  creativity beyond limits.
                  <br />
                  <strong>Image Idea:</strong> A glowing AI brain projecting
                  creative concept sketches into the air.
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {/* Image Preview Section */}
            <div className="bg-background relative flex overflow-hidden rounded-3xl border p-2">
              <div className="w-15 absolute inset-0 right-0 ml-auto border-l bg-[repeating-linear-gradient(-45deg,var(--color-border),var(--color-border)_1px,transparent_1px,transparent_8px)]"></div>
              <div className="aspect-76/59 bg-background relative w-[calc(3/4*100%+3rem)] rounded-2xl">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={`${activeItem}-id`}
                    initial={{ opacity: 0, y: 6, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 6, scale: 0.98 }}
                    transition={{ duration: 0.2 }}
                    className="size-full overflow-hidden rounded-2xl border bg-zinc-900 shadow-md"
                  >
                    <img
                      src={images[activeItem].image}
                      alt={images[activeItem].alt}
                      className="size-full object-cover object-left-top dark:mix-blend-lighten"
                    />
                  </motion.div>
                </AnimatePresence>
              </div>
              <BorderBeam
                duration={6}
                size={200}
                className="from-transparent via-yellow-700 to-transparent dark:via-white/50"
              />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}

export default Use_Cases;
