import type { Payload, PayloadRequest } from 'payload'

import type { Course } from '@/payload-types'
import {
  buildLessonState,
  buildOverview,
  buildQuiz,
  type LessonContent,
  type QuizInput,
} from './lessonContent'

export const MCP_SLUG = 'model-context-protocol'

type ModuleDef = {
  title: string
  lessons: { title: string; content: LessonContent }[]
  quiz?: QuizInput
}

const MODULES: ModuleDef[] = [
  {
    title: 'Module 1 — What is MCP?',
    lessons: [
      {
        title: 'Why MCP exists',
        content: {
          intro:
            'The Model Context Protocol (MCP) is an open standard for connecting AI models to the tools and data they need. Before MCP, every app wired each model to each data source with its own bespoke integration — an “M×N” problem where M apps times N tools means a tangle of custom connectors.',
          body: 'MCP turns that M×N problem into M+N: a tool exposes one MCP server, an app speaks MCP once, and they interoperate. It is often described as “a USB-C port for AI” — a single, standard way to plug capabilities into any compatible AI application.',
          points: [
            'MCP is an open protocol, not a product or a model.',
            'It standardises how apps give models context and actions.',
            'Replaces many one-off integrations with one shared interface.',
            'Any compliant client can talk to any compliant server.',
          ],
          example:
            'Instead of building separate GitHub integrations for Claude Desktop, an IDE, and your own app, GitHub can ship one MCP server that all three use.',
          takeaway:
            'MCP is a universal connector that lets AI apps and tools interoperate without custom glue code.',
        },
      },
      {
        title: 'The host, client and server model',
        content: {
          intro:
            'MCP defines three roles. The host is the AI application the user interacts with (for example a desktop assistant or an IDE). Inside the host runs one or more clients, and each client maintains a one-to-one connection to a server, which exposes capabilities.',
          body: 'The host orchestrates everything and mediates access — it decides which servers to connect to and asks the user for consent. Each client manages a single server connection, and each server is a separate program exposing a focused set of tools, data, or prompts.',
          points: [
            'Host: the AI app the user runs (orchestrates and mediates).',
            'Client: lives in the host; one per server connection.',
            'Server: exposes capabilities (tools, resources, prompts).',
            'A host can run many clients, hence many servers at once.',
          ],
          example:
            'Claude Desktop (host) runs a client connected to a “filesystem” server and another client connected to a “Postgres” server simultaneously.',
          takeaway:
            'host ⟶ client ⟶ server: the host runs a client per server, and servers provide the capabilities.',
        },
      },
      {
        title: 'MCP vs plain function calling',
        content: {
          intro:
            'LLMs already support “function calling”, where you describe functions and the model picks one to call. MCP builds on that idea but standardises the packaging, discovery, and transport so capabilities are reusable across apps.',
          body: 'With raw function calling, each app re-implements and re-describes every tool. MCP servers advertise their tools (and resources and prompts) over a common protocol, so a host can discover them at runtime and any host can reuse the same server.',
          points: [
            'Function calling is per-app; MCP capabilities are portable.',
            'MCP adds runtime discovery of what a server offers.',
            'MCP covers data (resources) and prompts, not just functions.',
            'Under the hood MCP still drives the model’s tool calls.',
          ],
          example:
            'A weather function written once as an MCP tool works in any MCP host; a raw function-calling version must be re-added to every app.',
          takeaway:
            'MCP is function calling made reusable and discoverable across applications.',
        },
      },
    ],
    quiz: {
      required: true,
      questions: [
        {
          question: 'What is MCP?',
          type: 'single',
          options: [
            { text: 'An open protocol for connecting AI apps to tools and data', correct: true },
            { text: 'A specific large language model' },
            { text: 'A cloud hosting product' },
          ],
        },
        {
          question: 'Which describe the MCP roles? (select all)',
          type: 'multiple',
          options: [
            { text: 'The host is the AI app the user interacts with', correct: true },
            { text: 'A client maintains one connection to one server', correct: true },
            { text: 'The server is the language model itself' },
          ],
        },
      ],
    },
  },
  {
    title: 'Module 2 — Core building blocks',
    lessons: [
      {
        title: 'Tools',
        content: {
          intro:
            'Tools are functions a server exposes that the model can choose to call to take an action or fetch live data — sending an email, querying a database, creating a file. They are “model-controlled”: the LLM decides when to invoke them, usually with the user’s approval.',
          body: 'Each tool has a name, a description, and a typed input schema (JSON Schema) so the model knows how to call it correctly. Because tools can have side effects, hosts typically require user consent before a tool runs.',
          points: [
            'Tools let the model do things, not just read.',
            'Each tool declares a name, description and input schema.',
            'Model-controlled: the LLM decides when to call them.',
            'Side-effecting, so they usually need user approval.',
          ],
          example:
            'A “create_issue” tool takes { title, body, repo } and opens a GitHub issue when the model calls it.',
          takeaway: 'tools are typed, model-callable actions — the “verbs” a server offers.',
        },
      },
      {
        title: 'Resources',
        content: {
          intro:
            'Resources are read-only pieces of data or content a server exposes for the host to load into context — files, database rows, documents, API responses. Unlike tools, resources are “application-controlled”: the host or user decides what to pull in.',
          body: 'Each resource is identified by a URI and can be listed and read. Resources give the model relevant background without side effects, keeping data access separate from actions.',
          points: [
            'Resources are read-only context (the “nouns”).',
            'Identified by a URI; can be listed and read.',
            'Application-controlled: host/user choose what to include.',
            'No side effects — just data for context.',
          ],
          example:
            'A “file:///docs/spec.md” resource lets the host load a spec document into the conversation’s context.',
          takeaway: 'resources are read-only data the host can pull into context, addressed by URI.',
        },
      },
      {
        title: 'Prompts',
        content: {
          intro:
            'Prompts are reusable, parameterised templates a server provides — pre-written instructions or workflows the user can invoke. They are “user-controlled”: typically surfaced as slash commands or menu items the person picks.',
          body: 'A prompt can take arguments and expand into a structured message (or sequence of messages), standardising common tasks so users don’t re-type complex instructions.',
          points: [
            'Prompts are reusable templated instructions/workflows.',
            'They can accept arguments to fill in.',
            'User-controlled: chosen explicitly by the person.',
            'Often surfaced as slash commands in the host UI.',
          ],
          example:
            'A “/summarise-pr” prompt takes a PR number and expands into a detailed review instruction.',
          takeaway:
            'prompts are user-invoked templates that package common instructions for reuse.',
        },
      },
    ],
    quiz: {
      required: true,
      questions: [
        {
          question: 'Which building block lets the model take actions with side effects?',
          type: 'single',
          options: [
            { text: 'Tools', correct: true },
            { text: 'Resources' },
            { text: 'Prompts' },
          ],
        },
        {
          question: 'Match control: which are correct? (select all)',
          type: 'multiple',
          options: [
            { text: 'Tools are model-controlled', correct: true },
            { text: 'Resources are application-controlled', correct: true },
            { text: 'Prompts are user-controlled', correct: true },
          ],
        },
      ],
    },
  },
  {
    title: 'Module 3 — How MCP works under the hood',
    lessons: [
      {
        title: 'Transports: stdio and HTTP',
        content: {
          intro:
            'MCP messages are carried over a transport. The two standard transports are stdio — where the host launches the server as a local subprocess and talks over standard input/output — and a streamable HTTP transport for remote servers.',
          body: 'stdio is ideal for local tools (fast, no network, runs with the user’s permissions). HTTP suits hosted/remote servers shared across users. Either way the messages themselves are JSON-RPC 2.0.',
          points: [
            'stdio: local subprocess over stdin/stdout.',
            'HTTP: remote servers over a streamable HTTP transport.',
            'Messages are JSON-RPC 2.0 regardless of transport.',
            'Choose stdio for local tools, HTTP for shared/remote ones.',
          ],
          example:
            'A local “filesystem” server runs via stdio; a company-hosted “CRM” server is reached over HTTP.',
          takeaway:
            'MCP runs over stdio (local) or HTTP (remote), exchanging JSON-RPC 2.0 messages.',
        },
      },
      {
        title: 'The connection lifecycle',
        content: {
          intro:
            'An MCP session begins with an initialize handshake. The client and server exchange the protocol version and their capabilities — which features (tools, resources, prompts, and options like notifications) each side supports — before any real work happens.',
          body: 'After initialising, the client can discover what the server offers (e.g. list tools/resources/prompts) and then make calls. Capability negotiation means each side only uses features the other actually supports.',
          points: [
            'Sessions start with an initialize handshake.',
            'Both sides exchange protocol version and capabilities.',
            'The client then discovers and calls what the server offers.',
            'Capability negotiation avoids unsupported features.',
          ],
          example:
            'On connect, the server reports it supports “tools” and “resources”; the client then calls tools/list to see what’s available.',
          takeaway:
            'every session begins by negotiating capabilities, then the client discovers and uses them.',
        },
      },
      {
        title: 'Security and user consent',
        content: {
          intro:
            'Because servers can read data and take actions, MCP puts the user and host in control. The host mediates access, asks for explicit consent before exposing data or running tools, and should only connect to servers the user trusts.',
          body: 'Treat third-party servers like any dependency: review them, run them with least privilege, and keep a human in the loop for sensitive actions. The protocol enables capabilities; the host and user enforce the guardrails.',
          points: [
            'The host mediates and requires user consent.',
            'Only connect to servers you trust.',
            'Run servers with least privilege.',
            'Keep a human in the loop for sensitive tool calls.',
          ],
          example:
            'Before a “delete_file” tool runs, the host shows the user exactly what will happen and waits for approval.',
          takeaway:
            'MCP relies on host mediation and user consent — connect only to trusted servers and approve risky actions.',
        },
      },
    ],
    quiz: {
      required: true,
      questions: [
        {
          question: 'Which transport launches the server as a local subprocess?',
          type: 'single',
          options: [
            { text: 'stdio', correct: true },
            { text: 'HTTP' },
          ],
        },
        {
          question: 'What happens during the initialize handshake? (select all)',
          type: 'multiple',
          options: [
            { text: 'Protocol version is exchanged', correct: true },
            { text: 'Capabilities are negotiated', correct: true },
            { text: 'The model is downloaded to the server' },
          ],
        },
      ],
    },
  },
  {
    title: 'Module 4 — Building with MCP',
    lessons: [
      {
        title: 'Building an MCP server',
        content: {
          intro:
            'You build a server with an MCP SDK (available for TypeScript, Python and more). You create a server instance, register its tools, resources and prompts with their schemas and handlers, then connect it to a transport.',
          body: 'Each tool handler receives validated input and returns a result; resources return content for a URI; prompts return messages. Start small — one well-described tool — and grow from there.',
          points: [
            'Use an official SDK (TypeScript, Python, etc.).',
            'Register tools/resources/prompts with schemas + handlers.',
            'Connect the server to a transport (stdio or HTTP).',
            'Clear names and descriptions help the model use them well.',
          ],
          example:
            'In the TypeScript SDK you call server.tool("add", schema, handler) and then connect a StdioServerTransport.',
          takeaway:
            'a server = register your capabilities with an SDK, then connect a transport.',
        },
      },
      {
        title: 'Connecting a host and client',
        content: {
          intro:
            'To use a server, a host adds it to its configuration — typically the command to launch it (for stdio) or its URL (for HTTP). The host then spins up a client, performs the handshake, and makes the server’s capabilities available to the model.',
          body: 'Many hosts (desktop assistants, IDEs) read a config file listing servers. Once connected, the model can call the server’s tools and the host can load its resources, all mediated by the host.',
          points: [
            'Add the server to the host’s config (command or URL).',
            'The host launches a client and runs the handshake.',
            'Capabilities then appear to the model in that host.',
            'The host keeps mediating access and consent.',
          ],
          example:
            'You add { "command": "npx", "args": ["-y", "@scope/filesystem-server"] } to the host config to enable a local file server.',
          takeaway:
            'point the host at a server (command or URL); it connects a client and exposes the capabilities.',
        },
      },
      {
        title: 'Best practices and next steps',
        content: {
          intro:
            'Good MCP servers are focused, well-documented, and safe. Give tools precise names and descriptions, validate inputs, return helpful errors, and scope each server to a clear domain rather than doing everything.',
          body: 'Design for least privilege, make destructive actions explicit, and test your server with a host before sharing it. From here, explore the official SDKs and the growing ecosystem of community servers to learn patterns.',
          points: [
            'Keep servers focused on one domain.',
            'Write clear tool names, descriptions and input schemas.',
            'Validate inputs and return useful errors.',
            'Favour least privilege; make risky actions explicit.',
          ],
          example:
            'Ship a “docs-search” server that only reads your documentation, rather than one tool that can run arbitrary shell commands.',
          takeaway:
            'build small, clear, safe servers — then lean on the SDKs and community examples to go further.',
        },
      },
    ],
    quiz: {
      required: false,
      questions: [
        {
          question: 'How do you typically build an MCP server?',
          type: 'single',
          options: [
            { text: 'With an official SDK, registering tools/resources/prompts', correct: true },
            { text: 'By retraining a language model' },
          ],
        },
        {
          question: 'Good server practices include… (select all)',
          type: 'multiple',
          options: [
            { text: 'Clear tool names and descriptions', correct: true },
            { text: 'Validating inputs and least privilege', correct: true },
            { text: 'One giant tool that runs arbitrary commands' },
          ],
        },
      ],
    },
  },
]

const FINAL_ASSESSMENT: QuizInput = {
  required: false,
  passMark: 60,
  questions: [
    {
      question: 'The core purpose of MCP is to…',
      type: 'single',
      options: [
        { text: 'Standardise how AI apps connect to tools and data', correct: true },
        { text: 'Train faster language models' },
        { text: 'Replace HTTP on the web' },
      ],
    },
    {
      question: 'Match each building block to its control model: (select all correct)',
      type: 'multiple',
      options: [
        { text: 'Tools — model-controlled', correct: true },
        { text: 'Resources — application-controlled', correct: true },
        { text: 'Prompts — user-controlled', correct: true },
        { text: 'Tools — user-controlled' },
      ],
    },
    {
      question: 'Which are valid MCP transports? (select all)',
      type: 'multiple',
      options: [
        { text: 'stdio (local subprocess)', correct: true },
        { text: 'Streamable HTTP (remote)', correct: true },
        { text: 'FTP' },
      ],
    },
    {
      question: 'An MCP session begins by…',
      type: 'single',
      options: [
        { text: 'Initialising and negotiating capabilities', correct: true },
        { text: 'Immediately deleting files' },
      ],
    },
    {
      question: 'Who enforces consent and access in MCP?',
      type: 'single',
      options: [
        { text: 'The host, with the user’s approval', correct: true },
        { text: 'The server, with no oversight' },
      ],
    },
  ],
}

const OUTCOMES = [
  'Explain what MCP is and the problem it solves',
  'Describe the host, client and server architecture',
  'Use tools, resources and prompts correctly',
  'Understand transports, the connection lifecycle and security',
  'Build and connect a simple MCP server',
]

/**
 * Create the free MCP course (full curriculum + quizzes + final assessment).
 * Idempotent: skips if a course with the MCP slug already exists. Returns true
 * if it created the course.
 */
export async function createMcpCourse(payload: Payload, req?: PayloadRequest): Promise<boolean> {
  const existing = await payload.find({
    collection: 'courses',
    where: { slug: { equals: MCP_SLUG } },
    limit: 1,
    overrideAccess: true,
    req,
  })
  if (existing.docs.length > 0) return false

  // Step 1 — create the shell with bare curriculum (module titles + lesson
  // titles only). Creating deeply-nested lesson content + module quizzes in a
  // single create is dropped by Payload under the drafts-enabled collection, so
  // we add those in step 2 via update (the same path used to seed other courses).
  const bareCurriculum = MODULES.map((m) => ({
    moduleTitle: m.title,
    lessons: m.lessons.map((l) => ({ lesson: l.title, preview: false })),
  })) as Course['curriculum']

  const created = await payload.create({
    collection: 'courses',
    overrideAccess: true,
    context: { disableRevalidate: true },
    req,
    data: {
      title: 'Model Context Protocol (MCP)',
      slug: MCP_SLUG,
      _status: 'published',
      price: 0,
      currency: 'INR',
      level: 'intermediate',
      mode: 'self-paced',
      icon: 'code',
      featured: false,
      duration: '~4 hours',
      summary:
        'A free, self-paced introduction to the Model Context Protocol (MCP) — the open standard that connects AI applications to tools and data. Learn the architecture, the core building blocks, how it works under the hood, and how to build your own server.',
      content: buildOverview([
        'The Model Context Protocol (MCP) is an open standard for connecting AI applications to the tools and data they need — think of it as a universal connector, “a USB-C port for AI”.',
        'This course explains what MCP is and why it exists, the host–client–server architecture, the three building blocks (tools, resources and prompts), how messages flow over stdio and HTTP, and how to build and connect your own MCP server.',
        'It is self-paced and beginner-friendly for anyone comfortable with basic software concepts. Each module ends with a short quiz, and there is a final assessment at the end.',
      ]) as Course['content'],
      outcomes: OUTCOMES.map((o) => ({ outcome: o })),
      curriculum: bareCurriculum,
    },
  })

  // Step 2 — fill in lesson rich-text content + per-module quizzes + the final
  // assessment, mapping by position onto the rows Payload just created. Re-fetch
  // first: payload.create may not return the populated curriculum, and mapping an
  // empty array would wipe it on update.
  const fresh = await payload.findByID({
    collection: 'courses',
    id: created.id,
    depth: 0,
    overrideAccess: true,
    req,
  })
  const curriculum = (fresh.curriculum || []).map((mod, mi) => ({
    ...mod,
    lessons: (mod.lessons || []).map((l, li) => ({
      ...l,
      content: buildLessonState(MODULES[mi].lessons[li].content),
    })),
    ...(MODULES[mi]?.quiz ? { quiz: buildQuiz(MODULES[mi].quiz as QuizInput, true) } : {}),
  })) as Course['curriculum']

  await payload.update({
    collection: 'courses',
    id: created.id,
    overrideAccess: true,
    context: { disableRevalidate: true },
    req,
    data: {
      curriculum,
      finalAssessment: buildQuiz(FINAL_ASSESSMENT, false),
    },
  })

  return true
}
