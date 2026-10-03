import { LessonPlanData, Step3Exercise } from '@/types/lesson-plan';
import katex from 'katex';

export function generateStandaloneLessonPlanHTML(data: LessonPlanData, autoPrint: boolean = false): string {
  const {
    teacherInfo,
    generalInfo,
    objectives,
    materials,
    steps,
    assessment,
    selfReflection,
  } = data;

  const knowledgeList = objectives.knowledge
    .map((k) => `<li>${escapeHtml(k)}</li>`)
    .join('');
  const skillsList = objectives.skills
    .map((s) => `<li>${escapeHtml(s)}</li>`)
    .join('');
  const attitudeList = objectives.attitude
    .map((a) => `<li>${escapeHtml(a)}</li>`)
    .join('');

  const teacherMaterialsList = materials.teacherMaterials
    .map((m) => `<li>${escapeHtml(m)}</li>`)
    .join('');
  const studentMaterialsList = materials.studentMaterials
    .map((m) => `<li>${escapeHtml(m)}</li>`)
    .join('');

  // Step 3 activities rows
  const step3Rows = steps.step3
    .map((act, idx) => `
      <tr class="step3-subrow">
        <td class="col-teacher">${formatMathHtml(act.teacherActivity)}</td>
        <td class="col-step-content">
          <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-bottom: 6px;">
            <strong style="color: #0369a1;">សកម្មភាព ${idx + 1}</strong>
            <span class="badge-time">${escapeHtml(act.time)}</span>
          </div>
          <div class="activity-title"><strong>${escapeHtml(act.activityTitle)}</strong></div>
          <div class="content-text">${formatMathHtml(act.content)}</div>
          ${renderVisualHtml(act.imageUrl, act.imageCaption)}
        </td>
        <td class="col-student">
          ${formatMathHtml(act.studentActivity)}
          ${
            act.exercise
              ? `
            <div class="activity-single-exercise">
              <span class="ex-mini-tag">${escapeHtml(act.exercise.title)}</span>
              <div>${formatMathHtml(act.exercise.question)}</div>
            </div>
          `
              : ''
          }
        </td>
      </tr>
    `)
    .join('');

  return `<!DOCTYPE html>
<html lang="km">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>កិច្ចតែងការបង្រៀន - ${escapeHtml(generalInfo.subject)} - ${escapeHtml(generalInfo.subTopic || generalInfo.lessonTitle)}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;500;600;700&family=Moul&family=Siemreap&family=STIX+Two+Math&family=STIX+Two+Text:ital,wght@0,400..700;1,400..700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/katex@0.16.11/dist/katex.min.css">
  <style>
    :root {
      --primary-color: #0284c7;
      --border-color: #334155;
      --bg-header: #f1f5f9;
      --font-mathtype: 'Cambria Math', 'STIX Two Math', 'Times New Roman', serif;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      font-family: 'Kantumruy Pro', 'Siemreap', 'Khmer OS Battambang', 'Khmer OS Siemreap', 'Segoe UI', Tahoma, sans-serif;
      font-size: 13.5px;
      line-height: 1.6;
      color: #111827;
      background-color: #e2e8f0;
      padding: 20px;
    }
    /* MathType Typography Rules */
    .mathtype-formula,
    .mathtype-inline,
    .mathtype-block,
    .katex {
      font-family: var(--font-mathtype) !important;
      letter-spacing: 0.02em;
    }
    .mathtype-inline {
      display: inline-block;
      padding: 0 2px;
      vertical-align: -0.1em;
    }
    .mathtype-block {
      display: block;
      text-align: center;
      margin: 8px 0;
    }
    .katex .mathnormal {
      font-family: var(--font-mathtype) !important;
      font-style: italic !important;
    }
    .page-container {
      max-width: 900px;
      margin: 0 auto;
      background: #ffffff;
      padding: 40px 45px;
      box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
      border-radius: 8px;
    }
    .action-bar {
      max-width: 900px;
      margin: 0 auto 16px auto;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #1e293b;
      color: #ffffff;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
    }
    .action-bar h2 {
      font-size: 15px;
      font-weight: 600;
    }
    .action-buttons {
      display: flex;
      gap: 10px;
    }
    .btn {
      background-color: #0284c7;
      color: #ffffff;
      border: none;
      padding: 8px 16px;
      border-radius: 6px;
      cursor: pointer;
      font-family: inherit;
      font-size: 13px;
      font-weight: 500;
      display: inline-flex;
      align-items: center;
      gap: 6px;
      text-decoration: none;
      transition: background-color 0.2s;
    }
    .btn:hover {
      background-color: #0369a1;
    }
    .btn-secondary {
      background-color: #475569;
    }
    .btn-secondary:hover {
      background-color: #334155;
    }

    /* Official Header Styles */
    .official-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 25px;
    }
    .school-info {
      text-align: left;
    }
    .school-name {
      font-family: 'Moul', serif;
      font-size: 14.5px;
      color: #0f172a;
      line-height: 1.8;
    }
    .tech-team {
      font-size: 13px;
      font-weight: 600;
      color: #334155;
      margin-top: 2px;
    }
    .teacher-badge {
      font-size: 13px;
      color: #475569;
      margin-top: 2px;
    }
    .kingdom-motto {
      text-align: center;
    }
    .kingdom-title {
      font-family: 'Moul', serif;
      font-size: 15.5px;
      color: #0f172a;
      line-height: 1.8;
    }
    .kingdom-sub {
      font-family: 'Moul', serif;
      font-size: 13px;
      color: #0f172a;
      margin-top: 2px;
    }
    .motto-dots {
      letter-spacing: 4px;
      color: #64748b;
      margin-top: 2px;
      font-size: 12px;
    }

    /* Title Block */
    .document-title-block {
      text-align: center;
      margin: 25px 0 20px 0;
    }
    .document-title {
      font-family: 'Moul', serif;
      font-size: 22px;
      color: #0284c7;
      letter-spacing: 0.5px;
      text-shadow: 0 1px 2px rgba(2, 132, 199, 0.1);
    }
    .document-subtitle {
      font-size: 13px;
      color: #64748b;
      margin-top: 4px;
    }

    /* Metadata Table Grid */
    .meta-box {
      border: 1px solid #cbd5e1;
      background: #f8fafc;
      border-radius: 6px;
      padding: 12px 18px;
      margin-bottom: 25px;
      display: grid;
      grid-template-columns: 1fr 1fr;
      row-gap: 6px;
      column-gap: 20px;
      font-size: 13px;
    }
    .meta-item {
      display: flex;
      align-items: baseline;
    }
    .meta-label {
      font-weight: 700;
      color: #1e293b;
      min-width: 120px;
    }
    .meta-val {
      color: #334155;
    }

    /* Section Headings */
    .section-title {
      font-family: 'Moul', serif;
      font-size: 14.5px;
      color: #0f172a;
      border-bottom: 2px solid #0284c7;
      padding-bottom: 4px;
      margin: 25px 0 12px 0;
    }
    .sub-section-title {
      font-weight: 700;
      color: #0369a1;
      font-size: 13.5px;
      margin: 10px 0 4px 0;
    }
    ul.item-list {
      margin-left: 20px;
      margin-bottom: 12px;
    }
    ul.item-list li {
      margin-bottom: 4px;
      color: #1e293b;
    }

    /* Table Styles */
    .table-container {
      margin: 15px 0 25px 0;
      overflow-x: auto;
    }
    table.moeys-table {
      width: 100%;
      border-collapse: collapse;
      border: 1.5px solid #475569;
      font-size: 13px;
    }
    table.moeys-table th {
      background-color: #f1f5f9;
      color: #0f172a;
      font-weight: 700;
      padding: 10px 8px;
      border: 1px solid #64748b;
      text-align: center;
    }
    table.moeys-table td {
      border: 1px solid #94a3b8;
      padding: 10px 10px;
      vertical-align: top;
      color: #1e293b;
    }
    .col-teacher {
      width: 33%;
    }
    .col-step-content {
      width: 34%;
    }
    .col-student {
      width: 33%;
    }
    .text-center {
      text-align: center;
    }
    .badge-time {
      display: inline-block;
      margin-top: 4px;
      padding: 2px 8px;
      background: #e0f2fe;
      color: #0369a1;
      border-radius: 12px;
      font-size: 11px;
      font-weight: 600;
    }
    .step-main-header {
      background-color: #f0f9ff;
      border-top: 1.5px solid #0284c7;
      border-bottom: 1.5px solid #0284c7;
      padding: 8px 12px;
    }
    .activity-title {
      color: #0369a1;
      margin-bottom: 6px;
      font-size: 13px;
    }

    /* Visual Illustrations */
    .step-visual-box {
      margin-top: 8px;
      padding: 6px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      border-radius: 6px;
      text-align: center;
    }
    .step-visual-img {
      max-width: 100%;
      max-height: 160px;
      border-radius: 4px;
      display: block;
      margin: 0 auto;
    }
    .step-visual-caption {
      font-size: 12px;
      font-weight: 700;
      color: #0f172a;
      margin-top: 6px;
      padding: 3px 10px;
      background: #ffffff;
      border: 1.5px solid #94a3b8;
      border-radius: 4px;
      display: inline-block;
      box-shadow: 0 1px 2px rgba(0,0,0,0.05);
    }

    /* Exercises Box Styles */
    .exercise-box-card {
      margin-top: 10px;
      padding: 8px 12px;
      background: #fffbeb;
      border: 1px solid #fde68a;
      border-left: 4px solid #f59e0b;
      border-radius: 6px;
    }
    .exercise-box-title {
      font-weight: bold;
      color: #b45309;
      font-size: 12px;
      margin-bottom: 4px;
    }
    .exercise-box-list {
      margin-left: 16px;
      font-size: 12px;
      color: #334155;
    }
    .exercise-box-list li {
      margin-bottom: 4px;
    }

    /* Step 3 Exercises Container */
    .step3-ex-container {
      margin: 10px 0;
      padding: 12px 14px;
      background: #f0fdf4;
      border: 1.5px solid #86efac;
      border-radius: 8px;
    }
    .step3-ex-header {
      font-family: 'Kantumruy Pro', sans-serif;
      font-weight: bold;
      color: #15803d;
      font-size: 13px;
      margin-bottom: 8px;
      border-bottom: 1px dashed #86efac;
      padding-bottom: 4px;
    }
    .step3-ex-card {
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 6px;
      padding: 8px 12px;
      margin-bottom: 8px;
    }
    .step3-ex-card.pisa-card {
      background: #fffdf5;
      border: 1.5px solid #f59e0b;
      box-shadow: 0 1px 3px rgba(245, 158, 11, 0.15);
    }
    .step3-ex-title-row {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 4px;
    }
    .step3-ex-title {
      font-weight: bold;
      font-size: 12.5px;
      color: #1e293b;
    }
    .pisa-badge {
      background: #d97706;
      color: #ffffff;
      padding: 2px 7px;
      border-radius: 4px;
      font-size: 10.5px;
      font-weight: bold;
      letter-spacing: 0.3px;
    }
    .step3-ex-question {
      font-size: 12px;
      color: #1e293b;
      line-height: 1.5;
    }
    .step3-ex-hint {
      margin-top: 4px;
      padding: 4px 8px;
      background: #f1f5f9;
      border-radius: 4px;
      font-size: 11px;
      color: #475569;
    }
    .activity-single-exercise {
      margin-top: 6px;
      padding: 6px 8px;
      background: #f8fafc;
      border: 1px dashed #cbd5e1;
      border-radius: 4px;
      font-size: 11.5px;
    }
    .ex-mini-tag {
      font-weight: bold;
      color: #0284c7;
      display: block;
      margin-bottom: 2px;
    }

    /* Assessment Box */
    .assessment-card {
      border: 1px solid #cbd5e1;
      background: #fafafa;
      border-radius: 6px;
      padding: 14px 18px;
      margin-bottom: 20px;
    }
    .assessment-item {
      margin-bottom: 8px;
    }
    .assessment-label {
      font-weight: 700;
      color: #1e293b;
    }

    /* Signatures Table */
    table.signatures-table {
      width: 100%;
      border: none !important;
      border-collapse: collapse;
      margin-top: 15px;
      page-break-inside: avoid;
      break-inside: avoid;
    }
    table.signatures-table td {
      border: none !important;
      padding: 0 6px;
      vertical-align: top;
      text-align: center;
      width: 33.33%;
    }
    .sig-col {
      text-align: center;
    }
    .sig-title {
      font-weight: 700;
      font-size: 13px;
      color: #0f172a;
    }
    .sig-sub {
      font-size: 11px;
      color: #64748b;
      margin-top: 1px;
    }
    .sig-date {
      font-size: 11px;
      color: #64748b;
      margin-top: 1px;
    }
    .sig-dots {
      font-family: Arial, sans-serif;
      letter-spacing: 1px;
      color: #475569;
      margin-top: 22px;
      margin-bottom: 3px;
      font-size: 11px;
    }
    .sig-name {
      font-weight: 700;
      font-size: 12.5px;
      color: #0f172a;
    }

    /* Print styles */
    @media print {
      body {
        background: transparent !important;
        padding: 0 !important;
        color: #000000 !important;
        font-size: 10.5pt !important;
      }
      .no-print {
        display: none !important;
      }
      .page-container {
        box-shadow: none !important;
        border-radius: 0 !important;
        padding: 0 !important;
        max-width: 100% !important;
        width: 100% !important;
      }
      .meta-box, .assessment-card {
        background: transparent !important;
        border-color: #000 !important;
      }
      table.moeys-table {
        border-color: #000 !important;
      }
      table.moeys-table th, table.moeys-table td {
        border-color: #000 !important;
      }
      .step-visual-img {
        max-height: 120px !important;
      }
      .step-visual-caption {
        font-size: 10.5pt !important;
        font-weight: bold !important;
        color: #000000 !important;
        background: #ffffff !important;
        border: 1pt solid #000000 !important;
        display: inline-block !important;
      }
      .step3-ex-card, .exercise-box-card {
        break-inside: avoid;
      }
      table.signatures-table, .signatures-table tr {
        page-break-inside: avoid !important;
        break-inside: avoid !important;
      }
      @page {
        size: A4 portrait;
        margin: 1.0cm 1.0cm 1.0cm 1.0cm;
      }
    }
  </style>
</head>
<body>

  <!-- Top Action Bar (Hidden in Print) -->
  <div class="action-bar no-print">
    <div>
      <h2>កិច្ចតែងការបង្រៀនស្តង់ដារក្រសួងអប់រំ យុវជន និងកីឡា</h2>
    </div>
    <div class="action-buttons">
      <button onclick="window.print()" class="btn">
        🖨️ បោះពុម្ព ឬ រក្សាទុកជា PDF
      </button>
      <button onclick="saveAsWordDoc()" class="btn btn-secondary">
        📄 ទាញយកជា Word (.doc)
      </button>
    </div>
  </div>

  <div class="page-container" id="printable-plan">
    <!-- Official Header -->
    <div class="official-header">
      <div class="school-info">
        <div class="school-name">${escapeHtml(teacherInfo.schoolName || 'សាលារៀនជំនាន់ថ្មី')}</div>
        <div class="tech-team">ក្រុមបច្ចេកទេស៖ ${escapeHtml(generalInfo.subject)}</div>
        <div class="teacher-badge">គ្រូបង្រៀន៖ <strong>${escapeHtml(teacherInfo.teacherName)}</strong> ${teacherInfo.phoneNumber ? `(ទូរស័ព្ទ៖ ${escapeHtml(teacherInfo.phoneNumber)})` : ''}</div>
      </div>
      <div class="kingdom-motto">
        <div class="kingdom-title">ព្រះរាជាណាចក្រកម្ពុជា</div>
        <div class="kingdom-sub">ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
        <div class="motto-dots">៚ ៚ ៚</div>
      </div>
    </div>

    <!-- Title -->
    <div class="document-title-block">
      <h1 class="document-title">កិច្ចតែងការបង្រៀន</h1>
      <div class="document-subtitle">ស្តង់ដារ ៥ ជំហាន (មានលំហាត់អនុវត្ត &amp; PISA ព្រមទាំងដ្យាក្រាមឧបទេស)</div>
    </div>

    <!-- General Info Box -->
    <div class="meta-box">
      <div class="meta-item"><span class="meta-label">មុខវិជ្ជា៖</span> <span class="meta-val">${escapeHtml(generalInfo.subject)}</span></div>
      <div class="meta-item"><span class="meta-label">កម្រិតថ្នាក់៖</span> <span class="meta-val">${escapeHtml(generalInfo.grade)}</span></div>
      <div class="meta-item"><span class="meta-label">ជំពូក៖</span> <span class="meta-val">${escapeHtml(generalInfo.chapter)}</span></div>
      <div class="meta-item"><span class="meta-label">មេរៀន៖</span> <span class="meta-val">${escapeHtml(generalInfo.lessonTitle)}</span></div>
      <div class="meta-item" style="grid-column: span 2;"><span class="meta-label">ចំណងជើងរង៖</span> <span class="meta-val"><strong>${escapeHtml(generalInfo.subTopic)}</strong></span></div>
      <div class="meta-item"><span class="meta-label">រយៈពេលបង្រៀន៖</span> <span class="meta-val">${escapeHtml(generalInfo.duration)}</span></div>
      <div class="meta-item"><span class="meta-label">កាលបរិច្ឆេទបង្រៀន៖</span> <span class="meta-val">${escapeHtml(teacherInfo.date)}</span></div>
      <div class="meta-item" style="grid-column: span 2;"><span class="meta-label">វិធីសាស្ត្របង្រៀន៖</span> <span class="meta-val">${escapeHtml(generalInfo.methodology)}</span></div>
      <div class="meta-item" style="grid-column: span 2;"><span class="meta-label">យុទ្ធវិធីបង្រៀន៖</span> <span class="meta-val">${escapeHtml(generalInfo.strategy)}</span></div>
    </div>

    <!-- Section I: Objectives -->
    <div class="section-title">I. វត្ថុបំណងមេរៀន (Lesson Objectives)</div>
    <div class="sub-section-title">១. ចំណេះដឹង (Knowledge)</div>
    <ul class="item-list">
      ${knowledgeList}
    </ul>
    <div class="sub-section-title">២. បំណិន (Skills)</div>
    <ul class="item-list">
      ${skillsList}
    </ul>
    <div class="sub-section-title">៣. ចរិយាសម្បទា (Attitude)</div>
    <ul class="item-list">
      ${attitudeList}
    </ul>

    <!-- Section II: Materials -->
    <div class="section-title">II. សម្ភារឧបទេស និងធនធានសិក្សា (Teaching Aids &amp; Materials)</div>
    <div class="sub-section-title">សម្រាប់គ្រូ (Teacher Aids)៖</div>
    <ul class="item-list">
      ${teacherMaterialsList}
    </ul>
    <div class="sub-section-title">សម្រាប់សិស្ស (Student Materials)៖</div>
    <ul class="item-list">
      ${studentMaterialsList}
    </ul>

    <!-- Section III: 5-Step Process Table -->
    <div class="section-title">III. ដំណើរការបង្រៀន និងរៀន (Teaching and Learning Process - 5 Steps)</div>
    <div class="table-container">
      <table class="moeys-table">
        <thead>
          <tr>
            <th class="col-teacher">សកម្មភាពគ្រូ</th>
            <th class="col-step-content">ជំហានបង្រៀន និង ខ្លឹមសារមេរៀន</th>
            <th class="col-student">សកម្មភាពសិស្ស</th>
          </tr>
        </thead>
        <tbody>
          <!-- Step 1 -->
          <tr>
            <td class="col-teacher">${formatMathHtml(steps.step1.teacherActivity)}</td>
            <td class="col-step-content">
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin-bottom: 6px;">
                <strong style="color: #0f172a;">ជំហានទី១៖ រដ្ឋបាលថ្នាក់</strong>
                <span class="badge-time">${escapeHtml(steps.step1.time)}</span>
              </div>
              <div class="content-text">${formatMathHtml(steps.step1.content)}</div>
              ${renderVisualHtml(steps.step1.imageUrl, steps.step1.imageCaption)}
            </td>
            <td class="col-student">${formatMathHtml(steps.step1.studentActivity)}</td>
          </tr>

          <!-- Step 2 -->
          <tr>
            <td class="col-teacher">${formatMathHtml(steps.step2.teacherActivity)}</td>
            <td class="col-step-content">
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #fed7aa; padding-bottom: 4px; margin-bottom: 6px;">
                <strong style="color: #7c2d12;">ជំហានទី២៖ រំឭកមេរៀនចាស់</strong>
                <span class="badge-time" style="background: #fef3c7; color: #92400e;">${escapeHtml(steps.step2.time)}</span>
              </div>
              <div class="content-text">${formatMathHtml(steps.step2.content)}</div>
              ${renderVisualHtml(steps.step2.imageUrl, steps.step2.imageCaption)}
              ${renderExercisesHtml(steps.step2.exercises, 'លំហាត់រំឭកមេរៀនចាស់ (Review Exercises)')}
            </td>
            <td class="col-student">${formatMathHtml(steps.step2.studentActivity)}</td>
          </tr>

          <!-- Step 3 Header -->
          <tr class="step-main-header">
            <td colspan="3">
              <strong>ជំហានទី៣៖ មេរៀនថ្មី (New Lesson) — ${escapeHtml(generalInfo.subTopic || generalInfo.lessonTitle)}</strong>
              <div style="font-size: 12px; font-weight: normal; margin-top: 3px; color: #475569;">
                វិធីសាស្ត្រ៖ ${escapeHtml(generalInfo.methodology)} | យុទ្ធវិធី៖ ${escapeHtml(generalInfo.strategy)}
              </div>
              ${renderVisualHtml(steps.step3ImageUrl, steps.step3ImageCaption)}
              ${renderStep3ExercisesHtml(steps.step3Exercises)}
            </td>
          </tr>

          <!-- Step 3 Activities -->
          ${step3Rows}

          <!-- Step 4 -->
          <tr>
            <td class="col-teacher">${formatMathHtml(steps.step4.teacherActivity)}</td>
            <td class="col-step-content">
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #e9d5ff; padding-bottom: 4px; margin-bottom: 6px;">
                <strong style="color: #581c87;">ជំហានទី៤៖ ពង្រឹងចំណេះដឹង</strong>
                <span class="badge-time" style="background: #f3e8ff; color: #6b21a8;">${escapeHtml(steps.step4.time)}</span>
              </div>
              <div class="content-text">${formatMathHtml(steps.step4.content)}</div>
              ${renderVisualHtml(steps.step4.imageUrl, steps.step4.imageCaption)}
              ${renderExercisesHtml(steps.step4.exercises, 'លំហាត់ពង្រឹងចំណេះដឹង (Consolidation Exercises)')}
            </td>
            <td class="col-student">${formatMathHtml(steps.step4.studentActivity)}</td>
          </tr>

          <!-- Step 5 -->
          <tr>
            <td class="col-teacher">${formatMathHtml(steps.step5.teacherActivity)}</td>
            <td class="col-step-content">
              <div style="display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #bae6fd; padding-bottom: 4px; margin-bottom: 6px;">
                <strong style="color: #0c4a6e;">ជំហានទី៥៖ កិច្ចការផ្ទះ & បណ្តាំផ្ញើ</strong>
                <span class="badge-time">${escapeHtml(steps.step5.time)}</span>
              </div>
              <div class="content-text">${formatMathHtml(steps.step5.content)}</div>
              ${renderVisualHtml(steps.step5.imageUrl, steps.step5.imageCaption)}
            </td>
            <td class="col-student">${formatMathHtml(steps.step5.studentActivity)}</td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Section IV: Assessment -->
    <div class="section-title">IV. ការវាយតម្លៃ (Assessment)</div>
    <div class="assessment-card">
      <div class="assessment-item">
        <span class="assessment-label">១. ការវាយតម្លៃដើមទី (Diagnostic Assessment)៖</span>
        <span>${escapeHtml(assessment.diagnostic)}</span>
      </div>
      <div class="assessment-item">
        <span class="assessment-label">២. ការវាយតម្លៃបន្ត (Formative Assessment)៖</span>
        <span>${escapeHtml(assessment.formative)}</span>
      </div>
      <div class="assessment-item">
        <span class="assessment-label">៣. ការវាយតម្លៃបូកសរុប (Summative Assessment)៖</span>
        <span>${escapeHtml(assessment.summative)}</span>
      </div>
    </div>

    <!-- Section V: Self-Reflection -->
    ${
      selfReflection
        ? `
      <div class="section-title">V. ការឆ្លុះបញ្ចាំងរបស់គ្រូ (Teacher's Self-Reflection)</div>
      <div class="assessment-card" style="font-style: italic; color: #334155;">
        ${escapeHtml(selfReflection)}
      </div>
    `
        : ''
    }

    <!-- Signatures -->
    <table class="signatures-table" style="table-layout: fixed; width: 100%;">
      <tr style="page-break-inside: avoid; break-inside: avoid;">
        <td class="sig-col" style="width: 33.33%; overflow: hidden;">
          <div class="sig-title">បានឃើញ និងឯកភាព</div>
          <div class="sig-date">ថ្ងៃទី..... ខែ..... ឆ្នាំ២០២៦</div>
          <div class="sig-sub">នាយក / នាយិកាសាលា</div>
          <div class="sig-dots">....................................</div>
          <div class="sig-name">ឈ្មោះ ៖ ${escapeHtml(teacherInfo.principalName || '....................................')}</div>
        </td>
        <td class="sig-col" style="width: 33.33%; overflow: hidden;">
          <div class="sig-title">បានពិនិត្យត្រឹមត្រូវ</div>
          <div class="sig-date">ថ្ងៃទី..... ខែ..... ឆ្នាំ២០២៦</div>
          <div class="sig-sub">ប្រធានក្រុមបច្ចេកទេស</div>
          <div class="sig-dots">....................................</div>
          <div class="sig-name">ឈ្មោះ ៖ ${escapeHtml(teacherInfo.headOfTechnicalTeam || '....................................')}</div>
        </td>
        <td class="sig-col" style="width: 33.33%; overflow: hidden;">
          <div class="sig-sub">ធ្វើនៅ ${escapeHtml(teacherInfo.schoolName || '....................................')}</div>
          <div class="sig-date">${escapeHtml(teacherInfo.date || 'ថ្ងៃទី.....ខែ.....ឆ្នាំ២០២៦')}</div>
          <div class="sig-title" style="margin-top: 1px;">ហត្ថលេខា និងឈ្មោះគ្រូបង្រៀន</div>
          <div class="sig-dots">....................................</div>
          <div class="sig-name">ឈ្មោះ ៖ ${escapeHtml(teacherInfo.teacherName)}</div>
        </td>
      </tr>
    </table>
  </div>

  <script>
    function saveAsWordDoc() {
      const header = "<html xmlns:o='urn:schemas-microsoft-com:office:office' "+
            "xmlns:w='urn:schemas-microsoft-com:office:word' "+
            "xmlns='http://www.w3.org/TR/REC-html40'>"+
            "<head><meta charset='utf-8'><title>Lesson Plan</title><style>body{font-family:'Khmer OS Siemreap','Segoe UI',sans-serif;font-size:11pt;}table{border-collapse:collapse;width:100%;}th,td{border:1px solid #333;padding:6px;}</style></head><body>";
      const footer = "</body></html>";
      const sourceHTML = header + document.getElementById("printable-plan").innerHTML + footer;
      
      const source = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(sourceHTML);
      const fileDownload = document.createElement("a");
      document.body.appendChild(fileDownload);
      fileDownload.href = source;
      fileDownload.download = 'កិច្ចតែងការ_${sanitizeFileName(generalInfo.subject)}_${sanitizeFileName(generalInfo.grade)}.doc';
      fileDownload.click();
      document.body.removeChild(fileDownload);
    }
    ${
      autoPrint
        ? `
    window.addEventListener('load', function() {
      setTimeout(function() {
        window.print();
      }, 350);
    });
    `
        : ''
    }
  </script>
</body>
</html>`;
}

function renderVisualHtml(imageUrl?: string, caption?: string): string {
  if (!imageUrl) return '';
  return `
    <div class="step-visual-box">
      <img src="${imageUrl}" alt="${escapeHtml(caption || 'ដ្យាក្រាមមេរៀន')}" class="step-visual-img" />
      ${caption ? `<div class="step-visual-caption">🔍 ${escapeHtml(caption)}</div>` : ''}
    </div>
  `;
}

function renderExercisesHtml(exercises?: string[], title: string = 'លំហាត់អនុវត្ត'): string {
  if (!exercises || exercises.length === 0) return '';
  return `
    <div class="exercise-box-card">
      <div class="exercise-box-title">📝 ${escapeHtml(title)}</div>
      <ul class="exercise-box-list">
        ${exercises.map((ex) => `<li>${formatMathHtml(ex)}</li>`).join('')}
      </ul>
    </div>
  `;
}

function renderStep3ExercisesHtml(exercises?: Step3Exercise[]): string {
  if (!exercises || exercises.length === 0) return '';
  return `
    <div class="step3-ex-container">
      <div class="step3-ex-header">🎯 លំហាត់អនុវត្ត ៣ កម្រិត (រួមទាំងលំហាត់ស្តង់ដារអន្តរជាតិ PISA)</div>
      ${exercises
        .map(
          (ex) => `
        <div class="step3-ex-card ${ex.isPisa ? 'pisa-card' : ''}">
          <div class="step3-ex-title-row">
            <span class="step3-ex-title">${escapeHtml(ex.title)}</span>
            ${ex.isPisa ? `<span class="pisa-badge">⭐ ស្តង់ដារ PISA</span>` : ''}
          </div>
          <div class="step3-ex-question">${formatMathHtml(ex.question)}</div>
          ${
            ex.solutionHint
              ? `<div class="step3-ex-hint">💡 <strong>គន្លឹះដោះស្រាយ៖</strong> ${formatMathHtml(ex.solutionHint)}</div>`
              : ''
          }
        </div>
      `
        )
        .join('')}
    </div>
  `;
}

function formatMathHtml(rawText?: string): string {
  if (!rawText) return '';
  const regex = /(\$\$[\s\S]*?\$\$|\$[^$\n]+?\$)/g;
  let result = '';
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = regex.exec(rawText)) !== null) {
    if (match.index > lastIndex) {
      result += formatPlainMathHtml(rawText.slice(lastIndex, match.index));
    }
    const matchStr = match[0];
    if (matchStr.startsWith('$$') && matchStr.endsWith('$$')) {
      try {
        const rendered = katex.renderToString(matchStr.slice(2, -2).trim(), { displayMode: true, throwOnError: false });
        result += `<div class="mathtype-block">${rendered}</div>`;
      } catch {
        result += `<div class="mathtype-block font-serif">${escapeHtml(matchStr)}</div>`;
      }
    } else if (matchStr.startsWith('$') && matchStr.endsWith('$')) {
      try {
        const rendered = katex.renderToString(matchStr.slice(1, -1).trim(), { displayMode: false, throwOnError: false });
        result += `<span class="mathtype-inline">${rendered}</span>`;
      } catch {
        result += `<span class="mathtype-inline font-serif">${escapeHtml(matchStr)}</span>`;
      }
    }
    lastIndex = regex.lastIndex;
  }

  if (lastIndex < rawText.length) {
    result += formatPlainMathHtml(rawText.slice(lastIndex));
  }

  return result;
}

function formatPlainMathHtml(text: string): string {
  if (!text) return '';
  // Check for common plain math equations like y = 2x + 1 or S = a * b or Delta = b^2 - 4ac
  let escaped = escapeHtml(text);
  // Auto-format power ^2, ^3, etc into sup
  escaped = escaped.replace(/\^([0-9a-zA-Z]+)/g, '<sup class="mathtype-sup" style="font-family: \'Cambria Math\', \'Times New Roman\', serif; font-weight: bold;">$1</sup>');
  escaped = escaped.replace(/_([0-9a-zA-Z]+)/g, '<sub class="mathtype-sub" style="font-family: \'Cambria Math\', \'Times New Roman\', serif;">$1</sub>');
  escaped = escaped.replace(/²/g, '<sup class="mathtype-sup" style="font-family: \'Cambria Math\', \'Times New Roman\', serif; font-weight: bold;">2</sup>');
  escaped = escaped.replace(/³/g, '<sup class="mathtype-sup" style="font-family: \'Cambria Math\', \'Times New Roman\', serif; font-weight: bold;">3</sup>');
  escaped = escaped.replace(/Δ/g, '<span style="font-family: \'Cambria Math\', \'Times New Roman\', serif;">&Delta;</span>');
  escaped = escaped.replace(/π/g, '<span style="font-family: \'Cambria Math\', \'Times New Roman\', serif;">&pi;</span>');
  escaped = escaped.replace(/×/g, '<span style="font-family: \'Cambria Math\', \'Times New Roman\', serif; padding: 0 2px;">&times;</span>');
  escaped = escaped.replace(/÷/g, '<span style="font-family: \'Cambria Math\', \'Times New Roman\', serif; padding: 0 2px;">&divide;</span>');
  escaped = escaped.replace(/±/g, '<span style="font-family: \'Cambria Math\', \'Times New Roman\', serif; padding: 0 2px;">&plusmn;</span>');
  escaped = escaped.replace(/√/g, '<span style="font-family: \'Cambria Math\', \'Times New Roman\', serif; font-weight: bold;">&radic;</span>');

  return nl2br(escaped);
}

export function escapeHtml(str?: string): string {
  if (!str) return '';
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

function nl2br(str: string): string {
  return str.replace(/\n/g, '<br/>');
}

function sanitizeFileName(str?: string): string {
  if (!str) return 'lesson_plan';
  return str.replace(/[^a-zA-Z0-9_\u1780-\u17FF]/g, '_');
}

function formatMathWord(rawText?: string): string {
  if (!rawText) return '';
  // Escape html first, then insert safe Word math spans
  let text = escapeHtml(rawText);

  // Convert LaTeX and plain math into clean Word HTML tags styled with Cambria Math / Times New Roman
  text = text
    .replace(/\$\$(.*?)\$\$/g, '<span style="font-family: \'Cambria Math\', \'Times New Roman\', serif; font-size: 10.5pt; font-weight: 500; display: block; text-align: center; margin: 4pt 0;">$1</span>')
    .replace(/\$(.*?)\$/g, '<span style="font-family: \'Cambria Math\', \'Times New Roman\', serif; font-size: 10.5pt; font-weight: 500;">$1</span>')
    .replace(/\\frac\{([^}]+)\}\{([^}]+)\}/g, '($1 / $2)')
    .replace(/\^([0-9a-zA-Z]+|\{[^}]+\})/g, (_m, p1) => `<sup style="font-family: \'Cambria Math\', \'Times New Roman\', serif; font-weight: bold;">${p1.replace(/[{}]/g, '')}</sup>`)
    .replace(/_([0-9a-zA-Z]+|\{[^}]+\})/g, (_m, p1) => `<sub style="font-family: \'Cambria Math\', \'Times New Roman\', serif;">${p1.replace(/[{}]/g, '')}</sub>`)
    .replace(/²/g, '<sup style="font-family: \'Cambria Math\', \'Times New Roman\', serif; font-weight: bold;">2</sup>')
    .replace(/³/g, '<sup style="font-family: \'Cambria Math\', \'Times New Roman\', serif; font-weight: bold;">3</sup>')
    .replace(/\\times/g, '×')
    .replace(/\\div/g, '÷')
    .replace(/\\pm/g, '±')
    .replace(/\\approx/g, '≈')
    .replace(/\\le/g, '≤')
    .replace(/\\ge/g, '≥')
    .replace(/\\neq/g, '≠')
    .replace(/\\Delta/g, 'Δ')
    .replace(/\\pi/g, 'π')
    .replace(/\\sqrt\{([^}]+)\}/g, '√($1)')
    .replace(/\^\\circ\\text\{C\}|\^\{\\circ\}C|\^\\circ C/g, '°C')
    .replace(/\^\\circ\\text\{F\}|\^\{\\circ\}F|\^\\circ F/g, '°F')
    .replace(/\\text\{([^}]+)\}/g, '$1');

  return nl2br(text);
}

function renderVisualWord(imageUrl?: string, caption?: string): string {
  if (!imageUrl) return '';
  return `
    <div style="margin-top: 6pt; margin-bottom: 6pt; text-align: center; page-break-inside: avoid;">
      <img src="${imageUrl}" alt="${escapeHtml(caption || 'ដ្យាក្រាមមេរៀន')}" style="max-width: 100%; max-height: 120pt; border: 1pt solid #cbd5e1; border-radius: 4pt;" />
      ${caption ? `<div style="font-size: 10pt; font-weight: bold; color: #000000; margin-top: 3pt; padding: 2pt 8pt; background-color: #f1f5f9; border: 1pt solid #94a3b8; display: inline-block;">🔍 ${escapeHtml(caption)}</div>` : ''}
    </div>
  `;
}

export function generateStandaloneWordDoc(data: LessonPlanData): string {
  const {
    teacherInfo,
    generalInfo,
    objectives,
    materials,
    steps,
    assessment,
    selfReflection,
  } = data;

  const knowledgeList = objectives.knowledge
    .map((k) => `<li style="margin-bottom: 3pt;">${formatMathWord(k)}</li>`)
    .join('');
  const skillsList = objectives.skills
    .map((s) => `<li style="margin-bottom: 3pt;">${formatMathWord(s)}</li>`)
    .join('');
  const attitudeList = objectives.attitude
    .map((a) => `<li style="margin-bottom: 3pt;">${formatMathWord(a)}</li>`)
    .join('');

  const teacherMaterialsList = materials.teacherMaterials
    .map((m) => `<li style="margin-bottom: 2pt;">${escapeHtml(m)}</li>`)
    .join('');
  const studentMaterialsList = materials.studentMaterials
    .map((m) => `<li style="margin-bottom: 2pt;">${escapeHtml(m)}</li>`)
    .join('');

  // Step 3 activities rows for Word
  const step3Rows = steps.step3
    .map(
      (act, idx) => `
      <tr>
        <td style="width: 33%; border: 1pt solid #000000; padding: 6pt; vertical-align: top;">
          ${formatMathWord(act.teacherActivity)}
        </td>
        <td style="width: 34%; border: 1pt solid #000000; padding: 6pt; vertical-align: top;">
          <div style="font-weight: bold; color: #0369a1; border-bottom: 1pt solid #cbd5e1; padding-bottom: 3pt; margin-bottom: 4pt;">
            សកម្មភាព ${idx + 1} (${escapeHtml(act.time)})
          </div>
          <div style="font-weight: bold; color: #0c4a6e; margin-bottom: 3pt;">
            ${escapeHtml(act.activityTitle)}
          </div>
          <div style="margin-bottom: 4pt;">
            ${formatMathWord(act.content)}
          </div>
          ${renderVisualWord(act.imageUrl, act.imageCaption)}
        </td>
        <td style="width: 33%; border: 1pt solid #000000; padding: 6pt; vertical-align: top;">
          ${formatMathWord(act.studentActivity)}
        </td>
      </tr>
    `
    )
    .join('');

  // Step 2 review exercises
  const step2ExercisesWord =
    steps.step2.exercises && steps.step2.exercises.length > 0
      ? `
      <div style="margin-top: 6pt; padding: 5pt; background-color: #fefce8; border: 1pt solid #fef08a;">
        <div style="font-weight: bold; color: #854d0e; font-size: 10pt; margin-bottom: 3pt;">
          📝 លំហាត់រំឭកមេរៀនចាស់៖
        </div>
        <ol style="margin-left: 14pt; margin-top: 2pt; margin-bottom: 2pt; font-size: 10pt;">
          ${steps.step2.exercises.map((ex) => `<li>${formatMathWord(ex)}</li>`).join('')}
        </ol>
      </div>
    `
      : '';

  // Step 3 exercises
  const step3ExercisesWord =
    steps.step3Exercises && steps.step3Exercises.length > 0
      ? `
      <div style="margin-top: 8pt; padding: 6pt; background-color: #f0fdf4; border: 1pt solid #86efac;">
        <div style="font-weight: bold; color: #166534; font-size: 10.5pt; margin-bottom: 4pt;">
          ⭐ លំហាត់អនុវត្ត ៣ កម្រិត (រួមទាំងលំហាត់ស្តង់ដារអន្តរជាតិ PISA)៖
        </div>
        ${steps.step3Exercises
          .map(
            (ex, i) => `
          <div style="margin-top: 4pt; padding: 4pt 6pt; background-color: #ffffff; border: 1pt solid #dcfce7; font-size: 10pt;">
            <strong style="color: #14532d;">${i + 1}. ${escapeHtml(ex.title)} ${ex.isPisa ? '<span style="color:#b45309;font-weight:bold;">[PISA]</span>' : ''}</strong>
            <div style="margin-top: 2pt;">${formatMathWord(ex.question)}</div>
            ${ex.solutionHint ? `<div style="margin-top: 2pt; color: #475569; font-size: 9.5pt;">💡 <em>គន្លឹះ៖ ${formatMathWord(ex.solutionHint)}</em></div>` : ''}
          </div>
        `
          )
          .join('')}
      </div>
    `
      : '';

  // Step 4 consolidation exercises
  const step4ExercisesWord =
    steps.step4.exercises && steps.step4.exercises.length > 0
      ? `
      <div style="margin-top: 6pt; padding: 5pt; background-color: #faf5ff; border: 1pt solid #e9d5ff;">
        <div style="font-weight: bold; color: #6b21a8; font-size: 10pt; margin-bottom: 3pt;">
          🎯 លំហាត់ពង្រឹងចំណេះដឹង៖
        </div>
        <ol style="margin-left: 14pt; margin-top: 2pt; margin-bottom: 2pt; font-size: 10pt;">
          ${steps.step4.exercises.map((ex) => `<li>${formatMathWord(ex)}</li>`).join('')}
        </ol>
      </div>
    `
      : '';

  return `
    <html xmlns:o="urn:schemas-microsoft-com:office:office"
          xmlns:w="urn:schemas-microsoft-com:office:word"
          xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8">
      <title>កិច្ចតែងការបង្រៀន - ${escapeHtml(generalInfo.subject)}</title>
      <!--[if gte mso 9]>
      <xml>
        <w:WordDocument>
          <w:View>Print</w:View>
          <w:Zoom>100</w:Zoom>
          <w:DoNotOptimizeForBrowser/>
        </w:WordDocument>
      </xml>
      <![endif]-->
      <style>
        @page Section1 {
          size: 21.0cm 29.7cm; /* A4 */
          margin: 0.9cm 1.2cm 0.9cm 1.2cm;
          mso-header-margin: 18pt;
          mso-footer-margin: 18pt;
          mso-paper-source: 0;
        }
        div.Section1 {
          page: Section1;
        }
        body {
          font-family: 'Khmer OS Siemreap', 'Siemreap', 'Kantumruy Pro', 'Khmer OS', 'Segoe UI', Arial, sans-serif;
          font-size: 10pt;
          line-height: 1.35;
          color: #000000;
        }
        table {
          border-collapse: collapse;
          mso-table-lspace: 0pt;
          mso-table-rspace: 0pt;
          page-break-inside: avoid;
        }
        tr {
          page-break-inside: avoid;
        }
        h2.sec-title {
          font-family: 'Khmer OS Muol Light', 'Moul', 'Khmer OS Siemreap', serif;
          font-size: 10.5pt;
          color: #000000;
          border-bottom: 1.5pt solid #0284c7;
          padding-bottom: 1pt;
          margin-top: 8pt;
          margin-bottom: 3pt;
        }
      </style>
    </head>
    <body>
      <div class="Section1">
        <!-- Top Header: Kingdom & School in a 2-column table -->
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="width: 100%; border: none; margin-bottom: 6pt;">
          <tr style="border: none;">
            <td width="55%" align="left" valign="top" style="border: none; text-align: left; vertical-align: top;">
              <div style="font-weight: bold; font-size: 11pt;">${escapeHtml(teacherInfo.schoolName || 'សាលារៀន')}</div>
              <div style="font-size: 9.5pt; margin-top: 1pt;">ក្រុមបច្ចេកទេស៖ <strong>${escapeHtml(generalInfo.subject)}</strong></div>
              <div style="font-size: 9.5pt; margin-top: 1pt;">គ្រូបង្រៀន៖ <strong>${escapeHtml(teacherInfo.teacherName)}</strong> ${teacherInfo.phoneNumber ? `(${escapeHtml(teacherInfo.phoneNumber)})` : ''}</div>
            </td>
            <td width="45%" align="center" valign="top" style="border: none; text-align: center; vertical-align: top;">
              <div style="font-weight: bold; font-size: 11pt;">ព្រះរាជាណាចក្រកម្ពុជា</div>
              <div style="font-weight: bold; font-size: 10pt; margin-top: 1pt;">ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
              <div style="color: #0284c7; font-size: 10pt; letter-spacing: 2pt; margin-top: 1pt;">៚ ៚ ៚</div>
            </td>
          </tr>
        </table>

        <!-- Document Title -->
        <div style="text-align: center; margin-top: 4pt; margin-bottom: 6pt;">
          <div style="font-weight: bold; font-size: 13.5pt; color: #000000;">កិច្ចតែងការបង្រៀន</div>
          <div style="font-size: 9.5pt; font-weight: bold; color: #0369a1; margin-top: 1pt;">
            ស្តង់ដារ ៥ ជំហាន (ក្រសួងអប់រំ យុវជន និងកីឡា)
          </div>
        </div>

        <!-- General Info Metadata Grid in Table -->
        <table width="100%" border="1" cellpadding="3" cellspacing="0" style="width: 100%; border-collapse: collapse; border: 1pt solid #94a3b8; background-color: #f8fafc; font-size: 9.5pt; margin-bottom: 6pt;">
          <tr>
            <td width="50%" style="border: 1pt solid #cbd5e1; padding: 2.5pt 5pt;"><strong>មុខវិជ្ជា៖</strong> ${escapeHtml(generalInfo.subject)}</td>
            <td width="50%" style="border: 1pt solid #cbd5e1; padding: 2.5pt 5pt;"><strong>កាលបរិច្ឆេទ៖</strong> ${escapeHtml(teacherInfo.date || '..../..../២០២៦')}</td>
          </tr>
          <tr>
            <td width="50%" style="border: 1pt solid #cbd5e1; padding: 2.5pt 5pt;"><strong>កម្រិតថ្នាក់៖</strong> ${escapeHtml(generalInfo.grade)}</td>
            <td width="50%" style="border: 1pt solid #cbd5e1; padding: 2.5pt 5pt;"><strong>រយៈពេល៖</strong> ${escapeHtml(generalInfo.duration)}</td>
          </tr>
          <tr>
            <td colspan="2" style="border: 1pt solid #cbd5e1; padding: 2.5pt 5pt;"><strong>ជំពូក៖</strong> ${escapeHtml(generalInfo.chapter)}</td>
          </tr>
          <tr>
            <td colspan="2" style="border: 1pt solid #cbd5e1; padding: 2.5pt 5pt;"><strong>មេរៀន៖</strong> ${escapeHtml(generalInfo.lessonTitle)}</td>
          </tr>
          <tr>
            <td colspan="2" style="border: 1pt solid #cbd5e1; padding: 2.5pt 5pt;"><strong>ចំណងជើងរង៖</strong> ${escapeHtml(generalInfo.subTopic)}</td>
          </tr>
          <tr>
            <td width="50%" style="border: 1pt solid #cbd5e1; padding: 2.5pt 5pt;"><strong>វិធីសាស្ត្រ៖</strong> ${escapeHtml(generalInfo.methodology)}</td>
            <td width="50%" style="border: 1pt solid #cbd5e1; padding: 2.5pt 5pt;"><strong>យុទ្ធវិធី៖</strong> ${escapeHtml(generalInfo.strategy)}</td>
          </tr>
        </table>

        <!-- Section I: Objectives -->
        <h2 class="sec-title">I. វត្ថុបំណងមេរៀន (Lesson Objectives)</h2>
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="width: 100%; border: none; font-size: 9.5pt; margin-bottom: 6pt;">
          <tr style="border: none;">
            <td style="border: none; padding-bottom: 2pt;">
              <strong>១. ចំណេះដឹង (Knowledge)៖</strong>
              <ul style="margin-top: 1pt; margin-bottom: 2pt; margin-left: 16pt;">${knowledgeList}</ul>
            </td>
          </tr>
          <tr style="border: none;">
            <td style="border: none; padding-bottom: 2pt;">
              <strong>២. បំណិន (Skills)៖</strong>
              <ul style="margin-top: 1pt; margin-bottom: 2pt; margin-left: 16pt;">${skillsList}</ul>
            </td>
          </tr>
          <tr style="border: none;">
            <td style="border: none;">
              <strong>៣. ចរិយាសម្បទា (Attitude)៖</strong>
              <ul style="margin-top: 1pt; margin-bottom: 2pt; margin-left: 16pt;">${attitudeList}</ul>
            </td>
          </tr>
        </table>

        <!-- Section II: Materials -->
        <h2 class="sec-title">II. សម្ភារឧបទេស និងធនធានសិក្សា (Teaching Aids & Materials)</h2>
        <table width="100%" border="1" cellpadding="3" cellspacing="0" style="width: 100%; border-collapse: collapse; border: 1pt solid #cbd5e1; font-size: 9.5pt; margin-bottom: 6pt;">
          <tr style="background-color: #f8fafc;">
            <td width="50%" style="border: 1pt solid #cbd5e1; vertical-align: top; padding: 4pt 6pt;">
              <strong>១. សម្រាប់គ្រូ (Teacher)៖</strong>
              <ul style="margin-top: 2pt; margin-bottom: 1pt; margin-left: 14pt;">${teacherMaterialsList}</ul>
            </td>
            <td width="50%" style="border: 1pt solid #cbd5e1; vertical-align: top; padding: 4pt 6pt;">
              <strong>២. សម្រាប់សិស្ស (Students)៖</strong>
              <ul style="margin-top: 2pt; margin-bottom: 1pt; margin-left: 14pt;">${studentMaterialsList}</ul>
            </td>
          </tr>
        </table>

        <!-- Section III: 5 Steps Teaching Process Table (3 COLUMNS) -->
        <h2 class="sec-title">III. ដំណើរការបង្រៀន និងរៀន (Teaching and Learning Process - 3 Columns)</h2>
        <table width="100%" border="1" cellpadding="4" cellspacing="0" style="width: 100%; border-collapse: collapse; border: 1.5pt solid #000000; font-size: 9.5pt; margin-bottom: 6pt; page-break-inside: auto;">
          <thead>
            <tr style="background-color: #f1f5f9; page-break-inside: avoid;">
              <th width="33%" style="width: 33%; border: 1pt solid #000000; padding: 4pt 5pt; text-align: center; font-weight: bold;">
                សកម្មភាពគ្រូ
              </th>
              <th width="34%" style="width: 34%; border: 1pt solid #000000; padding: 4pt 5pt; text-align: center; font-weight: bold;">
                ជំហានបង្រៀន និង ខ្លឹមសារមេរៀន
              </th>
              <th width="33%" style="width: 33%; border: 1pt solid #000000; padding: 4pt 5pt; text-align: center; font-weight: bold;">
                សកម្មភាពសិស្ស
              </th>
            </tr>
          </thead>
          <tbody>
            <!-- Step 1 -->
            <tr style="page-break-inside: avoid;">
              <td style="width: 33%; border: 1pt solid #000000; padding: 4pt 5pt; vertical-align: top;">
                ${formatMathWord(steps.step1.teacherActivity)}
              </td>
              <td style="width: 34%; border: 1pt solid #000000; padding: 4pt 5pt; vertical-align: top;">
                <div style="font-weight: bold; color: #0f172a; border-bottom: 1pt solid #cbd5e1; padding-bottom: 2pt; margin-bottom: 3pt;">
                  ជំហានទី១៖ រដ្ឋបាលថ្នាក់ (${escapeHtml(steps.step1.time)})
                </div>
                <div>${formatMathWord(steps.step1.content)}</div>
                ${renderVisualWord(steps.step1.imageUrl, steps.step1.imageCaption)}
              </td>
              <td style="width: 33%; border: 1pt solid #000000; padding: 4pt 5pt; vertical-align: top;">
                ${formatMathWord(steps.step1.studentActivity)}
              </td>
            </tr>

            <!-- Step 2 -->
            <tr style="background-color: #fffdf5; page-break-inside: avoid;">
              <td style="width: 33%; border: 1pt solid #000000; padding: 4pt 5pt; vertical-align: top;">
                ${formatMathWord(steps.step2.teacherActivity)}
              </td>
              <td style="width: 34%; border: 1pt solid #000000; padding: 4pt 5pt; vertical-align: top;">
                <div style="font-weight: bold; color: #7c2d12; border-bottom: 1pt solid #fed7aa; padding-bottom: 2pt; margin-bottom: 3pt;">
                  ជំហានទី២៖ រំឭកមេរៀនចាស់ (${escapeHtml(steps.step2.time)})
                </div>
                <div>${formatMathWord(steps.step2.content)}</div>
                ${renderVisualWord(steps.step2.imageUrl, steps.step2.imageCaption)}
                ${step2ExercisesWord}
              </td>
              <td style="width: 33%; border: 1pt solid #000000; padding: 4pt 5pt; vertical-align: top;">
                ${formatMathWord(steps.step2.studentActivity)}
              </td>
            </tr>

            <!-- Step 3 Main Banner -->
            <tr style="background-color: #f0f9ff; page-break-inside: avoid;">
              <td colspan="3" style="border: 1.5pt solid #0284c7; padding: 5pt 7pt; vertical-align: top;">
                <div style="font-weight: bold; font-size: 10.5pt; color: #0369a1;">
                  ជំហានទី៣៖ មេរៀនថ្មី — ${escapeHtml(generalInfo.subTopic || generalInfo.lessonTitle)}
                </div>
                <div style="font-size: 9pt; color: #475569; margin-top: 1pt;">
                  វិធីសាស្ត្រ៖ ${escapeHtml(generalInfo.methodology)} | យុទ្ធវិធី៖ ${escapeHtml(generalInfo.strategy)}
                </div>
                ${renderVisualWord(steps.step3ImageUrl, steps.step3ImageCaption)}
                ${step3ExercisesWord}
              </td>
            </tr>

            <!-- Step 3 Sub-activities -->
            ${step3Rows}

            <!-- Step 4 -->
            <tr style="background-color: #fbf8ff; page-break-inside: avoid;">
              <td style="width: 33%; border: 1pt solid #000000; padding: 4pt 5pt; vertical-align: top;">
                ${formatMathWord(steps.step4.teacherActivity)}
              </td>
              <td style="width: 34%; border: 1pt solid #000000; padding: 4pt 5pt; vertical-align: top;">
                <div style="font-weight: bold; color: #581c87; border-bottom: 1pt solid #e9d5ff; padding-bottom: 2pt; margin-bottom: 3pt;">
                  ជំហានទី៤៖ ពង្រឹងចំណេះដឹង (${escapeHtml(steps.step4.time)})
                </div>
                <div>${formatMathWord(steps.step4.content)}</div>
                ${renderVisualWord(steps.step4.imageUrl, steps.step4.imageCaption)}
                ${step4ExercisesWord}
              </td>
              <td style="width: 33%; border: 1pt solid #000000; padding: 4pt 5pt; vertical-align: top;">
                ${formatMathWord(steps.step4.studentActivity)}
              </td>
            </tr>

            <!-- Step 5 -->
            <tr style="page-break-inside: avoid;">
              <td style="width: 33%; border: 1pt solid #000000; padding: 4pt 5pt; vertical-align: top;">
                ${formatMathWord(steps.step5.teacherActivity)}
              </td>
              <td style="width: 34%; border: 1pt solid #000000; padding: 4pt 5pt; vertical-align: top;">
                <div style="font-weight: bold; color: #0c4a6e; border-bottom: 1pt solid #bae6fd; padding-bottom: 2pt; margin-bottom: 3pt;">
                  ជំហានទី៥៖ កិច្ចការផ្ទះ & បណ្តាំផ្ញើ (${escapeHtml(steps.step5.time)})
                </div>
                <div>${formatMathWord(steps.step5.content)}</div>
                ${renderVisualWord(steps.step5.imageUrl, steps.step5.imageCaption)}
              </td>
              <td style="width: 33%; border: 1pt solid #000000; padding: 4pt 5pt; vertical-align: top;">
                ${formatMathWord(steps.step5.studentActivity)}
              </td>
            </tr>
          </tbody>
        </table>

        <!-- Section IV: Assessment -->
        <h2 class="sec-title">IV. ការវាយតម្លៃ (Assessment)</h2>
        <table width="100%" border="1" cellpadding="4" cellspacing="0" style="width: 100%; border-collapse: collapse; border: 1pt solid #cbd5e1; background-color: #fafafa; font-size: 9.5pt; margin-bottom: 6pt;">
          <tr style="page-break-inside: avoid;">
            <td style="border: 1pt solid #cbd5e1; padding: 3pt 6pt;">
              <strong>១. ការវាយតម្លៃដើមទី (Diagnostic)៖</strong> ${escapeHtml(assessment.diagnostic)}
            </td>
          </tr>
          <tr style="page-break-inside: avoid;">
            <td style="border: 1pt solid #cbd5e1; padding: 3pt 6pt;">
              <strong>២. ការវាយតម្លៃដំណើរការ (Formative)៖</strong> ${escapeHtml(assessment.formative)}
            </td>
          </tr>
          <tr style="page-break-inside: avoid;">
            <td style="border: 1pt solid #cbd5e1; padding: 3pt 6pt;">
              <strong>៣. ការវាយតម្លៃចុងក្រោយ (Summative)៖</strong> ${escapeHtml(assessment.summative)}
            </td>
          </tr>
        </table>

        ${
          selfReflection
            ? `
          <h2 class="sec-title">V. ការឆ្លុះបញ្ចាំងរបស់គ្រូ (Teacher's Self-Reflection)</h2>
          <div style="padding: 4pt 6pt; border: 1pt solid #fef08a; background-color: #fffbeb; font-style: italic; font-size: 9.5pt; margin-bottom: 6pt; page-break-inside: avoid;">
            ${escapeHtml(selfReflection)}
          </div>
        `
            : ''
        }

        <!-- Section VI: Signatures in a native 3-column table (Word Safe & Compact - No Overflow) -->
        <table width="100%" border="0" cellpadding="0" cellspacing="0" style="width: 100%; table-layout: fixed; border: none; margin-top: 8pt; page-break-inside: avoid; mso-line-break-inside: avoid; font-size: 9.5pt;">
          <tr style="border: none; page-break-inside: avoid; mso-line-break-inside: avoid;">
            <!-- Column 1: Principal -->
            <td width="33%" align="center" valign="top" style="width: 33%; border: none; text-align: center; vertical-align: top; padding: 2pt 4pt; overflow: hidden;">
              <div style="font-weight: bold; font-size: 10pt; color: #000000;">បានឃើញ និងឯកភាព</div>
              <div style="font-size: 8.5pt; color: #475569; margin-top: 1pt;">ថ្ងៃទី..... ខែ..... ឆ្នាំ២០២៦</div>
              <div style="font-weight: bold; font-size: 9pt; color: #1e293b; margin-top: 1pt;">នាយក / នាយិកាសាលា</div>
              <div style="margin-top: 20pt; font-family: Arial, sans-serif; letter-spacing: 0.5pt; color: #475569; font-size: 9pt;">..........................</div>
              <div style="margin-top: 2pt; font-weight: bold; font-size: 9.5pt; color: #000000;">
                ឈ្មោះ ៖ ${escapeHtml(teacherInfo.principalName || '....................................')}
              </div>
            </td>

            <!-- Column 2: Technical Team Head -->
            <td width="34%" align="center" valign="top" style="width: 34%; border: none; text-align: center; vertical-align: top; padding: 2pt 4pt; overflow: hidden;">
              <div style="font-weight: bold; font-size: 10pt; color: #000000;">បានពិនិត្យត្រឹមត្រូវ</div>
              <div style="font-size: 8.5pt; color: #475569; margin-top: 1pt;">ថ្ងៃទី..... ខែ..... ឆ្នាំ២០២៦</div>
              <div style="font-weight: bold; font-size: 9pt; color: #1e293b; margin-top: 1pt;">ប្រធានក្រុមបច្ចេកទេស</div>
              <div style="margin-top: 20pt; font-family: Arial, sans-serif; letter-spacing: 0.5pt; color: #475569; font-size: 9pt;">..........................</div>
              <div style="margin-top: 2pt; font-weight: bold; font-size: 9.5pt; color: #000000;">
                ឈ្មោះ ៖ ${escapeHtml(teacherInfo.headOfTechnicalTeam || '....................................')}
              </div>
            </td>

            <!-- Column 3: Teacher -->
            <td width="33%" align="center" valign="top" style="width: 33%; border: none; text-align: center; vertical-align: top; padding: 2pt 4pt; overflow: hidden;">
              <div style="font-size: 9pt; color: #000000;">ធ្វើនៅ ${escapeHtml(teacherInfo.schoolName || '....................................')}</div>
              <div style="font-size: 8.5pt; color: #475569; margin-top: 1pt;">${escapeHtml(teacherInfo.date || 'ថ្ងៃទី.....ខែ.....ឆ្នាំ២០២៦')}</div>
              <div style="font-weight: bold; font-size: 9pt; color: #1e293b; margin-top: 1pt;">ហត្ថលេខា និងឈ្មោះគ្រូបង្រៀន</div>
              <div style="margin-top: 20pt; font-family: Arial, sans-serif; letter-spacing: 0.5pt; color: #475569; font-size: 9pt;">..........................</div>
              <div style="margin-top: 2pt; font-weight: bold; font-size: 9.5pt; color: #000000;">
                ឈ្មោះ ៖ ${escapeHtml(teacherInfo.teacherName)}
              </div>
            </td>
          </tr>
        </table>
      </div>
    </body>
    </html>
  `;
}

export function downloadFile(content: string, filename: string, mimeType: string = 'text/html') {
  const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
