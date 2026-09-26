// Legal pages (/privacy). The policy body is markdown rendered by
// <Markdown>; it must describe what the code actually does today — update it
// (and PRIVACY_UPDATED in src/app/(app)/privacy/page.tsx) whenever data
// collection, a recipient or the AI provider changes.
export const legal = {
  privacy: {
    metaTitle: "Privacy Policy — TUSST",
    metaDescription:
      "What personal data TUSST collects, why, who receives it and how to exercise your rights.",
    kicker: "legal",
    title: "Privacy Policy",
    updated: "Last updated: {date}",
    body: `TUSST is a free, open-source learning platform for Rust and the Stellar network, available at tusst.xyz. This policy explains what personal data we collect when you use it, why we collect it, who receives it and what your rights are.

## Who is responsible

TUSST is maintained by Pedro Pelicioni, in Brazil. He is the controller of your personal data and the contact for any privacy question or request (the "encarregado" under Brazil's LGPD): [pedro@vants.xyz](mailto:pedro@vants.xyz).

## What we collect

- **Your account.** When you sign in with GitHub or Discord, we store your display name (or your username, if you have not set one), your primary email address with that provider (even if it is private on GitHub) and the numeric id of your account there. We do not store your profile picture or other profile details. The sign-in library also stores the tokens the provider issued at your first sign-in (for Discord, including a refresh token). They only allow reading your profile and email address, and we never use them to access your GitHub or Discord account.
- **Your progress.** The lessons, Journey chapters and labs you completed and when, the experience points (XP) each one earned and your level, the hero you picked, your in-game gold, the Armory items you bought and what you paid for them, and your preferred language.
- **The code you submit.** When you run a lesson's code, we store the code, the grading results and the program output, with the date and time. This keeps your progress and lets us fix lessons that are broken or too hard.
- **Mentor and examiner feedback.** When you ask the AI mentor for a hint or submit a spec to the Journey examiner, we store the text it wrote back (which may quote your code), the model that wrote it, your language, the lesson it refers to (if any) and when. We do not store the Forge files or the spec you sent it.
- **Lab evidence.** When you claim a lab, we store the public Stellar testnet address, contract id and transaction hashes involved.
- **Usage statistics.** We use Vercel Web Analytics, which records the pages you visit, the site you came from, your country, browser, operating system and device type, and a few interface events (for example, which sign-in button was clicked or which hero you picked). It uses no cookies and is not linked to your account; visitors are counted with a hash of the IP address and browser that changes every day.
- **Technical data.** Like any website, our hosting (Vercel) and our code runner (DigitalOcean) receive your IP address and basic browser information with each request, to deliver the site and keep it secure. The code runner also uses your IP address to limit how many builds, tests and audits each visitor can start; it is kept only in that server's memory and is never written to our database.

You need a GitHub or Discord account to sign in. Without signing in you can still read lessons, run the first lesson and use the Forge: code you run this way is sent to our code runner to be graded or built, is not stored and is not linked to anyone. Your progress is not saved, and the mentor and the examiner are not available.

## What stays in your browser

Some data is kept only in your browser's storage on your device, and we keep no copy of it: your unsent lesson code drafts and Journey specs, your Forge IDE projects, deployment history and layout, lab progress before you claim it, the passkey wallet data created in the passkey lab (the passkey itself is kept by your device or password manager), your position on the maps, tutorial and music settings, and the secret key of any testnet wallet you create or import in the labs and the Forge. We never receive that key.

Some of this data is sent to us only when you use a feature that needs it: your lesson code when you run it, your Forge or lab project files each time you build, test or audit them (they go to our code runner and are deleted when the run ends), your Forge files and console output when you ask the mentor for help, and the address and transaction hashes when you claim a lab. Clearing your browser's site data erases everything that is stored only in your browser.

## Cookies

We only use cookies the site needs to work: the sign-in session cookie (encrypted; it holds your name, email address and account id and expires after 30 days without use), short-lived cookies that protect the sign-in step, and a cookie that remembers your language for one year. An older cookie that recorded an onboarding answer is still read if your browser has it, but it is no longer set. We do not use advertising or cross-site tracking cookies, which is why there is no cookie banner.

## How we use your data

- To run TUSST: sign you in, save your progress, grade your code and award XP, gold and items.
- To generate the mentor hints you ask for, and to have an AI examiner check the specs you submit in Journey exercises against the chapter's rubric. The examiner's verdict alone decides whether you earn that exercise's XP; you can ask us to review a verdict and to explain the criteria used (see "Your rights").
- To answer support requests and to fix lessons, including by looking at the attempts submitted to them.
- To keep the platform secure and fair, preventing cheating, abuse and overload.
- To understand, in aggregate, how the platform is used and improve the lessons.

We do not sell your data, we do not show ads and we do not send marketing emails.

## Legal bases

We process your data to provide the service you use or signed up for (LGPD art. 7, V; GDPR art. 6(1)(b)). For security, abuse prevention and rate limiting, support, fixing lessons based on submitted attempts, and aggregate statistics, we rely on our legitimate interest in running a safe and useful free platform (LGPD art. 7, IX; GDPR art. 6(1)(f)).

## Who receives your data

- **Vercel**: hosts the site and provides the usage statistics.
- **Neon**: hosts our database.
- **DigitalOcean**: runs our code runner (forge.tusst.xyz, in the United States), which compiles and runs your code in isolated sandboxes. Lesson code reaches it through our site; Forge and lab builds are sent to it directly from your browser, so it also sees your IP address. Code sent there is deleted as soon as the run ends and is not linked to your account.
- **Groq** (AI model provider): when you ask the mentor for a hint, it receives the code, the names of the failed checks and the compiler or program output of your latest failed attempt, or up to six files of your Forge project and its console output. When you submit a spec to the Journey examiner, it receives that spec. It is also told which language to answer in. It never receives your name, email address, account id or IP address.
- **Raven (raven.stellar.buzz)**: a Stellar documentation search service. To ground some mentor hints, our server may send it a short query, such as a lesson title or the first line of an error.
- **GitHub and Discord**: when you choose them to sign in, they confirm your identity to us. They handle your data under their own privacy policies, not on our behalf.
- **Stellar Development Foundation (SDF)**: the labs and the Forge connect directly from your browser to SDF's public testnet servers (Horizon, RPC and Friendbot), which see your IP address and your testnet address. When you claim a lab, our server looks up your testnet address on those servers to check your work. Transactions you make, the addresses involved and any contract you deploy (including its compiled code) are public by design on the Stellar testnet, which is reset periodically. The address we store links that public activity to your TUSST account.

## Services your browser contacts directly

Some features make your browser connect directly to other services. Those services see your IP address and what was requested, under their own privacy policies:

- **jsDelivr**, which delivers the code editor used in lessons and the Forge.
- **GitHub**, when you import a public repository into the Forge.
- **The wallet you choose** in the Forge wallet menu (for example Freighter or Albedo), and Creit Tech (stellar.creit.tech), which serves the icons in that menu.

## International transfers

Most of these services are located outside Brazil and the European Union, mainly in the United States. We transfer data to them because it is necessary to provide the service you asked for (LGPD art. 33, IX). Where a provider offers them, we also rely on its data-processing terms, standard contractual clauses or its certification under the EU–U.S. Data Privacy Framework. Write to us to find out which safeguard applies to each provider or to get a copy.

## How long we keep it

We keep your account data, progress, submitted code and mentor and examiner feedback while your account exists. Our code runner keeps IP addresses only in memory, until it restarts; other technical data is kept only as long as our hosting providers keep their request logs. The sign-in cookie expires after 30 days without use and the language cookie after one year. When you ask us to delete your account, we delete it and all associated data within 30 days; copies in our database provider's short-term backups disappear when those backups expire. What is public on the Stellar testnet is outside our control.

## Your rights

You may ask us to confirm whether we process your data; to access, correct, export or delete it; to anonymize, block or restrict data that is unnecessary, excessive or processed unlawfully; to know who we share it with; to object to processing based on legitimate interest; and to have an automated decision, such as a Journey examiner verdict, reviewed. Write to [pedro@vants.xyz](mailto:pedro@vants.xyz) from the email address linked to your account; we reply within 15 days. You can also file a complaint with Brazil's data protection authority (ANPD) or with the authority in your country.

## Children

TUSST is not intended for children under 13, and we do not knowingly allow them to create accounts. If you are under 18, use TUSST with the knowledge of a parent or guardian. If you believe a child under 13 has an account, write to us and we will delete it.

## Security

Traffic is encrypted (HTTPS), your code runs in isolated sandboxes without network access, and access to production systems is restricted to the maintainer. No system is perfectly secure: if we learn of an incident that affects your data, we will notify you and the competent authority as the law requires.

## Changes to this policy

We update this page when our practices change and update the date at the top. Significant changes will also be announced on the site.`,
  },
};
