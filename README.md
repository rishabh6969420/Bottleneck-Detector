# Bottleneck-Detector

**Institutional Intelligence & Explainable Diagnostic Platform for Colleges and Corporate Enterprises.**

The **Invisible Bottleneck Detector** transforms application and workflow monitoring from passive metric graphs into an explainable, actionable diagnostic intelligence platform. It systematically identifies technical friction (application latency, database contention, network bottlenecks) and operational friction (sequential approval stalls, handoff ping-pong, and queue dwell times).

---

## Key Features

- **Dual-Domain Bottleneck Diagnostics**: Supports both digital/computer processes and offline paper/ledger workflows.
- **5-Question Diagnostic Framework**:
  1. *What is the problem?* (Component & boundary localization)
  2. *What is the evidence?* (OpenTelemetry traces, metrics, queue dwell timestamps)
  3. *What is the likely cause?* (Ranked probabilistic hypotheses with calibrated uncertainty)
  4. *What should we do next?* (Prescriptive operational & engineering remediations)
  5. *Did it work?* (Automated pre/post workload validation benchmarks)
- **Interactive Workflow Adder**: Build custom process sequences step-by-step with work name, description, sender, receiver, destination, and duration.
- **Automated Bottleneck Detection**: Pinpoints primary and secondary bottlenecks with visual proportional latency timeline bars.
- **Zero-Knowledge Multi-Tenancy**: Designed from first principles to ensure zero employee surveillance, zero message content collection, and strict institutional tenant data isolation.

---

## Tech Stack

- **Frontend**: HTML5, Vanilla CSS3 (San Francisco font, Pure Black theme), JavaScript (ES6+)
- **Backend & APIs**: Python 3, FastAPI
- **Metrics & Tracing**: Prometheus, OpenTelemetry
- **Inference & Baselines**: pandas, NumPy, scikit-learn
- **Database & Storage**: PostgreSQL (with Row-Level Security), TimescaleDB
- **Asynchronous Workers**: Celery, Redis
- **Deployment**: Docker & Docker Compose

---

## Local Setup & Quick Start

1. Clone the repository:
   ```bash
   git clone https://github.com/rishabh6969420/Bottleneck-Detector.git
   cd Bottleneck-Detector
   ```

2. Start the local presentation server:
   ```bash
   python3 -m http.server 3000
   ```

3. Open your browser:
   ```
   http://localhost:3000/
   ```

---

## License

MIT License &copy; 2026 Invisible Bottleneck Detector
