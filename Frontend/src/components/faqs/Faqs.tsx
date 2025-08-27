import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

export default function Faqs() {
  const faqItems = [
    {
      id: "item-1",
      question: "How do I generate 3D models using your platform?",
      answer:
        "Our platform leverages NVIDIA Edify to convert text or image prompts into high-quality 3D assets in under 2 minutes. Simply input your description or upload an image, and our AI handles the rest.",
    },
    {
      id: "item-2",
      question: "Is there a free trial available?",
      answer:
        "Yes, we offer a limited free trial that allows you to generate up to 5 images or 3D models. Once the trial is used, you can choose from various subscription plans based on your needs.",
    },
    {
      id: "item-3",
      question: "What payment methods are accepted?",
      answer:
        "We accept major credit and debit cards (Visa, Mastercard, American Express), as well as digital wallets like Apple Pay, Google Pay, and Amazon Pay. Payments are securely processed via Stripe.",
    },

    {
      id: "item-4",
      question: "Can I use generated images for commercial purposes?",
      answer:
        "Commercial usage is typically allowed with paid plans. Platforms like getimg.ai permit commercial use only on paid subscriptions.",
    },

    {
      id: "item-5",
      question: "What is the quality of images generated?",
      answer:
        "Image quality varies by model. Advanced models like Imagen 4 offer high-quality outputs, while others may provide faster but lower-quality images.",
    },
  ];

  return (
    <section className="py-16 md:py-24">
      <div className="mx-auto max-w-5xl px-4 md:px-6">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="text-muted-foreground mt-4 text-balance">
            Discover quick and comprehensive answers to common questions about
            our platform, services, and features.
          </p>
        </div>

        <div className="mx-auto mt-12 max-w-xl">
          <Accordion
            type="single"
            collapsible
            className="bg-card ring-muted w-full rounded-2xl border px-8 py-3 shadow-sm ring-4 dark:ring-0"
          >
            {faqItems.map((item) => (
              <AccordionItem
                key={item.id}
                value={item.id}
                className="border-dashed"
              >
                <AccordionTrigger className="cursor-pointer text-base hover:no-underline">
                  {item.question}
                </AccordionTrigger>
                <AccordionContent>
                  <p className="text-base">{item.answer}</p>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </div>
    </section>
  );
}
