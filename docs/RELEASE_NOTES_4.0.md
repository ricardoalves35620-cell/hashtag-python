# Hashtag Python 4.0 — Local AI Path

## Purpose

Version 4.0 completes the optional specialization that begins only after the deep Python core. It teaches the concepts, engineering decisions and local architecture required to build a realistic private AI application without depending on paid external AI APIs.

This release does **not** claim that a browser can train or run every serious model. Browser-safe exercises run in Pyodide. Lessons that need PyTorch, native packages, GPU access or a local model runtime are explicitly marked as desktop practice.

## Published phases

### Data and machine learning — phases 54–60

- vectors, matrices, gradients and numerical reasoning;
- NumPy arrays and vectorized work;
- Pandas, missing values and data-quality contracts;
- statistics, baselines and evaluation metrics;
- train/validation/test workflow and leakage prevention;
- regression;
- classification and reproducible pipelines.

### Neural networks and language — phases 61–64

- a neural network built from first principles;
- PyTorch training-system concepts;
- tokenization and embeddings;
- attention and transformer reasoning.

### Local AI engineering — phases 65–68

- open models, licenses, GGUF and quantization;
- local inference and tool boundaries;
- local embeddings, retrieval and RAG with citations;
- capstone: a private local document copilot.

## Local AI Lab

The new lab includes:

- a RAM/VRAM-based model-range planner;
- a quantized weight-memory calculator;
- a visual local-RAG architecture;
- a release-evidence checklist;
- explicit privacy and offline constraints.

The estimates are planning aids, not hardware guarantees. Runtime memory also depends on context length, KV cache, implementation, operating system and other processes.

## Runtime changes

The isolated Python worker now calls `loadPackagesFromImports` before executable lessons. This allows browser exercises using packages supplied by Pyodide, such as NumPy and Pandas, to load automatically.

## Curriculum integrity

- 69 consecutive phases, from 0 through 68;
- 54 phases in the mandatory Python spine;
- 15 phases in the optional local-AI path;
- AI skills integrated into mastery and spaced review;
- all roadmap stages marked with their real published phase ranges;
- curriculum tests verify phase continuity and stage counts.

## Boundaries

The web application provides instruction, verified browser exercises, planning laboratories and project rubrics. Native execution of PyTorch, `llama.cpp`, Ollama or another local runtime still requires a desktop Python environment and suitable hardware. A future desktop runner may automate that setup, but the curriculum does not depend on a paid hosted AI provider.
