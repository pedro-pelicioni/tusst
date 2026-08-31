import type { Concept } from "../types";

// Foundations I — the ground floor. A reader who has never opened a wallet
// must finish this chapter able to say what a blockchain is without using a
// single acronym. Deliberate constraints: no code, no Stellar-specific
// vocabulary until the last step, every idea carried by an everyday object.

export const theBookNoOneCanErase: Concept = {
  meta: {
    slug: "the-book-no-one-can-erase",
    title: "The Book No One Can Erase",
    tagline: "What a blockchain is, told without a single acronym.",
    numeral: "I",
    arc: "foundations",
    level: 0,
    status: "live",
    estMinutes: 10,
    sigil: "/v2/journey/sigils/the-book-no-one-can-erase.webp",
    glyph: "📖",
  },
  steps: [
    {
      kind: "theory",
      body: `## Start with a tab at the tavern

You and eleven friends drink at the same tavern every week. Nobody pays on the spot — the keeper writes it all in a book: *Ana owes 3, Bruno owes 5, Ana paid 3 back.*

The book works. But it has one weakness, and it is not the arithmetic: **the keeper is the only one holding it.** If a page gets rewritten one quiet night, there is nothing to compare it against.

Everything in this chapter comes from fixing that single weakness. No mathematics required — just a better arrangement of the book.`,
    },
    {
      kind: "theory",
      body: `## Fix one: everybody keeps a copy

So you change the rule. Every line the keeper writes, all twelve of you copy into your own book, at the same moment.

Now rewriting a page is nearly pointless. Change your copy and the other eleven simply disagree with you — and the majority is obviously right. The keeper stopped being *the* book and became *one* of the books.

That is the whole idea of a **shared ledger**: not a magic file, just a list of movements that too many people hold at once for any single one of them to quietly edit.`,
    },
    {
      kind: "diagram",
      body: `The whole difference, in three lines:`,
      caption: "Nothing here is cryptography — it is just arithmetic about how many copies exist.",
      view: {
        kind: "compare",
        columns: [
          { id: "one", label: "one keeper", tone: "bad" },
          { id: "many", label: "twelve copies", tone: "good" },
        ],
        rows: [
          {
            label: "rewriting a page",
            cells: [
              { text: "nobody can tell", tone: "bad" },
              { text: "eleven copies disagree", tone: "good" },
            ],
          },
          {
            label: "who you must trust",
            cells: [
              { text: "the keeper", tone: "bad" },
              { text: "nobody in particular", tone: "good" },
            ],
          },
          {
            label: "losing the book",
            cells: [
              { text: "everything is gone", tone: "bad" },
              { text: "eleven copies remain", tone: "good" },
            ],
          },
        ],
      },
    },
    {
      kind: "theory",
      body: `## Fix two: chain the pages together

There is still a gap. What stops someone from rewriting a page from *last year*, deep in the book where nobody looks?

So you add one habit: at the top of every new page, you copy a short summary of the page before it. Page 40 carries a fingerprint of page 39, which carries one of page 38, and so on back to the first.

Now touching an old page changes its fingerprint — which no longer matches the one written on the next page, which no longer matches the next. **One edit far in the past breaks every page that followed it**, loudly, for everyone holding a copy.

Pages linked to the pages before them. That is the "chain" in blockchain — and yes, that is genuinely all the word means.`,
    },
    {
      kind: "widget",
      component: "ledger-tamper",
      body: `Here is that book, chained. **Change any page** and watch what happens to the ones after it.`,
    },
    {
      kind: "quiz",
      question: `Someone with a copy of the shared book quietly rewrites a line from three years ago. What happens?`,
      options: [
        "Everyone notices: the edited page no longer matches the fingerprint recorded on the page after it",
        "Nothing — old pages are too far back for anyone to be checking",
        "The book repairs itself and the edit silently disappears",
      ],
      answer: 0,
      explain: `This is the point of chaining pages. History isn't protected by a lock or a password — it's protected by the fact that changing it *shows*. Everyone else's copy still has the original fingerprints, and yours stops matching.`,
    },
    {
      kind: "theory",
      body: `## Fix three: who writes the next page?

Twelve copies is fine among friends. Now imagine thousands of strangers, scattered across the world, none of whom trust each other — and a new line arriving every few seconds.

Who gets to write it down? If they all write at once, whose version is real?

Every network of this kind exists to answer that one question, and the answer is what makes them different from each other. Some hold a lottery decided by raw computing power. **Stellar holds a vote:** each participant names the others it considers reliable, and a line becomes real when those circles overlap enough to agree.

The practical consequence is the part worth remembering: a new page every **5 seconds or so**, and a fee per movement so small it is measured in fractions of a cent.`,
    },
    {
      kind: "quiz",
      question: `Why does a shared ledger need a rule for *who writes the next page*?`,
      options: [
        "Because thousands of strangers receive movements at the same time and must end up with the same book",
        "Because writing is expensive and someone has to pay for the paper",
        "Because only the original author of the book is allowed to add to it",
      ],
      answer: 0,
      explain: `Agreement is the hard part, not storage. Copying a list is easy; getting thousands of machines that don't trust each other to agree on the *same* list, in the same order, is the problem every one of these networks was built to solve. You'll take that apart properly in the Realm — and even get to break it on purpose.`,
    },
    {
      kind: "fill",
      prompt: `Complete the sentence that defines the thing:`,
      file: "NOTES.md",
      before: `A blockchain is a list of movements that many people hold at once, where each page carries a fingerprint of the page before it — so changing history `,
      after: ` .`,
      choices: [
        "is immediately visible to everyone",
        "costs a small fee",
        "requires a password",
        "is impossible by mathematics",
      ],
      answer: 0,
      explain: `Careful with the last one — it's the myth. History isn't *impossible* to alter; it's impossible to alter **quietly**. Everything else here rests on that distinction.`,
    },
    {
      kind: "theory",
      body: `## So what is Stellar?

One of these books — built specifically for **value moving between people**.

Not a general-purpose world computer, not a speculation machine: a ledger designed so that sending money across a border costs a fraction of a cent, settles in about five seconds, and works the same whether you send ten cents or ten million.

Everything you will meet later — accounts, payments, tokens, contracts — is a line, or a rule about lines, in this one shared book.

**Next:** if the book is public and anyone can write to it, what stops a stranger from spending *your* money? The answer is a key — and it is nothing like a password.`,
    },
  ],
  // Dedicated test-out bank — deliberately NOT the chapter's own checks, so a
  // reader who fails still meets fresh questions when they walk the chapter.
  testOut: [
    {
      question: `Twelve friends each keep their own copy of the tavern book. What does that arrangement actually buy them?`,
      options: [
        "Nobody has to trust the keeper — a quiet edit stops matching the other eleven copies",
        "The book becomes impossible to lose, but a keeper can still rewrite it",
        "Writing gets faster, because twelve people share the work",
      ],
      answer: 0,
    },
    {
      question: `Every page also carries a short summary of the page before it. What does that add that copies alone do not?`,
      options: [
        "Editing an OLD page breaks every page that came after it, instead of just that one",
        "It compresses the book, so old pages take less room",
        "It lets you read the book backwards without losing your place",
      ],
      answer: 0,
    },
    {
      question: `Why does a shared book need a rule about who writes the next page?`,
      options: [
        "Thousands of strangers receive movements at once and must end up with the same book, in the same order",
        "Because paper is expensive and someone has to be responsible for it",
        "Because only the person who started the book is allowed to add to it",
      ],
      answer: 0,
    },
    {
      question: `In the terms of this chapter, what is Stellar?`,
      options: [
        "One of these shared books, built specifically for value moving between people",
        "A company that keeps the book and charges to write in it",
        "A general-purpose computer that happens to store a book",
      ],
      answer: 0,
    },
  ],
};
