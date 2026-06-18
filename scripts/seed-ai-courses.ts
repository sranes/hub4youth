import 'dotenv/config'
import config from '@payload-config'
import { getPayload } from 'payload'

/* ---------- Lexical rich-text helpers ---------- */
type Node = Record<string, unknown>

const t = (text: string, format = 0): Node => ({
  detail: 0,
  format,
  mode: 'normal',
  style: '',
  text,
  type: 'text',
  version: 1,
})
const b = (text: string): Node => t(text, 1) // bold

const para = (children: Node[] | string): Node => ({
  type: 'paragraph',
  children: typeof children === 'string' ? [t(children)] : children,
  direction: 'ltr',
  format: '',
  indent: 0,
  textFormat: 0,
  textStyle: '',
  version: 1,
})
const heading = (tag: 'h2' | 'h3', text: string): Node => ({
  type: 'heading',
  tag,
  children: [t(text)],
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
})
const li = (children: Node[] | string): Node => ({
  type: 'listitem',
  children: typeof children === 'string' ? [t(children)] : children,
  direction: 'ltr',
  format: '',
  indent: 0,
  value: 1,
  version: 1,
})
const ul = (items: (Node[] | string)[]): Node => ({
  type: 'list',
  listType: 'bullet',
  tag: 'ul',
  start: 1,
  children: items.map(li),
  direction: 'ltr',
  format: '',
  indent: 0,
  version: 1,
})
const doc = (children: Node[]) => ({
  root: { type: 'root', children, direction: 'ltr', format: '', indent: 0, version: 1 },
})

/* ---------- Course 1: AI Foundation (instructor-led) ---------- */
const aiFoundation = {
  title: 'AI Foundation',
  slug: 'ai-foundation',
  summary:
    'A live, instructor-led introduction to artificial intelligence — core concepts, machine learning, neural networks and generative AI, with hands-on guidance and a capstone project.',
  price: 19999,
  currency: 'INR' as const,
  duration: '8 weeks',
  level: 'beginner' as const,
  mode: 'live' as const,
  icon: 'brain' as const,
  featured: true,
  content: doc([
    heading('h2', 'About this course'),
    para(
      'AI Foundation is an 8-week, live, mentor-led program that takes you from "what is AI?" to building and evaluating your own machine-learning models. Sessions are interactive: you learn a concept, see it demonstrated, and apply it immediately with an instructor on hand to unblock you.',
    ),
    para([
      b('Who it’s for: '),
      t(
        'students and working professionals who want a structured, practical grounding in AI. No prior machine-learning experience is required — comfort with basic programming helps but we cover the Python you need.',
      ),
    ]),
    para([
      b('What you’ll build: '),
      t(
        'a series of small projects across the course (a classifier, a regression model, a simple neural network and a generative-AI mini-app), culminating in a capstone you can show employers.',
      ),
    ]),
    para([
      b('Format: '),
      t('weekly live classes, guided exercises, office hours, and a final capstone review.'),
    ]),
  ]),
  outcomes: [
    { outcome: 'Explain core AI, machine-learning and deep-learning concepts in plain language' },
    { outcome: 'Prepare data and build, train and evaluate machine-learning models' },
    { outcome: 'Understand how neural networks and deep learning work' },
    { outcome: 'Use generative AI and large language models in a simple application' },
    { outcome: 'Apply AI responsibly and recognise bias and ethical risks' },
    { outcome: 'Complete and present a portfolio-ready capstone project' },
  ],
  curriculum: [
    {
      moduleTitle: 'Introduction to AI',
      lessons: [
        { lesson: 'What artificial intelligence is (and isn’t)' },
        { lesson: 'A short history and the key milestones' },
        { lesson: 'AI vs machine learning vs deep learning' },
        { lesson: 'Where AI is used across industries today' },
      ],
    },
    {
      moduleTitle: 'Tools & foundations',
      lessons: [
        { lesson: 'Python essentials for AI' },
        { lesson: 'Working with NumPy and pandas' },
        { lesson: 'Statistics and probability you actually need' },
        { lesson: 'Intuition for vectors and matrices' },
      ],
    },
    {
      moduleTitle: 'Machine learning basics',
      lessons: [
        { lesson: 'Supervised vs unsupervised learning' },
        { lesson: 'Regression: predicting numbers' },
        { lesson: 'Classification: predicting categories' },
        { lesson: 'Train, validation and test splits' },
      ],
    },
    {
      moduleTitle: 'Building & evaluating models',
      lessons: [
        { lesson: 'Feature engineering' },
        { lesson: 'Overfitting, underfitting and regularisation' },
        { lesson: 'Metrics: accuracy, precision, recall, F1' },
        { lesson: 'Cross-validation and tuning' },
      ],
    },
    {
      moduleTitle: 'Neural networks & deep learning',
      lessons: [
        { lesson: 'From a neuron to a network' },
        { lesson: 'Activation functions and the forward pass' },
        { lesson: 'How models learn: loss and gradient descent' },
        { lesson: 'CNNs for images and an intro to frameworks' },
      ],
    },
    {
      moduleTitle: 'Natural language processing',
      lessons: [
        { lesson: 'Turning text into numbers' },
        { lesson: 'Word embeddings' },
        { lesson: 'Sentiment analysis in practice' },
        { lesson: 'An introduction to transformers' },
      ],
    },
    {
      moduleTitle: 'Generative AI & LLMs',
      lessons: [
        { lesson: 'How large language models work' },
        { lesson: 'Prompting effectively' },
        { lesson: 'Calling an AI model from code' },
        { lesson: 'Building a simple generative-AI app' },
      ],
    },
    {
      moduleTitle: 'Responsible AI & capstone',
      lessons: [
        { lesson: 'Bias, fairness and ethics' },
        { lesson: 'Privacy and safety basics' },
        { lesson: 'Deploying a model' },
        { lesson: 'Capstone project and career next steps' },
      ],
    },
  ],
}

/* ---------- Course 2: AI Fundamentals (free, full deep-dive material) ---------- */
const aiFundamentals = {
  title: 'AI Fundamentals',
  slug: 'ai-fundamentals',
  summary:
    'A free, self-paced deep dive into the fundamentals of artificial intelligence — from core concepts and machine learning to neural networks and modern generative AI, with clear explanations and examples.',
  price: 0,
  currency: 'INR' as const,
  duration: 'Self-paced · ~10 hours',
  level: 'all' as const,
  mode: 'self-paced' as const,
  icon: 'brain' as const,
  featured: true,
  outcomes: [
    { outcome: 'Describe what AI is and how it differs from machine learning and deep learning' },
    { outcome: 'Understand how machines learn from data' },
    { outcome: 'Recognise the main types of machine-learning algorithms and how they’re evaluated' },
    { outcome: 'Explain how neural networks and deep learning work at a high level' },
    { outcome: 'Understand how modern large language models generate text' },
    { outcome: 'Apply AI responsibly and know the key ethical risks' },
  ],
  curriculum: [
    {
      moduleTitle: 'Module 1 — What is artificial intelligence?',
      lessons: [
        { lesson: 'Defining AI' },
        { lesson: 'Narrow vs general AI' },
        { lesson: 'AI, ML and deep learning' },
        { lesson: 'A brief history' },
      ],
    },
    {
      moduleTitle: 'Module 2 — How machines learn',
      lessons: [
        { lesson: 'Learning from data' },
        { lesson: 'Supervised, unsupervised and reinforcement learning' },
        { lesson: 'Features, labels and a worked example' },
      ],
    },
    {
      moduleTitle: 'Module 3 — Working with data',
      lessons: [
        { lesson: 'Why data quality matters' },
        { lesson: 'Cleaning and preparing data' },
        { lesson: 'Splitting data and avoiding leakage' },
      ],
    },
    {
      moduleTitle: 'Module 4 — Core machine-learning algorithms',
      lessons: [
        { lesson: 'Regression and classification' },
        { lesson: 'A tour of common algorithms' },
        { lesson: 'Overfitting and how to measure success' },
      ],
    },
    {
      moduleTitle: 'Module 5 — Neural networks & deep learning',
      lessons: [
        { lesson: 'From neuron to network' },
        { lesson: 'How networks learn' },
        { lesson: 'CNNs and RNNs at a glance' },
      ],
    },
    {
      moduleTitle: 'Module 6 — Natural language processing',
      lessons: [
        { lesson: 'Turning language into numbers' },
        { lesson: 'Embeddings' },
        { lesson: 'Transformers and attention' },
      ],
    },
    {
      moduleTitle: 'Module 7 — Generative AI & large language models',
      lessons: [
        { lesson: 'What generative AI is' },
        { lesson: 'How LLMs are trained' },
        { lesson: 'Prompting, capabilities and limits' },
      ],
    },
    {
      moduleTitle: 'Module 8 — Using AI responsibly',
      lessons: [
        { lesson: 'Bias and fairness' },
        { lesson: 'Privacy, safety and transparency' },
        { lesson: 'Keeping humans in the loop' },
      ],
    },
    {
      moduleTitle: 'Module 9 — Getting hands-on & next steps',
      lessons: [
        { lesson: 'Tools to start with' },
        { lesson: 'A practice path' },
        { lesson: 'Glossary of key terms' },
      ],
    },
  ],
  content: doc([
    para([
      b('Welcome! '),
      t(
        'This free, self-paced course is a genuine deep dive into the fundamentals of artificial intelligence. Work through it top to bottom — each module builds on the last. You don’t need any maths or programming background to follow the ideas; where we mention code or formulas, we explain the intuition in plain language.',
      ),
    ]),

    heading('h2', 'Module 1 — What is artificial intelligence?'),
    para(
      'Artificial intelligence (AI) is the field of building computer systems that perform tasks we’d normally associate with human intelligence — recognising images, understanding language, making decisions, and learning from experience. The key word is "learning": modern AI systems improve by finding patterns in data rather than following rules written by hand.',
    ),
    heading('h3', 'Narrow vs general AI'),
    para(
      'Almost every AI in use today is "narrow" — it does one thing well, like detecting spam, recommending a film, or transcribing speech. "General" AI, a single system that can learn any task a human can, does not exist yet and remains a research goal. When the news talks about AI, it almost always means narrow AI applied to a specific problem.',
    ),
    heading('h3', 'AI, machine learning and deep learning'),
    para('These three terms are nested, not interchangeable:'),
    ul([
      [b('Artificial intelligence'), t(' — the broad goal of intelligent behaviour in machines.')],
      [
        b('Machine learning (ML)'),
        t(' — a subset of AI where systems learn patterns from data instead of being explicitly programmed.'),
      ],
      [
        b('Deep learning'),
        t(' — a subset of ML that uses many-layered neural networks; it powers most recent breakthroughs in vision and language.'),
      ],
    ]),
    heading('h3', 'A brief history'),
    para(
      'The term "artificial intelligence" was coined in 1956. Early decades focused on hand-written rules and logic, with bursts of optimism followed by "AI winters" when progress stalled. The 2010s changed everything: cheap computing power, huge datasets, and better algorithms made deep learning practical. Since the early 2020s, large language models have brought AI into everyday tools.',
    ),

    heading('h2', 'Module 2 — How machines learn'),
    para(
      'Traditional software follows instructions a programmer wrote. Machine learning flips this: you show the system many examples, and it figures out the rules itself. Give it thousands of emails labelled "spam" or "not spam", and it learns the patterns that distinguish them — no one writes those rules by hand.',
    ),
    heading('h3', 'Three styles of learning'),
    ul([
      [
        b('Supervised learning'),
        t(' — learn from labelled examples (input → correct answer). Used for prediction and classification. This is the most common style.'),
      ],
      [
        b('Unsupervised learning'),
        t(' — find structure in unlabelled data, e.g. grouping customers into segments.'),
      ],
      [
        b('Reinforcement learning'),
        t(' — learn by trial and error, receiving rewards for good actions. Used in game-playing and robotics.'),
      ],
    ]),
    heading('h3', 'Features, labels and a worked example'),
    para(
      'In supervised learning, the inputs are called features and the answer is the label. Imagine predicting house prices: features might be size, number of bedrooms and location; the label is the price. The model studies many houses with known prices, learns how features relate to price, and can then estimate the price of a house it has never seen.',
    ),

    heading('h2', 'Module 3 — Working with data'),
    para(
      'AI is only as good as the data it learns from. A common saying is "garbage in, garbage out." Most of the real work in AI is preparing data, not building models.',
    ),
    heading('h3', 'Cleaning and preparing data'),
    ul([
      'Handle missing values (fill them in or remove them sensibly).',
      'Fix errors, duplicates and inconsistent formats.',
      'Convert categories (like "red/green/blue") into numbers a model can use.',
      'Scale numeric features so no single one dominates just because of its units.',
    ]),
    heading('h3', 'Splitting data and avoiding leakage'),
    para(
      'We split data into a training set (to learn from), a validation set (to tune choices), and a test set (to fairly judge final performance on unseen data). The golden rule: never let information from the test set influence training — that "leakage" makes a model look better than it really is.',
    ),

    heading('h2', 'Module 4 — Core machine-learning algorithms'),
    para('Most everyday ML problems fall into two shapes:'),
    ul([
      [b('Regression'), t(' — predict a number (price, temperature, demand).')],
      [b('Classification'), t(' — predict a category (spam/not-spam, disease/no-disease).')],
    ]),
    heading('h3', 'A tour of common algorithms'),
    ul([
      [b('Linear & logistic regression'), t(' — simple, fast, surprisingly strong baselines.')],
      [b('Decision trees & random forests'), t(' — flexible models that capture non-linear patterns and are easy to interpret.')],
      [b('k-nearest neighbours'), t(' — classify by looking at the most similar past examples.')],
      [b('k-means clustering'), t(' — an unsupervised method that groups similar items together.')],
    ]),
    heading('h3', 'Overfitting and measuring success'),
    para(
      'A model that memorises the training data but fails on new data is "overfitting"; one too simple to capture the pattern is "underfitting". We measure classifiers with accuracy, precision (how many predicted positives were right) and recall (how many real positives we caught) — these matter more than accuracy when classes are imbalanced, such as detecting fraud.',
    ),

    heading('h2', 'Module 5 — Neural networks & deep learning'),
    para(
      'Neural networks are loosely inspired by the brain. They’re the engine behind modern image and language AI.',
    ),
    heading('h3', 'From neuron to network'),
    para(
      'An artificial neuron takes several inputs, multiplies each by a weight, adds them up, and passes the result through an activation function that decides how strongly it "fires". Stack many neurons into layers and you get a network: an input layer, one or more hidden layers, and an output layer. "Deep" learning simply means many hidden layers.',
    ),
    heading('h3', 'How networks learn'),
    para(
      'The network makes a prediction, a loss function measures how wrong it was, and an algorithm called backpropagation adjusts every weight slightly to reduce that error. Repeat this over millions of examples — a process called gradient descent — and the network gradually gets better.',
    ),
    heading('h3', 'CNNs and RNNs at a glance'),
    ul([
      [
        b('Convolutional neural networks (CNNs)'),
        t(' — excel at images by detecting edges, shapes and objects layer by layer.'),
      ],
      [
        b('Recurrent neural networks (RNNs)'),
        t(' — handle sequences like text or time series; largely superseded by transformers (next module).'),
      ],
    ]),

    heading('h2', 'Module 6 — Natural language processing'),
    para(
      'Natural language processing (NLP) is how computers work with human language — translation, summarising, answering questions and more.',
    ),
    heading('h3', 'Turning language into numbers'),
    para(
      'Models can’t read words directly, so we convert text into numbers. First we break text into tokens (words or word-pieces), then represent each token as a vector of numbers called an embedding.',
    ),
    heading('h3', 'Embeddings'),
    para(
      'An embedding places words in a mathematical space where similar meanings sit close together — "king" near "queen", "Paris" near "France". This lets models capture meaning, not just spelling.',
    ),
    heading('h3', 'Transformers and attention'),
    para(
      'The transformer architecture (2017) uses a mechanism called "attention" that lets a model weigh how much each word relates to every other word in a sentence. This made it possible to train enormous, highly capable language models — and is the foundation of today’s generative AI.',
    ),

    heading('h2', 'Module 7 — Generative AI & large language models'),
    para(
      'Generative AI creates new content — text, images, audio, code — rather than just classifying existing data. Large language models (LLMs) are the best-known example.',
    ),
    heading('h3', 'How LLMs work'),
    para(
      'At their core, LLMs do one simple thing astonishingly well: predict the next token given everything so far. Trained on vast amounts of text, they learn grammar, facts and patterns of reasoning. Generating an answer is just doing this prediction over and over.',
    ),
    heading('h3', 'How they’re trained'),
    ul([
      [b('Pre-training'), t(' — learn language from huge text datasets by predicting the next token.')],
      [b('Fine-tuning'), t(' — specialise the model on narrower, higher-quality data for a task.')],
      [
        b('Alignment (RLHF)'),
        t(' — use human feedback to make responses more helpful, honest and safe.'),
      ],
    ]),
    heading('h3', 'Prompting, capabilities and limits'),
    para(
      'You steer an LLM with a prompt — clear instructions and context produce better results. But LLMs have real limits: they can "hallucinate" confident but wrong answers, they don’t truly understand the world, and their knowledge has a cutoff date. Always verify important outputs.',
    ),

    heading('h2', 'Module 8 — Using AI responsibly'),
    para(
      'AI is powerful, which means it can cause harm if used carelessly. Responsible use is part of the fundamentals, not an afterthought.',
    ),
    ul([
      [
        b('Bias & fairness'),
        t(' — models learn society’s biases from data; test for and mitigate unfair outcomes.'),
      ],
      [b('Privacy'), t(' — handle personal data lawfully and minimise what you collect.')],
      [
        b('Transparency'),
        t(' — be clear when AI is used and how decisions are made, especially in high-stakes settings.'),
      ],
      [
        b('Human oversight'),
        t(' — keep people accountable for consequential decisions; AI should assist, not replace, judgement.'),
      ],
    ]),

    heading('h2', 'Module 9 — Getting hands-on & next steps'),
    heading('h3', 'Tools to start with'),
    ul([
      'Python with libraries like scikit-learn, pandas and NumPy for classic ML.',
      'PyTorch or TensorFlow for deep learning.',
      'No-code tools and hosted AI APIs to experiment without setup.',
    ]),
    heading('h3', 'A practice path'),
    para(
      'Pick a small, real dataset you find interesting. Frame a question, prepare the data, train a simple model, and measure it honestly. Then iterate. Building a handful of small projects teaches more than reading ever will.',
    ),
    heading('h3', 'Glossary of key terms'),
    ul([
      [b('Model'), t(' — a system that has learned patterns from data to make predictions.')],
      [b('Feature / label'), t(' — the inputs to a model / the answer it’s trained to predict.')],
      [b('Training'), t(' — the process of learning patterns from data.')],
      [b('Overfitting'), t(' — performing well on training data but poorly on new data.')],
      [b('Neural network'), t(' — a layered model of connected artificial neurons.')],
      [b('Embedding'), t(' — a numeric vector representing the meaning of a token.')],
      [b('LLM'), t(' — a large language model that generates text by predicting tokens.')],
      [b('Prompt'), t(' — the instruction and context you give a generative model.')],
    ]),
    para([
      b('Congratulations — '),
      t(
        'you now have a solid mental model of how modern AI works. The best next step is to enroll in a hands-on, mentor-led program (like our AI Foundation course) and start building.',
      ),
    ]),
  ]),
}

/* ---------- Seeder ---------- */
const run = async () => {
  const dbUrl = process.env.DATABASE_URL || ''
  const isPostgres = dbUrl.startsWith('postgres')
  console.log(`[seed] Target database: ${isPostgres ? 'PostgreSQL (production)' : 'SQLite (local)'}`)

  // Guard: when invoked for production, refuse to run if the production
  // DATABASE_URL didn't actually load (otherwise we'd seed local SQLite by mistake).
  if (process.env.SEED_REQUIRE_POSTGRES === '1' && !isPostgres) {
    console.error(
      '[seed] Aborting: SEED_REQUIRE_POSTGRES=1 but DATABASE_URL is not a Postgres string.\n' +
        '       The production environment may not have loaded (is DATABASE_URL marked Sensitive in Vercel?).',
    )
    process.exit(1)
  }

  const payload = await getPayload({ config })

  for (const course of [aiFoundation, aiFundamentals]) {
    const existing = await payload.find({
      collection: 'courses',
      where: { slug: { equals: course.slug } },
      limit: 1,
    })
    if (existing.totalDocs > 0) {
      payload.logger.info(`Course "${course.title}" already exists — skipping.`)
      continue
    }
    await payload.create({
      collection: 'courses',
      data: { ...course, _status: 'published' },
      context: { disableRevalidate: true },
    })
    payload.logger.info(`Created course: ${course.title}`)
  }

  payload.logger.info('AI courses seed complete.')
  process.exit(0)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
