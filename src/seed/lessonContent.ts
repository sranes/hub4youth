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

export type LessonContent = { intro: string; points: string[]; takeaway: string }

export function buildLessonState(c: LessonContent) {
  return {
    root: {
      children: [
        para(c.intro),
        heading('Key points'),
        list(c.points),
        para(`In practice: ${c.takeaway}`),
      ],
      direction: 'ltr',
      format: '',
      indent: 0,
      type: 'root',
      version: 1,
    },
  }
}

// ---------------------------------------------------------------------------
// Authored content, keyed by course slug then exact lesson title.
// ---------------------------------------------------------------------------
export const CONTENT: Record<string, Record<string, LessonContent>> = {
  'ai-fundamentals': {
    'Defining AI': {
      intro:
        'Artificial intelligence is the field of building systems that perform tasks we associate with human intelligence — recognising images, understanding language, making decisions, and improving from experience. Rather than following only hand-written rules, modern AI learns patterns from data.',
      points: [
        'AI is a broad goal, not a single technique.',
        'Most of today’s AI is built on machine learning — systems that improve from examples.',
        'An AI system is only as good as the data and objective it is given.',
        'AI augments human work; it rarely replaces judgement entirely.',
      ],
      takeaway:
        'think of AI as software that learns behaviour from data instead of being programmed for every case.',
    },
    'Narrow vs general AI': {
      intro:
        'Almost all AI in use today is “narrow” — it does one task well, like translating text or detecting spam. “General” AI, a system that can learn any intellectual task a human can, does not yet exist.',
      points: [
        'Narrow AI: expert at a single, well-defined task.',
        'General AI (AGI): hypothetical human-level breadth — still research.',
        'Superintelligence: speculative, beyond human ability.',
        'Impressive demos are still narrow AI applied cleverly.',
      ],
      takeaway: 'when someone says “AI”, they almost always mean a narrow system tuned for one job.',
    },
    'AI, ML and deep learning': {
      intro:
        'These three terms are nested. AI is the goal; machine learning (ML) is the main way we reach it today; deep learning is a powerful subset of ML based on neural networks.',
      points: [
        'AI contains machine learning, which contains deep learning.',
        'ML learns patterns from data instead of explicit rules.',
        'Deep learning uses many-layered neural networks for complex data like images and text.',
        'Deep learning shines with lots of data and compute.',
      ],
      takeaway:
        'deep learning is one tool inside machine learning, which is one approach to building AI.',
    },
    'A brief history': {
      intro:
        'AI has moved through waves of optimism and “winters”. From symbolic rule-based systems in the 1950s–80s, to statistical machine learning, and since 2012 the deep-learning era driven by data, GPUs and better algorithms.',
      points: [
        '1950s: the term “AI” is coined; early symbolic systems.',
        '1980s–90s: expert systems, then an “AI winter”.',
        '2012: deep learning breaks image-recognition records.',
        '2017–today: transformers and large language models.',
      ],
      takeaway: 'today’s breakthroughs rest on decades of research plus modern data and hardware.',
    },
    'Learning from data': {
      intro:
        'Machine learning finds patterns in examples and uses them to make predictions on new, unseen data. Instead of coding rules, we show the model many examples and let it infer the rule.',
      points: [
        'Training: the model adjusts itself to fit examples.',
        'Inference: the trained model predicts on new data.',
        'Generalisation — performing well on unseen data — is the real goal.',
        'More relevant data usually beats a cleverer algorithm.',
      ],
      takeaway: 'learning means adjusting a model from examples so it generalises to new cases.',
    },
    'Supervised, unsupervised and reinforcement learning': {
      intro:
        'The three broad styles of ML differ in what signal they learn from: labelled answers, structure alone, or feedback from actions.',
      points: [
        'Supervised: learns from labelled examples (input → known output).',
        'Unsupervised: finds structure or clusters with no labels.',
        'Reinforcement: learns by trial and error via rewards.',
        'Most business ML today is supervised.',
      ],
      takeaway: 'pick the paradigm by the data you have: labels, structure, or a reward signal.',
    },
    'Features, labels and a worked example': {
      intro:
        'A feature is an input variable; a label is the answer we want to predict. To predict a house price from its size, location and age, those are the features; the price is the label.',
      points: [
        'Features are the inputs the model sees.',
        'The label is the target it learns to predict.',
        'Good features often matter more than the algorithm.',
        'Each training row pairs features with a label.',
      ],
      takeaway: 'framing a problem as features → label is the first step of any ML project.',
    },
    'Why data quality matters': {
      intro:
        'Models learn whatever is in the data — including errors and bias. “Garbage in, garbage out” is the rule: poor data produces poor predictions no matter the algorithm.',
      points: [
        'Errors, duplicates and missing values mislead the model.',
        'Biased data produces biased predictions.',
        'Representative data matters more than sheer volume.',
        'Data work is most of a real ML project.',
      ],
      takeaway: 'invest in clean, representative data before tuning models.',
    },
    'Cleaning and preparing data': {
      intro:
        'Raw data is rarely ready to use. Preparation handles missing values, inconsistent formats, outliers and scaling so the model can learn effectively.',
      points: [
        'Handle missing values (drop, fill, or flag).',
        'Standardise formats and units.',
        'Scale or normalise numeric features.',
        'Encode categories into numbers.',
      ],
      takeaway: 'most modelling time goes into preparing data, not training.',
    },
    'Splitting data and avoiding leakage': {
      intro:
        'To estimate real-world performance, we split data into training and test sets. Data leakage — letting test information sneak into training — gives falsely high scores.',
      points: [
        'The train set fits the model; the test set measures it.',
        'Never let test data influence training.',
        'Leakage causes great scores that collapse in production.',
        'Use a validation set for tuning choices.',
      ],
      takeaway: 'keep test data untouched until the end to get an honest estimate.',
    },
    'Regression and classification': {
      intro:
        'Two core supervised tasks: regression predicts a number (like price), and classification predicts a category (like spam or not spam).',
      points: [
        'Regression produces a continuous output.',
        'Classification produces discrete categories.',
        'The same features can serve either, depending on the label.',
        'Each task has its own metrics.',
      ],
      takeaway: 'decide first whether you are predicting a number or a category.',
    },
    'A tour of common algorithms': {
      intro:
        'A handful of algorithms cover most needs: linear and logistic regression, decision trees, random forests, gradient boosting, k-nearest neighbours, and neural networks.',
      points: [
        'Linear/logistic regression: simple, interpretable baselines.',
        'Trees and forests: handle non-linear data well.',
        'Gradient boosting: strong on tabular data.',
        'Neural networks: best for images, audio and text.',
      ],
      takeaway: 'start simple; reach for complex models only when needed.',
    },
    'Overfitting and how to measure success': {
      intro:
        'Overfitting means memorising training data instead of learning the pattern — great train scores but poor test scores. We measure success on held-out data with task-appropriate metrics.',
      points: [
        'Overfit: low train error, high test error.',
        'Underfit: high error everywhere (too simple).',
        'Classification: accuracy, precision, recall, F1.',
        'Regression: MAE, RMSE, R².',
      ],
      takeaway: 'judge a model by held-out performance, not training performance.',
    },
    'From neuron to network': {
      intro:
        'A neural network is built from simple units called neurons. Each neuron takes inputs, weights them, sums them, and passes the result through an activation function. Stack many and you get a network that learns complex patterns.',
      points: [
        'A neuron is a weighted sum plus an activation.',
        'Layers compose simple parts into complex functions.',
        'Weights are what the network learns.',
        'Depth lets networks model rich relationships.',
      ],
      takeaway: 'networks gain power by combining many simple neurons across layers.',
    },
    'How networks learn': {
      intro:
        'Networks learn by comparing predictions to the truth (a loss), then nudging weights to reduce that loss using gradient descent and backpropagation, repeated over many examples.',
      points: [
        'The loss measures how wrong a prediction is.',
        'Backpropagation computes how each weight affects the loss.',
        'Gradient descent updates weights to lower the loss.',
        'Repeat over many epochs to improve.',
      ],
      takeaway: 'training repeatedly measures error and adjusts weights to reduce it.',
    },
    'CNNs and RNNs at a glance': {
      intro:
        'Different data needs different architectures. Convolutional networks (CNNs) excel at images; recurrent networks (RNNs) handle sequences like text or time series.',
      points: [
        'CNNs detect local patterns (edges → shapes → objects).',
        'RNNs carry information across a sequence.',
        'Transformers have largely replaced RNNs for language.',
        'Architecture choice follows the data type.',
      ],
      takeaway: 'match the architecture to your data: grids → CNNs, sequences → RNNs or transformers.',
    },
    'Turning language into numbers': {
      intro:
        'Computers work with numbers, so text must be converted before a model can use it. The first step is tokenisation — splitting text into words or sub-word pieces — then mapping tokens to numeric ids.',
      points: [
        'Tokenisation splits text into units (tokens).',
        'Each token maps to a numeric id.',
        'Sub-word tokens handle rare or unknown words.',
        'Token counts drive model cost and limits.',
      ],
      takeaway: 'all NLP begins by turning text into numbers the model can process.',
    },
    Embeddings: {
      intro:
        'An embedding represents a token or sentence as a vector of numbers that captures meaning, so that similar meanings sit close together in space.',
      points: [
        'Embeddings encode meaning as vectors.',
        'Similar concepts have nearby vectors.',
        'They power search, recommendations and clustering.',
        'They are learned from huge text corpora.',
      ],
      takeaway: 'embeddings let machines compare meaning, not just exact words.',
    },
    'Transformers and attention': {
      intro:
        'The transformer architecture, introduced in 2017, uses “attention” to let each word consider every other word in context. It underpins modern language models.',
      points: [
        'Attention weighs the relevance of other tokens.',
        'Transformers process sequences in parallel (fast).',
        'They capture long-range context well.',
        'They are the foundation of GPT-style LLMs.',
      ],
      takeaway: 'attention is the mechanism that made today’s large language models possible.',
    },
    'What generative AI is': {
      intro:
        'Generative AI creates new content — text, images, audio, code — rather than only classifying or predicting. Large language models generate text one token at a time.',
      points: [
        'Generative means it produces new content.',
        'LLMs predict the next token repeatedly.',
        'It also covers image, audio and video generation.',
        'Outputs are probabilistic, not looked up.',
      ],
      takeaway: 'generative models produce novel outputs by predicting likely continuations.',
    },
    'How LLMs are trained': {
      intro:
        'Large language models are trained in stages: pre-training on vast text to predict the next token, then fine-tuning and alignment (for example with human feedback) to be helpful and safe.',
      points: [
        'Pre-training: predict the next token on huge corpora.',
        'Fine-tuning: specialise on curated data.',
        'Alignment (RLHF): match human preferences.',
        'The result is a general, instructable model.',
      ],
      takeaway: 'LLMs learn language broadly first, then are shaped to be helpful and safe.',
    },
    'Prompting, capabilities and limits': {
      intro:
        'You steer an LLM with prompts. They are powerful at drafting, summarising and reasoning, but can hallucinate, lack up-to-date facts, and reflect training bias.',
      points: [
        'Strengths: writing, summarising, coding, ideation.',
        'Limits: can hallucinate confidently.',
        'No inherent access to live or private data.',
        'Always verify important outputs.',
      ],
      takeaway: 'use LLMs as capable assistants whose output you check, not as oracles.',
    },
    'Bias and fairness': {
      intro:
        'AI can reproduce and amplify bias present in its training data, leading to unfair outcomes for some groups. Fairness must be designed for, measured and monitored.',
      points: [
        'Bias enters through data and design choices.',
        'Harms fall unevenly across groups.',
        'Measure fairness with appropriate metrics.',
        'Mitigate via better data, constraints and audits.',
      ],
      takeaway: 'fairness is an ongoing engineering and governance responsibility, not an afterthought.',
    },
    'Privacy, safety and transparency': {
      intro:
        'Responsible AI protects personal data, avoids harmful outputs, and is transparent about how decisions are made and where AI is used.',
      points: [
        'Minimise and protect personal data.',
        'Guard against unsafe or harmful outputs.',
        'Be transparent that AI is involved.',
        'Follow relevant laws and regulations.',
      ],
      takeaway: 'trust comes from protecting users and being open about AI’s role.',
    },
    'Keeping humans in the loop': {
      intro:
        'For consequential decisions, a human should review and be able to override the AI. Human oversight catches errors and keeps accountability clear.',
      points: [
        'Use AI to assist, not decide alone, on high-stakes calls.',
        'Provide review and override paths.',
        'Keep accountability with people.',
        'Monitor systems after deployment.',
      ],
      takeaway: 'design AI so a responsible human stays in control of important decisions.',
    },
    'Tools to start with': {
      intro:
        'You can learn AI hands-on with free, widely used tools. Python is the dominant language, with libraries for data and modelling, and notebooks for experimentation.',
      points: [
        'Python with Jupyter or Google Colab notebooks.',
        'pandas and NumPy for data.',
        'scikit-learn for classic ML.',
        'PyTorch or TensorFlow for deep learning.',
      ],
      takeaway: 'start with Python and scikit-learn in a free notebook environment.',
    },
    'A practice path': {
      intro:
        'Learning sticks when you build. Work through small projects end to end: get data, clean it, train a model, evaluate, and iterate.',
      points: [
        'Start with a tidy public dataset.',
        'Build a simple baseline first.',
        'Evaluate honestly on held-out data.',
        'Iterate and document what you try.',
      ],
      takeaway: 'build small projects end-to-end — that is how concepts become skills.',
    },
    'Glossary of key terms': {
      intro:
        'A quick reference for the terms used across this course. Keep it handy as you continue learning.',
      points: [
        'Model: a function learned from data.',
        'Feature / label: input variable / target.',
        'Training / inference: learning / predicting.',
        'Overfitting: memorising instead of generalising.',
        'Embedding: meaning represented as a vector.',
      ],
      takeaway: 'revisit these definitions whenever a term feels fuzzy.',
    },
  },

  'prompt-engineering': {
    'How models read a prompt': {
      intro:
        'A language model reads your prompt as a sequence of tokens and predicts a continuation. It has no memory beyond what you provide, so the prompt is its entire world for that request.',
      points: [
        'The model only knows what is in the prompt (and its training).',
        'It predicts the most likely continuation, token by token.',
        'Clearer input leads to more predictable output.',
        'Context length is limited, so stay relevant.',
      ],
      takeaway: 'treat the prompt as the model’s complete instructions and context for that answer.',
    },
    'Why wording matters': {
      intro:
        'Small changes in wording can change the output a lot, because the model responds to patterns and cues in your text. Precise, specific language steers it better than vague requests.',
      points: [
        'Specific verbs and nouns reduce ambiguity.',
        'State the audience, tone and length you want.',
        'Ambiguity invites inconsistent answers.',
        'Examples anchor the style you expect.',
      ],
      takeaway: 'say exactly what you want; specificity is the cheapest quality boost.',
    },
    'Role, task and context': {
      intro:
        'Strong prompts usually set a role (“You are a…”), a clear task, and the context needed to do it. Together these focus the model on the right behaviour.',
      points: [
        'Role: the perspective or expertise to adopt.',
        'Task: the specific action to perform.',
        'Context: the facts, audience and goals it needs.',
        'Omitting context forces the model to guess.',
      ],
      takeaway: 'role + task + context is a reliable backbone for any prompt.',
    },
    'Format, constraints and examples': {
      intro:
        'Tell the model how to answer: the format (list, table, JSON), constraints (length, tone, what to avoid), and an example of the output you want.',
      points: [
        'Specify the output format explicitly.',
        'Add constraints such as word count or tone.',
        'Give a sample of the desired result.',
        'Constraints reduce rambling and surprises.',
      ],
      takeaway: 'define the shape of a good answer, not just the question.',
    },
    'Zero-shot and few-shot': {
      intro:
        'Zero-shot prompting asks directly with no examples; few-shot includes a few input→output examples to demonstrate the pattern you want.',
      points: [
        'Zero-shot: just ask — fast and simple.',
        'Few-shot: show one to five examples to set the pattern.',
        'Few-shot improves consistency on tricky formats.',
        'Keep examples representative and correct.',
      ],
      takeaway: 'add examples when zero-shot output is inconsistent or off-format.',
    },
    'Chain-of-thought': {
      intro:
        'Asking the model to reason step by step before answering often improves accuracy on multi-step problems, because it works through intermediate steps rather than jumping to a guess.',
      points: [
        'Prompt it to “think step by step” for reasoning tasks.',
        'Helps with maths, logic and multi-step decisions.',
        'Exposes the reasoning so you can check it.',
        'Not needed for simple lookups.',
      ],
      takeaway: 'for complex problems, ask for reasoning steps, then the final answer.',
    },
    'Role and persona prompting': {
      intro:
        'Assigning a persona (“You are an experienced editor”) shapes tone, depth and vocabulary. It is a quick way to get domain-appropriate responses.',
      points: [
        'A persona sets expertise and tone.',
        'Useful for a consistent voice across outputs.',
        'Combine with task and format for best results.',
        'Be specific: “senior tax accountant”, not just “expert”.',
      ],
      takeaway: 'a well-chosen persona aligns the model’s style with your need.',
    },
    'Asking for a format': {
      intro:
        'When you need machine-readable or consistent output, explicitly request a format such as JSON, a table, or a numbered list — and describe the fields.',
      points: [
        'Name the format and the exact fields.',
        'Provide a tiny schema or example.',
        'Ask it to return only the format, nothing else.',
        'Great for pipelines and automation.',
      ],
      takeaway: 'specify the exact structure when output needs to be parsed or reused.',
    },
    'Delimiters and examples': {
      intro:
        'Delimiters (triple quotes, tags, headings) separate instructions from data so the model does not confuse them. Examples show the mapping you expect.',
      points: [
        'Wrap input data in clear delimiters.',
        'Separate instructions from content.',
        'Pair with a worked example.',
        'Reduces instruction-injection from pasted text.',
      ],
      takeaway: 'use delimiters to keep instructions and data cleanly separated.',
    },
    'Debugging a prompt': {
      intro:
        'When output is wrong, change one thing at a time: clarify the task, add context or an example, tighten constraints, or ask for reasoning. Compare results to learn what helped.',
      points: [
        'Isolate the failure: format, content, or reasoning?',
        'Change one variable at a time.',
        'Add an example of the correct output.',
        'Iterate and keep what works.',
      ],
      takeaway: 'treat prompting as experiments — adjust one factor and observe.',
    },
    'Common mistakes': {
      intro:
        'Most weak prompts are vague, overloaded, or missing context. Asking for too much at once and not specifying a format are frequent culprits.',
      points: [
        'Too vague: no audience, tone or format.',
        'Too much: many tasks crammed together.',
        'Missing context the model cannot infer.',
        'No example when one would clarify.',
      ],
      takeaway: 'be specific, single-focused, and provide the context and format you need.',
    },
    'Verifying and using AI responsibly': {
      intro:
        'Models can sound confident yet be wrong. Verify facts, do not share sensitive data, and disclose AI use where it matters. You stay responsible for the output.',
      points: [
        'Fact-check important claims independently.',
        'Avoid pasting confidential or personal data.',
        'Disclose AI assistance where appropriate.',
        'You own the final result.',
      ],
      takeaway: 'always verify and use AI outputs responsibly — accountability stays with you.',
    },
  },

  'neural-networks-and-deep-learning': {
    'The artificial neuron': {
      intro:
        'The building block of every neural network is the artificial neuron: it multiplies each input by a weight, adds a bias, sums them, and passes the result through an activation function.',
      points: [
        'Output = activation(sum of inputs × weights + bias).',
        'Weights and bias are learned.',
        'Inspired by, but not identical to, biological neurons.',
        'Many neurons combine into powerful models.',
      ],
      takeaway: 'a neuron is a weighted sum plus an activation — simple, but the basis of everything.',
    },
    'Activation functions': {
      intro:
        'Activation functions add non-linearity, letting networks model complex relationships. Without them, stacked layers would collapse into a single linear function.',
      points: [
        'ReLU: fast, the default for hidden layers.',
        'Sigmoid and tanh: squashing functions, older style.',
        'Softmax: turns scores into class probabilities.',
        'Non-linearity is what makes depth useful.',
      ],
      takeaway: 'activations give networks the non-linearity needed to learn complex patterns.',
    },
    'Layers and weights': {
      intro:
        'Neurons are organised into layers: an input layer, one or more hidden layers, and an output layer. The weights connecting them are the parameters the network learns.',
      points: [
        'Data flows input → hidden → output layers.',
        'Weights connect neurons between layers.',
        'More layers or neurons mean more capacity.',
        'Parameters are tuned during training.',
      ],
      takeaway: 'a network’s knowledge lives in the weights between its layers.',
    },
    'The forward pass': {
      intro:
        'The forward pass is how a network makes a prediction: data flows from input to output, each layer transforming it, until a final result is produced.',
      points: [
        'Data moves input → output through layers.',
        'Each layer applies weights and an activation.',
        'It produces the model’s prediction.',
        'No learning happens yet — just computation.',
      ],
      takeaway: 'the forward pass turns inputs into a prediction, layer by layer.',
    },
    'Loss functions': {
      intro:
        'A loss function measures how far the network’s prediction is from the truth. Training aims to minimise this number.',
      points: [
        'Loss measures how wrong the prediction is.',
        'MSE for regression; cross-entropy for classification.',
        'Lower loss means a better fit.',
        'The choice of loss matches the task.',
      ],
      takeaway: 'the loss is the single number training tries to make as small as possible.',
    },
    'Gradient descent': {
      intro:
        'Gradient descent updates weights in the direction that reduces the loss, taking small steps controlled by the learning rate.',
      points: [
        'The gradient points toward steepest increase in loss.',
        'Step the opposite way to reduce loss.',
        'The learning rate sets the step size.',
        'Too big overshoots; too small is slow.',
      ],
      takeaway: 'gradient descent walks the weights downhill to lower the loss.',
    },
    Backpropagation: {
      intro:
        'Backpropagation efficiently computes how each weight contributed to the loss, by applying the chain rule backwards through the network. These gradients drive the weight updates.',
      points: [
        'It propagates error from output back to inputs.',
        'It uses the chain rule of calculus.',
        'It gives a gradient for every weight.',
        'It pairs with gradient descent to learn.',
      ],
      takeaway: 'backprop tells each weight how to change; gradient descent makes the change.',
    },
    'Epochs and batches': {
      intro:
        'Training processes data in batches, and one full pass over the dataset is an epoch. Networks train over many epochs to gradually improve.',
      points: [
        'A batch is a subset processed at once.',
        'An epoch is one full pass over the data.',
        'Mini-batches balance speed and stability.',
        'Multiple epochs let the model refine.',
      ],
      takeaway: 'networks learn over many epochs, updating on batches of data.',
    },
    'Overfitting and regularisation': {
      intro:
        'A network can memorise training data and fail on new data — overfitting. Regularisation techniques keep it general.',
      points: [
        'Overfit: great on train, poor on test.',
        'Dropout randomly disables neurons while training.',
        'Weight decay penalises large weights.',
        'Early stopping halts before overfitting.',
      ],
      takeaway: 'use regularisation so the network generalises instead of memorising.',
    },
    'Convolutional networks (images)': {
      intro:
        'Convolutional neural networks (CNNs) are designed for images. They slide small filters over the image to detect local patterns, building up from edges to shapes to objects.',
      points: [
        'Convolutions detect local features.',
        'Pooling reduces size and adds robustness.',
        'Layers build from edges → parts → objects.',
        'State of the art for vision tasks.',
      ],
      takeaway: 'CNNs exploit image structure by detecting local patterns hierarchically.',
    },
    'Recurrent networks (sequences)': {
      intro:
        'Recurrent neural networks (RNNs) process sequences one step at a time, carrying a hidden state that remembers earlier context — useful for text and time series.',
      points: [
        'They process sequences step by step.',
        'A hidden state carries memory.',
        'LSTM and GRU handle longer dependencies.',
        'Largely superseded by transformers for language.',
      ],
      takeaway: 'RNNs handle order and context in sequences via a running memory.',
    },
    'Transformers and attention': {
      intro:
        'Transformers use self-attention to relate every element of a sequence to every other, in parallel. They scale well and power modern language and vision models.',
      points: [
        'Self-attention weighs all positions at once.',
        'Parallel processing makes training efficient.',
        'It captures long-range dependencies.',
        'It is the backbone of modern LLMs.',
      ],
      takeaway: 'transformers replaced RNNs by using attention to model context at scale.',
    },
  },
}

/**
 * Write the authored content onto each matching lesson (by course slug + lesson
 * title). Used by both the standalone seed script and the data migration, so the
 * content reaches production deterministically on deploy. Returns the number of
 * lessons updated. Pass `req` inside a migration to run within its transaction.
 */
export async function applyLessonContent(payload: Payload, req?: PayloadRequest): Promise<number> {
  let updated = 0

  for (const [slug, lessonMap] of Object.entries(CONTENT)) {
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

    const curriculum = (course.curriculum || []).map((mod) => ({
      ...mod,
      lessons: (mod.lessons || []).map((l) => {
        const c = lessonMap[l.lesson]
        if (!c) return l
        updated += 1
        return { ...l, content: buildLessonState(c) }
      }),
    })) as Course['curriculum']

    await payload.update({
      collection: 'courses',
      id: course.id,
      overrideAccess: true,
      context: { disableRevalidate: true },
      data: { curriculum },
      req,
    })
  }

  return updated
}
