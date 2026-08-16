export const profile = {
  name: "Zoha Pasha",
  tagline: "I chase questions, fall down rabbit holes, and build my way out.",
  role: "CS student · AI, machine learning and computer vision",
  location: "Lahore, Pakistan",
  email: "zohapasha16@gmail.com",
  linkedin: "https://www.linkedin.com/in/zoha-pasha-a35022276",
  github: "https://github.com/zohapasha",
  about: [
    "I am in my final year of Computer Science at FAST-NUCES Lahore. My CGPA is 3.86. I have made the Dean's List four times and the Rector's List twice.",
    "Most of what I build starts the same way. I want to see inside the thing. That is how I ended up writing a debugger that reads a language model's confidence one word at a time. It is why I rebuilt an image model from a research paper instead of just reading it. It is why I put decision trees into game characters, so I could watch them choose what to do.",
    "I am heading into AI and machine learning work. I am keeping my options open between engineering jobs and graduate study while I finish my degree. Computer vision, language models and deep learning are the areas I want to keep building in.",
  ],
};

export type Focus = {
  id: "vision" | "llms" | "deep-learning";
  label: string;
  title: string;
  body: string;
  detail: string;
};

export const focuses: Focus[] = [
  {
    id: "vision",
    label: "01",
    title: "Computer Vision",
    body: "Getting a model to find and make sense of what is actually in a picture.",
    detail:
      "This is the area my final year project sits in. I am building a framework that uses a language model to help find several objects at once in a scene, from either a written description or an example image, for cameras that know where they are pointing. It is due in 2027. Before that I rebuilt a published model that sharpens Sentinel-2 satellite images, scaled down to run on my own machine. Going through someone else's design line by line taught me far more than reading about it ever did.",
  },
  {
    id: "llms",
    label: "02",
    title: "Language Models",
    body: "Building things with them, and checking what they are really doing.",
    detail:
      "I made a tool that shows what a language model is doing as it writes, one word at a time. It shows how confident the model is, where it is paying attention, and how likely it is to be making something up. Then I tested whether the model's own confidence could be trusted. It could not. When it said how sure it was, it was off by about 32 percent. Its own internal numbers were off by about 15 percent. I like working across all of this, from building with these models to working out why they behave the way they do.",
  },
  {
    id: "deep-learning",
    label: "03",
    title: "Deep Learning",
    body: "Starting from the maths, not from someone else's library.",
    detail:
      "Neural networks, CNNs, ensembles and reinforcement learning. Some of it came from my coursework, some from Andrew Ng's specialisation, and a lot of it from building things until they finally worked. I would rather write a method myself and watch it break than trust a library to be right. This is the layer sitting underneath everything else on this page.",
  },
];

export type Project = {
  slug: string;
  name: string;
  kind: string;
  year: string;
  stack?: string[];
  summary: string;
  points: string[];
  stackNote?: string;
  metrics?: { label: string; value: string }[];
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "multi-object-localisation",
    name: "LLM Assisted Multi Object Localisation",
    kind: "Final year project",
    year: "2027",
    summary:
      "My final year project, which I am working on now. It is a framework that uses a language model to help find several objects at once in a scene. You can describe what you are looking for in words or show it a picture, and it works with cameras that know where they are pointing.",
    points: [
      "Still in progress. It is due to be finished in 2027.",
    ],
    stackNote: "Still deciding on parts of the stack.",
  },
  {
    slug: "llm-reasoning-debugger",
    name: "LLM Reasoning Debugger",
    kind: "LLM tooling",
    year: "2026",
    stack: ["Python", "FastAPI", "Qwen2.5-1.5B"],
    summary:
      "A small web app that opens up how a language model thinks. It shows you, one word at a time, how confident the model is, where it is looking, and how likely it is to be making things up.",
    points: [
      "Ran Qwen2.5-1.5B-Instruct behind a FastAPI backend and captured what it was doing at every word.",
      "Wrote a set of 28 test questions and scored the answers properly.",
      "Found that the model is bad at judging itself. What it claimed about its own confidence was much further off than its own internal numbers.",
    ],
    metrics: [
      { label: "error in what it claimed", value: "32%" },
      { label: "error in its own numbers", value: "15%" },
    ],
    featured: true,
  },
  {
    slug: "sentinel-2-super-resolution",
    name: "Sentinel-2 Super Resolution",
    kind: "Paper implementation",
    year: "2025",
    stack: ["Python", "PyTorch", "CNNs"],
    summary:
      "A model that sharpens blurry Sentinel-2 satellite images. I built it by following a published paper and scaled it down so it would run on my own machine, so I could understand exactly why the design works.",
    points: [
      "Built the parts the paper describes, including how the model decides which details matter.",
      "Scaled the whole pipeline down to fit the hardware I had, then prepared the data, trained it and measured the results.",
      "This is my version of a pipeline that already exists. The original design is not mine, and this is not my final year project.",
    ],
  },
  {
    slug: "ai-murder-mystery",
    name: "AI Murder Mystery",
    kind: "Game / agent behaviour",
    year: "2025",
    stack: ["Unreal Engine 5", "C++", "Blueprints"],
    summary:
      "A murder mystery game where the characters decide things for themselves. They patrol, chase and attack on their own, and they talk to you using a language model.",
    points: [
      "Built the logic that makes characters switch between patrolling, chasing and attacking.",
      "Set up how they find their way around the level, so a chase feels deliberate instead of scripted.",
      "Hooked up a language model so characters can talk back while you investigate.",
    ],
  },
  {
    slug: "airline-management",
    name: "Airline Management System",
    kind: "Full stack platform",
    year: "2025",
    stack: ["Next.js", "Tailwind CSS", "SQL Server"],
    summary:
      "A booking and scheduling system for an airline, with an admin side for staff. It runs on a proper database behind a Next.js frontend.",
    points: [
      "Designed how flights, bookings and schedules are stored in SQL Server.",
      "Built the booking flow and the admin screens from start to finish.",
    ],
  },
  {
    slug: "fast-learning-system",
    name: "FAST Learning System",
    kind: "Desktop app",
    year: "2024",
    stack: ["WPF", "C#", "Supabase"],
    summary:
      "A desktop app that helps FAST students search old exam papers. It has a chatbot built in, and Supabase handles logins and file storage.",
    points: [
      "Built the desktop app in WPF and C#.",
      "Made the papers searchable, and added a chatbot so students can just ask.",
    ],
  },
  {
    slug: "social-networking-system",
    name: "Social Networking System",
    kind: "Desktop app",
    year: "2024",
    stack: ["C++", "Qt"],
    summary:
      "A desktop social app with friend requests, messaging and user profiles.",
    points: ["Built the friend system, the profiles and the messaging in Qt."],
  },
];

export type TimelineEntry = {
  when: string;
  title: string;
  org: string;
  detail: string[];
  kind: "Education" | "Experience" | "Certification";
};

export const timeline: TimelineEntry[] = [
  {
    when: "2023 to now",
    kind: "Education",
    title: "BS Computer Science",
    org: "FAST-NUCES Lahore",
    detail: ["CGPA 3.86 out of 4.00", "Dean's List four times, Rector's List twice", "Coursework in Applied Machine Learning"],
  },
  {
    when: "2025",
    kind: "Experience",
    title: "Developer Intern",
    org: "Clear Wave Information Technologies",
    detail: ["Built frontend features in Next.js and Tailwind CSS", "Helped set up and test an ERP system"],
  },
  {
    when: "2024",
    kind: "Experience",
    title: "Frontend Development Intern",
    org: "OSOL Technologies",
    detail: ["Built page components in HTML, CSS and JavaScript", "Helped connect those pages to the backend"],
  },
  {
    when: "2026",
    kind: "Certification",
    title: "Machine Learning Specialization",
    org: "DeepLearning.AI, taught by Andrew Ng",
    detail: ["Supervised learning, neural networks and ensembles", "Unsupervised learning, recommenders and reinforcement learning"],
  },
];

export const skills: { group: string; items: string[] }[] = [
  {
    group: "AI / ML",
    items: ["PyTorch", "TensorFlow", "scikit-learn", "CNNs", "Neural Networks", "LangChain", "LangGraph", "NumPy", "pandas"],
  },
  { group: "Languages", items: ["Python", "C++", "C#", "JavaScript", "Assembly (8088)"] },
  { group: "Web", items: ["Next.js", "Tailwind CSS", "FastAPI", "ASP.NET", "WPF"] },
  { group: "Tools", items: ["Unreal Engine 5", "Git", "SQL Server", "Supabase"] },
];
