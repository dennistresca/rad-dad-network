// TODO: have this reviewed by an attorney before relying on it, especially
// the sports betting disclaimer. This is a standard-template terms page,
// not customized legal advice.
const LAST_UPDATED = "2026-08-13";
const CONTACT_EMAIL = "raddadnetwork@mail.com";
const GOVERNING_STATE = "Nebraska";

const formatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  timeZone: "UTC",
});

export default function Terms() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-black text-neutral-900 sm:text-4xl">Terms of Service</h1>
      <p className="mt-2 text-sm text-neutral-500">
        Last updated: {formatter.format(new Date(LAST_UPDATED))}
      </p>

      <div className="mt-8 space-y-8 text-neutral-700">
        <section>
          <h2 className="text-xl font-bold text-neutral-900">Acceptance of Terms</h2>
          <p className="mt-2">
            By accessing this website, you agree to these Terms of Service. If you don't agree,
            please don't use the site.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-neutral-900">Use of the Site</h2>
          <p className="mt-2">
            This site provides podcast episodes, show information, blog content, and related
            material for entertainment and informational purposes. You agree to use it only for
            lawful purposes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-neutral-900">Sports Betting Content Disclaimer</h2>
          <p className="mt-2">
            Dancing With the Odds shares betting picks, opinions, and commentary for
            entertainment purposes only. Nothing on this site constitutes professional
            gambling, financial, or investment advice, and we make no guarantee about the
            accuracy or outcome of any pick. Sports betting involves real financial risk and is
            not legal everywhere; you are solely responsible for knowing and following the laws
            in your jurisdiction and for any decisions you make based on content from this site.
            If you or someone you know has a gambling problem, contact the National Council on
            Problem Gambling at 1-800-522-4700.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-neutral-900">Intellectual Property</h2>
          <p className="mt-2">
            All content on this site, including logos, artwork, episode descriptions, and
            articles, is owned by Rad Dad Network or its hosts unless otherwise noted, and may
            not be reproduced without permission.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-neutral-900">Third-Party Links</h2>
          <p className="mt-2">
            This site links to third-party platforms, including podcast players, social media,
            and our external merchandise store. We don't control those sites and aren't
            responsible for their content, policies, or practices.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-neutral-900">Disclaimer of Warranties</h2>
          <p className="mt-2">
            This site is provided "as is" without warranties of any kind, express or implied. We
            don't guarantee the site will be error-free, uninterrupted, or that content is
            accurate or current.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-neutral-900">Limitation of Liability</h2>
          <p className="mt-2">
            To the fullest extent permitted by law, Rad Dad Network and its hosts are not liable
            for any damages arising from your use of this site or reliance on its content,
            including but not limited to losses related to sports betting decisions.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-neutral-900">Governing Law</h2>
          <p className="mt-2">
            These Terms are governed by the laws of the State of {GOVERNING_STATE}, without
            regard to conflict-of-law principles.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-neutral-900">Changes to These Terms</h2>
          <p className="mt-2">
            We may update these Terms from time to time. The "Last updated" date above reflects
            the most recent revision. Continued use of the site after changes means you accept
            the updated Terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold text-neutral-900">Contact Us</h2>
          <p className="mt-2">
            Questions about these Terms can be sent to{" "}
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
