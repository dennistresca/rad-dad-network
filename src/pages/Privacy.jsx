// TODO: have this reviewed by an attorney before relying on it. This is a
// standard-template privacy policy, not customized legal advice.
const LAST_UPDATED = "2026-08-13";
const CONTACT_EMAIL = "raddadnetwork@mail.com";

const formatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

export default function Privacy() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-black text-neutral-900 sm:text-4xl">Privacy Policy</h1>
      <p className="mt-2 text-sm text-neutral-500">
        Last updated: {formatter.format(new Date(LAST_UPDATED))}
      </p>

      <div className="mt-8 space-y-8 text-neutral-700">
        <section>
          <h2 className="text-xl font-bold text-neutral-900">Introduction</h2>
          <p className="mt-2">
            Rad Dad Network ("we," "us," or "our") operates this website. This Privacy Policy
            explains what information we collect when you visit, how we use it, and the choices
            you have.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-neutral-900">Information We Collect</h2>
          <p className="mt-2">
            The only personal information we collect directly is what you choose to submit
            through our Contact form: your name, email address, and message. We use this
            information solely to respond to your inquiry.
          </p>
          <p className="mt-2">
            We do not currently use cookies, analytics, or advertising trackers on this site. If
            that changes in the future, we will update this policy to describe what is collected
            and why.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-neutral-900">Third-Party Services</h2>
          <p className="mt-2">
            Our Contact form is processed by Web3Forms, a third-party form service, which
            receives the information you submit in order to deliver it to us by email. We link
            out to third-party platforms, including Apple Podcasts, Spotify, YouTube, Facebook,
            TikTok, X, and our Printify-hosted merchandise store. Each of these platforms has its
            own privacy policy governing information collected when you visit or interact with
            them, and we encourage you to review those policies directly.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-neutral-900">Children's Privacy</h2>
          <p className="mt-2">
            This site is not directed at children under 13, and we do not knowingly collect
            personal information from children under 13.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-neutral-900">Data Security</h2>
          <p className="mt-2">
            We take reasonable measures to protect the limited information we collect, but no
            method of electronic transmission or storage is completely secure, and we cannot
            guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-neutral-900">Your Choices</h2>
          <p className="mt-2">
            You may contact us at any time to ask what information we hold about you or to
            request that we delete it.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-neutral-900">Changes to This Policy</h2>
          <p className="mt-2">
            We may update this Privacy Policy from time to time. The "Last updated" date above
            reflects the most recent revision.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-neutral-900">Contact Us</h2>
          <p className="mt-2">
            Questions about this policy can be sent to{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="underline">
              {CONTACT_EMAIL}
            </a>
            .
          </p>
        </section>
      </div>
    </div>
  );
}
