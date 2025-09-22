import logo from "/logo.webp";

export default function PrivacyPolicy() {
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
          <h1 className="text-3xl md:text-4xl font-semibold mb-2">
            Privacy Policy
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto lg:mx-0 mb-4">
            At Morphix AI, your privacy is our priority. This Privacy Policy
            explains what information we collect, how we use it, and your rights
            regarding your personal data.
          </p>
          <a
            href="/terms-of-service"
            className="text-blue-500 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            View our Terms of Service
          </a>
        </div>

        {/* Sections */}
        <div className="space-y-12">
          <div>
            <h2 className="text-xl md:text-2xl font-semibold mb-3">
              1. Information We Collect
            </h2>
            <p className="text-muted-foreground">
              We collect personal information that you provide directly, such as
              your name, email address, and account details. We also collect
              information automatically through usage data, cookies, and
              analytics tools to improve our platform.
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold mb-3">
              2. How We Use Your Information
            </h2>
            <ul className="list-disc list-outside pl-5 text-muted-foreground space-y-2">
              <li>Provide and maintain our AI services.</li>
              <li>
                Personalize user experience and improve our platform features.
              </li>
              <li>
                Communicate important updates, notifications, and support
                information.
              </li>
              <li>
                Ensure security, prevent fraud, and comply with legal
                obligations.
              </li>
            </ul>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold mb-3">
              3. Sharing and Disclosure
            </h2>
            <p className="text-muted-foreground">
              Morphix AI does not sell your personal information. We may share
              your data with trusted service providers, partners, or when
              required by law.
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold mb-3">
              4. Cookies and Tracking Technologies
            </h2>
            <p className="text-muted-foreground">
              We use cookies and similar technologies to provide a better user
              experience, analyze trends, and improve our services. You can
              manage your preferences in your browser settings.
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold mb-3">
              5. Your Rights
            </h2>
            <p className="text-muted-foreground">
              You have the right to access, correct, or delete your personal
              information. To exercise these rights, please contact our support
              team at <strong>support@morphixai.com</strong>.
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold mb-3">
              6. Security
            </h2>
            <p className="text-muted-foreground">
              We implement reasonable administrative, technical, and physical
              measures to protect your information. However, no method of
              transmission over the Internet or electronic storage is completely
              secure.
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold mb-3">
              7. Updates to this Policy
            </h2>
            <p className="text-muted-foreground">
              Morphix AI may update this Privacy Policy periodically. Changes
              will be posted on this page with the effective date.
            </p>
          </div>

          <div>
            <h2 className="text-xl md:text-2xl font-semibold mb-3">
              8. Contact Us
            </h2>
            <p className="text-muted-foreground">
              For any questions or concerns regarding this Privacy Policy,
              please reach out to us at <strong>support@morphixai.com</strong>.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
