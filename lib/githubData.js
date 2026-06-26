/**
 * GitHub AI 周榜共享数据
 * 供 API route 和首页服务端渲染共用
 */

// AI 领域分类：key + 匹配关键词列表
export const AI_CATEGORIES = [
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

const OTHER_AI_KEY = 'other-ai';

// 判断仓库是否属于 AI 领域
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

// 分类中文映射
export const CATEGORY_LABELS = {
  'llm': '大语言模型',
  'agent': 'AI Agent',
  'multimodal': '多模态',
  'rag': '检索增强',
  'ml-framework': 'ML 框架',
  'ai-tools': 'AI 工具',
  'other-ai': 'AI 项目',
};

/**
 * 获取内置静态 AI 仓库数据
 */
export function getStaticAIRepos() {
  const repos = [
    { name: 'DeepSeek-V3', fullName: 'deepseek-ai/DeepSeek-V3', author: 'deepseek-ai', description: 'DeepSeek-V3: 拥有 671B 总参数的混合专家 (MoE) 大语言模型，每次推理仅激活 37B 参数。', url: 'https://github.com/deepseek-ai/DeepSeek-V3', language: 'Python', stars: '85.2k', forks: '11.3k', starsRaw: 85200, forksRaw: 11300, topics: ['llm', 'deepseek', 'moe', 'language-model'] },
    { name: 'Qwen3', fullName: 'QwenLM/Qwen3', author: 'QwenLM', description: 'Qwen3 最新系列大语言模型，支持 Dense 和 MoE 两种架构。', url: 'https://github.com/QwenLM/Qwen3', language: 'Python', stars: '55.6k', forks: '6.2k', starsRaw: 55600, forksRaw: 6200, topics: ['llm', 'qwen', 'language-model', 'moe'] },
    { name: 'ollama', fullName: 'ollama/ollama', author: 'ollama', description: '在本地轻松运行 Llama 4、DeepSeek、Mistral、Gemma 3、Qwen3 等大语言模型。', url: 'https://github.com/ollama/ollama', language: 'Go', stars: '142k', forks: '12.1k', starsRaw: 142000, forksRaw: 12100, topics: ['llm', 'ollama', 'llama', 'local'] },
    { name: 'langchain', fullName: 'langchain-ai/langchain', author: 'langchain-ai', description: '构建上下文感知、可推理的 LLM 应用，提供灵活的抽象层和 AI 优先的工具集。', url: 'https://github.com/langchain-ai/langchain', language: 'Python', stars: '110k', forks: '18.5k', starsRaw: 110000, forksRaw: 18500, topics: ['llm', 'langchain', 'rag', 'agent'] },
    { name: 'transformers', fullName: 'huggingface/transformers', author: 'huggingface', description: 'PyTorch、TensorFlow 和 JAX 的最先进机器学习库，包含数千个预训练模型。', url: 'https://github.com/huggingface/transformers', language: 'Python', stars: '145k', forks: '28.1k', starsRaw: 145000, forksRaw: 28100, topics: ['nlp', 'transformers', 'pytorch', 'deep-learning'] },
    { name: 'vllm', fullName: 'vllm-project/vllm', author: 'vllm-project', description: '高吞吐量、低内存占用的 LLM 推理和服务引擎。', url: 'https://github.com/vllm-project/vllm', language: 'Python', stars: '55.3k', forks: '9.2k', starsRaw: 55300, forksRaw: 9200, topics: ['llm', 'inference', 'serving'] },
    { name: 'Dify', fullName: 'langgenius/dify', author: 'langgenius', description: '开源 LLM 应用开发平台，整合 AI 工作流、RAG、Agent 和模型管理。', url: 'https://github.com/langgenius/dify', language: 'TypeScript', stars: '98.2k', forks: '13.8k', starsRaw: 98200, forksRaw: 13800, topics: ['llm', 'rag', 'agent', 'workflow', 'ai-platform'] },
    { name: 'stable-diffusion-webui', fullName: 'AUTOMATIC1111/stable-diffusion-webui', author: 'AUTOMATIC1111', description: 'Stable Diffusion 的浏览器界面，用于 AI 图像生成。', url: 'https://github.com/AUTOMATIC1111/stable-diffusion-webui', language: 'Python', stars: '158k', forks: '29.8k', starsRaw: 158000, forksRaw: 29800, topics: ['stable-diffusion', 'image-generation', 'diffusion'] },
    { name: 'ComfyUI', fullName: 'comfyanonymous/ComfyUI', author: 'comfyanonymous', description: '最强大的模块化扩散模型 GUI 和后端，支持图/节点界面。', url: 'https://github.com/comfyanonymous/ComfyUI', language: 'Python', stars: '89.5k', forks: '8.9k', starsRaw: 89500, forksRaw: 8900, topics: ['stable-diffusion', 'diffusion', 'image-generation'] },
    { name: 'pytorch', fullName: 'pytorch/pytorch', author: 'pytorch', description: 'Python 中的张量和动态神经网络，支持强大的 GPU 加速。', url: 'https://github.com/pytorch/pytorch', language: 'Python', stars: '92.1k', forks: '25.1k', starsRaw: 92100, forksRaw: 25100, topics: ['pytorch', 'deep-learning', 'machine-learning'] },
    { name: 'ChatGPT-Next-Web', fullName: 'ChatGPTNextWeb/NextChat', author: 'ChatGPTNextWeb', description: '跨平台 ChatGPT/Gemini 界面（Web/PWA/Linux/Win/MacOS），一键部署私有 ChatGPT。', url: 'https://github.com/ChatGPTNextWeb/NextChat', language: 'TypeScript', stars: '86.3k', forks: '68.2k', starsRaw: 86300, forksRaw: 68200, topics: ['chatgpt', 'ai-tools', 'chatbot'] },
    { name: 'whisper', fullName: 'openai/whisper', author: 'openai', description: '通过大规模弱监督实现的鲁棒语音识别，通用语音识别模型。', url: 'https://github.com/openai/whisper', language: 'Python', stars: '82.5k', forks: '9.9k', starsRaw: 82500, forksRaw: 9900, topics: ['speech', 'whisper', 'speech-to-text', 'tts'] },
    { name: 'llama.cpp', fullName: 'ggml-org/llama.cpp', author: 'ggml-org', description: 'C/C++ 实现的 LLM 推理引擎，在本地和边缘设备上运行 LLM 的首选方案。', url: 'https://github.com/ggml-org/llama.cpp', language: 'C++', stars: '80.1k', forks: '11.8k', starsRaw: 80100, forksRaw: 11800, topics: ['llm', 'inference', 'ggml', 'quantization'] },
    { name: 'llama-index', fullName: 'run-llama/llama_index', author: 'run-llama', description: 'LLM 应用的数据框架，将自定义数据源连接到大型语言模型。', url: 'https://github.com/run-llama/llama_index', language: 'Python', stars: '42.3k', forks: '6.1k', starsRaw: 42300, forksRaw: 6100, topics: ['llm', 'rag', 'embedding', 'vector-database'] },
    { name: 'CrewAI', fullName: 'crewAIInc/crewAI', author: 'crewAIInc', description: '用于编排角色扮演式自主 AI Agent 的框架，赋能 Agent 无缝协作。', url: 'https://github.com/crewAIInc/crewAI', language: 'Python', stars: '32.5k', forks: '4.2k', starsRaw: 32500, forksRaw: 4200, topics: ['agent', 'multi-agent', 'orchestration'] },
    { name: 'OpenHands', fullName: 'All-Hands-AI/OpenHands', author: 'All-Hands-AI', description: '少写代码，多创造。AI 驱动的软件工程 Agent。', url: 'https://github.com/All-Hands-AI/OpenHands', language: 'Python', stars: '58.3k', forks: '6.5k', starsRaw: 58300, forksRaw: 6500, topics: ['agent', 'ai-engineer', 'code-generation'] },
    { name: 'Aider', fullName: 'aider-ai/aider', author: 'aider-ai', description: '命令行 AI 结对编程工具，支持 GPT/Claude 直接编辑本地 Git 仓库中的代码。', url: 'https://github.com/aider-ai/aider', language: 'Python', stars: '40.2k', forks: '5.8k', starsRaw: 40200, forksRaw: 5800, topics: ['ai-tools', 'code-generation', 'gpt'] },
    { name: 'Milvus', fullName: 'milvus-io/milvus', author: 'milvus-io', description: '云原生向量数据库，为下一代 AI 应用而构建的十亿级向量搜索存储引擎。', url: 'https://github.com/milvus-io/milvus', language: 'Go', stars: '35.2k', forks: '3.5k', starsRaw: 35200, forksRaw: 3500, topics: ['vector-database', 'embedding', 'rag'] },
    { name: 'stable-diffusion', fullName: 'Stability-AI/stablediffusion', author: 'Stability-AI', description: '使用潜在扩散模型进行高分辨率图像合成，Stable Diffusion 原始模型。', url: 'https://github.com/Stability-AI/stablediffusion', language: 'Python', stars: '42.6k', forks: '5.4k', starsRaw: 42600, forksRaw: 5400, topics: ['stable-diffusion', 'diffusion', 'image-generation'] },
    { name: 'OpenAI-Cookbook', fullName: 'openai/openai-cookbook', author: 'openai', description: 'OpenAI API 使用示例和指南，涵盖提示工程、嵌入、微调等内容。', url: 'https://github.com/openai/openai-cookbook', language: 'MDX', stars: '65.1k', forks: '10.6k', starsRaw: 65100, forksRaw: 10600, topics: ['openai', 'gpt', 'prompt-engineering'] },
    { name: 'ChatGPT-on-WeChat', fullName: 'zhayujie/chatgpt-on-wechat', author: 'zhayujie', description: '基于大模型搭建的聊天机器人，支持微信、企业微信、飞书、钉钉等平台接入。', url: 'https://github.com/zhayujie/chatgpt-on-wechat', language: 'Python', stars: '38.2k', forks: '10.5k', starsRaw: 38200, forksRaw: 10500, topics: ['chatgpt', 'wechat', 'chatbot', 'ai-tools'] },
    { name: 'TensorFlow', fullName: 'tensorflow/tensorflow', author: 'tensorflow', description: '面向所有人的开源机器学习框架，构建和部署 ML 模型的核心平台。', url: 'https://github.com/tensorflow/tensorflow', language: 'C++', stars: '190k', forks: '75.1k', starsRaw: 190000, forksRaw: 75100, topics: ['tensorflow', 'machine-learning', 'deep-learning'] },
    { name: 'gpt4all', fullName: 'nomic-ai/gpt4all', author: 'nomic-ai', description: '在任何设备上运行本地 LLM，开源且允许商业使用。', url: 'https://github.com/nomic-ai/gpt4all', language: 'C++', stars: '77.3k', forks: '8.5k', starsRaw: 77300, forksRaw: 8500, topics: ['llm', 'gpt', 'local', 'chatbot'] },
    { name: 'AutoGPT', fullName: 'Significant-Gravitas/AutoGPT', author: 'Significant-Gravitas', description: '让 AI 触手可及的愿景，自主 AI Agent 框架。', url: 'https://github.com/Significant-Gravitas/AutoGPT', language: 'Python', stars: '176k', forks: '47.2k', starsRaw: 176000, forksRaw: 47200, topics: ['agent', 'autonomous', 'autogpt'] },
    { name: 'langgraph', fullName: 'langchain-ai/langgraph', author: 'langchain-ai', description: '以图结构构建弹性语言 Agent，创建有状态、多角色的 LLM 应用框架。', url: 'https://github.com/langchain-ai/langgraph', language: 'Python', stars: '22.8k', forks: '3.3k', starsRaw: 22800, forksRaw: 3300, topics: ['agent', 'langgraph', 'workflow', 'multi-agent'] },
    { name: 'DiffSynth-Studio', fullName: 'modelscope/DiffSynth-Studio', author: 'modelscope', description: '享受扩散模型的魔力！图像与视频生成、编辑和增强的一站式解决方案。', url: 'https://github.com/modelscope/DiffSynth-Studio', language: 'Python', stars: '12.5k', forks: '1.3k', starsRaw: 12500, forksRaw: 1300, topics: ['diffusion', 'image-generation', 'video-generation', 'multimodal'] },
    { name: 'MiniMax-01', fullName: 'MiniMax-AI/MiniMax-01', author: 'MiniMax-AI', description: '拥有 400 万 Token 上下文窗口和闪电注意力机制的大语言模型。', url: 'https://github.com/MiniMax-AI/MiniMax-01', language: 'Python', stars: '8.9k', forks: '0.9k', starsRaw: 8900, forksRaw: 900, topics: ['llm', 'language-model', 'transformer'] },
    { name: 'Qwen-Agent', fullName: 'QwenLM/Qwen-Agent', author: 'QwenLM', description: '基于 Qwen 的 Agent 框架，支持函数调用、代码解释器、RAG 和 Chrome 扩展。', url: 'https://github.com/QwenLM/Qwen-Agent', language: 'Python', stars: '10.2k', forks: '1.2k', starsRaw: 10200, forksRaw: 1200, topics: ['agent', 'qwen', 'function-calling', 'rag'] },
    { name: 'browser-use', fullName: 'browser-use/browser-use', author: 'browser-use', description: '让网站对 AI Agent 可访问，AI Agent 的开源浏览器自动化工具。', url: 'https://github.com/browser-use/browser-use', language: 'Python', stars: '28.5k', forks: '3.1k', starsRaw: 28500, forksRaw: 3100, topics: ['agent', 'browser', 'automation', 'ai'] },
    { name: 'FastGPT', fullName: 'labring/FastGPT', author: 'labring', description: '基于 LLM 的知识库平台，提供开箱即用的数据处理和模型调用能力。', url: 'https://github.com/labring/FastGPT', language: 'TypeScript', stars: '26.3k', forks: '6.8k', starsRaw: 26300, forksRaw: 6800, topics: ['rag', 'knowledge-base', 'llm', 'ai-platform'] },
  ];

  return repos
    .sort((a, b) => b.starsRaw - a.starsRaw)
    .map((r, i) => ({
      ...r,
      rank: i + 1,
      currentPeriodStars: '',
      builtBy: [],
      languageColor: '',
      aiCategory: classifyAIRepo(r),
    }))
    .filter(isAIRepo);
}
