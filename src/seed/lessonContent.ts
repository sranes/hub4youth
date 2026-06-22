import type { Payload, PayloadRequest } from 'payload'

import type { Course } from '@/payload-types'

// ---------------------------------------------------------------------------
// Lexical rich-text builders (minimal nodes the Payload react converter renders)
// ---------------------------------------------------------------------------
type Node = Record<string, unknown>

const txt = (text: string): Node => ({
  detail: 0,
  format: 0,
  mode: 'normal',
  style: '',
  text,
  type: 'text',
  version: 1,
})

const para = (text: string): Node => ({
  children: [txt(text)],
  direction: 'ltr',
  format: '',
  indent: 0,
  textFormat: 0,
  textStyle: '',
  type: 'paragraph',
  version: 1,
})

const heading = (text: string, tag = 'h2'): Node => ({
  children: [txt(text)],
  direction: 'ltr',
  format: '',
  indent: 0,
  tag,
  type: 'heading',
  version: 1,
})

const list = (items: string[]): Node => ({
  children: items.map((t, i) => ({
    children: [txt(t)],
    direction: 'ltr',
    format: '',
    indent: 0,
    type: 'listitem',
    value: i + 1,
    version: 1,
  })),
  direction: 'ltr',
  format: '',
  indent: 0,
  listType: 'bullet',
  start: 1,
  tag: 'ul',
  type: 'list',
  version: 1,
})

export type LessonContent = {
  intro: string
  body?: string
  points: string[]
  example?: string
  takeaway: string
  /** Optional hands-on exercise, shown in a highlighted box in the player. */
  tryIt?: string
}

export function buildLessonState(c: LessonContent) {
  const children: Node[] = [para(c.intro)]
  if (c.body) children.push(para(c.body))
  children.push(heading('Key points', 'h3'), list(c.points))
  if (c.example) {
    children.push(heading('Example', 'h3'), para(c.example))
  }
  children.push(para(`In practice: ${c.takeaway}`))
  return {
    root: {
      children,
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  }
}

// ---------------------------------------------------------------------------
// Quizzes
// ---------------------------------------------------------------------------
export type QuizQuestionInput = {
  question: string
  type?: 'single' | 'multiple'
  options: { text: string; correct?: boolean }[]
}
export type QuizInput = {
  required?: boolean
  passMark?: number
  questions: QuizQuestionInput[]
}

/** Build a simple multi-paragraph rich-text doc (used for course overviews). */
export function buildOverview(paragraphs: string[]) {
  return {
    root: {
      children: paragraphs.map(para),
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  }
}

export function buildQuiz(q: QuizInput, defaultRequired: boolean) {
  return {
    required: q.required ?? defaultRequired,
    passMark: q.passMark ?? 60,
    questions: q.questions.map((qq) => ({
      question: qq.question,
      type: qq.type || 'single',
      options: qq.options.map((o) => ({ text: o.text, correct: Boolean(o.correct) })),
    })),
  }
}

export type CourseContent = {
  lessons: Record<string, LessonContent>
  // Keyed by exact module title.
  quizzes?: Record<string, QuizInput>
  finalAssessment?: QuizInput
}

// ---------------------------------------------------------------------------
// Authored content, keyed by course slug.
// ---------------------------------------------------------------------------
export const CONTENT: Record<string, CourseContent> = {
  'ai-fundamentals': {
    lessons: {
      'Defining AI': {
        intro:
          'Artificial intelligence is the field of building systems that perform tasks we associate with human intelligence — recognising images, understanding language, making decisions, and improving from experience. Rather than following only hand-written rules, modern AI learns patterns from data.',
        body: 'The crucial shift from traditional software is this: instead of a programmer specifying every rule, we give the system examples and an objective, and it discovers the rules itself. That makes AI powerful for messy, real-world problems (like recognising a cat in a photo) that are almost impossible to capture in explicit if/else logic.',
        points: [
          'AI is a broad goal, not a single technique.',
          'Most of today’s AI is built on machine learning — systems that improve from examples.',
          'An AI system is only as good as the data and objective it is given.',
          'AI augments human work; it rarely replaces judgement entirely.',
        ],
        example:
          'A spam filter is AI: rather than hand-listing every spammy phrase, it learns from millions of emails labelled “spam” or “not spam” and generalises to new messages.',
        takeaway:
          'think of AI as software that learns behaviour from data instead of being programmed for every case.',
      },
      'Narrow vs general AI': {
        intro:
          'Almost all AI in use today is “narrow” — it does one task well, like translating text or detecting spam. “General” AI, a system that can learn any intellectual task a human can, does not yet exist.',
        body: 'Even systems that feel broad, like a chatbot that can write code and poems, are still narrow AI applied to the single task of predicting text. Recognising this keeps expectations realistic: today’s AI has no understanding, goals, or common sense beyond the patterns in its training data.',
        points: [
          'Narrow AI: expert at a single, well-defined task.',
          'General AI (AGI): hypothetical human-level breadth — still research.',
          'Superintelligence: speculative, beyond human ability.',
          'Impressive demos are still narrow AI applied cleverly.',
        ],
        example:
          'A chess engine can crush a world champion but cannot drive a car or hold a conversation — it is narrow by design.',
        takeaway: 'when someone says “AI”, they almost always mean a narrow system tuned for one job.',
      },
      'AI, ML and deep learning': {
        intro:
          'These three terms are nested. AI is the goal; machine learning (ML) is the main way we reach it today; deep learning is a powerful subset of ML based on neural networks.',
        body: 'Picture three concentric circles: AI on the outside, machine learning inside it, and deep learning at the centre. Classic ML often needs humans to hand-pick useful features; deep learning learns those features automatically from raw data, which is why it dominates images, audio and language.',
        points: [
          'AI contains machine learning, which contains deep learning.',
          'ML learns patterns from data instead of explicit rules.',
          'Deep learning uses many-layered neural networks for complex data like images and text.',
          'Deep learning shines with lots of data and compute.',
        ],
        example:
          'Predicting house prices from a spreadsheet is classic ML; recognising faces in photos is deep learning.',
        takeaway:
          'deep learning is one tool inside machine learning, which is one approach to building AI.',
      },
      'A brief history': {
        intro:
          'AI has moved through waves of optimism and “winters”. From symbolic rule-based systems in the 1950s–80s, to statistical machine learning, and since 2012 the deep-learning era driven by data, GPUs and better algorithms.',
        body: 'The pattern repeats: a breakthrough sparks hype, reality falls short, funding dries up (a “winter”), then new ideas plus more data and compute restart the cycle. The current era began when deep networks, trained on huge datasets with GPUs, suddenly outperformed everything else.',
        points: [
          '1950s: the term “AI” is coined; early symbolic systems.',
          '1980s–90s: expert systems, then an “AI winter”.',
          '2012: deep learning breaks image-recognition records.',
          '2017–today: transformers and large language models.',
        ],
        example:
          'In 2012 a deep network called AlexNet roughly halved the error rate on a famous image-recognition benchmark, kicking off the modern boom.',
        takeaway: 'today’s breakthroughs rest on decades of research plus modern data and hardware.',
      },
      'Learning from data': {
        intro:
          'Machine learning finds patterns in examples and uses them to make predictions on new, unseen data. Instead of coding rules, we show the model many examples and let it infer the rule.',
        body: 'There are two phases: training, where the model adjusts its internal numbers to fit the examples, and inference, where the trained model makes predictions on new data. Success is measured by generalisation — performing well on data it has never seen, not by memorising the training set.',
        points: [
          'Training: the model adjusts itself to fit examples.',
          'Inference: the trained model predicts on new data.',
          'Generalisation — performing well on unseen data — is the real goal.',
          'More relevant data usually beats a cleverer algorithm.',
        ],
        example:
          'Show a model thousands of labelled photos of cats and dogs (training); it then labels a brand-new photo it has never seen (inference).',
        takeaway: 'learning means adjusting a model from examples so it generalises to new cases.',
      },
      'Supervised, unsupervised and reinforcement learning': {
        intro:
          'The three broad styles of ML differ in what signal they learn from: labelled answers, structure alone, or feedback from actions.',
        body: 'Supervised learning is by far the most common in business because labelled data (input paired with the right answer) is the clearest teaching signal. Unsupervised learning explores data with no labels to find groupings, while reinforcement learning learns a strategy by trial and error against a reward.',
        points: [
          'Supervised: learns from labelled examples (input → known output).',
          'Unsupervised: finds structure or clusters with no labels.',
          'Reinforcement: learns by trial and error via rewards.',
          'Most business ML today is supervised.',
        ],
        example:
          'Supervised: predict churn from labelled customers. Unsupervised: segment customers into groups. Reinforcement: train a game-playing agent that earns points.',
        takeaway: 'pick the paradigm by the data you have: labels, structure, or a reward signal.',
      },
      'Features, labels and a worked example': {
        intro:
          'A feature is an input variable; a label is the answer we want to predict. To predict a house price from its size, location and age, those are the features; the price is the label.',
        body: 'Each training row is a set of features paired with its label. The art of “feature engineering” — choosing and shaping the inputs — often matters more than the choice of algorithm, because the model can only learn from the signal you give it.',
        points: [
          'Features are the inputs the model sees.',
          'The label is the target it learns to predict.',
          'Good features often matter more than the algorithm.',
          'Each training row pairs features with a label.',
        ],
        example:
          'Rows like {size: 90m², bedrooms: 2, area: “central”} → price: £350k teach the model the relationship between features and the label.',
        takeaway: 'framing a problem as features → label is the first step of any ML project.',
      },
      'Why data quality matters': {
        intro:
          'Models learn whatever is in the data — including errors and bias. “Garbage in, garbage out” is the rule: poor data produces poor predictions no matter the algorithm.',
        body: 'A clever algorithm cannot rescue bad data. Mislabelled rows, missing values, and unrepresentative samples all get baked into the model. Representative data — covering the cases you will actually face — matters more than sheer volume.',
        points: [
          'Errors, duplicates and missing values mislead the model.',
          'Biased data produces biased predictions.',
          'Representative data matters more than sheer volume.',
          'Data work is most of a real ML project.',
        ],
        example:
          'A face system trained mostly on one demographic performs worse on others — the gap comes from the data, not the maths.',
        takeaway: 'invest in clean, representative data before tuning models.',
      },
      'Cleaning and preparing data': {
        intro:
          'Raw data is rarely ready to use. Preparation handles missing values, inconsistent formats, outliers and scaling so the model can learn effectively.',
        body: 'Typical steps: fill or drop missing values, standardise units and formats, scale numbers to comparable ranges, and turn categories into numbers the model can use. This unglamorous work is usually where most project time goes.',
        points: [
          'Handle missing values (drop, fill, or flag).',
          'Standardise formats and units.',
          'Scale or normalise numeric features.',
          'Encode categories into numbers.',
        ],
        example:
          'Convert “London/london/LDN” to one value, fill blank ages with the median, and scale salary so it doesn’t dwarf age in the maths.',
        takeaway: 'most modelling time goes into preparing data, not training.',
      },
      'Splitting data and avoiding leakage': {
        intro:
          'To estimate real-world performance, we split data into training and test sets. Data leakage — letting test information sneak into training — gives falsely high scores.',
        body: 'The test set is a stand-in for the future: it must stay untouched until the very end. A validation set is used for tuning choices. Leakage (e.g. scaling using the whole dataset before splitting) quietly inflates scores that then collapse in production.',
        points: [
          'The train set fits the model; the test set measures it.',
          'Never let test data influence training.',
          'Leakage causes great scores that collapse in production.',
          'Use a validation set for tuning choices.',
        ],
        example:
          'Computing an average from all rows (train + test) and feeding it in leaks the future into training — split first, then process.',
        takeaway: 'keep test data untouched until the end to get an honest estimate.',
      },
      'Regression and classification': {
        intro:
          'Two core supervised tasks: regression predicts a number (like price), and classification predicts a category (like spam or not spam).',
        body: 'The same features can power either task — what changes is the label. Each task also uses different success metrics, so decide the task type first because it drives everything downstream.',
        points: [
          'Regression produces a continuous output.',
          'Classification produces discrete categories.',
          'The same features can serve either, depending on the label.',
          'Each task has its own metrics.',
        ],
        example:
          'From the same customer data: predict spend next month (regression) or predict whether they will churn — yes/no (classification).',
        takeaway: 'decide first whether you are predicting a number or a category.',
      },
      'A tour of common algorithms': {
        intro:
          'A handful of algorithms cover most needs: linear and logistic regression, decision trees, random forests, gradient boosting, k-nearest neighbours, and neural networks.',
        body: 'Start with a simple, interpretable baseline and only add complexity if it earns its keep. For everyday spreadsheet-style data, tree ensembles like gradient boosting are often the strongest; deep networks win on images, audio and text.',
        points: [
          'Linear/logistic regression: simple, interpretable baselines.',
          'Trees and forests: handle non-linear data well.',
          'Gradient boosting: strong on tabular data.',
          'Neural networks: best for images, audio and text.',
        ],
        example:
          'For a churn model on tabular data, a gradient-boosting model often beats a neural network and is easier to ship.',
        takeaway: 'start simple; reach for complex models only when needed.',
      },
      'Overfitting and how to measure success': {
        intro:
          'Overfitting means memorising training data instead of learning the pattern — great train scores but poor test scores. We measure success on held-out data with task-appropriate metrics.',
        body: 'The opposite failure is underfitting — too simple to capture the pattern, with high error everywhere. The cure for overfitting is more/cleaner data, a simpler model, or regularisation. Always judge on held-out data with the right metric.',
        points: [
          'Overfit: low train error, high test error.',
          'Underfit: high error everywhere (too simple).',
          'Classification: accuracy, precision, recall, F1.',
          'Regression: MAE, RMSE, R².',
        ],
        example:
          'A model that memorises every training email scores 100% in training but flags real new emails poorly — classic overfitting.',
        takeaway: 'judge a model by held-out performance, not training performance.',
      },
      'From neuron to network': {
        intro:
          'A neural network is built from simple units called neurons. Each neuron takes inputs, weights them, sums them, and passes the result through an activation function. Stack many and you get a network that learns complex patterns.',
        body: 'Neurons are arranged in layers; each layer transforms its inputs a little, and stacking layers (depth) lets the network compose simple features into complex ones. The weights across all those connections are what the network learns.',
        points: [
          'A neuron is a weighted sum plus an activation.',
          'Layers compose simple parts into complex functions.',
          'Weights are what the network learns.',
          'Depth lets networks model rich relationships.',
        ],
        example:
          'In image recognition, early layers detect edges, middle layers detect shapes, and later layers detect whole objects.',
        takeaway: 'networks gain power by combining many simple neurons across layers.',
      },
      'How networks learn': {
        intro:
          'Networks learn by comparing predictions to the truth (a loss), then nudging weights to reduce that loss using gradient descent and backpropagation, repeated over many examples.',
        body: 'Each pass measures how wrong the prediction is, backpropagation works out how every weight contributed to that error, and gradient descent nudges the weights to do better. Repeat over many examples and epochs and the loss steadily falls.',
        points: [
          'The loss measures how wrong a prediction is.',
          'Backpropagation computes how each weight affects the loss.',
          'Gradient descent updates weights to lower the loss.',
          'Repeat over many epochs to improve.',
        ],
        example:
          'Predict “cat”, truth is “dog”: the loss is high, backprop assigns blame to weights, and they shift so next time “dog” is likelier.',
        takeaway: 'training repeatedly measures error and adjusts weights to reduce it.',
      },
      'CNNs and RNNs at a glance': {
        intro:
          'Different data needs different architectures. Convolutional networks (CNNs) excel at images; recurrent networks (RNNs) handle sequences like text or time series.',
        body: 'CNNs slide small filters across an image to detect local patterns regardless of position. RNNs carry a memory across a sequence step by step — though for language, transformers have largely replaced them.',
        points: [
          'CNNs detect local patterns (edges → shapes → objects).',
          'RNNs carry information across a sequence.',
          'Transformers have largely replaced RNNs for language.',
          'Architecture choice follows the data type.',
        ],
        example:
          'A CNN spots a tumour in an X-ray; an RNN (or transformer) predicts the next word in a sentence.',
        takeaway: 'match the architecture to your data: grids → CNNs, sequences → RNNs or transformers.',
      },
      'Turning language into numbers': {
        intro:
          'Computers work with numbers, so text must be converted before a model can use it. The first step is tokenisation — splitting text into words or sub-word pieces — then mapping tokens to numeric ids.',
        body: 'Sub-word tokenisation lets a model handle rare or unseen words by breaking them into familiar pieces. The number of tokens also drives cost and the context-length limit, so concise prompts are cheaper and fit more in.',
        points: [
          'Tokenisation splits text into units (tokens).',
          'Each token maps to a numeric id.',
          'Sub-word tokens handle rare or unknown words.',
          'Token counts drive model cost and limits.',
        ],
        example:
          '“unhappiness” might tokenise to “un”, “happi”, “ness” — three known pieces instead of one unknown word.',
        takeaway: 'all NLP begins by turning text into numbers the model can process.',
      },
      Embeddings: {
        intro:
          'An embedding represents a token or sentence as a vector of numbers that captures meaning, so that similar meanings sit close together in space.',
        body: 'Because related concepts land near each other, you can measure similarity by distance — which is what powers semantic search, recommendations and clustering. Embeddings are learned from huge text corpora, not hand-built.',
        points: [
          'Embeddings encode meaning as vectors.',
          'Similar concepts have nearby vectors.',
          'They power search, recommendations and clustering.',
          'They are learned from huge text corpora.',
        ],
        example:
          'The vectors for “king” and “queen” sit close together, and “king − man + woman” lands near “queen”.',
        takeaway: 'embeddings let machines compare meaning, not just exact words.',
      },
      'Transformers and attention': {
        intro:
          'The transformer architecture, introduced in 2017, uses “attention” to let each word consider every other word in context. It underpins modern language models.',
        body: 'Attention lets the model weigh which other words matter for understanding the current one, and it processes a whole sequence in parallel rather than one step at a time — making training fast and long-range context easy to capture.',
        points: [
          'Attention weighs the relevance of other tokens.',
          'Transformers process sequences in parallel (fast).',
          'They capture long-range context well.',
          'They are the foundation of GPT-style LLMs.',
        ],
        example:
          'In “the trophy didn’t fit in the case because it was too big”, attention helps the model link “it” to “trophy”, not “case”.',
        takeaway: 'attention is the mechanism that made today’s large language models possible.',
      },
      'What generative AI is': {
        intro:
          'Generative AI creates new content — text, images, audio, code — rather than only classifying or predicting. Large language models generate text one token at a time.',
        body: 'Each new token is chosen based on everything written so far, then fed back in to choose the next — so output is produced, not retrieved. The same idea extends to images, audio and video generators.',
        points: [
          'Generative means it produces new content.',
          'LLMs predict the next token repeatedly.',
          'It also covers image, audio and video generation.',
          'Outputs are probabilistic, not looked up.',
        ],
        example:
          'Ask for a haiku about rain and the model writes a fresh one token by token — it isn’t copied from a database.',
        takeaway: 'generative models produce novel outputs by predicting likely continuations.',
      },
      'How LLMs are trained': {
        intro:
          'Large language models are trained in stages: pre-training on vast text to predict the next token, then fine-tuning and alignment (for example with human feedback) to be helpful and safe.',
        body: 'Pre-training builds broad language ability from raw text; fine-tuning specialises it on curated examples; alignment (such as RLHF) shapes it toward responses people prefer. The result is a general model you can instruct.',
        points: [
          'Pre-training: predict the next token on huge corpora.',
          'Fine-tuning: specialise on curated data.',
          'Alignment (RLHF): match human preferences.',
          'The result is a general, instructable model.',
        ],
        example:
          'After pre-training on the open web, a model is fine-tuned on helpful Q&A and rated by humans so it answers politely and safely.',
        takeaway: 'LLMs learn language broadly first, then are shaped to be helpful and safe.',
      },
      'Prompting, capabilities and limits': {
        intro:
          'You steer an LLM with prompts. They are powerful at drafting, summarising and reasoning, but can hallucinate, lack up-to-date facts, and reflect training bias.',
        body: 'Treat an LLM as a fast, capable assistant whose work you review. It can invent confident-sounding but wrong details (“hallucinate”), has no built-in access to live or private data, and reflects biases in its training.',
        points: [
          'Strengths: writing, summarising, coding, ideation.',
          'Limits: can hallucinate confidently.',
          'No inherent access to live or private data.',
          'Always verify important outputs.',
        ],
        example:
          'Asked for a citation, a model may produce a plausible-looking but non-existent reference — always verify.',
        takeaway: 'use LLMs as capable assistants whose output you check, not as oracles.',
      },
      'Bias and fairness': {
        intro:
          'AI can reproduce and amplify bias present in its training data, leading to unfair outcomes for some groups. Fairness must be designed for, measured and monitored.',
        body: 'Bias enters through the data and through design choices, and harms often fall unevenly across groups. Treat fairness as an ongoing process: measure it with appropriate metrics, then mitigate with better data, constraints and audits.',
        points: [
          'Bias enters through data and design choices.',
          'Harms fall unevenly across groups.',
          'Measure fairness with appropriate metrics.',
          'Mitigate via better data, constraints and audits.',
        ],
        example:
          'A hiring model trained on past hires can learn historical bias and keep rejecting qualified candidates from under-represented groups.',
        takeaway: 'fairness is an ongoing engineering and governance responsibility, not an afterthought.',
      },
      'Privacy, safety and transparency': {
        intro:
          'Responsible AI protects personal data, avoids harmful outputs, and is transparent about how decisions are made and where AI is used.',
        body: 'Collect the minimum personal data needed and protect it, guard against unsafe outputs, tell people when AI is involved, and follow the relevant laws. Transparency builds the trust that adoption depends on.',
        points: [
          'Minimise and protect personal data.',
          'Guard against unsafe or harmful outputs.',
          'Be transparent that AI is involved.',
          'Follow relevant laws and regulations.',
        ],
        example:
          'A support chatbot should say it’s an AI and hand off to a human for sensitive issues rather than guessing.',
        takeaway: 'trust comes from protecting users and being open about AI’s role.',
      },
      'Keeping humans in the loop': {
        intro:
          'For consequential decisions, a human should review and be able to override the AI. Human oversight catches errors and keeps accountability clear.',
        body: 'Use AI to assist rather than decide alone on high-stakes calls (loans, medical, hiring). Provide clear review and override paths, keep accountability with people, and monitor the system after launch as the world changes.',
        points: [
          'Use AI to assist, not decide alone, on high-stakes calls.',
          'Provide review and override paths.',
          'Keep accountability with people.',
          'Monitor systems after deployment.',
        ],
        example:
          'An AI flags suspicious transactions, but a human analyst makes the final block-or-allow decision.',
        takeaway: 'design AI so a responsible human stays in control of important decisions.',
      },
      'Tools to start with': {
        intro:
          'You can learn AI hands-on with free, widely used tools. Python is the dominant language, with libraries for data and modelling, and notebooks for experimentation.',
        body: 'Notebooks (Jupyter or Google Colab) let you run code in small cells and see results instantly. pandas and NumPy handle data, scikit-learn covers classic ML, and PyTorch or TensorFlow handle deep learning when you need it.',
        points: [
          'Python with Jupyter or Google Colab notebooks.',
          'pandas and NumPy for data.',
          'scikit-learn for classic ML.',
          'PyTorch or TensorFlow for deep learning.',
        ],
        example:
          'Open a free Google Colab notebook, load a CSV with pandas, and train a scikit-learn model in a dozen lines — no setup required.',
        takeaway: 'start with Python and scikit-learn in a free notebook environment.',
      },
      'A practice path': {
        intro:
          'Learning sticks when you build. Work through small projects end to end: get data, clean it, train a model, evaluate, and iterate.',
        body: 'Begin with a tidy public dataset and a simple baseline, then improve it step by step. Evaluating honestly on held-out data and documenting what you try turns tutorials into real, transferable skill.',
        points: [
          'Start with a tidy public dataset.',
          'Build a simple baseline first.',
          'Evaluate honestly on held-out data.',
          'Iterate and document what you try.',
        ],
        example:
          'Predict Titanic survival or house prices end to end — load, clean, train, evaluate — then write up what worked.',
        takeaway: 'build small projects end-to-end — that is how concepts become skills.',
      },
      'Glossary of key terms': {
        intro:
          'A quick reference for the terms used across this course. Keep it handy as you continue learning.',
        body: 'These are the words you’ll meet again and again. Skim them now and return whenever a term feels fuzzy — the definitions are intentionally short and practical.',
        points: [
          'Model: a function learned from data.',
          'Feature / label: input variable / target.',
          'Training / inference: learning / predicting.',
          'Overfitting: memorising instead of generalising.',
          'Embedding: meaning represented as a vector.',
        ],
        example:
          'When a tutorial says “the model overfit”, you now know it memorised the training data and will do poorly on new data.',
        takeaway: 'revisit these definitions whenever a term feels fuzzy.',
      },
    },
    quizzes: {
      'Module 1 — What is artificial intelligence?': {
        required: true,
        questions: [
          {
            question: 'What best describes modern AI?',
            type: 'single',
            options: [
              { text: 'Software that learns patterns from data', correct: true },
              { text: 'A program with a rule hand-written for every case' },
              { text: 'A faster type of database' },
            ],
          },
          {
            question: 'Which statements are true today? (select all)',
            type: 'multiple',
            options: [
              { text: 'Almost all AI in use is “narrow”', correct: true },
              { text: 'Deep learning is a subset of machine learning', correct: true },
              { text: 'General (human-level) AI is already widely deployed' },
            ],
          },
        ],
      },
      'Module 2 — How machines learn': {
        required: true,
        questions: [
          {
            question: 'What is the real goal of training a model?',
            type: 'single',
            options: [
              { text: 'Generalising to unseen data', correct: true },
              { text: 'Memorising the training set' },
              { text: 'Using the largest possible model' },
            ],
          },
          {
            question: 'Match the paradigm: which learn from a labelled answer? (select all)',
            type: 'multiple',
            options: [
              { text: 'Supervised learning', correct: true },
              { text: 'Unsupervised learning' },
              { text: 'Reinforcement learning' },
            ],
          },
        ],
      },
      'Module 3 — Working with data': {
        required: true,
        questions: [
          {
            question: 'Why does data quality matter so much?',
            type: 'single',
            options: [
              { text: 'Models learn whatever is in the data, errors included', correct: true },
              { text: 'Clean data makes the model file smaller' },
              { text: 'It has no real effect on results' },
            ],
          },
          {
            question: 'What is data leakage?',
            type: 'single',
            options: [
              { text: 'Test information sneaking into training, inflating scores', correct: true },
              { text: 'Losing data to disk failure' },
              { text: 'Sending data to the wrong server' },
            ],
          },
        ],
      },
      'Module 4 — Core machine-learning algorithms': {
        required: true,
        questions: [
          {
            question: 'Which task predicts a category rather than a number?',
            type: 'single',
            options: [
              { text: 'Classification', correct: true },
              { text: 'Regression' },
            ],
          },
          {
            question: 'Which describe overfitting? (select all)',
            type: 'multiple',
            options: [
              { text: 'Low training error but high test error', correct: true },
              { text: 'Memorising instead of generalising', correct: true },
              { text: 'High error on both training and test data' },
            ],
          },
        ],
      },
      'Module 5 — Neural networks & deep learning': {
        required: true,
        questions: [
          {
            question: 'A single neuron computes…',
            type: 'single',
            options: [
              { text: 'A weighted sum of inputs passed through an activation', correct: true },
              { text: 'A random number' },
              { text: 'A database join' },
            ],
          },
          {
            question: 'Which architecture is best suited to images?',
            type: 'single',
            options: [
              { text: 'Convolutional neural network (CNN)', correct: true },
              { text: 'Recurrent neural network (RNN)' },
            ],
          },
        ],
      },
      'Module 6 — Natural language processing': {
        required: true,
        questions: [
          {
            question: 'What does an embedding represent?',
            type: 'single',
            options: [
              { text: 'Meaning captured as a vector of numbers', correct: true },
              { text: 'The exact spelling of a word' },
              { text: 'A compressed image' },
            ],
          },
          {
            question: 'What made transformers a breakthrough for language?',
            type: 'single',
            options: [
              { text: 'Attention, letting each word consider every other', correct: true },
              { text: 'They avoid using any training data' },
            ],
          },
        ],
      },
      'Module 7 — Generative AI & large language models': {
        required: true,
        questions: [
          {
            question: 'How does an LLM produce text?',
            type: 'single',
            options: [
              { text: 'By predicting the next token repeatedly', correct: true },
              { text: 'By copying answers from a fixed database' },
            ],
          },
          {
            question: 'Which are real limits of LLMs? (select all)',
            type: 'multiple',
            options: [
              { text: 'They can hallucinate confidently', correct: true },
              { text: 'They have no inherent access to live or private data', correct: true },
              { text: 'They are always factually correct' },
            ],
          },
        ],
      },
      'Module 8 — Using AI responsibly': {
        required: true,
        questions: [
          {
            question: 'Where does AI bias usually come from?',
            type: 'single',
            options: [
              { text: 'The training data and design choices', correct: true },
              { text: 'The colour of the user interface' },
            ],
          },
          {
            question: 'Good responsible-AI practices include… (select all)',
            type: 'multiple',
            options: [
              { text: 'Keeping a human in the loop for high-stakes decisions', correct: true },
              { text: 'Protecting personal data', correct: true },
              { text: 'Hiding that AI is involved from users' },
            ],
          },
        ],
      },
      'Module 9 — Getting hands-on & next steps': {
        required: false,
        questions: [
          {
            question: 'A good first toolkit for learning AI hands-on is…',
            type: 'single',
            options: [
              { text: 'Python with scikit-learn in a notebook', correct: true },
              { text: 'A spreadsheet only' },
            ],
          },
          {
            question: 'What is the best way to make concepts stick?',
            type: 'single',
            options: [
              { text: 'Build small projects end to end', correct: true },
              { text: 'Only read about them' },
            ],
          },
        ],
      },
    },
    finalAssessment: {
      required: false,
      passMark: 60,
      questions: [
        {
          question: 'Order of generality from broadest to narrowest:',
          type: 'single',
          options: [
            { text: 'AI ⊃ machine learning ⊃ deep learning', correct: true },
            { text: 'Deep learning ⊃ AI ⊃ machine learning' },
            { text: 'Machine learning ⊃ AI ⊃ deep learning' },
          ],
        },
        {
          question: 'Which are supervised-learning tasks? (select all)',
          type: 'multiple',
          options: [
            { text: 'Predicting a house price (regression)', correct: true },
            { text: 'Classifying email as spam', correct: true },
            { text: 'Clustering customers with no labels' },
          ],
        },
        {
          question: 'A model scores 99% on training data but 60% on test data. This is…',
          type: 'single',
          options: [
            { text: 'Overfitting', correct: true },
            { text: 'Underfitting' },
            { text: 'Data leakage being fixed' },
          ],
        },
        {
          question: 'Embeddings are useful because…',
          type: 'single',
          options: [
            { text: 'Similar meanings end up close together as vectors', correct: true },
            { text: 'They store the original text losslessly' },
          ],
        },
        {
          question: 'Responsible use of an LLM means… (select all)',
          type: 'multiple',
          options: [
            { text: 'Verifying important facts yourself', correct: true },
            { text: 'Avoiding pasting confidential data', correct: true },
            { text: 'Trusting every answer without checking' },
          ],
        },
      ],
    },
  },

  'prompt-engineering': {
    lessons: {
      'How models read a prompt': {
        intro:
          'A language model reads your prompt as a sequence of tokens and predicts a continuation. It has no memory beyond what you provide, so the prompt is its entire world for that request.',
        body: 'Because the model only “sees” the current prompt (plus what it learned in training), anything it needs to know must be in the text in front of it. There is no hidden state from previous chats unless that history is included in the prompt.',
        points: [
          'The model only knows what is in the prompt (and its training).',
          'It predicts the most likely continuation, token by token.',
          'Clearer input leads to more predictable output.',
          'Context length is limited, so stay relevant.',
        ],
        example:
          'Ask “summarise this” with no text and you get nothing useful — the model has no document unless you paste it into the prompt.',
        takeaway: 'treat the prompt as the model’s complete instructions and context for that answer.',
      },
      'Why wording matters': {
        intro:
          'Small changes in wording can change the output a lot, because the model responds to patterns and cues in your text. Precise, specific language steers it better than vague requests.',
        body: 'Vague prompts force the model to guess your intent, and it will guess differently each time. Naming the audience, tone, length and format removes that ambiguity and makes results consistent.',
        points: [
          'Specific verbs and nouns reduce ambiguity.',
          'State the audience, tone and length you want.',
          'Ambiguity invites inconsistent answers.',
          'Examples anchor the style you expect.',
        ],
        example:
          '“Write about dogs” is vague; “Write a 50-word, upbeat intro about adopting rescue dogs for a charity homepage” is specific and repeatable.',
        takeaway: 'say exactly what you want; specificity is the cheapest quality boost.',
      },
      'Role, task and context': {
        intro:
          'Strong prompts usually set a role (“You are a…”), a clear task, and the context needed to do it. Together these focus the model on the right behaviour.',
        body: 'The role sets the perspective and expertise, the task says exactly what to do, and the context supplies the facts, audience and goals. Leave any of these out and the model fills the gap with guesses.',
        points: [
          'Role: the perspective or expertise to adopt.',
          'Task: the specific action to perform.',
          'Context: the facts, audience and goals it needs.',
          'Omitting context forces the model to guess.',
        ],
        example:
          '“You are a friendly dietitian (role). Suggest a 3-day veg meal plan (task) for a busy student on a £20 budget (context).”',
        takeaway: 'role + task + context is a reliable backbone for any prompt.',
      },
      'Format, constraints and examples': {
        intro:
          'Tell the model how to answer: the format (list, table, JSON), constraints (length, tone, what to avoid), and an example of the output you want.',
        body: 'Defining the shape of a good answer is as important as the question. Constraints rein in rambling, and a single example of the desired output is often the fastest way to lock in the style you want.',
        points: [
          'Specify the output format explicitly.',
          'Add constraints such as word count or tone.',
          'Give a sample of the desired result.',
          'Constraints reduce rambling and surprises.',
        ],
        example:
          '“Reply as a 3-row markdown table with columns Name, Pros, Cons. Keep each cell under 8 words.”',
        takeaway: 'define the shape of a good answer, not just the question.',
      },
      'Zero-shot and few-shot': {
        intro:
          'Zero-shot prompting asks directly with no examples; few-shot includes a few input→output examples to demonstrate the pattern you want.',
        body: 'Zero-shot is fastest and often enough. When the format is tricky or the output keeps drifting, add one to five correct, representative examples — the model imitates the pattern you show.',
        points: [
          'Zero-shot: just ask — fast and simple.',
          'Few-shot: show one to five examples to set the pattern.',
          'Few-shot improves consistency on tricky formats.',
          'Keep examples representative and correct.',
        ],
        example:
          'Show two examples of “review → sentiment: positive/negative”, then give a new review; the model follows the pattern.',
        takeaway: 'add examples when zero-shot output is inconsistent or off-format.',
      },
      'Chain-of-thought': {
        intro:
          'Asking the model to reason step by step before answering often improves accuracy on multi-step problems, because it works through intermediate steps rather than jumping to a guess.',
        body: 'Prompting “think step by step” nudges the model to show its working, which both improves reasoning and lets you check it. It’s overkill for simple lookups but valuable for maths, logic and decisions.',
        points: [
          'Prompt it to “think step by step” for reasoning tasks.',
          'Helps with maths, logic and multi-step decisions.',
          'Exposes the reasoning so you can check it.',
          'Not needed for simple lookups.',
        ],
        example:
          'For a word problem, “Show your reasoning step by step, then give the final number” yields more correct answers.',
        takeaway: 'for complex problems, ask for reasoning steps, then the final answer.',
      },
      'Role and persona prompting': {
        intro:
          'Assigning a persona (“You are an experienced editor”) shapes tone, depth and vocabulary. It is a quick way to get domain-appropriate responses.',
        body: 'A specific persona is more effective than a generic “expert”. Combine it with the task and a target format to get a consistent, on-brand voice across many outputs.',
        points: [
          'A persona sets expertise and tone.',
          'Useful for a consistent voice across outputs.',
          'Combine with task and format for best results.',
          'Be specific: “senior tax accountant”, not just “expert”.',
        ],
        example:
          '“You are a patient primary-school teacher” yields simpler explanations than “You are an AI researcher”.',
        takeaway: 'a well-chosen persona aligns the model’s style with your need.',
      },
      'Asking for a format': {
        intro:
          'When you need machine-readable or consistent output, explicitly request a format such as JSON, a table, or a numbered list — and describe the fields.',
        body: 'Name the format and the exact fields, give a tiny schema or example, and tell the model to return only that format with nothing else. This is essential when the output feeds another program.',
        points: [
          'Name the format and the exact fields.',
          'Provide a tiny schema or example.',
          'Ask it to return only the format, nothing else.',
          'Great for pipelines and automation.',
        ],
        example:
          '“Return only JSON: {\\"title\\": string, \\"tags\\": string[]} — no prose.”',
        takeaway: 'specify the exact structure when output needs to be parsed or reused.',
      },
      'Delimiters and examples': {
        intro:
          'Delimiters (triple quotes, tags, headings) separate instructions from data so the model does not confuse them. Examples show the mapping you expect.',
        body: 'Wrapping pasted content in clear delimiters stops the model from treating it as new instructions — a simple guard against prompt-injection from untrusted text. Pair delimiters with a worked example for best results.',
        points: [
          'Wrap input data in clear delimiters.',
          'Separate instructions from content.',
          'Pair with a worked example.',
          'Reduces instruction-injection from pasted text.',
        ],
        example:
          'Summarise the text between the triple quotes: """{user text}""" — anything inside is data, not a command.',
        takeaway: 'use delimiters to keep instructions and data cleanly separated.',
      },
      'Debugging a prompt': {
        intro:
          'When output is wrong, change one thing at a time: clarify the task, add context or an example, tighten constraints, or ask for reasoning. Compare results to learn what helped.',
        body: 'Treat prompting like an experiment. First isolate whether the failure is format, content or reasoning, then adjust a single variable and compare — that tells you what actually moved the result.',
        points: [
          'Isolate the failure: format, content, or reasoning?',
          'Change one variable at a time.',
          'Add an example of the correct output.',
          'Iterate and keep what works.',
        ],
        example:
          'If answers are too long, add only “limit to 60 words” and re-run — don’t also change the persona in the same step.',
        takeaway: 'treat prompting as experiments — adjust one factor and observe.',
      },
      'Common mistakes': {
        intro:
          'Most weak prompts are vague, overloaded, or missing context. Asking for too much at once and not specifying a format are frequent culprits.',
        body: 'Cramming several tasks into one prompt, omitting context the model can’t infer, and never giving an example are the usual causes of disappointing output. Be specific and single-focused.',
        points: [
          'Too vague: no audience, tone or format.',
          'Too much: many tasks crammed together.',
          'Missing context the model cannot infer.',
          'No example when one would clarify.',
        ],
        example:
          'Splitting “research, outline and write a full report” into three prompts beats asking for all of it at once.',
        takeaway: 'be specific, single-focused, and provide the context and format you need.',
      },
      'Verifying and using AI responsibly': {
        intro:
          'Models can sound confident yet be wrong. Verify facts, do not share sensitive data, and disclose AI use where it matters. You stay responsible for the output.',
        body: 'Independently fact-check anything important, keep confidential and personal data out of prompts, and be open about AI assistance where it counts. The accountability for what you publish is yours, not the model’s.',
        points: [
          'Fact-check important claims independently.',
          'Avoid pasting confidential or personal data.',
          'Disclose AI assistance where appropriate.',
          'You own the final result.',
        ],
        example:
          'Before sending an AI-drafted legal summary, check the cited rules yourself and remove any client details from the prompt.',
        takeaway: 'always verify and use AI outputs responsibly — accountability stays with you.',
      },
    },
    quizzes: {
      'Module 1 — What is prompt engineering?': {
        required: true,
        questions: [
          {
            question: 'How does a model decide what to write?',
            type: 'single',
            options: [
              { text: 'It predicts the most likely next tokens', correct: true },
              { text: 'It searches the live web by default' },
            ],
          },
          {
            question: 'Why does precise wording help? (select all)',
            type: 'multiple',
            options: [
              { text: 'It reduces ambiguity', correct: true },
              { text: 'It makes results more consistent', correct: true },
              { text: 'It gives the model memory of past chats' },
            ],
          },
        ],
      },
      'Module 2 — Anatomy of a great prompt': {
        required: true,
        questions: [
          {
            question: 'Which trio forms a reliable prompt backbone?',
            type: 'single',
            options: [
              { text: 'Role, task and context', correct: true },
              { text: 'Font, colour and size' },
            ],
          },
          {
            question: 'Good ways to control the answer include… (select all)',
            type: 'multiple',
            options: [
              { text: 'Specifying the output format', correct: true },
              { text: 'Adding constraints like length or tone', correct: true },
              { text: 'Giving an example of the desired result', correct: true },
            ],
          },
        ],
      },
      'Module 3 — Core techniques': {
        required: true,
        questions: [
          {
            question: 'What is few-shot prompting?',
            type: 'single',
            options: [
              { text: 'Including a few input→output examples in the prompt', correct: true },
              { text: 'Asking the same question several times' },
            ],
          },
          {
            question: 'When does chain-of-thought help most?',
            type: 'single',
            options: [
              { text: 'On multi-step reasoning problems', correct: true },
              { text: 'On simple factual lookups' },
            ],
          },
        ],
      },
      'Module 4 — Reliable, structured output': {
        required: true,
        questions: [
          {
            question: 'To get machine-readable output you should…',
            type: 'single',
            options: [
              { text: 'Name the exact format and fields (e.g. JSON)', correct: true },
              { text: 'Ask politely and hope' },
            ],
          },
          {
            question: 'What do delimiters achieve?',
            type: 'single',
            options: [
              { text: 'They separate instructions from data', correct: true },
              { text: 'They make the model answer faster' },
            ],
          },
        ],
      },
      'Module 5 — Iterating, pitfalls & responsible use': {
        required: false,
        questions: [
          {
            question: 'The best way to debug a prompt is to…',
            type: 'single',
            options: [
              { text: 'Change one thing at a time and compare', correct: true },
              { text: 'Rewrite everything at once randomly' },
            ],
          },
          {
            question: 'Responsible use means… (select all)',
            type: 'multiple',
            options: [
              { text: 'Fact-checking important claims', correct: true },
              { text: 'Not pasting confidential data', correct: true },
              { text: 'Publishing output unchecked' },
            ],
          },
        ],
      },
    },
    finalAssessment: {
      required: false,
      passMark: 60,
      questions: [
        {
          question: 'A prompt is best understood as…',
          type: 'single',
          options: [
            { text: 'The model’s complete instructions and context for that answer', correct: true },
            { text: 'A saved setting the model always remembers' },
          ],
        },
        {
          question: 'Which improve reliability of output? (select all)',
          type: 'multiple',
          options: [
            { text: 'Specifying role, task and context', correct: true },
            { text: 'Requesting an explicit format', correct: true },
            { text: 'Using vague, open-ended wording' },
          ],
        },
        {
          question: 'Few-shot prompting means…',
          type: 'single',
          options: [
            { text: 'Showing a few examples of the pattern you want', correct: true },
            { text: 'Limiting the model to a few words' },
          ],
        },
        {
          question: 'You should always…',
          type: 'single',
          options: [
            { text: 'Verify important outputs and avoid sharing sensitive data', correct: true },
            { text: 'Trust the first answer completely' },
          ],
        },
      ],
    },
  },

  'neural-networks-and-deep-learning': {
    lessons: {
      'The artificial neuron': {
        intro:
          'The building block of every neural network is the artificial neuron: it multiplies each input by a weight, adds a bias, sums them, and passes the result through an activation function.',
        body: 'The weights decide how much each input matters and the bias shifts the result up or down; both are the numbers the network learns during training. A single neuron is just a tiny adjustable formula — power comes from connecting many together.',
        points: [
          'Output = activation(sum of inputs × weights + bias).',
          'Weights and bias are learned.',
          'Inspired by, but not identical to, biological neurons.',
          'Many neurons combine into powerful models.',
        ],
        example:
          'To predict if an email is spam, inputs might be word counts; the neuron weights “free” and “winner” heavily, sums them, and the activation outputs a spam probability.',
        takeaway: 'a neuron is a weighted sum plus an activation — simple, but the basis of everything.',
      },
      'Activation functions': {
        intro:
          'Activation functions add non-linearity, letting networks model complex relationships. Without them, stacked layers would collapse into a single linear function.',
        body: 'Non-linearity is what lets a deep network bend and fold its decision boundaries to fit complicated data. ReLU is the popular default for hidden layers because it is simple and trains fast; softmax is used at the output to turn scores into probabilities.',
        points: [
          'ReLU: fast, the default for hidden layers.',
          'Sigmoid and tanh: squashing functions, older style.',
          'Softmax: turns scores into class probabilities.',
          'Non-linearity is what makes depth useful.',
        ],
        example:
          'ReLU simply outputs 0 for negative inputs and passes positives through unchanged — cheap to compute, yet enough to unlock deep learning.',
        takeaway: 'activations give networks the non-linearity needed to learn complex patterns.',
      },
      'Layers and weights': {
        intro:
          'Neurons are organised into layers: an input layer, one or more hidden layers, and an output layer. The weights connecting them are the parameters the network learns.',
        body: 'Data flows from the input layer through the hidden layers to the output. More layers and neurons give the network more capacity to model complex relationships — but also more parameters to train and more risk of overfitting.',
        points: [
          'Data flows input → hidden → output layers.',
          'Weights connect neurons between layers.',
          'More layers or neurons mean more capacity.',
          'Parameters are tuned during training.',
        ],
        example:
          'A digit recogniser might take 784 pixel inputs, pass through two hidden layers, and output 10 numbers (one per digit 0–9).',
        takeaway: 'a network’s knowledge lives in the weights between its layers.',
      },
      'The forward pass': {
        intro:
          'The forward pass is how a network makes a prediction: data flows from input to output, each layer transforming it, until a final result is produced.',
        body: 'Every layer applies its weights and activation to the previous layer’s output. No learning happens during the forward pass — it’s pure computation that turns inputs into a prediction.',
        points: [
          'Data moves input → output through layers.',
          'Each layer applies weights and an activation.',
          'It produces the model’s prediction.',
          'No learning happens yet — just computation.',
        ],
        example:
          'Feed a photo in; the forward pass outputs probabilities like {cat: 0.92, dog: 0.08}.',
        takeaway: 'the forward pass turns inputs into a prediction, layer by layer.',
      },
      'Loss functions': {
        intro:
          'A loss function measures how far the network’s prediction is from the truth. Training aims to minimise this number.',
        body: 'The loss turns “how wrong was that?” into a single number the network can optimise. Use mean squared error for regression and cross-entropy for classification — the choice should match the task.',
        points: [
          'Loss measures how wrong the prediction is.',
          'MSE for regression; cross-entropy for classification.',
          'Lower loss means a better fit.',
          'The choice of loss matches the task.',
        ],
        example:
          'Predicting 0.6 when the true label is 1 gives a moderate cross-entropy loss; predicting 0.99 gives a small one.',
        takeaway: 'the loss is the single number training tries to make as small as possible.',
      },
      'Gradient descent': {
        intro:
          'Gradient descent updates weights in the direction that reduces the loss, taking small steps controlled by the learning rate.',
        body: 'The gradient points toward the steepest increase in loss, so we step the opposite way. The learning rate sets the step size: too big and training overshoots; too small and it crawls.',
        points: [
          'The gradient points toward steepest increase in loss.',
          'Step the opposite way to reduce loss.',
          'The learning rate sets the step size.',
          'Too big overshoots; too small is slow.',
        ],
        example:
          'Like walking downhill in fog: feel the slope (gradient) and take a step downward; stride length is the learning rate.',
        takeaway: 'gradient descent walks the weights downhill to lower the loss.',
      },
      Backpropagation: {
        intro:
          'Backpropagation efficiently computes how each weight contributed to the loss, by applying the chain rule backwards through the network. These gradients drive the weight updates.',
        body: 'It propagates the error from the output back toward the inputs, assigning each weight a gradient — its share of the blame. Those gradients are exactly what gradient descent needs to update the weights.',
        points: [
          'It propagates error from output back to inputs.',
          'It uses the chain rule of calculus.',
          'It gives a gradient for every weight.',
          'It pairs with gradient descent to learn.',
        ],
        example:
          'If an output weight contributed heavily to a wrong answer, backprop gives it a large gradient so it changes more.',
        takeaway: 'backprop tells each weight how to change; gradient descent makes the change.',
      },
      'Epochs and batches': {
        intro:
          'Training processes data in batches, and one full pass over the dataset is an epoch. Networks train over many epochs to gradually improve.',
        body: 'Updating on small mini-batches balances speed and stability, and repeating over many epochs lets the model refine its weights. Too few epochs underfit; too many can overfit.',
        points: [
          'A batch is a subset processed at once.',
          'An epoch is one full pass over the data.',
          'Mini-batches balance speed and stability.',
          'Multiple epochs let the model refine.',
        ],
        example:
          '60,000 images in batches of 64 means ~938 updates per epoch; train for, say, 20 epochs.',
        takeaway: 'networks learn over many epochs, updating on batches of data.',
      },
      'Overfitting and regularisation': {
        intro:
          'A network can memorise training data and fail on new data — overfitting. Regularisation techniques keep it general.',
        body: 'Watch for great training scores but poor test scores. Dropout randomly disables neurons during training, weight decay penalises large weights, and early stopping halts before the model starts memorising.',
        points: [
          'Overfit: great on train, poor on test.',
          'Dropout randomly disables neurons while training.',
          'Weight decay penalises large weights.',
          'Early stopping halts before overfitting.',
        ],
        example:
          'If validation loss starts rising while training loss keeps falling, stop early — the model is beginning to memorise.',
        takeaway: 'use regularisation so the network generalises instead of memorising.',
      },
      'Convolutional networks (images)': {
        intro:
          'Convolutional neural networks (CNNs) are designed for images. They slide small filters over the image to detect local patterns, building up from edges to shapes to objects.',
        body: 'Convolutions detect features regardless of where they appear, and pooling shrinks the data while adding robustness. Stacked layers build a hierarchy: edges → parts → whole objects.',
        points: [
          'Convolutions detect local features.',
          'Pooling reduces size and adds robustness.',
          'Layers build from edges → parts → objects.',
          'State of the art for vision tasks.',
        ],
        example:
          'Early CNN filters fire on edges; deeper ones fire on eyes and wheels, letting the network recognise faces or cars.',
        takeaway: 'CNNs exploit image structure by detecting local patterns hierarchically.',
      },
      'Recurrent networks (sequences)': {
        intro:
          'Recurrent neural networks (RNNs) process sequences one step at a time, carrying a hidden state that remembers earlier context — useful for text and time series.',
        body: 'The hidden state acts as memory passed from step to step. Variants like LSTM and GRU handle longer dependencies, though transformers have largely replaced RNNs for language.',
        points: [
          'They process sequences step by step.',
          'A hidden state carries memory.',
          'LSTM and GRU handle longer dependencies.',
          'Largely superseded by transformers for language.',
        ],
        example:
          'Predicting the next word in “the clouds are in the …” relies on remembering the earlier words via the hidden state.',
        takeaway: 'RNNs handle order and context in sequences via a running memory.',
      },
      'Transformers and attention': {
        intro:
          'Transformers use self-attention to relate every element of a sequence to every other, in parallel. They scale well and power modern language and vision models.',
        body: 'Self-attention weighs all positions at once, capturing long-range dependencies that tripped up RNNs, and the parallelism makes training on huge datasets efficient. This is the backbone of modern LLMs.',
        points: [
          'Self-attention weighs all positions at once.',
          'Parallel processing makes training efficient.',
          'It captures long-range dependencies.',
          'It is the backbone of modern LLMs.',
        ],
        example:
          'In a long paragraph, attention lets a pronoun at the end link directly to a noun near the start in one step.',
        takeaway: 'transformers replaced RNNs by using attention to model context at scale.',
      },
    },
    quizzes: {
      'Module 1 — From brain to artificial neuron': {
        required: true,
        questions: [
          {
            question: 'What does an artificial neuron compute?',
            type: 'single',
            options: [
              { text: 'A weighted sum passed through an activation', correct: true },
              { text: 'A database query' },
              { text: 'A CSS rule' },
            ],
          },
          {
            question: 'Which are activation functions? (select all)',
            type: 'multiple',
            options: [
              { text: 'ReLU', correct: true },
              { text: 'Softmax', correct: true },
              { text: 'SELECT' },
            ],
          },
        ],
      },
      'Module 2 — Building a network': {
        required: true,
        questions: [
          {
            question: 'Where does a network store what it has learned?',
            type: 'single',
            options: [
              { text: 'In the weights between its layers', correct: true },
              { text: 'In the lesson titles' },
            ],
          },
          {
            question: 'What happens during the forward pass?',
            type: 'single',
            options: [
              { text: 'Data flows input → output to produce a prediction', correct: true },
              { text: 'Weights are updated to reduce error' },
            ],
          },
        ],
      },
      'Module 3 — How networks learn': {
        required: true,
        questions: [
          {
            question: 'What does a loss function measure?',
            type: 'single',
            options: [
              { text: 'How far the prediction is from the truth', correct: true },
              { text: 'How fast the model runs' },
            ],
          },
          {
            question: 'Which pair makes learning work? (select all)',
            type: 'multiple',
            options: [
              { text: 'Backpropagation computes the gradients', correct: true },
              { text: 'Gradient descent updates the weights', correct: true },
              { text: 'Random guessing sets the weights' },
            ],
          },
        ],
      },
      'Module 4 — Training in practice': {
        required: true,
        questions: [
          {
            question: 'What is an epoch?',
            type: 'single',
            options: [
              { text: 'One full pass over the training data', correct: true },
              { text: 'A single neuron' },
            ],
          },
          {
            question: 'Which techniques fight overfitting? (select all)',
            type: 'multiple',
            options: [
              { text: 'Dropout', correct: true },
              { text: 'Weight decay', correct: true },
              { text: 'Early stopping', correct: true },
            ],
          },
        ],
      },
      'Module 5 — Architectures': {
        required: false,
        questions: [
          {
            question: 'Which architecture is designed for images?',
            type: 'single',
            options: [
              { text: 'Convolutional network (CNN)', correct: true },
              { text: 'Recurrent network (RNN)' },
            ],
          },
          {
            question: 'What powers modern language models?',
            type: 'single',
            options: [
              { text: 'Transformers using self-attention', correct: true },
              { text: 'Spreadsheets' },
            ],
          },
        ],
      },
    },
    finalAssessment: {
      required: false,
      passMark: 60,
      questions: [
        {
          question: 'A neuron’s output is…',
          type: 'single',
          options: [
            { text: 'activation(Σ inputs × weights + bias)', correct: true },
            { text: 'the average of its inputs' },
          ],
        },
        {
          question: 'Why are activation functions essential?',
          type: 'single',
          options: [
            { text: 'They add the non-linearity that makes depth useful', correct: true },
            { text: 'They store the training data' },
          ],
        },
        {
          question: 'Which two work together to train a network? (select all)',
          type: 'multiple',
          options: [
            { text: 'Backpropagation', correct: true },
            { text: 'Gradient descent', correct: true },
            { text: 'Tokenisation' },
          ],
        },
        {
          question: 'Match data to architecture:',
          type: 'single',
          options: [
            { text: 'Images → CNNs, sequences → RNNs/transformers', correct: true },
            { text: 'Images → RNNs, sequences → CNNs' },
          ],
        },
      ],
    },
  },
}

/**
 * Write the authored content (rich lesson bodies, per-module quizzes, and the
 * final assessment) onto each matching course. Idempotent — safe to re-run.
 * Used by the standalone seed script and by data migrations so the content
 * reaches production deterministically on deploy. Returns lessons updated.
 * Pass `req` inside a migration to run within its transaction.
 */
export async function applyLessonContent(payload: Payload, req?: PayloadRequest): Promise<number> {
  let updated = 0

  for (const [slug, data] of Object.entries(CONTENT)) {
    const res = await payload.find({
      collection: 'courses',
      where: { slug: { equals: slug } },
      limit: 1,
      depth: 0,
      overrideAccess: true,
      req,
    })
    const course = res.docs[0]
    if (!course) continue

    const curriculum = (course.curriculum || []).map((mod) => {
      const quizInput = data.quizzes?.[mod.moduleTitle]
      return {
        ...mod,
        lessons: (mod.lessons || []).map((l) => {
          const c = data.lessons[l.lesson]
          if (!c) return l
          updated += 1
          return { ...l, content: buildLessonState(c), ...(c.tryIt ? { tryIt: c.tryIt } : {}) }
        }),
        ...(quizInput ? { quiz: buildQuiz(quizInput, true) } : {}),
      }
    }) as Course['curriculum']

    await payload.update({
      collection: 'courses',
      id: course.id,
      overrideAccess: true,
      context: { disableRevalidate: true },
      data: {
        curriculum,
        ...(data.finalAssessment
          ? { finalAssessment: buildQuiz(data.finalAssessment, false) }
          : {}),
      },
    })
  }

  return updated
}
