/**
 * Invisible Bottleneck Detector
 * Interactive UI Controller: Stepper, ScrollSpy, and Manual Workflow Adder & Diagnostic Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initStepper();
  initScrollSpy();
  initWorkflowAdder();
});

/**
 * 5-Question Framework Interactive Stepper
 */
function initStepper() {
  const stepButtons = document.querySelectorAll('.step-btn');
  const stepPanels = document.querySelectorAll('.step-panel');

  if (!stepButtons.length || !stepPanels.length) return;

  stepButtons.forEach((button) => {
    button.addEventListener('click', () => {
      const targetStep = button.getAttribute('data-step');

      // Update button active state
      stepButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');

      // Update panel visibility
      stepPanels.forEach((panel) => {
        panel.classList.remove('active');
        if (panel.id === `step-panel-${targetStep}`) {
          panel.classList.add('active');
        }
      });
    });
  });

  // Keyboard navigation support for accessibility (Arrow Left / Arrow Right)
  const navContainer = document.querySelector('.stepper-nav');
  if (navContainer) {
    navContainer.addEventListener('keydown', (e) => {
      const activeBtn = document.querySelector('.step-btn.active');
      if (!activeBtn) return;

      const buttons = Array.from(stepButtons);
      const currentIndex = buttons.indexOf(activeBtn);

      if (e.key === 'ArrowRight' && currentIndex < buttons.length - 1) {
        buttons[currentIndex + 1].click();
        buttons[currentIndex + 1].focus();
      } else if (e.key === 'ArrowLeft' && currentIndex > 0) {
        buttons[currentIndex - 1].click();
        buttons[currentIndex - 1].focus();
      }
    });
  }
}

/**
 * Active Navigation Link Tracker via IntersectionObserver
 */
function initScrollSpy() {
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('section[id]');

  if (!navLinks.length || !sections.length) return;

  const observerOptions = {
    root: null,
    rootMargin: '-20% 0px -70% 0px',
    threshold: 0
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach((link) => {
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          } else {
            link.classList.remove('active');
          }
        });
      }
    });
  }, observerOptions);

  sections.forEach((section) => observer.observe(section));
}

/**
 * ==========================================================================
 * Manual Workflow Adder & Bottleneck Diagnostic Engine
 * ==========================================================================
 */
function initWorkflowAdder() {
  const form = document.getElementById('workflow-step-form');
  const addStepBtn = document.getElementById('add-step-btn');
  const clearFormBtn = document.getElementById('clear-form-btn');
  const resetWorkflowBtn = document.getElementById('reset-workflow-btn');
  const analyzeBtn = document.getElementById('analyze-bottlenecks-btn');

  const stepsListEl = document.getElementById('workflow-steps-list');
  const emptyStateEl = document.getElementById('workflow-empty-state');
  const controlsBarEl = document.getElementById('workflow-controls-bar');
  const stepsCounterEl = document.getElementById('steps-counter');
  const leadTimeDisplayEl = document.getElementById('total-lead-time-display');
  const resultsContainer = document.getElementById('bottleneck-analysis-results');

  // Input Elements
  const workInput = document.getElementById('step-work');
  const descInput = document.getElementById('step-desc');
  const senderInput = document.getElementById('step-sender');
  const receiverInput = document.getElementById('step-receiver');
  const destinationInput = document.getElementById('step-destination');
  const modalityInput = document.getElementById('step-modality');
  const durationValInput = document.getElementById('step-duration-val');
  const durationUnitInput = document.getElementById('step-duration-unit');

  // In-memory workflow state
  let workflowSteps = [];

  // Helper: Standardize any duration into fractional minutes
  function convertToMinutes(val, unit) {
    const num = parseFloat(val);
    if (isNaN(num) || num <= 0) return 0;
    switch (unit) {
      case 'seconds': return num / 60;
      case 'minutes': return num;
      case 'hours': return num * 60;
      case 'days': return num * 1440;
      default: return num;
    }
  }

  // Helper: Format minutes into human-readable duration string
  function formatMinutes(minutes) {
    if (minutes < 1) {
      const sec = Math.round(minutes * 60);
      return `${sec} sec${sec !== 1 ? 's' : ''}`;
    }
    if (minutes < 60) {
      const m = Math.round(minutes * 10) / 10;
      return `${m} min${m !== 1 ? 's' : ''}`;
    }
    if (minutes < 1440) {
      const hrs = Math.round((minutes / 60) * 10) / 10;
      return `${hrs} hr${hrs !== 1 ? 's' : ''}`;
    }
    const days = Math.round((minutes / 1440) * 10) / 10;
    return `${days} day${days !== 1 ? 's' : ''}`;
  }

  // Render the current state of added workflow steps
  function renderWorkflowList() {
    if (workflowSteps.length === 0) {
      emptyStateEl.style.display = 'flex';
      stepsListEl.style.display = 'none';
      controlsBarEl.style.display = 'none';
      stepsCounterEl.textContent = '0 Steps Added';
      resultsContainer.style.display = 'none';
      return;
    }

    emptyStateEl.style.display = 'none';
    stepsListEl.style.display = 'flex';
    controlsBarEl.style.display = 'flex';

    stepsCounterEl.textContent = `${workflowSteps.length} Step${workflowSteps.length !== 1 ? 's' : ''} in Sequence`;

    // Compute cumulative lead time
    const totalMinutes = workflowSteps.reduce((acc, s) => acc + s.durationInMinutes, 0);
    leadTimeDisplayEl.textContent = formatMinutes(totalMinutes);

    // Render step items
    stepsListEl.innerHTML = '';
    workflowSteps.forEach((step, index) => {
      const itemEl = document.createElement('div');
      itemEl.className = 'workflow-step-item';

      const modalityLabels = {
        digital: 'Computer / Digital',
        offline: 'Offline / Paper',
        hybrid: 'Hybrid / Counter'
      };

      itemEl.innerHTML = `
        <div class="step-item-top">
          <div class="step-badges-group">
            <span class="step-seq-pill">Step ${String(index + 1).padStart(2, '0')}</span>
            <span class="step-modality-pill ${step.modality}">${modalityLabels[step.modality]}</span>
          </div>
          <button type="button" class="btn-delete-step" data-id="${step.id}" title="Remove Step" aria-label="Remove Step">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>
        </div>

        <div class="step-work-title">${escapeHtml(step.work)}</div>
        <div class="step-desc-snippet">${escapeHtml(step.desc)}</div>

        <div class="step-routing-row">
          <div class="step-route-nodes">
            <span>From:</span> <span class="node-chip">${escapeHtml(step.sender)}</span>
            <span class="route-arrow">&rarr;</span>
            <span>To:</span> <span class="node-chip">${escapeHtml(step.receiver)}</span>
            <span class="route-arrow">&rarr;</span>
            <span>Dest:</span> <span class="node-chip">${escapeHtml(step.destination)}</span>
          </div>
          <div class="step-duration-chip">
            ${step.rawDuration} ${step.durationUnit} (${formatMinutes(step.durationInMinutes)})
          </div>
        </div>
      `;

      stepsListEl.appendChild(itemEl);
    });

    // Wire up delete buttons
    stepsListEl.querySelectorAll('.btn-delete-step').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const id = btn.getAttribute('data-id');
        workflowSteps = workflowSteps.filter((s) => s.id !== id);
        renderWorkflowList();
        if (workflowSteps.length >= 2 && resultsContainer.style.display !== 'none') {
          analyzeWorkflow();
        } else {
          resultsContainer.style.display = 'none';
        }
      });
    });
  }

  // Handle Form Submission / Add Step
  function handleAddStep(e) {
    if (e) e.preventDefault();

    const work = workInput.value.trim();
    const desc = descInput.value.trim();
    const sender = senderInput.value.trim();
    const receiver = receiverInput.value.trim();
    const destination = destinationInput.value.trim();
    const modality = modalityInput.value;
    const rawDuration = parseFloat(durationValInput.value);
    const durationUnit = durationUnitInput.value;

    if (!work || !desc || !sender || !receiver || !destination || isNaN(rawDuration) || rawDuration <= 0) {
      alert('Please fill out all required fields with valid values.');
      return;
    }

    const durationInMinutes = convertToMinutes(rawDuration, durationUnit);

    const newStep = {
      id: 'step_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
      work,
      desc,
      sender,
      receiver,
      destination,
      modality,
      rawDuration,
      durationUnit,
      durationInMinutes
    };

    workflowSteps.push(newStep);
    renderWorkflowList();

    // Reset input fields
    workInput.value = '';
    descInput.value = '';
    senderInput.value = '';
    receiverInput.value = '';
    destinationInput.value = '';
    durationValInput.value = '';
    workInput.focus();

    // If analysis was already active, refresh it
    if (workflowSteps.length >= 2 && resultsContainer.style.display !== 'none') {
      analyzeWorkflow();
    }
  }

  // Clear Form Fields
  clearFormBtn.addEventListener('click', () => {
    workInput.value = '';
    descInput.value = '';
    senderInput.value = '';
    receiverInput.value = '';
    destinationInput.value = '';
    durationValInput.value = '';
    workInput.focus();
  });

  // Reset Entire Workflow
  resetWorkflowBtn.addEventListener('click', () => {
    if (workflowSteps.length > 0 && confirm('Are you sure you want to clear all steps in this workflow?')) {
      workflowSteps = [];
      renderWorkflowList();
      resultsContainer.style.display = 'none';
    }
  });

  // Add Step Trigger
  addStepBtn.addEventListener('click', handleAddStep);
  form.addEventListener('submit', handleAddStep);

  // Analyze Workflow & Pinpoint Bottleneck
  analyzeBtn.addEventListener('click', analyzeWorkflow);

  function analyzeWorkflow() {
    if (workflowSteps.length < 2) {
      alert('Please add at least 2 process steps to compare execution times and detect bottlenecks.');
      return;
    }

    const totalMinutes = workflowSteps.reduce((acc, s) => acc + s.durationInMinutes, 0);
    const avgMinutes = totalMinutes / workflowSteps.length;

    // Find the primary bottleneck (step with maximum duration)
    let maxStep = workflowSteps[0];
    workflowSteps.forEach((step) => {
      if (step.durationInMinutes > maxStep.durationInMinutes) {
        maxStep = step;
      }
    });

    const maxStepIndex = workflowSteps.findIndex((s) => s.id === maxStep.id);
    const bottleneckPercent = ((maxStep.durationInMinutes / totalMinutes) * 100).toFixed(1);
    const varianceFactor = (maxStep.durationInMinutes / avgMinutes).toFixed(1);

    // Check for ping-pong routing
    let pingPongDetected = false;
    let pingPongDetail = '';
    for (let i = 1; i < workflowSteps.length; i++) {
      const prev = workflowSteps[i - 1];
      const curr = workflowSteps[i];
      if (
        curr.sender.toLowerCase() === prev.receiver.toLowerCase() &&
        curr.receiver.toLowerCase() === prev.sender.toLowerCase()
      ) {
        pingPongDetected = true;
        pingPongDetail = `Step ${i} and Step ${i + 1} exhibit a cross-departmental ping-pong loop between [${prev.sender}] and [${prev.receiver}].`;
        break;
      }
    }

    // Severity assessment
    let severityClass = 'critical';
    let severityLabel = 'Critical Bottleneck Drag';
    if (bottleneckPercent < 35) {
      severityClass = 'elevated';
      severityLabel = 'Moderate Latency Concentration';
    }

    // Render results view
    resultsContainer.innerHTML = `
      <div class="results-header-wrap">
        <div>
          <div class="results-eyebrow">Diagnostic Core Assessment</div>
          <h3 class="results-title">Workflow Bottleneck Analysis &amp; Prevention Report</h3>
        </div>
        <button type="button" id="copy-report-btn" class="btn-copy-report">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
          <span>Copy Full Diagnostic Report</span>
        </button>
      </div>

      <!-- KPI Grid -->
      <div class="results-kpi-grid">
        <div class="kpi-card">
          <span class="kpi-label">Total Lead Time</span>
          <span class="kpi-value">${formatMinutes(totalMinutes)}</span>
          <span class="kpi-caption">Sum across ${workflowSteps.length} stages</span>
        </div>

        <div class="kpi-card highlight">
          <span class="kpi-label">Primary Bottleneck</span>
          <span class="kpi-value">Step ${String(maxStepIndex + 1).padStart(2, '0')}</span>
          <span class="kpi-caption">${escapeHtml(maxStep.work)}</span>
        </div>

        <div class="kpi-card highlight">
          <span class="kpi-label">Lead Time Share</span>
          <span class="kpi-value">${bottleneckPercent}%</span>
          <span class="kpi-caption">${varianceFactor}x above step average</span>
        </div>

        <div class="kpi-card">
          <span class="kpi-label">Average Step Duration</span>
          <span class="kpi-value">${formatMinutes(avgMinutes)}</span>
          <span class="kpi-caption">Normative baseline</span>
        </div>
      </div>

      <!-- Latency Distribution Proportional Timeline -->
      <div class="timeline-viz-card">
        <h4>Proportional Latency Distribution</h4>
        <p>Visual breakdown of elapsed duration across the entire workflow sequence.</p>

        <div class="latency-bar-container">
          ${workflowSteps.map((s, idx) => {
            const share = ((s.durationInMinutes / totalMinutes) * 100).toFixed(1);
            const isBottleneck = s.id === maxStep.id;
            const segmentClass = isBottleneck ? 'bottleneck-segment' : `normal-segment-${idx % 4}`;
            return `
              <div class="latency-bar-segment ${segmentClass}" style="width: ${share}%;" title="Step ${idx + 1}: ${escapeHtml(s.work)} - ${formatMinutes(s.durationInMinutes)} (${share}%)">
                ${share > 7 ? `Step ${idx + 1} (${share}%)` : (share > 3 ? `${idx + 1}` : '')}
              </div>
            `;
          }).join('')}
        </div>

        <div class="timeline-legend">
          <div class="legend-item">
            <span class="legend-color-dot bottleneck-dot"></span>
            <span>Step ${maxStepIndex + 1}: Primary Bottleneck (${bottleneckPercent}% of total)</span>
          </div>
          <div class="legend-item">
            <span class="legend-color-dot normal-dot"></span>
            <span>Other Sequence Steps</span>
          </div>
        </div>
      </div>

      <!-- Process Sequence Flow Cards -->
      <div class="process-flow-chain">
        ${workflowSteps.map((s, idx) => {
          const isBottleneck = s.id === maxStep.id;
          const share = ((s.durationInMinutes / totalMinutes) * 100).toFixed(1);
          let badgeStatus = 'optimal';
          let badgeText = 'Normal';
          if (isBottleneck) {
            badgeStatus = 'critical';
            badgeText = 'CRITICAL BOTTLENECK';
          } else if (s.durationInMinutes > avgMinutes * 1.25) {
            badgeStatus = 'elevated';
            badgeText = 'Elevated Latency';
          }

          return `
            <div class="flow-node-card ${isBottleneck ? 'bottleneck-highlight' : ''}">
              <div class="flow-node-top">
                <span class="step-seq-pill">Step ${String(idx + 1).padStart(2, '0')}</span>
                <span class="flow-status-badge ${badgeStatus}">${badgeText}</span>
              </div>
              <div class="flow-node-title">${escapeHtml(s.work)}</div>
              <div class="flow-node-meta">
                <span><strong>From:</strong> ${escapeHtml(s.sender)}</span>
                <span><strong>To:</strong> ${escapeHtml(s.receiver)}</span>
                <span><strong>Dest:</strong> ${escapeHtml(s.destination)}</span>
              </div>
              <div class="flow-node-footer">
                <span class="flow-duration-text">${formatMinutes(s.durationInMinutes)}</span>
                <span class="flow-percent-text">${share}% share</span>
              </div>
            </div>
          `;
        }).join('')}
      </div>

      <!-- The 5-Question Prevention Protocol -->
      <div class="prevention-protocol-wrap">
        <div class="protocol-header">
          <h3 class="protocol-title">Explainable 5-Question Diagnostic &amp; Prevention Suite</h3>
          <p class="protocol-desc">Detailed root cause synthesis and prescriptive engineering/operational playbooks to prevent recurrence.</p>
        </div>

        <div class="five-q-container">
          <!-- Q1: Problem -->
          <div class="five-q-card">
            <div class="five-q-top">
              <span class="five-q-num-pill">01</span>
              <h4 class="five-q-stage-title">What is the problem?</h4>
            </div>
            <div class="five-q-content">
              The primary systemic bottleneck is concentrated at <strong>Step ${maxStepIndex + 1}: ${escapeHtml(maxStep.work)}</strong>.
              This single stage consumes <strong>${formatMinutes(maxStep.durationInMinutes)}</strong> out of the total <strong>${formatMinutes(totalMinutes)}</strong> workflow cycle time (<strong>${bottleneckPercent}%</strong> of total duration). The handover from sender <strong>[${escapeHtml(maxStep.sender)}]</strong> to receiver <strong>[${escapeHtml(maxStep.receiver)}]</strong> heading toward <strong>[${escapeHtml(maxStep.destination)}]</strong> represents the single largest drag on organizational throughput.
            </div>
          </div>

          <!-- Q2: Evidence -->
          <div class="five-q-card">
            <div class="five-q-top">
              <span class="five-q-num-pill">02</span>
              <h4 class="five-q-stage-title">What is the evidence?</h4>
            </div>
            <div class="five-q-content">
              Mathematical proof extracted from the workflow execution timeline:
              <ul class="five-q-bullets">
                <li><strong>Elapsed Step Duration:</strong> ${formatMinutes(maxStep.durationInMinutes)} (${maxStep.rawDuration} ${maxStep.durationUnit}).</li>
                <li><strong>Baseline Deviation:</strong> The bottleneck step takes <strong>${varianceFactor}x longer</strong> than the workflow average step duration of ${formatMinutes(avgMinutes)}.</li>
                <li><strong>Lead Time Footprint:</strong> ${bottleneckPercent}% of all elapsed cycle time is spent waiting on or processing this single step.</li>
                <li><strong>Execution Medium:</strong> Classified as <em>${maxStep.modality.toUpperCase()}</em> process.</li>
                ${pingPongDetected ? `<li><strong>Handoff Loop Anomaly:</strong> ${pingPongDetail}</li>` : ''}
              </ul>
            </div>
          </div>

          <!-- Q3: Cause -->
          <div class="five-q-card">
            <div class="five-q-top">
              <span class="five-q-num-pill">03</span>
              <h4 class="five-q-stage-title">What is the likely cause?</h4>
            </div>
            <div class="five-q-content">
              ${getCauseDiagnosis(maxStep, pingPongDetected, varianceFactor)}
            </div>
          </div>

          <!-- Q4: Prevention Playbook -->
          <div class="five-q-card">
            <div class="five-q-top">
              <span class="five-q-num-pill">04</span>
              <h4 class="five-q-stage-title">Ways to prevent this bottleneck in the future</h4>
            </div>
            <div class="five-q-content">
              To eliminate this latency concentration, apply the following prescriptive mitigations:
              <ul class="five-q-bullets">
                ${getPreventionSteps(maxStep, avgMinutes, pingPongDetected)}
              </ul>
            </div>
          </div>

          <!-- Q5: Fix Validation -->
          <div class="five-q-card">
            <div class="five-q-top">
              <span class="five-q-num-pill">05</span>
              <h4 class="five-q-stage-title">Did it work? (Validation Protocol)</h4>
            </div>
            <div class="five-q-content">
              To statistically verify that your preventative intervention eliminated the bottleneck:
              <ul class="five-q-bullets">
                <li><strong>Target SLA Threshold:</strong> Set an institutional SLA target for Step ${maxStepIndex + 1} at <strong>&le; ${formatMinutes(avgMinutes * 1.2)}</strong> (a ${Math.round((1 - (avgMinutes * 1.2) / maxStep.durationInMinutes) * 100)}% latency reduction).</li>
                <li><strong>Lead Time Share Ceiling:</strong> Upon re-execution, Step ${maxStepIndex + 1} must consume <strong>less than 25%</strong> of the total lead time.</li>
                <li><strong>Verification Rerun:</strong> Re-execute the workflow with the preventative controls in place and compare pre- and post-fix duration distributions to confirm that total cycle time decreases without transferring friction to downstream nodes.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    `;

    resultsContainer.style.display = 'block';

    // Wire up Copy Report button
    const copyBtn = document.getElementById('copy-report-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => {
        const reportText = generatePlainTextReport(workflowSteps, maxStep, maxStepIndex, totalMinutes, avgMinutes, bottleneckPercent, varianceFactor, pingPongDetected, pingPongDetail);
        navigator.clipboard.writeText(reportText).then(() => {
          const originalHTML = copyBtn.innerHTML;
          copyBtn.innerHTML = `
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="20 6 9 17 4 12"></polyline></svg>
            <span>Report Copied to Clipboard!</span>
          `;
          setTimeout(() => {
            copyBtn.innerHTML = originalHTML;
          }, 2500);
        }).catch(() => {
          alert('Report copied to clipboard.');
        });
      });
    }

    // Smooth scroll down to results
    resultsContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  // Diagnostic deduction based on modality and handoff characteristics
  function getCauseDiagnosis(step, hasPingPong, variance) {
    if (step.modality === 'offline') {
      return `
        <strong>Physical / Paper Process Friction:</strong> Because this step is performed offline on paper/pages, latency is predominantly driven by 
        <em>physical transit delays, physical document dwell in incoming trays, manual stamp/signatory gatekeepers, and the absence of real-time milestone notifications</em>.
        Without digital tracking, the request remains dormant between physical desks until manually retrieved.
      `;
    }
    if (step.modality === 'digital') {
      return `
        <strong>Digital Queue Stagnation or Synchronous Blocking:</strong> The task is stalling either in an unnotified digital inbox awaiting manual human intervention, 
        or due to <em>synchronous dependency blocking</em> (e.g., database lock contention, unindexed query execution, thread starvation, or missing automated routing).
      `;
    }
    if (hasPingPong) {
      return `
        <strong>Cross-Department Routing Ambiguity:</strong> A handoff loop was identified where the request is passed back and forth between sender and receiver. 
        This is typically caused by <em>unclear submission requirements, incomplete preliminary documentation, or conflicting approval policies</em>.
      `;
    }
    return `
      <strong>Single-Point-of-Failure Contention:</strong> Receiver <strong>[${escapeHtml(step.receiver)}]</strong> represents an oversubscribed node in the sequence. 
      Inbound request arrival rate exceeds processing capacity, creating an escalating queue buffer where items accumulate before active handling begins.
    `;
  }

  // Actionable preventative solutions
  function getPreventionSteps(step, avgMinutes, hasPingPong) {
    const list = [];

    // Operational Parallelization
    list.push(`
      <li><strong>Operational Parallelization:</strong> Decouple <em>"${escapeHtml(step.work)}"</em> from the sequential critical path. 
      If other downstream or lateral verification steps do not strictly require its completion, execute them concurrently rather than sequentially.</li>
    `);

    // Fallback & Delegation
    list.push(`
      <li><strong>Establish Fallback Signatories &amp; Delegation Rules:</strong> Institute an automated fallback handler for receiver <strong>[${escapeHtml(step.receiver)}]</strong>. 
      If a task remains unacted upon for more than ${formatMinutes(avgMinutes * 0.8)}, automatically escalate or delegate authorization to an alternate officer/node.</li>
    `);

    // Digitization / QR Tracking
    if (step.modality === 'offline' || step.modality === 'hybrid') {
      list.push(`
        <li><strong>Implement Checkpoint QR / Barcode Tracking:</strong> Attach a standardized routing cover sheet with a scannable barcode to the physical document. 
        Scanning upon intake and dispatch provides real-time timestamp visibility, eliminating hidden dwell time in office in-baskets.</li>
      `);
      list.push(`
        <li><strong>Convert to Digital Pre-Approval:</strong> Enable the sender <strong>[${escapeHtml(step.sender)}]</strong> to submit digital scans or forms in advance, 
        reserving physical desk visits solely for final collection or stamped archival.</li>
      `);
    } else {
      list.push(`
        <li><strong>Automated Asynchronous Queue &amp; Push Triggers:</strong> Replace passive inbox checking with automated webhook/push notifications dispatched to <strong>[${escapeHtml(step.receiver)}]</strong> 
        with strict time-to-first-action alerting.</li>
      `);
    }

    // Ping-Pong Prevention
    if (hasPingPong) {
      list.push(`
        <li><strong>Pre-Flight Checklist Enforcement:</strong> Implement a mandatory pre-submission completeness checklist at sender <strong>[${escapeHtml(step.sender)}]</strong> 
        to ensure that requests are never routed with missing attachments or ambiguous metadata.</li>
      `);
    }

    return list.join('');
  }

  // Plain Text Report Generator for Clipboard
  function generatePlainTextReport(steps, maxStep, maxIdx, totalMin, avgMin, pct, variance, hasPingPong, pingPongDetail) {
    return `
================================================================================
INVISIBLE BOTTLENECK DETECTOR — WORKFLOW DIAGNOSTIC & PREVENTION REPORT
================================================================================

1. EXECUTIVE SUMMARY
--------------------------------------------------------------------------------
- Total Workflow Lead Time : ${formatMinutes(totalMin)}
- Total Process Steps      : ${steps.length}
- Average Step Duration    : ${formatMinutes(avgMin)}
- Primary Bottleneck Node  : Step ${maxIdx + 1} ("${maxStep.work}")
- Bottleneck Lead Time %   : ${pct}% (${formatMinutes(maxStep.durationInMinutes)})
- Deviation from Average   : ${variance}x above workflow baseline

2. COMPLETE ASSEMBLED WORKFLOW SEQUENCE
--------------------------------------------------------------------------------
${steps.map((s, idx) => `Step ${idx + 1}: ${s.work}
  - Modality    : ${s.modality.toUpperCase()}
  - Description : ${s.desc}
  - Routing     : From [${s.sender}] -> To [${s.receiver}] -> Dest [${s.destination}]
  - Duration    : ${s.rawDuration} ${s.durationUnit} (${formatMinutes(s.durationInMinutes)})
  - Share       : ${((s.durationInMinutes / totalMin) * 100).toFixed(1)}% ${s.id === maxStep.id ? '[PRIMARY BOTTLENECK]' : ''}
`).join('\n')}

3. 5-QUESTION EXPLAINABLE DIAGNOSIS
--------------------------------------------------------------------------------
[Q1] What is the problem?
The primary systemic bottleneck is concentrated at Step ${maxIdx + 1}: "${maxStep.work}".
It consumes ${formatMinutes(maxStep.durationInMinutes)} (${pct}%) of the total ${formatMinutes(totalMin)} cycle time.
Sender: [${maxStep.sender}] | Receiver: [${maxStep.receiver}] | Destination: [${maxStep.destination}].

[Q2] What is the evidence?
- Duration: ${formatMinutes(maxStep.durationInMinutes)} (${maxStep.rawDuration} ${maxStep.durationUnit})
- Variance: ${variance}x greater than step average of ${formatMinutes(avgMin)}
- Process Modality: ${maxStep.modality.toUpperCase()}
${hasPingPong ? `- Handoff Loop: ${pingPongDetail}` : ''}

[Q3] What is the likely cause?
${maxStep.modality === 'offline' 
  ? 'Physical paper/ledger transit friction: Delay caused by un-notified physical tray dwell, manual signature queues, and lack of real-time milestone tracking.' 
  : 'Digital queue dwell or synchronous blocking: Request dwells unmonitored in an inbox, or synchronous execution dependencies prevent async throughput.'}

[Q4] Ways to prevent this bottleneck in the future:
1. Operational Parallelization: Decouple Step ${maxIdx + 1} to run concurrently with lateral steps.
2. Fallback Signatory & Delegation: Escalate if unacted upon after ${formatMinutes(avgMin * 0.8)}.
3. Milestone Tracking: Use QR/barcode checkpoint scans (for offline) or webhook alerts (for digital).
4. Intake Quality Control: Enforce pre-flight checklists to eliminate submission errors.

[Q5] Did it work? (Validation Protocol)
- Target Benchmark: Reduce Step ${maxIdx + 1} duration to <= ${formatMinutes(avgMin * 1.2)}.
- Target Share: Step duration must fall under 25% of total lead time upon re-measurement.
- Verification: Re-run identical workload to confirm latency eradication.

================================================================================
Generated by Invisible Bottleneck Detector · Institutional Intelligence Platform
================================================================================
    `.trim();
  }

  // HTML sanitization helper
  function escapeHtml(str) {
    if (!str) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
