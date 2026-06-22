import type { Payload, PayloadRequest } from 'payload'

import { createCourse, type CourseDef } from './courseBuilder'

// ---------------------------------------------------------------------------
// 1. AI for Everyday Productivity
// ---------------------------------------------------------------------------
const everyday: CourseDef = {
  slug: 'ai-for-everyday-productivity',
  title: 'AI for Everyday Productivity',
  summary:
    'A free, no-code introduction to using AI assistants like ChatGPT, Claude and Gemini for everyday work — writing, research, documents and data. Get real value today.',
  overview: [
    'AI assistants can save you hours every week once you know how to use them. This free, no-code course shows you how to get reliable, useful results for everyday tasks.',
    'You’ll practise writing and editing, summarising and researching, working with documents and spreadsheets, and writing prompts that work — then learn to use AI safely and responsibly.',
    'No technical background needed. Each module ends with a short quiz, with a final assessment at the end.',
  ],
  level: 'beginner',
  duration: '~3 hours',
  icon: 'brain',
  outcomes: [
    'Use an AI assistant confidently for daily tasks',
    'Write clearer prompts that get better results',
    'Summarise, research and draft faster',
    'Work with documents and spreadsheets using AI',
    'Use AI safely, privately and responsibly',
  ],
  modules: [
    {
      title: 'Module 1 — Getting started',
      lessons: [
        {
          title: 'Choosing and opening an AI assistant',
          content: {
            intro:
              'AI assistants (ChatGPT, Claude, Gemini and others) are free to start and work right in your browser or phone. They answer questions, write, summarise and brainstorm in plain language.',
            body: 'They are all similar to use: you type a request, it replies, and you can keep the conversation going. Pick one, create a free account, and you’re ready — you can always try others later.',
            points: [
              'All major assistants work from a browser or app.',
              'A free tier is enough to learn and do real work.',
              'You chat in plain language — no commands to memorise.',
              'The conversation has memory within a single chat.',
            ],
            example:
              'Open the assistant and type: “Explain what you can help me with in 5 bullet points.”',
            tryIt:
              'Create a free account on one AI assistant. Ask it: “Give me 5 ways you could help me at work this week.” Read the reply and pick one to try next.',
            takeaway: 'pick one assistant, sign up free, and start by simply asking it a question.',
          },
        },
        {
          title: 'How to talk to an AI',
          content: {
            intro:
              'You get better results by being specific. Tell the assistant who it’s for, what you want, how long, and in what tone — then refine by continuing the chat.',
            body: 'Think of it like briefing a capable assistant: the clearer the brief, the better the output. If the first answer isn’t right, just say what to change — it remembers the conversation.',
            points: [
              'State the task, audience, length and tone.',
              'Give any context it needs (paste the details).',
              'Ask follow-ups to refine — don’t restart.',
              'Vague requests get generic answers.',
            ],
            example:
              '“Write a friendly 3-sentence reply to this customer email declining a refund politely: [paste email].”',
            tryIt:
              'Take a short message you need to write. Ask the AI for it with a clear brief (audience + tone + length). Then reply “make it warmer and shorter” and compare.',
            takeaway: 'be specific and refine in conversation — clarity is what drives quality.',
          },
        },
      ],
      quiz: {
        required: true,
        questions: [
          {
            question: 'What gets you better results from an AI assistant?',
            type: 'single',
            options: [
              { text: 'Being specific about task, audience, length and tone', correct: true },
              { text: 'Typing in capital letters' },
            ],
          },
          {
            question: 'Which are true? (select all)',
            type: 'multiple',
            options: [
              { text: 'A free tier is enough to start', correct: true },
              { text: 'You can refine by continuing the chat', correct: true },
              { text: 'You must learn special commands' },
            ],
          },
        ],
      },
    },
    {
      title: 'Module 2 — Everyday tasks',
      lessons: [
        {
          title: 'Writing and editing with AI',
          content: {
            intro:
              'AI is excellent for first drafts, rewrites, tone changes and fixing grammar — emails, posts, summaries, job applications and more.',
            body: 'Use it to get past the blank page, then edit to add your voice and facts. Always read and adjust the output; it’s a draft, not a final answer.',
            points: [
              'Great for drafts, rewrites and tone shifts.',
              'Ask for several options to choose from.',
              'Paste your rough notes and ask it to polish.',
              'Always review and personalise the result.',
            ],
            example: '“Rewrite this in a confident, concise tone, and give me 3 subject lines.”',
            tryIt:
              'Paste a rough paragraph you wrote. Ask: “Tighten this and give me two versions — one formal, one casual.” Pick the best and tweak it.',
            takeaway: 'use AI to draft fast, then edit to make it yours and correct.',
          },
        },
        {
          title: 'Summarising and researching',
          content: {
            intro:
              'Paste long text and ask for a summary, key points, or action items. For research, ask it to explain, compare, or outline — then verify anything important.',
            body: 'Summaries and explanations are a strength, but assistants can be confidently wrong or out of date, so treat facts as a starting point to check, not gospel.',
            points: [
              'Summarise long text into bullets or actions.',
              'Ask it to explain a topic at your level.',
              'Compare options in a table.',
              'Verify facts before relying on them.',
            ],
            example: '“Summarise this report in 5 bullets and list any decisions needed: [paste].”',
            tryIt:
              'Paste a long article or email thread. Ask for “a 5-bullet summary and 3 action items”. Check one fact it states against the source.',
            takeaway: 'summarise and explain freely, but verify important facts yourself.',
          },
        },
      ],
      quiz: {
        required: true,
        questions: [
          {
            question: 'A good way to use AI for writing is to…',
            type: 'single',
            options: [
              { text: 'Generate a draft, then edit and personalise it', correct: true },
              { text: 'Publish its output unchanged' },
            ],
          },
          {
            question: 'With AI-provided facts you should…',
            type: 'single',
            options: [
              { text: 'Verify anything important', correct: true },
              { text: 'Assume it is always correct' },
            ],
          },
        ],
      },
    },
    {
      title: 'Module 3 — Documents & data',
      lessons: [
        {
          title: 'Asking questions about a document',
          content: {
            intro:
              'Paste a document (or upload it where supported) and ask questions, request a summary, or pull out specific details — far faster than reading it all.',
            body: 'Keep your question focused and point to what you need (“the deadline”, “the risks”). If the document is long, ask section by section.',
            points: [
              'Paste or upload, then ask targeted questions.',
              'Request summaries, key terms or action items.',
              'Quote the part you want it to focus on.',
              'Long docs: work section by section.',
            ],
            example: '“From this contract, list the payment terms and any cancellation clauses.”',
            tryIt:
              'Paste a document you have (notes, a policy, a long email). Ask three specific questions about it and one “what am I missing?”.',
            takeaway: 'paste a document and ask focused questions to extract what matters.',
          },
        },
        {
          title: 'Quick help with spreadsheets',
          content: {
            intro:
              'AI can write spreadsheet formulas, explain errors, and suggest how to structure data — describe what you want in plain words and it returns the formula.',
            body: 'Tell it your tool (Excel/Google Sheets), the columns, and the goal. Paste a formula that’s erroring and ask it to fix and explain it.',
            points: [
              'Describe the goal; get the formula.',
              'Name the tool (Excel vs Google Sheets).',
              'Paste errors to get a fix and explanation.',
              'Ask it to explain a formula you don’t understand.',
            ],
            example:
              '“In Google Sheets, write a formula to sum column C where column A = ‘Paid’.”',
            tryIt:
              'Think of a calculation you do manually. Ask the AI for the formula (name your tool and columns), then paste it into a sheet and test it.',
            takeaway: 'describe the result you want and let AI write and explain the formula.',
          },
        },
      ],
      quiz: {
        required: true,
        questions: [
          {
            question: 'To get help with a document you should…',
            type: 'single',
            options: [
              { text: 'Paste/upload it and ask focused questions', correct: true },
              { text: 'Only describe it from memory' },
            ],
          },
          {
            question: 'For spreadsheet help, it helps to… (select all)',
            type: 'multiple',
            options: [
              { text: 'Name the tool (Excel/Sheets)', correct: true },
              { text: 'Describe columns and the goal', correct: true },
              { text: 'Avoid giving any context' },
            ],
          },
        ],
      },
    },
    {
      title: 'Module 4 — Better results & staying safe',
      lessons: [
        {
          title: 'Prompts that work',
          content: {
            intro:
              'A reliable prompt names the role, the task, the format and any constraints, and often includes an example. Small wording changes can noticeably improve output.',
            body: 'If results drift, add an example of what “good” looks like, or ask the AI to ask you clarifying questions first. Iterate one change at a time.',
            points: [
              'Role + task + format + constraints.',
              'Show an example of the output you want.',
              'Ask it to clarify before answering big tasks.',
              'Change one thing at a time when refining.',
            ],
            example:
              '“You are a recruiter. Rewrite my CV summary in 3 sentences, results-focused, for a marketing role.”',
            tryIt:
              'Rewrite a prompt you used earlier to include a role and a desired format. Run both versions and notice the difference.',
            takeaway: 'structure prompts (role, task, format, example) and refine iteratively.',
          },
        },
        {
          title: 'Privacy, accuracy and responsible use',
          content: {
            intro:
              'Don’t paste confidential or personal data into public AI tools, double-check important facts, and be transparent when AI helped with work that matters.',
            body: 'Assistants can be wrong, biased, or out of date, and your inputs may be used to improve models unless you opt out. You stay responsible for what you send and publish.',
            points: [
              'Keep confidential and personal data out.',
              'Verify facts, figures and quotes.',
              'Disclose AI help where it matters.',
              'You own the final result.',
            ],
            example:
              'Before pasting a customer email, remove names and account numbers first.',
            tryIt:
              'Review a prompt you’d send at work. Remove anything sensitive, and note one fact in the answer you should verify.',
            takeaway: 'protect data, verify facts, and stay accountable for AI-assisted work.',
          },
        },
      ],
      quiz: {
        required: false,
        questions: [
          {
            question: 'A reliable prompt usually includes… (select all)',
            type: 'multiple',
            options: [
              { text: 'A role and a clear task', correct: true },
              { text: 'The format you want', correct: true },
              { text: 'As little detail as possible' },
            ],
          },
          {
            question: 'Responsible use means…',
            type: 'single',
            options: [
              { text: 'Keeping sensitive data out and verifying facts', correct: true },
              { text: 'Pasting anything and trusting every answer' },
            ],
          },
        ],
      },
    },
  ],
  finalAssessment: {
    required: false,
    passMark: 60,
    questions: [
      {
        question: 'The single biggest driver of good AI output is…',
        type: 'single',
        options: [
          { text: 'A clear, specific prompt', correct: true },
          { text: 'Typing quickly' },
        ],
      },
      {
        question: 'Which are good everyday uses of AI? (select all)',
        type: 'multiple',
        options: [
          { text: 'Drafting and rewriting text', correct: true },
          { text: 'Summarising long documents', correct: true },
          { text: 'Writing spreadsheet formulas', correct: true },
        ],
      },
      {
        question: 'Before pasting a work email into a public AI tool you should…',
        type: 'single',
        options: [
          { text: 'Remove confidential and personal details', correct: true },
          { text: 'Add more personal details' },
        ],
      },
      {
        question: 'AI-provided facts should be…',
        type: 'single',
        options: [
          { text: 'Verified when they matter', correct: true },
          { text: 'Always trusted' },
        ],
      },
    ],
  },
}

// ---------------------------------------------------------------------------
// 2. Build Your First AI App
// ---------------------------------------------------------------------------
const firstApp: CourseDef = {
  slug: 'build-your-first-ai-app',
  title: 'Build Your First AI App',
  summary:
    'A free, hands-on course that takes you from zero to a working AI app — call an LLM API, put a simple interface on it, and deploy it online for free.',
  overview: [
    'This is the “I built something with AI!” course. You’ll call a language-model API, wrap it in a tiny app, and put it online — for free.',
    'We cover how LLM APIs work, getting a key, making requests, prompts in code, a simple web UI, and deploying. Light coding (mostly copy-run-tweak) — comfort with basic computing is enough.',
    'Each module ends with a short quiz, with a final assessment at the end.',
  ],
  level: 'beginner',
  duration: '~4 hours',
  icon: 'code',
  outcomes: [
    'Explain how LLM APIs work (tokens, models, cost)',
    'Get an API key and make your first request',
    'Use prompts inside code',
    'Add a simple web interface',
    'Deploy your app online for free',
  ],
  modules: [
    {
      title: 'Module 1 — How LLM APIs work',
      lessons: [
        {
          title: 'What an API is',
          content: {
            intro:
              'An API (Application Programming Interface) lets your code talk to a service. For an LLM, you send a request containing your prompt and get back the model’s text response.',
            body: 'You don’t run the model yourself — you call a hosted one over the internet and pay per use. Your app sends text in, gets text out, and does something useful with it.',
            points: [
              'An API is how code talks to a service.',
              'You send a prompt, you receive a completion.',
              'The model runs on the provider’s servers.',
              'You’re billed per request (usually per token).',
            ],
            example:
              'Your app sends { prompt: "Summarise: ..." } and receives { text: "..." } back.',
            tryIt:
              'Open an AI provider’s docs (OpenAI, Anthropic, or Google) and find the “quickstart”. Read the example request and identify the prompt and the response.',
            takeaway: 'an LLM API takes your prompt over the web and returns generated text.',
          },
        },
        {
          title: 'Models, tokens and cost',
          content: {
            intro:
              'Providers offer several models that trade off capability, speed and price. Usage is measured in tokens — chunks of text — and you pay for input plus output tokens.',
            body: 'Start with a small, cheap model while building; switch up only if you need more capability. Watch token counts: long prompts and long answers cost more and may hit limits.',
            points: [
              'Bigger models: smarter but slower and pricier.',
              'Tokens ≈ pieces of words; ~4 chars each.',
              'You pay for input + output tokens.',
              'Develop on a cheap model first.',
            ],
            example:
              '“Hello, world” is a few tokens; a long document can be thousands — and counts toward cost and limits.',
            tryIt:
              'Find your provider’s pricing page. Note the cost per 1K tokens for a small vs large model, and estimate the cost of a 500-token request.',
            takeaway: 'pick a small model to start; tokens drive both cost and context limits.',
          },
        },
      ],
      quiz: {
        required: true,
        questions: [
          {
            question: 'What does an LLM API do?',
            type: 'single',
            options: [
              { text: 'Lets your code send a prompt and get generated text back', correct: true },
              { text: 'Installs a model on your laptop' },
            ],
          },
          {
            question: 'Which are true about tokens/cost? (select all)',
            type: 'multiple',
            options: [
              { text: 'You pay for input and output tokens', correct: true },
              { text: 'Bigger models usually cost more', correct: true },
              { text: 'Token count never affects cost' },
            ],
          },
        ],
      },
    },
    {
      title: 'Module 2 — Your first API call',
      lessons: [
        {
          title: 'Getting an API key',
          content: {
            intro:
              'An API key is a secret password that identifies your account when calling the API. You create one in the provider’s dashboard and keep it private.',
            body: 'Never paste keys into public code or commit them to git — store them in an environment variable. Treat a key like a password; rotate it if it leaks.',
            points: [
              'Create a key in the provider dashboard.',
              'Keep it secret — never commit it to git.',
              'Store it in an environment variable.',
              'Rotate/revoke if it’s ever exposed.',
            ],
            example:
              'Save it as OPENAI_API_KEY in a .env file, and read it from there in code.',
            tryIt:
              'Create a free API key in your provider’s dashboard. Put it in a .env file and add .env to your .gitignore.',
            takeaway: 'get a key, keep it secret, and load it from an environment variable.',
          },
        },
        {
          title: 'Making a request',
          content: {
            intro:
              'With a key and the provider’s SDK (or a plain HTTP request), you send your prompt and print the response. This is your first real call — a few lines of code.',
            body: 'Most providers give a copy-paste snippet. Run it, see the model reply in your terminal, then change the prompt and run again to feel the loop.',
            points: [
              'Install the provider SDK (or use fetch/HTTP).',
              'Pass your key, model and prompt.',
              'Print the response text.',
              'Change the prompt and re-run.',
            ],
            example:
              'A Node snippet: create the client with your key, call the chat/messages endpoint with your prompt, log the result.',
            tryIt:
              'Copy your provider’s quickstart snippet, paste in your key via the env var, run it, then change the prompt and run again.',
            takeaway: 'a few lines — key, model, prompt — get your first live response.',
          },
        },
      ],
      quiz: {
        required: true,
        questions: [
          {
            question: 'Where should an API key live?',
            type: 'single',
            options: [
              { text: 'In an environment variable, never committed', correct: true },
              { text: 'Hard-coded and pushed to GitHub' },
            ],
          },
          {
            question: 'A first API call needs… (select all)',
            type: 'multiple',
            options: [
              { text: 'Your API key', correct: true },
              { text: 'A model name', correct: true },
              { text: 'A prompt', correct: true },
            ],
          },
        ],
      },
    },
    {
      title: 'Module 3 — Turn it into an app',
      lessons: [
        {
          title: 'Prompts in code',
          content: {
            intro:
              'In an app, prompts are usually built from a fixed instruction plus user input. You combine a “system” instruction with the user’s text and send the result.',
            body: 'Keep the instruction separate from user input, and never let user text override your instructions. Templating the prompt makes the app consistent and reusable.',
            points: [
              'Combine a fixed instruction with user input.',
              'Keep instructions and user text separate.',
              'Template prompts for consistent behaviour.',
              'Validate/limit user input length.',
            ],
            example:
              'system: “Summarise the user’s text in 3 bullets.” user: <the pasted text>.',
            tryIt:
              'Wrap your earlier call in a function that takes user text and inserts it into a fixed prompt template. Call it with two different inputs.',
            takeaway: 'build prompts from a fixed instruction plus user input, kept separate.',
          },
        },
        {
          title: 'A simple web UI',
          content: {
            intro:
              'Give your app a face: a text box and a button that sends the input to your code and shows the response. A minimal web page or a framework like Next.js works.',
            body: 'Call the API from the server side so your key stays secret, and show a loading state while waiting. Keep the first version tiny — one input, one output.',
            points: [
              'One input, one button, one output area.',
              'Call the API server-side to hide the key.',
              'Show a loading state during the request.',
              'Start minimal; add features later.',
            ],
            example:
              'A page with a textarea and “Summarise” button that displays the model’s reply below.',
            tryIt:
              'Build a one-page UI (plain HTML or a starter template) with a textbox and button that calls your function and shows the result.',
            takeaway: 'a textbox + button calling your server-side code is a complete first app.',
          },
        },
      ],
      quiz: {
        required: true,
        questions: [
          {
            question: 'Why call the LLM API from the server side?',
            type: 'single',
            options: [
              { text: 'To keep your API key secret', correct: true },
              { text: 'To make the page load slower' },
            ],
          },
          {
            question: 'A good first app UI is…',
            type: 'single',
            options: [
              { text: 'Minimal: one input, one button, one output', correct: true },
              { text: 'Packed with every feature at once' },
            ],
          },
        ],
      },
    },
    {
      title: 'Module 4 — Ship it',
      lessons: [
        {
          title: 'Deploying for free',
          content: {
            intro:
              'Hosting platforms (like Vercel, Netlify or similar) deploy small apps for free. You connect your code repository, set your API key as an environment variable, and go live.',
            body: 'Set secrets in the platform’s dashboard, not in code. Once deployed you get a public URL you can share — your app is real and online.',
            points: [
              'Free tiers host small apps fine.',
              'Connect your git repo to deploy.',
              'Set the API key as a platform env var.',
              'You get a shareable public URL.',
            ],
            example:
              'Push to GitHub, import the repo on the host, add OPENAI_API_KEY, deploy → live URL.',
            tryIt:
              'Push your app to a git repo, deploy it on a free host, set your API key in the dashboard, and open the live URL.',
            takeaway: 'connect repo, set the key as an env var, deploy — and share the URL.',
          },
        },
        {
          title: 'Improving and iterating',
          content: {
            intro:
              'With a working app, improve it: better prompts, error handling, input limits, and basic cost control. Ship small changes and test as you go.',
            body: 'Add guardrails (handle empty input and API errors), cap input length to control cost, and gather a little feedback. Iterate in small, testable steps.',
            points: [
              'Handle errors and empty input gracefully.',
              'Cap input length to control cost.',
              'Refine the prompt based on real use.',
              'Ship small, test, repeat.',
            ],
            example:
              'Add a friendly “Please enter some text” message and a max length on the textbox.',
            tryIt:
              'Add one improvement to your app: an error message, an input limit, or a better prompt. Deploy the change.',
            takeaway: 'iterate with small, tested improvements once the basic app works.',
          },
        },
      ],
      quiz: {
        required: false,
        questions: [
          {
            question: 'On a hosting platform, your API key should be set…',
            type: 'single',
            options: [
              { text: 'As an environment variable in the dashboard', correct: true },
              { text: 'In the public client-side code' },
            ],
          },
          {
            question: 'Good early improvements include… (select all)',
            type: 'multiple',
            options: [
              { text: 'Handling errors and empty input', correct: true },
              { text: 'Capping input length for cost', correct: true },
              { text: 'Removing all testing' },
            ],
          },
        ],
      },
    },
  ],
  finalAssessment: {
    required: false,
    passMark: 60,
    questions: [
      {
        question: 'An LLM API call fundamentally is…',
        type: 'single',
        options: [
          { text: 'Send a prompt, receive generated text', correct: true },
          { text: 'Download and run the model locally' },
        ],
      },
      {
        question: 'Which protect your API key? (select all)',
        type: 'multiple',
        options: [
          { text: 'Store it in an environment variable', correct: true },
          { text: 'Call the API from the server side', correct: true },
          { text: 'Commit it to a public repo' },
        ],
      },
      {
        question: 'Tokens matter because…',
        type: 'single',
        options: [
          { text: 'They drive cost and context limits', correct: true },
          { text: 'They change the app’s colour' },
        ],
      },
      {
        question: 'A sensible first app is…',
        type: 'single',
        options: [
          { text: 'Minimal, then iterated', correct: true },
          { text: 'Feature-complete on day one' },
        ],
      },
    ],
  },
}

// ---------------------------------------------------------------------------
// 3. Chat with Your Documents (RAG)
// ---------------------------------------------------------------------------
const rag: CourseDef = {
  slug: 'chat-with-your-documents-rag',
  title: 'Chat with Your Documents (RAG)',
  summary:
    'A free, hands-on introduction to Retrieval-Augmented Generation (RAG) — the technique that lets an AI answer questions from your own documents, accurately and with sources.',
  overview: [
    'Retrieval-Augmented Generation (RAG) is the most useful real-world AI pattern: it lets a model answer from your documents instead of only its training data.',
    'You’ll learn why RAG matters, how embeddings and vector search work, how to chunk and store content, and how to retrieve the right pieces and generate a grounded answer — plus how to improve accuracy and use it responsibly.',
    'Best after the AI Fundamentals and Embeddings topics. Each module ends with a quiz, with a final assessment at the end.',
  ],
  level: 'intermediate',
  duration: '~4 hours',
  icon: 'database',
  outcomes: [
    'Explain what RAG is and the problem it solves',
    'Describe embeddings and vector search',
    'Chunk and store documents for retrieval',
    'Retrieve relevant context and generate grounded answers',
    'Improve accuracy and avoid common pitfalls',
  ],
  modules: [
    {
      title: 'Module 1 — Why RAG',
      lessons: [
        {
          title: 'The problem RAG solves',
          content: {
            intro:
              'LLMs only know their training data — they don’t know your private files, and they can hallucinate. RAG fixes this by fetching relevant text from your documents and giving it to the model as context.',
            body: 'Instead of fine-tuning a model on your data (expensive, slow to update), RAG looks up the right passages at question time and asks the model to answer using them — keeping answers current and grounded.',
            points: [
              'LLMs don’t know your private or latest data.',
              'They can answer confidently but wrongly.',
              'RAG retrieves relevant text, then answers from it.',
              'Cheaper and fresher than fine-tuning.',
            ],
            example:
              'Ask “What’s our refund policy?” — RAG finds the policy doc passage and the model answers from it, with a citation.',
            tryIt:
              'List 3 questions you’d want to ask your own documents (notes, a handbook, product docs). These are your RAG test cases.',
            takeaway: 'RAG grounds answers in your documents instead of the model’s memory.',
          },
        },
        {
          title: 'How RAG works (overview)',
          content: {
            intro:
              'RAG has two phases. Offline: split documents into chunks and store them as embeddings in a vector database. Online: embed the question, retrieve the most similar chunks, and pass them to the model to answer.',
            body: 'The model never sees your whole library — only the handful of relevant chunks for each question. That keeps it focused, cheap, and grounded in real text.',
            points: [
              'Index phase: chunk → embed → store.',
              'Query phase: embed question → retrieve → answer.',
              'Only relevant chunks go to the model.',
              'Answers can cite the retrieved sources.',
            ],
            example:
              'For a question, retrieve the top 4 matching chunks and prepend them to the prompt: “Answer using this context: …”.',
            tryIt:
              'Sketch the RAG flow for one of your questions: which document would be chunked, and what passage should be retrieved to answer it?',
            takeaway: 'index documents once, then retrieve-and-answer per question.',
          },
        },
      ],
      quiz: {
        required: true,
        questions: [
          {
            question: 'What problem does RAG primarily solve?',
            type: 'single',
            options: [
              { text: 'Letting a model answer from your own/up-to-date documents', correct: true },
              { text: 'Making the model train faster' },
            ],
          },
          {
            question: 'The two RAG phases are… (select all)',
            type: 'multiple',
            options: [
              { text: 'Indexing: chunk, embed, store', correct: true },
              { text: 'Querying: embed question, retrieve, answer', correct: true },
              { text: 'Deleting the model' },
            ],
          },
        ],
      },
    },
    {
      title: 'Module 2 — Embeddings & vectors',
      lessons: [
        {
          title: 'What embeddings are',
          content: {
            intro:
              'An embedding turns a piece of text into a list of numbers (a vector) that captures its meaning, so that similar meanings produce nearby vectors.',
            body: 'You create embeddings with an embedding model (an API call). Because meaning becomes geometry, you can find related text by finding nearby vectors — the heart of retrieval.',
            points: [
              'Embedding = text represented as a vector.',
              'Similar meaning → nearby vectors.',
              'Created via an embedding model/API.',
              'Enables “search by meaning”, not keywords.',
            ],
            example:
              '“refund policy” and “money-back terms” land close together even though the words differ.',
            tryIt:
              'On your provider’s docs, find the embeddings endpoint. Note the model name and that it returns an array of numbers for input text.',
            takeaway: 'embeddings convert meaning into vectors so similarity becomes distance.',
          },
        },
        {
          title: 'Vector search',
          content: {
            intro:
              'A vector database stores embeddings and finds the closest ones to a query vector quickly. This “nearest-neighbour” search is how RAG retrieves the most relevant chunks.',
            body: 'You embed the user’s question, ask the vector store for the top-k nearest chunks, and use those. Many options exist (hosted services or libraries); they all do nearest-neighbour search.',
            points: [
              'Vector DBs store and search embeddings.',
              'Retrieve the top-k nearest to the query.',
              '“Nearest” ≈ most semantically similar.',
              'Many tools; same core idea.',
            ],
            example:
              'Embed the question, request the 4 nearest chunks, and feed them to the model.',
            tryIt:
              'Name a vector store you could use (e.g. a hosted one or a library). Write the one-line query you’d run: “find top 4 chunks nearest to <question embedding>”.',
            takeaway: 'vector search returns the chunks whose meaning is closest to the question.',
          },
        },
      ],
      quiz: {
        required: true,
        questions: [
          {
            question: 'An embedding is…',
            type: 'single',
            options: [
              { text: 'A vector of numbers capturing text meaning', correct: true },
              { text: 'A compressed PDF' },
            ],
          },
          {
            question: 'Vector search retrieves…',
            type: 'single',
            options: [
              { text: 'The chunks nearest (most similar) to the query', correct: true },
              { text: 'A random sample of chunks' },
            ],
          },
        ],
      },
    },
    {
      title: 'Module 3 — Building the pipeline',
      lessons: [
        {
          title: 'Chunking and storing',
          content: {
            intro:
              'Documents are split into chunks (e.g. a few hundred words, often overlapping) before embedding. Good chunking keeps each piece focused so retrieval returns coherent, relevant context.',
            body: 'Chunks too big dilute relevance and cost more; too small lose context. A little overlap avoids cutting ideas in half. Store each chunk’s text, its embedding, and metadata (source, page).',
            points: [
              'Split docs into focused chunks (with slight overlap).',
              'Too big = noisy; too small = lost context.',
              'Store text + embedding + metadata.',
              'Keep the source so you can cite it.',
            ],
            example:
              'A 20-page handbook → ~80 chunks of ~250 words, each stored with its page number.',
            tryIt:
              'Take one of your documents and decide a chunk size. Manually mark where the first 2–3 chunks would split.',
            takeaway: 'chunk documents into focused, slightly-overlapping pieces and store with sources.',
          },
        },
        {
          title: 'Retrieve and answer',
          content: {
            intro:
              'At query time: embed the question, retrieve the top chunks, put them in the prompt as context, and instruct the model to answer using only that context (and say when it doesn’t know).',
            body: 'Grounding the model in retrieved text dramatically reduces hallucination. Ask it to cite which chunk it used, and to admit uncertainty rather than invent an answer.',
            points: [
              'Embed question → retrieve top-k chunks.',
              'Prompt: “Answer using only this context.”',
              'Ask for citations to the sources.',
              'Tell it to say “I don’t know” if unsupported.',
            ],
            example:
              '“Using the context below, answer the question and cite the source. If the answer isn’t in the context, say so. Context: …”',
            tryIt:
              'Write the answer prompt template you’d use: include a context placeholder, the question, and the “only use the context / cite sources” instruction.',
            takeaway: 'retrieve, then instruct the model to answer only from that context, with citations.',
          },
        },
      ],
      quiz: {
        required: true,
        questions: [
          {
            question: 'Why overlap chunks slightly?',
            type: 'single',
            options: [
              { text: 'To avoid cutting ideas in half across chunks', correct: true },
              { text: 'To use more storage for no reason' },
            ],
          },
          {
            question: 'A grounded answer prompt should… (select all)',
            type: 'multiple',
            options: [
              { text: 'Tell the model to use only the provided context', correct: true },
              { text: 'Ask it to say when the answer isn’t there', correct: true },
              { text: 'Encourage it to guess freely' },
            ],
          },
        ],
      },
    },
    {
      title: 'Module 4 — Making it good',
      lessons: [
        {
          title: 'Improving accuracy',
          content: {
            intro:
              'If answers are weak, the fix is usually retrieval, not the model. Improve chunking, retrieve more (or fewer) chunks, add metadata filters, or re-rank results before answering.',
            body: 'Evaluate with your real questions: did the right chunk get retrieved? If not, the generation can’t be right. Tune retrieval first, then the prompt.',
            points: [
              'Most RAG errors are retrieval errors.',
              'Tune chunk size and how many you retrieve.',
              'Filter by metadata (date, source, section).',
              'Re-rank candidates for relevance.',
            ],
            example:
              'If a question fails, check the retrieved chunks — often the answer chunk wasn’t fetched.',
            tryIt:
              'For one test question, list what “the correct retrieved chunk” looks like. That’s your check for whether retrieval is working.',
            takeaway: 'fix retrieval first — if the right chunk isn’t fetched, the answer can’t be right.',
          },
        },
        {
          title: 'Limits and responsible use',
          content: {
            intro:
              'RAG reduces but doesn’t eliminate hallucination, and it can surface sensitive content. Respect document permissions, cite sources, and keep a human check for high-stakes answers.',
            body: 'Only index data users are allowed to see, show citations so answers are verifiable, and be clear that it’s an AI assistant. Garbage or biased source documents still produce poor answers.',
            points: [
              'RAG reduces, not removes, hallucination.',
              'Honour document access permissions.',
              'Show sources so answers are checkable.',
              'Keep humans in the loop for high stakes.',
            ],
            example:
              'A support bot cites the policy paragraph it used, so an agent can verify before acting.',
            tryIt:
              'For your use case, note one permission rule (who may see which docs) and one place a human should verify the answer.',
            takeaway: 'ground and cite answers, respect permissions, and verify high-stakes results.',
          },
        },
      ],
      quiz: {
        required: false,
        questions: [
          {
            question: 'Most RAG answer problems come from…',
            type: 'single',
            options: [
              { text: 'Retrieval fetching the wrong chunks', correct: true },
              { text: 'The colour of the UI' },
            ],
          },
          {
            question: 'Responsible RAG includes… (select all)',
            type: 'multiple',
            options: [
              { text: 'Respecting document permissions', correct: true },
              { text: 'Citing sources', correct: true },
              { text: 'Indexing data users shouldn’t see' },
            ],
          },
        ],
      },
    },
  ],
  finalAssessment: {
    required: false,
    passMark: 60,
    questions: [
      {
        question: 'RAG lets an LLM…',
        type: 'single',
        options: [
          { text: 'Answer using retrieved passages from your documents', correct: true },
          { text: 'Permanently memorise every document' },
        ],
      },
      {
        question: 'Order of the query phase:',
        type: 'single',
        options: [
          { text: 'Embed question → retrieve chunks → answer from them', correct: true },
          { text: 'Answer → retrieve → embed' },
        ],
      },
      {
        question: 'Embeddings enable retrieval because…',
        type: 'single',
        options: [
          { text: 'Similar meanings have nearby vectors', correct: true },
          { text: 'They store exact keywords only' },
        ],
      },
      {
        question: 'To improve a weak RAG answer, first…',
        type: 'single',
        options: [
          { text: 'Check and fix retrieval', correct: true },
          { text: 'Switch the button colour' },
        ],
      },
    ],
  },
}

// ---------------------------------------------------------------------------
// 4. Python for AI — the gentle start
// ---------------------------------------------------------------------------
const python: CourseDef = {
  slug: 'python-for-ai-gentle-start',
  title: 'Python for AI — the gentle start',
  summary:
    'A free, beginner-friendly path to the small amount of Python you need for AI — written and run in a free online notebook, no installation required.',
  overview: [
    'You don’t need to be a software engineer to do AI, but a little Python unlocks the hands-on courses. This gentle introduction teaches just what you need.',
    'You’ll work in a free notebook (like Google Colab), learn variables, lists, loops and functions, do basic data work with pandas, and finish by calling an AI model from Python.',
    'No setup and no prior coding required. Each module ends with a quiz, with a final assessment at the end.',
  ],
  level: 'beginner',
  duration: '~4 hours',
  icon: 'code',
  outcomes: [
    'Run Python in a free online notebook',
    'Use variables, lists, loops and functions',
    'Do basic data work with pandas',
    'Read a CSV file into a table',
    'Call an AI model from Python',
  ],
  modules: [
    {
      title: 'Module 1 — Getting set up',
      lessons: [
        {
          title: 'Notebooks and your first code',
          content: {
            intro:
              'A notebook (like Google Colab) runs Python in your browser — no installation. You write code in “cells” and run them one at a time, seeing results immediately.',
            body: 'This instant feedback is perfect for learning and for AI experiments. Open a free notebook, type code in a cell, and press run.',
            points: [
              'Notebooks run Python in the browser.',
              'Code lives in cells you run individually.',
              'Results appear right below each cell.',
              'No setup — great for experimenting.',
            ],
            example:
              'Type print("Hello, AI") in a cell and run it to see the output appear below.',
            tryIt:
              'Open Google Colab (free), create a new notebook, type print("Hello, AI") in a cell, and run it.',
            takeaway: 'a free notebook lets you write and run Python instantly in the browser.',
          },
        },
        {
          title: 'Printing and variables',
          content: {
            intro:
              'print() shows output. A variable stores a value with a name so you can reuse it. Variables hold text (strings), numbers, and more.',
            body: 'You assign with =, e.g. name = "Sam". Then you can use name anywhere. Naming values clearly makes code readable and reusable.',
            points: [
              'print() displays a value.',
              'Variables store values by name (name = "Sam").',
              'Common types: strings (text) and numbers.',
              'Reuse a variable instead of repeating values.',
            ],
            example:
              'name = "Sam"; print("Hello", name) → prints “Hello Sam”.',
            tryIt:
              'In a cell, set a variable to your name and a variable to your favourite number, then print a sentence using both.',
            takeaway: 'store values in variables and display them with print().',
          },
        },
      ],
      quiz: {
        required: true,
        questions: [
          {
            question: 'What does a notebook let you do?',
            type: 'single',
            options: [
              { text: 'Run Python in the browser, cell by cell', correct: true },
              { text: 'Only read about Python' },
            ],
          },
          {
            question: 'Which are true? (select all)',
            type: 'multiple',
            options: [
              { text: 'print() shows output', correct: true },
              { text: 'Variables store values by name', correct: true },
              { text: 'You must install Python to use Colab' },
            ],
          },
        ],
      },
    },
    {
      title: 'Module 2 — Core Python',
      lessons: [
        {
          title: 'Lists and loops',
          content: {
            intro:
              'A list holds many values in order, e.g. items = ["a", "b", "c"]. A for-loop runs the same code for each item — the basis of processing data.',
            body: 'Lists + loops let you handle many things with a few lines: go through rows, files, or API results one by one. This pattern is everywhere in AI code.',
            points: [
              'A list stores an ordered collection.',
              'Index from 0: items[0] is the first.',
              'for x in items: repeats per item.',
              'Loops process data without repetition.',
            ],
            example:
              'for word in ["ai", "ml"]: print(word.upper()) → prints AI then ML.',
            tryIt:
              'Make a list of three tasks. Write a for-loop that prints each task with “TODO:” in front of it.',
            takeaway: 'lists hold many values; loops let you act on each one.',
          },
        },
        {
          title: 'Functions',
          content: {
            intro:
              'A function is reusable code with a name. You define it once with def, give it inputs (parameters), and call it whenever you need it.',
            body: 'Functions keep code organised and avoid repetition — you’ll wrap your AI calls in functions so you can reuse them with different inputs.',
            points: [
              'Define with def name(params):',
              'return sends a value back.',
              'Call it by name with arguments.',
              'Functions avoid repeating code.',
            ],
            example:
              'def greet(n): return "Hi " + n — then greet("Sam") gives “Hi Sam”.',
            tryIt:
              'Write a function that takes a number and returns it doubled. Call it with three different numbers and print the results.',
            takeaway: 'functions package reusable logic you can call with different inputs.',
          },
        },
      ],
      quiz: {
        required: true,
        questions: [
          {
            question: 'A for-loop is used to…',
            type: 'single',
            options: [
              { text: 'Run code once per item in a collection', correct: true },
              { text: 'Store a single number' },
            ],
          },
          {
            question: 'A function…',
            type: 'single',
            options: [
              { text: 'Packages reusable code you call by name', correct: true },
              { text: 'Is a type of spreadsheet' },
            ],
          },
        ],
      },
    },
    {
      title: 'Module 3 — Working with data',
      lessons: [
        {
          title: 'pandas basics',
          content: {
            intro:
              'pandas is the standard Python library for tabular data. Its DataFrame is like a spreadsheet in code — rows and columns you can filter, sort and summarise.',
            body: 'You import it (import pandas as pd) and work with DataFrames. Most AI data prep — cleaning, selecting columns, computing stats — happens in pandas.',
            points: [
              'pandas handles tables (DataFrames).',
              'import pandas as pd is the convention.',
              'Select, filter, sort and summarise easily.',
              'It’s the backbone of data prep for AI.',
            ],
            example:
              'df["age"].mean() returns the average of the age column.',
            tryIt:
              'In a notebook, run import pandas as pd, then create a small DataFrame from a dict of two columns and print it.',
            takeaway: 'pandas gives you a spreadsheet-like DataFrame for data work in code.',
          },
        },
        {
          title: 'Reading a CSV',
          content: {
            intro:
              'Real data usually comes as CSV files. pd.read_csv("file.csv") loads one into a DataFrame so you can explore and prepare it.',
            body: 'After loading, df.head() previews the first rows and df.shape shows size. This load-then-inspect step starts almost every data/AI task.',
            points: [
              'pd.read_csv() loads a CSV into a DataFrame.',
              'df.head() previews the first rows.',
              'df.shape shows (rows, columns).',
              'Inspect before you analyse.',
            ],
            example:
              'df = pd.read_csv("data.csv"); df.head() shows the top of your table.',
            tryIt:
              'Upload a small CSV to your notebook (or use a sample URL), load it with read_csv, and run head() and shape.',
            takeaway: 'load CSVs with read_csv, then inspect with head() and shape.',
          },
        },
      ],
      quiz: {
        required: true,
        questions: [
          {
            question: 'What is a pandas DataFrame like?',
            type: 'single',
            options: [
              { text: 'A spreadsheet table (rows and columns) in code', correct: true },
              { text: 'A single number' },
            ],
          },
          {
            question: 'How do you load a CSV in pandas?',
            type: 'single',
            options: [
              { text: 'pd.read_csv("file.csv")', correct: true },
              { text: 'pd.open_excel()' },
            ],
          },
        ],
      },
    },
    {
      title: 'Module 4 — Your first AI call',
      lessons: [
        {
          title: 'Installing and importing a library',
          content: {
            intro:
              'AI providers offer Python libraries. In a notebook you install one with pip (e.g. !pip install openai) and bring it into your code with import.',
            body: 'Install once per notebook session, then import the package to use it. The same pattern works for any library — pandas, an AI SDK, and so on.',
            points: [
              '!pip install <package> installs in a notebook.',
              'import <package> makes it usable.',
              'Install once per session.',
              'Same pattern for every library.',
            ],
            example:
              '!pip install openai then import openai in the next cell.',
            tryIt:
              'In a notebook, install your chosen AI provider’s Python package with pip and import it in the next cell (no errors = success).',
            takeaway: 'install with pip, import to use — the standard way to add libraries.',
          },
        },
        {
          title: 'Calling an AI model from Python',
          content: {
            intro:
              'With the library imported and your API key set, you create a client and send a prompt — the Python version of the API call, returning the model’s text.',
            body: 'Keep your key in an environment variable, not in the notebook. Send a prompt, print the response, then change the prompt and re-run — you’re now doing AI in Python.',
            points: [
              'Create a client with your API key (from env).',
              'Send a prompt; read the text response.',
              'Never hard-code keys in the notebook.',
              'Change the prompt and re-run to experiment.',
            ],
            example:
              'Send “Explain RAG in one sentence.” and print the model’s reply.',
            tryIt:
              'Using your provider’s Python quickstart, set your key as an env var, send a one-line prompt, and print the response.',
            takeaway: 'a client + key + prompt in Python returns the model’s answer — your first AI call in code.',
          },
        },
      ],
      quiz: {
        required: false,
        questions: [
          {
            question: 'How do you add an AI library in a notebook?',
            type: 'single',
            options: [
              { text: '!pip install it, then import it', correct: true },
              { text: 'Just hope it is there' },
            ],
          },
          {
            question: 'When calling a model from Python you should…',
            type: 'single',
            options: [
              { text: 'Keep the API key in an environment variable', correct: true },
              { text: 'Paste the key directly in shared code' },
            ],
          },
        ],
      },
    },
  ],
  finalAssessment: {
    required: false,
    passMark: 60,
    questions: [
      {
        question: 'A notebook is useful for AI because…',
        type: 'single',
        options: [
          { text: 'It runs Python in the browser with instant results', correct: true },
          { text: 'It replaces the need for any code' },
        ],
      },
      {
        question: 'Which are core Python building blocks? (select all)',
        type: 'multiple',
        options: [
          { text: 'Variables', correct: true },
          { text: 'Lists and loops', correct: true },
          { text: 'Functions', correct: true },
        ],
      },
      {
        question: 'pandas is mainly for…',
        type: 'single',
        options: [
          { text: 'Working with tabular data (DataFrames)', correct: true },
          { text: 'Editing images' },
        ],
      },
      {
        question: 'To call an AI model from Python you need…',
        type: 'single',
        options: [
          { text: 'The library imported and an API key (from env)', correct: true },
          { text: 'Only a spreadsheet' },
        ],
      },
    ],
  },
}

export const NEWCOMER_COURSES: CourseDef[] = [everyday, firstApp, rag, python]

/** Create all newcomer courses (idempotent). Returns how many were created. */
export async function createNewcomerCourses(
  payload: Payload,
  req?: PayloadRequest,
): Promise<number> {
  let created = 0
  for (const def of NEWCOMER_COURSES) {
    if (await createCourse(payload, def, req)) created += 1
  }
  return created
}
