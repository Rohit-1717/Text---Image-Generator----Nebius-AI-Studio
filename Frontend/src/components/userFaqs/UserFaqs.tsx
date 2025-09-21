import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function UserFaqs() {
  // Back button handler with fallback
  const navigate = useNavigate();

  const handleBack = () => {
    // navigate to Settings page with Support tab
    navigate("/settings?tab=support");
  };

  return (
    <section className="scroll-py-16 py-12 md:scroll-py-32 md:py-20">
      <div className="mx-auto max-w-5xl px-6">
        {/* Company Logo + Name */}
        <div className="mb-4 flex items-center justify-center lg:justify-start gap-3">
          <img src="/logo.webp" alt="Morphix Logo" className="h-12 w-auto" />
          <span className="text-2xl font-bold">Morphix</span>
        </div>

        {/* Back Button */}
        <Button
          variant="ghost"
          className="mb-6 flex items-center gap-2"
          onClick={handleBack}
        >
          <ArrowLeft size={16} /> Back
        </Button>

        <div className="grid gap-y-12 px-2 lg:[grid-template-columns:1fr_auto]">
          <div className="text-center lg:text-left">
            <h2 className="mb-4 text-3xl font-semibold md:text-4xl">
              Frequently <br className="hidden lg:block" /> Asked{" "}
              <br className="hidden lg:block" />
              Questions
            </h2>
            <p>
              Everything you need to know about using our AI image generator.
            </p>
          </div>

          <div className="divide-y divide-dashed sm:mx-auto sm:max-w-lg lg:mx-0">
            <div className="pb-6">
              <h3 className="font-medium">
                What subscription plans are available?
              </h3>
              <p className="text-muted-foreground mt-4">
                We offer three plans: Free, Pro, and Premium (Startup). Each
                plan provides access to different AI models and features.
              </p>
              <ul className="list-outside list-disc space-y-2 pl-4 mt-4 text-muted-foreground">
                <li>
                  Free: Limited AI-generated images per month and basic models
                  (Gemini & Nebius).
                </li>
                <li>
                  Pro: Unlimited images, access to premium models like Gemini,
                  OpenAI, Runway-AI, and advanced styles.
                </li>
                <li>
                  Premium/Startup: Team collaboration, 3D image generation,
                  Midjourney & X-ai access, plus early beta features.
                </li>
              </ul>
            </div>

            <div className="py-6">
              <h3 className="font-medium">How do I upgrade my subscription?</h3>
              <p className="text-muted-foreground mt-4">
                You can upgrade at any time by going to your account → Billing
                tab → Select desired plan. Payment is processed via PhonePe.
              </p>
            </div>

            <div className="py-6">
              <h3 className="font-medium">Can I cancel my subscription?</h3>
              <p className="text-muted-foreground mt-4">
                Yes, you can cancel your subscription anytime from your Billing
                tab. Cancellation will take effect at the end of your current
                billing cycle.
              </p>
            </div>

            <div className="py-6">
              <h3 className="font-medium">
                Do you provide support if I face issues?
              </h3>
              <p className="text-muted-foreground mt-4">
                Yes! You can contact our support team via the Support tab in
                your account. Options include FAQs, email support, and reporting
                any issues directly.
              </p>
            </div>

            <div className="py-6">
              <h3 className="font-medium">Do you offer refunds?</h3>
              <p className="text-muted-foreground mt-4">
                We provide a 7-day refund policy for paid subscriptions. To
                request a refund, contact support with your order ID and reason.
              </p>
            </div>

            <div className="py-6">
              <h3 className="font-medium">Which AI models are available?</h3>
              <p className="text-muted-foreground mt-4">
                Our platform provides multiple models:
              </p>
              <ul className="list-outside list-disc space-y-2 pl-4 mt-2 text-muted-foreground">
                <li>Gemini</li>
                <li>OpenAI</li>
                <li>X-ai</li>
                <li>Midjourney</li>
                <li>Runway-AI</li>
                <li>Nebius</li>
                <li>3D Image Generation</li>
              </ul>
            </div>

            <div className="py-6">
              <h3 className="font-medium">Is there phone support available?</h3>
              <p className="text-muted-foreground mt-4">
                Currently, we do not offer phone support. All support requests
                should be submitted via the Support tab or email.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
