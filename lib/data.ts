export const profile = {
  name: "Zoha Pasha",
  tagline: "I build systems, then take them apart to find out what they're actually doing.",
  role: "CS student · AI / machine learning / computer vision",
  location: "Lahore, Pakistan",
  email: "zohapasha16@gmail.com",
  linkedin: "https://www.linkedin.com/in/zoha-pasha-a35022276",
  github: "https://github.com/zohapasha",
  about: [
    "I'm a final-year Computer Science student at FAST-NUCES Lahore, sitting at a 3.86 CGPA with four Dean's List and two Rector's List placements.",
    "Most of what I build comes from the same impulse: I want to see inside the thing. That's how I ended up writing a debugger that reads an LLM's confidence token by token, reproducing a super-resolution architecture from a paper to understand why channel attention works, and wiring behaviour trees into game NPCs to watch them make decisions.",
    "I'm heading into AI and machine learning work. Engineering roles and graduate study are both on the table and I'm keeping both open while I finish my degree — computer vision, language models, and deep learning are the areas I want to keep building in.",
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
    body: "Getting a model to recover detail that isn't obviously in the pixels.",
    detail:
      "This is where my final-year work sits. I implemented a published DSen2-based super-resolution architecture for Sentinel-2 satellite imagery — channel attention, high-frequency filtering, and the full preprocessing and evaluation pipeline. Working through someone else's architecture line by line taught me more about why it works than reading about it did.",
  },
  {
    id: "llms",
    label: "02",
    title: "Language Models",
    body: "Building things with them — and checking what they are actually doing.",
    detail:
      "I built a debugger that surfaces a model's behaviour per token: confidence, entropy, attention weights, hallucination risk. Then I benchmarked whether its stated confidence could be trusted, and it couldn't — roughly 32% calibration error on what it claimed against 15% on its own token probabilities. I'm interested in the whole stack around these models, from wiring them into an application to understanding why they behave the way they do.",
  },
  {
    id: "deep-learning",
    label: "03",
    title: "Deep Learning",
    body: "From the gradient up, not from the API down.",
    detail:
      "Neural networks, CNNs, ensembles, reinforcement learning — through coursework, Andrew Ng's specialization, and building things until they worked. I'd rather implement a method and watch it fail than take a library's word for it. It is the layer underneath everything else here.",
  },
];

export type Project = {
  slug: string;
  name: string;
  kind: string;
  year: string;
  stack: string[];
  summary: string;
  points: string[];
  metrics?: { label: string; value: string }[];
  featured?: boolean;
};

export const projects: Project[] = [
  {
    slug: "llm-reasoning-debugger",
    name: "LLM Reasoning Debugger",
    kind: "LLM tooling",
    year: "2026",
    stack: ["Python", "FastAPI", "Qwen2.5-1.5B"],
    summary:
      "A local web app that opens up a language model's reasoning token by token — confidence, entropy, attention weights, and hallucination risk in a terminal-style interface.",
    points: [
      "Served Qwen2.5-1.5B-Instruct behind a FastAPI backend, capturing per-token logits and attention.",
      "Built a 28-question benchmark and scored it with AUROC and expected calibration error.",
      "Found the model's stated confidence was badly calibrated (~32% ECE) against its own token probabilities (~15% ECE).",
    ],
    metrics: [
      { label: "ECE, stated confidence", value: "~32%" },
      { label: "ECE, token probability", value: "~15%" },
    ],
    featured: true,
  },
  {
    slug: "sentinel-2-super-resolution",
    name: "Sentinel-2 Super-Resolution",
    kind: "Paper implementation",
    year: "2025",
    stack: ["Python", "PyTorch", "CNNs"],
    summary:
      "An implementation of a published DSen2-based super-resolution architecture for Sentinel-2 satellite imagery, reproduced end to end to understand how channel attention and high-frequency enhancement actually behave.",
    points: [
      "Implemented the paper's channel attention mechanism and high-pass frequency filtering.",
      "Ran the full pipeline myself: dataset preprocessing, training, and quantitative evaluation.",
      "This is a reproduction of existing published work, not an original architecture.",
    ],
  },
  {
    slug: "ai-murder-mystery",
    name: "AI Murder Mystery",
    kind: "Game / agent behaviour",
    year: "2025",
    stack: ["Unreal Engine 5", "C++", "Blueprints"],
    summary:
      "A story-mode murder mystery where the NPCs decide for themselves — behaviour trees driving patrol, chase, and attack states, with language-model dialogue on top.",
    points: [
      "Designed behaviour trees for NPC patrol, chase, and attack state transitions.",
      "Wired pathfinding into level geometry so pursuit reads as deliberate rather than scripted.",
      "Integrated an LLM for reactive dialogue during the investigation.",
    ],
  },
  {
    slug: "airline-management",
    name: "Airline Management System",
    kind: "Full-stack platform",
    year: "2025",
    stack: ["Next.js", "Tailwind CSS", "SQL Server"],
    summary:
      "A booking, scheduling, and administration platform built on a relational database with a Next.js frontend.",
    points: [
      "Modelled flights, bookings, and schedules in SQL Server.",
      "Built the booking and admin flows end to end.",
    ],
  },
  {
    slug: "fast-learning-system",
    name: "FAST Learning System",
    kind: "Desktop app",
    year: "2024",
    stack: ["WPF", "C#", "Supabase"],
    summary:
      "A past-paper search platform for FAST students, with an AI chatbot and Supabase handling auth and storage.",
    points: [
      "Built the desktop client in WPF and C#.",
      "Indexed past papers for fast retrieval and added a chatbot for student queries.",
    ],
  },
  {
    slug: "social-networking-system",
    name: "Social Networking System",
    kind: "Desktop app",
    year: "2024",
    stack: ["C++", "Qt"],
    summary:
      "A desktop social app implementing friend requests, messaging, and user profiles.",
    points: ["Built friend-request graphs, profile state, and messaging in Qt."],
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
    when: "2023 — now",
    kind: "Education",
    title: "BS Computer Science",
    org: "FAST-NUCES Lahore",
    detail: ["CGPA 3.86 / 4.00", "Dean's List ×4 · Rector's List ×2", "Coursework: Applied Machine Learning"],
  },
  {
    when: "2025",
    kind: "Experience",
    title: "Developer Intern",
    org: "Clear Wave Information Technologies",
    detail: ["Frontend features in Next.js and Tailwind CSS", "ERP implementation and testing support"],
  },
  {
    when: "2024",
    kind: "Experience",
    title: "Frontend Development Intern",
    org: "OSOL Technologies",
    detail: ["Responsive UI components in HTML, CSS, and JavaScript", "REST API integration support"],
  },
  {
    when: "2026",
    kind: "Certification",
    title: "Machine Learning Specialization",
    org: "DeepLearning.AI — Andrew Ng",
    detail: ["Supervised learning, neural networks, ensembles", "Unsupervised learning, recommenders, RL"],
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
