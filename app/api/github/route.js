/**
 * GitHub AI 周榜 API
 * GET /api/github?cat=all&since=weekly
 *
 * 通过 GitHub Search API 搜索近期热门 AI 仓库，按领域自动分类。
 * 分类基于仓库名、描述、topic 关键词匹配。
 *
 * 数据源：
 *   - 优先：GitHub Search API（按 stars 排序，最近一周创建/更新的 AI 项目）
 *   - 降级：内置静态数据
 */

const GITHUB_SEARCH_URL = 'https://api.github.com/search/repositories';

// 全量缓存 30 分钟
let cache = null;
let cacheTime = 0;
const CACHE_TTL = 30 * 60 * 1000;

// AI 领域分类：key + 匹配关键词列表
const AI_CATEGORIES = [
  {
    key: 'all',
    label: '全部 AI',
    icon: '🤖',
    color: '#6366f1',
    keywords: [],
  },
  {
    key: 'llm',
    label: 'LLM / 大语言模型',
    icon: '🧠',
    color: '#8b5cf6',
    keywords: [
      'llm', 'large language model', '大模型', 'gpt', 'chatgpt', 'claude', 'llama',
      'mistral', 'qwen', 'deepseek', 'chatglm', 'baichuan', 'yi-', 'gemini',
      'transformer', 'attention', 'tokenizer', 'inference', 'fine-tun',
      'finetune', 'rlhf', 'prompt', 'sft', 'lora', 'qlora', 'peft',
      'openai', 'anthropic', 'groq', 'together', 'vllm', 'ollama',
      'text generation', 'language model', 'text-generation',
    ],
  },
  {
    key: 'agent',
    label: 'AI Agent',
    icon: '🕵️',
    color: '#06b6d4',
    keywords: [
      'agent', 'autogpt', 'babyagi', 'crewai', 'langgraph', 'autogen',
      'multi-agent', 'multi agent', 'swarm', 'agentic', 'tool-calling',
      'tool calling', 'function call', 'function-calling', 'browser-use',
      'computer-use', 'computer use', 'code interpreter', 'copilot',
      'cursor', 'devin', 'swe-agent', 'sweagent', 'openhands',
      'autonomous', 'self-driving', 'workflow', 'orchestrat',
    ],
  },
  {
    key: 'multimodal',
    label: '多模态 / 视觉',
    icon: '👁️',
    color: '#ec4899',
    keywords: [
      'multimodal', 'multi-modal', 'vision', 'visual', 'image generation',
      'text-to-image', 'text-to-video', 'text to image', 'text to video',
      'stable-diffusion', 'stable diffusion', 'dall-e', 'dalle', 'midjourney',
      'diffusion', 'sora', 'image-gen', 'video-gen', 'video generation',
      'tts', 'text-to-speech', 'text to speech', 'speech', 'whisper',
      'ocr', 'object detection', 'segmentation', 'image recognition',
      'image model', 'visual model', 'vqa', 'clip', 'blip',
      'comfyui', 'sd-webui', 'automatic1111', 'animatediff',
    ],
  },
  {
    key: 'rag',
    label: 'RAG / 检索增强',
    icon: '🔍',
    color: '#f59e0b',
    keywords: [
      'rag', 'retrieval-augmented', 'retrieval augmented', 'vector database',
      'vector db', 'vectordb', 'embedding', 'semantic search', 'knowledge base',
      'knowledge graph', 'langchain', 'llamaindex', 'llama-index', 'llama index',
      'chroma', 'pinecone', 'weaviate', 'qdrant', 'milvus', 'faiss',
      'document loader', 'document parsing', 'pdf parser', 'chunking',
      'haystack', 'dify', 'fastgpt', 'anything-llm',
    ],
  },
  {
    key: 'ml-framework',
    label: 'ML 框架',
    icon: '⚙️',
    color: '#10b981',
    keywords: [
      'pytorch', 'tensorflow', 'jax', 'keras', 'scikit-learn', 'xgboost',
      'lightgbm', 'catboost', 'mlx', 'ggml', 'gguf', 'onnx', 'tensorrt',
      'deep learning', 'machine learning', 'neural network', 'training',
      'distributed training', 'deepspeed', 'megatron', 'fsdp', 'accelerate',
      'huggingface', 'transformers', 'diffusers', 'datasets', 'trl',
      'reinforcement learning', 'rl', 'gym', 'gymnasium',
      'cuda', 'triton', 'opencl', 'rocm',
    ],
  },
  {
    key: 'ai-tools',
    label: 'AI 工具 / 应用',
    icon: '🛠️',
    color: '#ef4444',
    keywords: [
      'ai tool', 'ai app', 'chatbot', 'ai assistant', 'ai-powered',
      'ai powered', 'ai-native', 'ai native', 'gpt-', 'chatgpt-',
      'open-webui', 'open webui', 'lobechat', 'nextchat', 'chatgpt-next',
      'aider', 'continue', 'cline', 'codex', 'copilot',
      'ai code', 'code generation', 'ai engineer', 'ai developer',
      'mcp', 'model context protocol', 'ai platform',
      'evaluation', 'benchmark', 'evals', 'lm-eval',
      'guardrail', 'safety', 'alignment', 'red-teaming',
      'ai observ', 'llm-ops', 'llmops', 'monitoring',
    ],
  },
];

// 用于标记"非 AI 项目"的分类
const OTHER_AI_KEY = 'other-ai';
const OTHER_AI_CAT = {
  key: OTHER_AI_KEY,
  label: '其他 AI 项目',
  icon: '📡',
  color: '#6b7280',
};

// 判断仓库是否属于 AI 领域（粗略过滤）
function isAIRepo(repo) {
  const text = [
    repo.fullName || '',
    repo.name || '',
    repo.description || '',
    repo.language || '',
    (repo.topics || []).join(' '),
  ]
    .join(' ')
    .toLowerCase();

  const aiSignals = [
    'llm', 'gpt', 'chatgpt', 'claude', 'llama', 'mistral', 'deepseek',
    'transformer', 'attention', 'neural', 'deep learn', 'machine learn',
    'pytorch', 'tensorflow', 'jax', 'huggingface', 'langchain', 'agent',
    'rag', 'embedding', 'vector', 'diffusion', 'stable diffusion',
    'generative', 'generation', 'fine-tun', 'finetune', 'prompt',
    'multimodal', 'vision model', 'image model', 'speech', 'whisper',
    'tts', 'text-to-', 'text to ', 'nlp', 'natural language',
    'copilot', 'ai ', '-ai', 'ai-', 'openai', 'anthropic',
    'ollama', 'vllm', 'gguf', 'ggml', 'mlx', 'onnx',
    'tokenizer', 'inference engine', 'quantiz',
    'autonomous agent', 'agentic', 'tool call',
    'comfyui', 'automatic1111', 'sd-webui',
  ];

  return aiSignals.some((sig) => text.includes(sig));
}

// 给仓库分配 AI 分类
function classifyAIRepo(repo) {
  const text = [
    repo.fullName || '',
    repo.name || '',
    repo.description || '',
    (repo.topics || []).join(' '),
  ]
    .join(' ')
    .toLowerCase();

  for (const cat of AI_CATEGORIES) {
    if (cat.key === 'all') continue;
    if (cat.keywords.some((kw) => text.includes(kw.toLowerCase()))) {
      return cat.key;
    }
  }
  return OTHER_AI_KEY;
}

function formatNumber(n) {
  if (n === undefined || n === null) return '';
  if (n >= 1000) return (n / 1000).toFixed(1) + 'k';
  return String(n);
}

function buildDescription(repo) {
  const desc = repo.description || '';
  return desc.length > 120 ? desc.slice(0, 120) + '...' : desc;
}

/**
 * 通过 GitHub Search API 搜索 AI 相关热门仓库
 * 分多个查询词搜索，去重合并后按 stars 排序
 */
async function fetchFromGitHubSearch() {
  // 精简为 4 个核心关键词搜索
  const queries = [
    'ai+language:python+pushed:>2026-06-12',
    'llm+language:python+pushed:>2026-06-12',
    'agent+language:python+pushed:>2026-06-12',
    'rag+language:python+pushed:>2026-06-12',
  ];

  const seen = new Set();
  const allRepos = [];

  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'dwhai-website/1.0',
  };

  // 先尝试第一个请求，如果 5 秒内没响应，直接放弃全部
  try {
    const firstUrl = `${GITHUB_SEARCH_URL}?q=${queries[0]}&sort=stars&order=desc&per_page=30`;
    const firstRes = await fetch(firstUrl, { headers, signal: AbortSignal.timeout(5000) });

    if (!firstRes.ok) {
      console.warn(`[github-ai] GitHub API returned ${firstRes.status}, using fallback`);
      return [];
    }

    const firstJson = await firstRes.json();
    for (const item of firstJson.items || []) {
      if (!seen.has(item.id)) {
        seen.add(item.id);
        allRepos.push(item);
      }
    }
  } catch (err) {
    console.warn('[github-ai] First search request failed, using fallback:', err.message);
    return [];
  }

  // 第一个请求成功后，继续搜索其余关键词
  for (const q of queries.slice(1)) {
    try {
      await new Promise((r) => setTimeout(r, 200));
      const url = `${GITHUB_SEARCH_URL}?q=${q}&sort=stars&order=desc&per_page=30`;
      const res = await fetch(url, { headers, signal: AbortSignal.timeout(5000) });

      if (!res.ok) {
        console.warn(`[github-ai] search "${q}" failed: ${res.status}`);
        continue;
      }

      const json = await res.json();
      for (const item of json.items || []) {
        if (seen.has(item.id)) continue;
        seen.add(item.id);
        allRepos.push(item);
      }
    } catch (err) {
      console.warn(`[github-ai] search "${q}" error:`, err.message);
    }
  }

  return allRepos;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const cat = searchParams.get('cat') || 'all';
  const since = searchParams.get('since') || 'weekly';

  // 缓存
  const cacheKey = 'github_ai_v2';
  if (cache && cache.cacheKey === cacheKey && Date.now() - cacheTime < CACHE_TTL) {
    return respond(cache.data, cat, since);
  }

  try {
    let rawRepos = await fetchFromGitHubSearch();

    // 如果 API 没有返回数据，使用静态备用数据
    if (rawRepos.length === 0) {
      console.warn('[github-ai] GitHub Search API returned no results, using fallback data');
      return respond(getFallbackData(), cat, since);
    }

    // 按 stars 降序排列
    rawRepos.sort((a, b) => (b.stargazers_count || 0) - (a.stargazers_count || 0));

    const allRepos = rawRepos.map((repo, idx) => ({
      rank: idx + 1,
      name: repo.name || '',
      fullName: repo.full_name || '',
      author: repo.owner?.login || (repo.full_name ? repo.full_name.split('/')[0] : ''),
      description: buildDescription(repo),
      url: repo.html_url || `https://github.com/${repo.full_name}`,
      language: repo.language || '',
      stars: formatNumber(repo.stargazers_count),
      forks: formatNumber(repo.forks_count),
      starsRaw: repo.stargazers_count || 0,
      forksRaw: repo.forks_count || 0,
      currentPeriodStars: '', // Search API 不提供趋势数据
      builtBy: [],
      languageColor: '',
      topics: repo.topics || [],
    }));

    // 只保留 AI 相关仓库并打分类标签
    const aiRepos = allRepos
      .filter(isAIRepo)
      .map((repo) => ({
        ...repo,
        aiCategory: classifyAIRepo(repo),
      }));

    // 构建分类列表
    const catCounts = {};
    for (const r of aiRepos) {
      catCounts[r.aiCategory] = (catCounts[r.aiCategory] || 0) + 1;
    }
    const populatedCategories = AI_CATEGORIES.filter(
      (c) => c.key === 'all' || catCounts[c.key] > 0,
    );
    if (catCounts[OTHER_AI_KEY] > 0) {
      populatedCategories.push({ ...OTHER_AI_CAT, count: catCounts[OTHER_AI_KEY] });
    }

    const data = {
      repos: aiRepos,
      categories: populatedCategories,
      updatedAt: new Date().toISOString(),
    };

    cache = { cacheKey, data };
    cacheTime = Date.now();

    return respond(data, cat, since);
  } catch (err) {
    console.error('[github-ai] fetch error:', err.message);
    return respond(getFallbackData(), cat, since);
  }
}

function respond(data, cat, since) {
  const filtered =
    cat && cat !== 'all'
      ? data.repos.filter((r) => r.aiCategory === cat)
      : data.repos;

  return Response.json({
    since,
    cat,
    updatedAt: data.updatedAt,
    categories: data.categories,
    total: filtered.length,
    repos: filtered.slice(0, 50),
  });
}

/** 内置静态 AI 仓库数据，API 不可用时使用 */
function getStaticRepos() {
  const repos = [
    { name: 'DeepSeek-V3', fullName: 'deepseek-ai/DeepSeek-V3', author: 'deepseek-ai', description: 'DeepSeek-V3: A Strong, Mixture-of-Experts (MoE) Language Model with 671B total parameters, 37B activated for each token.', url: 'https://github.com/deepseek-ai/DeepSeek-V3', language: 'Python', stars: '85.2k', forks: '11.3k', starsRaw: 85200, forksRaw: 11300, topics: ['llm', 'deepseek', 'moe', 'language-model'] },
    { name: 'Qwen3', fullName: 'QwenLM/Qwen3', author: 'QwenLM', description: 'Qwen3 is the latest series of Qwen large language models, featuring Dense and MoE architectures.', url: 'https://github.com/QwenLM/Qwen3', language: 'Python', stars: '55.6k', forks: '6.2k', starsRaw: 55600, forksRaw: 6200, topics: ['llm', 'qwen', 'language-model', 'moe'] },
    { name: 'ollama', fullName: 'ollama/ollama', author: 'ollama', description: 'Get up and running with Llama 4, DeepSeek, Mistral, Gemma 3, Qwen3 and other large language models locally.', url: 'https://github.com/ollama/ollama', language: 'Go', stars: '142k', forks: '12.1k', starsRaw: 142000, forksRaw: 12100, topics: ['llm', 'ollama', 'llama', 'local'] },
    { name: 'langchain', fullName: 'langchain-ai/langchain', author: 'langchain-ai', description: 'Build context-aware, reasoning applications with LangChain\'s flexible abstractions and AI-first toolkits.', url: 'https://github.com/langchain-ai/langchain', language: 'Python', stars: '110k', forks: '18.5k', starsRaw: 110000, forksRaw: 18500, topics: ['llm', 'langchain', 'rag', 'agent'] },
    { name: 'transformers', fullName: 'huggingface/transformers', author: 'huggingface', description: 'State-of-the-art Machine Learning for PyTorch, TensorFlow, and JAX. Thousands of pretrained models.', url: 'https://github.com/huggingface/transformers', language: 'Python', stars: '145k', forks: '28.1k', starsRaw: 145000, forksRaw: 28100, topics: ['nlp', 'transformers', 'pytorch', 'deep-learning'] },
    { name: 'vllm', fullName: 'vllm-project/vllm', author: 'vllm-project', description: 'A high-throughput and memory-efficient inference and serving engine for LLMs.', url: 'https://github.com/vllm-project/vllm', language: 'Python', stars: '55.3k', forks: '9.2k', starsRaw: 55300, forksRaw: 9200, topics: ['llm', 'inference', 'serving'] },
    { name: 'Dify', fullName: 'langgenius/dify', author: 'langgenius', description: 'An open-source LLM app development platform. Orchestrate AI workflow, RAG, agents, and model management.', url: 'https://github.com/langgenius/dify', language: 'TypeScript', stars: '98.2k', forks: '13.8k', starsRaw: 98200, forksRaw: 13800, topics: ['llm', 'rag', 'agent', 'workflow', 'ai-platform'] },
    { name: 'stable-diffusion-webui', fullName: 'AUTOMATIC1111/stable-diffusion-webui', author: 'AUTOMATIC1111', description: 'A browser interface for Stable Diffusion for AI image generation.', url: 'https://github.com/AUTOMATIC1111/stable-diffusion-webui', language: 'Python', stars: '158k', forks: '29.8k', starsRaw: 158000, forksRaw: 29800, topics: ['stable-diffusion', 'image-generation', 'diffusion'] },
    { name: 'ComfyUI', fullName: 'comfyanonymous/ComfyUI', author: 'comfyanonymous', description: 'The most powerful and modular diffusion model GUI and backend with a graph/nodes interface.', url: 'https://github.com/comfyanonymous/ComfyUI', language: 'Python', stars: '89.5k', forks: '8.9k', starsRaw: 89500, forksRaw: 8900, topics: ['stable-diffusion', 'diffusion', 'image-generation'] },
    { name: 'pytorch', fullName: 'pytorch/pytorch', author: 'pytorch', description: 'Tensors and Dynamic neural networks in Python with strong GPU acceleration.', url: 'https://github.com/pytorch/pytorch', language: 'Python', stars: '92.1k', forks: '25.1k', starsRaw: 92100, forksRaw: 25100, topics: ['pytorch', 'deep-learning', 'machine-learning'] },
    { name: 'ChatGPT-Next-Web', fullName: 'ChatGPTNextWeb/NextChat', author: 'ChatGPTNextWeb', description: 'A cross-platform ChatGPT/Gemini UI (Web / PWA / Linux / Win / MacOS). One-Click to deploy your own ChatGPT web UI.', url: 'https://github.com/ChatGPTNextWeb/NextChat', language: 'TypeScript', stars: '86.3k', forks: '68.2k', starsRaw: 86300, forksRaw: 68200, topics: ['chatgpt', 'ai-tools', 'chatbot'] },
    { name: 'whisper', fullName: 'openai/whisper', author: 'openai', description: 'Robust Speech Recognition via Large-Scale Weak Supervision. General-purpose speech recognition model.', url: 'https://github.com/openai/whisper', language: 'Python', stars: '82.5k', forks: '9.9k', starsRaw: 82500, forksRaw: 9900, topics: ['speech', 'whisper', 'speech-to-text', 'tts'] },
    { name: 'llama.cpp', fullName: 'ggml-org/llama.cpp', author: 'ggml-org', description: 'LLM inference in C/C++. The go-to for running LLMs locally and on edge devices.', url: 'https://github.com/ggml-org/llama.cpp', language: 'C++', stars: '80.1k', forks: '11.8k', starsRaw: 80100, forksRaw: 11800, topics: ['llm', 'inference', 'ggml', 'quantization'] },
    { name: 'llama-index', fullName: 'run-llama/llama_index', author: 'run-llama', description: 'The data framework for LLM applications. Connect custom data sources to large language models.', url: 'https://github.com/run-llama/llama_index', language: 'Python', stars: '42.3k', forks: '6.1k', starsRaw: 42300, forksRaw: 6100, topics: ['llm', 'rag', 'embedding', 'vector-database'] },
    { name: 'CrewAI', fullName: 'crewAIInc/crewAI', author: 'crewAIInc', description: 'Framework for orchestrating role-playing, autonomous AI agents. By fostering collaborative intelligence, CrewAI empowers agents to work together seamlessly.', url: 'https://github.com/crewAIInc/crewAI', language: 'Python', stars: '32.5k', forks: '4.2k', starsRaw: 32500, forksRaw: 4200, topics: ['agent', 'multi-agent', 'orchestration'] },
    { name: 'OpenHands', fullName: 'All-Hands-AI/OpenHands', author: 'All-Hands-AI', description: 'OpenHands: Code Less, Make More. An AI-powered software engineering agent.', url: 'https://github.com/All-Hands-AI/OpenHands', language: 'Python', stars: '58.3k', forks: '6.5k', starsRaw: 58300, forksRaw: 6500, topics: ['agent', 'ai-engineer', 'code-generation'] },
    { name: 'Aider', fullName: 'aider-ai/aider', author: 'aider-ai', description: 'Aider is a command-line tool to pair program with GPT/Claude to edit code in your local git repository.', url: 'https://github.com/aider-ai/aider', language: 'Python', stars: '40.2k', forks: '5.8k', starsRaw: 40200, forksRaw: 5800, topics: ['ai-tools', 'code-generation', 'gpt'] },
    { name: 'Milvus', fullName: 'milvus-io/milvus', author: 'milvus-io', description: 'A cloud-native vector database, storage for next generation AI applications. Built for billion-scale vector search.', url: 'https://github.com/milvus-io/milvus', language: 'Go', stars: '35.2k', forks: '3.5k', starsRaw: 35200, forksRaw: 3500, topics: ['vector-database', 'embedding', 'rag'] },
    { name: 'stable-diffusion', fullName: 'Stability-AI/stablediffusion', author: 'Stability-AI', description: 'High-Resolution Image Synthesis with Latent Diffusion Models. The original Stable Diffusion model.', url: 'https://github.com/Stability-AI/stablediffusion', language: 'Python', stars: '42.6k', forks: '5.4k', starsRaw: 42600, forksRaw: 5400, topics: ['stable-diffusion', 'diffusion', 'image-generation'] },
    { name: 'OpenAI-Cookbook', fullName: 'openai/openai-cookbook', author: 'openai', description: 'Examples and guides for using the OpenAI API. Includes prompt engineering, embeddings, fine-tuning, and more.', url: 'https://github.com/openai/openai-cookbook', language: 'MDX', stars: '65.1k', forks: '10.6k', starsRaw: 65100, forksRaw: 10600, topics: ['openai', 'gpt', 'prompt-engineering'] },
    { name: 'ChatGPT-on-WeChat', fullName: 'zhayujie/chatgpt-on-wechat', author: 'zhayujie', description: '基于大模型搭建的聊天机器人，支持微信公众号、企业微信应用、飞书、钉钉等接入，支持GPT/Claude/Gemini/DeepSeek等模型。', url: 'https://github.com/zhayujie/chatgpt-on-wechat', language: 'Python', stars: '38.2k', forks: '10.5k', starsRaw: 38200, forksRaw: 10500, topics: ['chatgpt', 'wechat', 'chatbot', 'ai-tools'] },
    { name: 'TensorFlow', fullName: 'tensorflow/tensorflow', author: 'tensorflow', description: 'An Open Source Machine Learning Framework for Everyone. Core platform for building and deploying ML models.', url: 'https://github.com/tensorflow/tensorflow', language: 'C++', stars: '190k', forks: '75.1k', starsRaw: 190000, forksRaw: 75100, topics: ['tensorflow', 'machine-learning', 'deep-learning'] },
    { name: 'gpt4all', fullName: 'nomic-ai/gpt4all', author: 'nomic-ai', description: 'GPT4All: Run Local LLMs on Any Device. Open-source and available for commercial use.', url: 'https://github.com/nomic-ai/gpt4all', language: 'C++', stars: '77.3k', forks: '8.5k', starsRaw: 77300, forksRaw: 8500, topics: ['llm', 'gpt', 'local', 'chatbot'] },
    { name: 'AutoGPT', fullName: 'Significant-Gravitas/AutoGPT', author: 'Significant-Gravitas', description: 'AutoGPT is the vision of accessible AI for everyone, to use and to build on. Autonomous AI agents framework.', url: 'https://github.com/Significant-Gravitas/AutoGPT', language: 'Python', stars: '176k', forks: '47.2k', starsRaw: 176000, forksRaw: 47200, topics: ['agent', 'autonomous', 'autogpt'] },
    { name: 'langgraph', fullName: 'langchain-ai/langgraph', author: 'langchain-ai', description: 'Build resilient language agents as graphs. Framework for creating stateful, multi-actor applications with LLMs.', url: 'https://github.com/langchain-ai/langgraph', language: 'Python', stars: '22.8k', forks: '3.3k', starsRaw: 22800, forksRaw: 3300, topics: ['agent', 'langgraph', 'workflow', 'multi-agent'] },
    { name: 'DiffSynth-Studio', fullName: 'modelscope/DiffSynth-Studio', author: 'modelscope', description: 'Enjoy the magic of Diffusion models! A one-stop solution for image and video generation, editing and enhancement.', url: 'https://github.com/modelscope/DiffSynth-Studio', language: 'Python', stars: '12.5k', forks: '1.3k', starsRaw: 12500, forksRaw: 1300, topics: ['diffusion', 'image-generation', 'video-generation', 'multimodal'] },
    { name: 'MiniMax-01', fullName: 'MiniMax-AI/MiniMax-01', author: 'MiniMax-AI', description: 'MiniMax-01: Powerful language models with 4M token context window and lightning attention mechanism.', url: 'https://github.com/MiniMax-AI/MiniMax-01', language: 'Python', stars: '8.9k', forks: '0.9k', starsRaw: 8900, forksRaw: 900, topics: ['llm', 'language-model', 'transformer'] },
    { name: 'Qwen-Agent', fullName: 'QwenLM/Qwen-Agent', author: 'QwenLM', description: 'Agent framework and applications built upon Qwen, featuring function calling, code interpreter, RAG, and Chrome extension.', url: 'https://github.com/QwenLM/Qwen-Agent', language: 'Python', stars: '10.2k', forks: '1.2k', starsRaw: 10200, forksRaw: 1200, topics: ['agent', 'qwen', 'function-calling', 'rag'] },
    { name: 'browser-use', fullName: 'browser-use/browser-use', author: 'browser-use', description: 'Make websites accessible for AI agents. Open-source browser automation for AI agents.', url: 'https://github.com/browser-use/browser-use', language: 'Python', stars: '28.5k', forks: '3.1k', starsRaw: 28500, forksRaw: 3100, topics: ['agent', 'browser', 'automation', 'ai'] },
    { name: 'FastGPT', fullName: 'labring/FastGPT', author: 'labring', description: 'FastGPT is a knowledge-based platform built on the LLMs, offers out-of-the-box data processing and model invocation capabilities.', url: 'https://github.com/labring/FastGPT', language: 'TypeScript', stars: '26.3k', forks: '6.8k', starsRaw: 26300, forksRaw: 6800, topics: ['rag', 'knowledge-base', 'llm', 'ai-platform'] },
  ];

  return repos.sort((a, b) => b.starsRaw - a.starsRaw).map((r, i) => ({
    ...r,
    rank: i + 1,
    currentPeriodStars: '',
    builtBy: [],
    languageColor: '',
  }));
}

function getFallbackData() {
  const repos = getStaticRepos();
  const aiRepos = repos
    .filter(isAIRepo)
    .map((repo) => ({
      ...repo,
      aiCategory: classifyAIRepo(repo),
    }));

  const catCounts = {};
  for (const r of aiRepos) {
    catCounts[r.aiCategory] = (catCounts[r.aiCategory] || 0) + 1;
  }
  const populatedCategories = AI_CATEGORIES.filter(
    (c) => c.key === 'all' || catCounts[c.key] > 0,
  );
  if (catCounts[OTHER_AI_KEY] > 0) {
    populatedCategories.push({ ...OTHER_AI_CAT, count: catCounts[OTHER_AI_KEY] });
  }

  return {
    repos: aiRepos,
    categories: populatedCategories,
    updatedAt: new Date().toISOString(),
  };
}
