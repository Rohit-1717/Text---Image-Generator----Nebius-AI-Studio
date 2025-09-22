import logo from "/logo.webp";

export default function TermsOfService() {
  return (
    <section className="scroll-py-16 py-16 md:scroll-py-32 md:py-32">
      <div className="mx-auto max-w-5xl px-6">
        {/* Header */}
        <div className="text-center lg:text-left mb-12">
          <img
            src={logo}
            alt="Morphix AI Logo"
            className="mx-auto lg:mx-0 w-32 h-auto mb-4"
          />
          <h1 className="text-3xl md:text-4xl font-semibold mb-2">Terms of Service</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto lg:mx-0">
            Welcome to Morphix AI! By accessing or using our services, you agree to be bound by these terms. Please read them carefully.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-12">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold mb-3">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground">
              By using Morphix AI, you agree to comply with these Terms of Service and all applicable laws and regulations.
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold mb-3">2. Account Responsibilities</h2>
            <ul className="list-disc list-outside pl-5 text-muted-foreground space-y-2">
              <li>Keep your account credentials secure.</li>
              <li>Notify us immediately of any unauthorized use of your account.</li>
              <li>Provide accurate and up-to-date information when creating an account.</li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold mb-3">3. Use of Services</h2>
            <p className="text-muted-foreground">
              Morphix AI services are intended for lawful use. You agree not to misuse or interfere with our services, or use them to harm others or violate laws.
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold mb-3">4. Intellectual Property</h2>
            <p className="text-muted-foreground">
              All content, trademarks, and intellectual property within Morphix AI are owned by us or our licensors. You may not use our intellectual property without permission.
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold mb-3">5. Payments & Subscriptions</h2>
            <p className="text-muted-foreground">
              Paid services are billed according to the plan you select. Refunds and cancellations follow the policies outlined on our website.
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold mb-3">6. Limitation of Liability</h2>
            <p className="text-muted-foreground">
              Morphix AI is provided "as-is." We are not liable for any direct, indirect, or incidental damages resulting from the use or inability to use our services.
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold mb-3">7. Modifications to Services</h2>
            <p className="text-muted-foreground">
              We reserve the right to update or discontinue services at any time, with or without notice.
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold mb-3">8. Governing Law</h2>
            <p className="text-muted-foreground">
              These Terms are governed by the laws of the country in which Morphix AI operates, without regard to conflict of law principles.
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold mb-3">9. Contact Us</h2>
            <p className="text-muted-foreground">
              For any questions regarding these Terms of Service, please contact us at <strong>support@morphixai.com</strong>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
