// Pedagogical SVG diagrams and illustrations for lesson plans
// 100% offline-ready, responsive, crisp for A4 printing and export.
// Dynamically matches the specific subject, chapter, lesson title, and subtopic.

export interface StepVisualInfo {
  url: string;
  caption: string;
  topicType?: string;
}

export interface DiagramCatalogItem {
  id: string;
  title: string;
  subject: string;
  description: string;
  svgUrl: string;
}

// Helper to encode SVG string into data URI with MathType font support
export function encodeSvg(svgContent: string): string {
  let svg = svgContent.trim();
  if (!svg.includes('mathtype-svg-style')) {
    const styleTag = `
      <defs>
        <style id="mathtype-svg-style">
          @import url('https://fonts.googleapis.com/css2?family=Kantumruy+Pro:wght@400;600;700&amp;family=STIX+Two+Math&amp;display=swap');
          .mathtype-formula, .math-eq { font-family: 'Cambria Math', 'STIX Two Math', 'Times New Roman', serif; }
          .math-var { font-family: 'Cambria Math', 'STIX Two Math', 'Times New Roman', serif; font-style: italic; }
        </style>
      </defs>`;
    svg = svg.replace(/<svg([^>]*)>/, `<svg$1>${styleTag}`);
  }
  return 'data:image/svg+xml;utf8,' + encodeURIComponent(svg);
}

/* =========================================================================
   DIAGRAM SVG BUILDERS (Tailored to specific subjects and lesson contents)
   ========================================================================= */

// 1. Physics: Temperature & Scales (Celsius, Kelvin, Fahrenheit)
export function getPhysicsTemperatureDiagram(): string {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 165">
      <defs>
        <linearGradient id="gradTemp" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#38bdf8"/>
          <stop offset="50%" stop-color="#10b981"/>
          <stop offset="100%" stop-color="#f97316"/>
        </linearGradient>
      </defs>
      <rect width="540" height="165" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <text x="270" y="24" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="13" fill="#0f172a" text-anchor="middle">ដ្យាក្រាមប្រៀបធៀបមាត្រដ្ឋានសីតុណ្ហភាព៖ Celsius, Kelvin, Fahrenheit</text>
      
      <!-- Celsius -->
      <rect x="25" y="38" width="145" height="98" rx="7" fill="#f0f9ff" stroke="#0284c7" stroke-width="1.2"/>
      <rect x="25" y="38" width="145" height="24" rx="7" fill="#0284c7"/>
      <text x="97" y="55" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="12" fill="#ffffff" text-anchor="middle">Celsius (°C)</text>
      <text x="97" y="78" font-family="sans-serif" font-weight="bold" font-size="11" fill="#dc2626" text-anchor="middle">100°C (ទឹកពុះ)</text>
      <text x="97" y="96" font-family="sans-serif" font-weight="bold" font-size="11" fill="#16a34a" text-anchor="middle">37°C (មនុស្ស)</text>
      <text x="97" y="114" font-family="sans-serif" font-weight="bold" font-size="11" fill="#0284c7" text-anchor="middle">0°C (ទឹកកក)</text>
      <text x="97" y="129" font-family="sans-serif" font-size="9.5" fill="#64748b" text-anchor="middle">-273.15°C (សូន្យដាច់ខាត)</text>

      <!-- Kelvin -->
      <rect x="195" y="38" width="150" height="98" rx="7" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.2"/>
      <rect x="195" y="38" width="150" height="24" rx="7" fill="#16a34a"/>
      <text x="270" y="55" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="12" fill="#ffffff" text-anchor="middle">Kelvin (K)</text>
      <text x="270" y="78" font-family="sans-serif" font-weight="bold" font-size="11" fill="#dc2626" text-anchor="middle">373.15 K (ទឹកពុះ)</text>
      <text x="270" y="96" font-family="sans-serif" font-weight="bold" font-size="11" fill="#16a34a" text-anchor="middle">310.15 K (មនុស្ស)</text>
      <text x="270" y="114" font-family="sans-serif" font-weight="bold" font-size="11" fill="#16a34a" text-anchor="middle">273.15 K (ទឹកកក)</text>
      <text x="270" y="129" font-family="sans-serif" font-size="9.5" fill="#64748b" text-anchor="middle">0 K (Absolute Zero)</text>

      <!-- Fahrenheit -->
      <rect x="370" y="38" width="145" height="98" rx="7" fill="#fff7ed" stroke="#ea580c" stroke-width="1.2"/>
      <rect x="370" y="38" width="145" height="24" rx="7" fill="#ea580c"/>
      <text x="442" y="55" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="12" fill="#ffffff" text-anchor="middle">Fahrenheit (°F)</text>
      <text x="442" y="78" font-family="sans-serif" font-weight="bold" font-size="11" fill="#dc2626" text-anchor="middle">212°F (ទឹកពុះ)</text>
      <text x="442" y="96" font-family="sans-serif" font-weight="bold" font-size="11" fill="#16a34a" text-anchor="middle">98.6°F (មនុស្ស)</text>
      <text x="442" y="114" font-family="sans-serif" font-weight="bold" font-size="11" fill="#ea580c" text-anchor="middle">32°F (ទឹកកក)</text>
      <text x="442" y="129" font-family="sans-serif" font-size="9.5" fill="#64748b" text-anchor="middle">-459.67°F (សូន្យដាច់ខាត)</text>

      <!-- Bottom Formulas (MathType Style) -->
      <rect x="25" y="142" width="490" height="18" rx="4" fill="#ede9fe" stroke="#c4b5fd"/>
      <text x="270" y="155" font-family="serif" font-style="italic" font-weight="bold" font-size="11" fill="#4338ca" text-anchor="middle">T(K) = t(°C) + 273.15   |   t(°F) = 1.8 × t(°C) + 32   |   t(°C) = (t(°F) - 32) / 1.8</text>
    </svg>
  `;
}

// 2. Physics: Mechanics & Force / Newton's Laws
export function getPhysicsMechanicsDiagram(): string {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 165">
      <rect width="540" height="165" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <text x="270" y="24" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="13" fill="#0f172a" text-anchor="middle">ដ្យាក្រាមមេកានិច៖ កម្លាំង ចលនា និងច្បាប់ញូតុន (F = m × a)</text>
      
      <rect x="25" y="38" width="150" height="98" rx="7" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.2"/>
      <text x="100" y="60" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="12" fill="#1e40af" text-anchor="middle">កម្លាំង និងម៉ាស</text>
      <text x="100" y="82" font-family="serif" font-style="italic" font-weight="bold" font-size="14" fill="#2563eb" text-anchor="middle">F = m × a</text>
      <text x="100" y="104" font-family="sans-serif" font-size="10" fill="#475569" text-anchor="middle">F: កម្លាំង (Newton, N)</text>
      <text x="100" y="122" font-family="sans-serif" font-size="10" fill="#475569" text-anchor="middle">m: ម៉ាស (kg), a: សំទុះ (m/s²)</text>

      <rect x="195" y="38" width="150" height="98" rx="7" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.2"/>
      <text x="270" y="60" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="12" fill="#15803d" text-anchor="middle">ទម្ងន់ និងទំនាញដី</text>
      <text x="270" y="82" font-family="serif" font-style="italic" font-weight="bold" font-size="14" fill="#16a34a" text-anchor="middle">P = m × g</text>
      <text x="270" y="104" font-family="sans-serif" font-size="10" fill="#475569" text-anchor="middle">P: ទម្ងន់ (N)</text>
      <text x="270" y="122" font-family="sans-serif" font-size="10" fill="#475569" text-anchor="middle">g ≈ 9.8 m/s² (សំទុះទំនាញដី)</text>

      <rect x="365" y="38" width="150" height="98" rx="7" fill="#fff7ed" stroke="#ea580c" stroke-width="1.2"/>
      <text x="440" y="60" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="12" fill="#c2410c" text-anchor="middle">ការងារ និងថាមពល</text>
      <text x="440" y="82" font-family="serif" font-style="italic" font-weight="bold" font-size="14" fill="#ea580c" text-anchor="middle">W = F × d</text>
      <text x="440" y="104" font-family="sans-serif" font-size="10" fill="#475569" text-anchor="middle">W: ការងារ (Joule, J)</text>
      <text x="440" y="122" font-family="sans-serif" font-size="10" fill="#475569" text-anchor="middle">d: ចម្ងាយផ្លាស់ទី (m)</text>

      <rect x="25" y="142" width="490" height="18" rx="4" fill="#e0e7ff" stroke="#a5b4fc"/>
      <text x="270" y="155" font-family="'Kantumruy Pro', sans-serif" font-size="10.5" fill="#3730a3" text-anchor="middle">គោលការណ៍គ្រឹះនៃរូបវិទ្យាមេកានិច និងច្បាប់ចលនាទាំងបីរបស់លោក អ៊ីសាក់ ញូតុន</text>
    </svg>
  `;
}

// 3. Physics: Electricity & Circuits (Ohm's Law, Series vs Parallel)
export function getPhysicsElectricityDiagram(): string {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 165">
      <rect width="540" height="165" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <text x="270" y="24" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="13" fill="#0f172a" text-anchor="middle">ដ្យាក្រាមអគ្គិសនី៖ ច្បាប់អូម និងការតសៀគ្វី (តជាស៊េរី និងតជាខ្នែង)</text>
      
      <rect x="25" y="38" width="150" height="98" rx="7" fill="#fefce8" stroke="#ca8a04" stroke-width="1.2"/>
      <text x="100" y="58" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="12" fill="#854d0e" text-anchor="middle">ច្បាប់អូម (Ohm's Law)</text>
      <text x="100" y="80" font-family="serif" font-style="italic" font-weight="bold" font-size="15" fill="#b45309" text-anchor="middle">U = R × I</text>
      <text x="100" y="102" font-family="sans-serif" font-size="10" fill="#475569" text-anchor="middle">U: តង់ស្យុង (Volt, V)</text>
      <text x="100" y="120" font-family="sans-serif" font-size="10" fill="#475569" text-anchor="middle">I: ចរន្ត (A), R: រេស៊ីស្តង់ (Ω)</text>

      <rect x="195" y="38" width="150" height="98" rx="7" fill="#f0f9ff" stroke="#0284c7" stroke-width="1.2"/>
      <text x="270" y="58" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="12" fill="#0369a1" text-anchor="middle">សៀគ្វីតជាស៊េរី</text>
      <text x="270" y="78" font-family="serif" font-style="italic" font-size="11" fill="#0284c7" text-anchor="middle">I = I₁ = I₂ = ...</text>
      <text x="270" y="98" font-family="serif" font-style="italic" font-size="11" fill="#0284c7" text-anchor="middle">U = U₁ + U₂</text>
      <text x="270" y="120" font-family="serif" font-style="italic" font-weight="bold" font-size="11.5" fill="#0369a1" text-anchor="middle">R_eq = R₁ + R₂</text>

      <rect x="365" y="38" width="150" height="98" rx="7" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.2"/>
      <text x="440" y="58" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="12" fill="#15803d" text-anchor="middle">សៀគ្វីតជាខ្នែង</text>
      <text x="440" y="78" font-family="serif" font-style="italic" font-size="11" fill="#16a34a" text-anchor="middle">U = U₁ = U₂ = ...</text>
      <text x="440" y="98" font-family="serif" font-style="italic" font-size="11" fill="#16a34a" text-anchor="middle">I = I₁ + I₂</text>
      <text x="440" y="120" font-family="serif" font-style="italic" font-weight="bold" font-size="11.5" fill="#15803d" text-anchor="middle">1/R_eq = 1/R₁ + 1/R₂</text>

      <rect x="25" y="142" width="490" height="18" rx="4" fill="#fef9c3" stroke="#fde047"/>
      <text x="270" y="155" font-family="serif" font-style="italic" font-size="10.5" fill="#713f12" text-anchor="middle">អានុភាពអគ្គិសនី៖ P = U × I = R × I²   |   ថាមពលអគ្គិសនី៖ E = P × t</text>
    </svg>
  `;
}

// 4. Mathematics: Quadratic Equations & Parabola
export function getMathQuadraticDiagram(): string {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 165">
      <rect width="540" height="165" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <text x="270" y="24" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="13" fill="#0f172a" text-anchor="middle">ដ្យាក្រាមគណិតវិទ្យា៖ សមីការដឺក្រេទី២ និងឌីសគ្រីមីណង់ Δ = b² - 4ac</text>
      
      <rect x="25" y="38" width="150" height="98" rx="7" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.2"/>
      <text x="100" y="58" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="12" fill="#1e40af" text-anchor="middle">ករណី Δ > 0</text>
      <text x="100" y="78" font-family="'Kantumruy Pro', sans-serif" font-size="10.5" fill="#1e3a8a" text-anchor="middle">មានឫសពីរផ្សេងគ្នា</text>
      <text x="100" y="98" font-family="serif" font-style="italic" font-weight="bold" font-size="11" fill="#2563eb" text-anchor="middle">x₁, x₂ = (-b ± √Δ) / 2a</text>
      <text x="100" y="120" font-family="sans-serif" font-size="9.5" fill="#64748b" text-anchor="middle">ប៉ារ៉ាបូលកាត់អ័ក្ស x ត្រង់ ២ ចំណុច</text>

      <rect x="195" y="38" width="150" height="98" rx="7" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.2"/>
      <text x="270" y="58" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="12" fill="#15803d" text-anchor="middle">ករណី Δ = 0</text>
      <text x="270" y="78" font-family="'Kantumruy Pro', sans-serif" font-size="10.5" fill="#14532d" text-anchor="middle">មានឫសឌុបតែមួយ</text>
      <text x="270" y="98" font-family="serif" font-style="italic" font-weight="bold" font-size="12" fill="#16a34a" text-anchor="middle">x₀ = -b / 2a</text>
      <text x="270" y="120" font-family="sans-serif" font-size="9.5" fill="#64748b" text-anchor="middle">ប៉ារ៉ាបូលប៉ះអ័ក្ស x ត្រង់កំពូល</text>

      <rect x="365" y="38" width="150" height="98" rx="7" fill="#fef2f2" stroke="#ef4444" stroke-width="1.2"/>
      <text x="440" y="58" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="12" fill="#b91c1c" text-anchor="middle">ករណី Δ &lt; 0</text>
      <text x="440" y="78" font-family="'Kantumruy Pro', sans-serif" font-size="10.5" fill="#7f1d1d" text-anchor="middle">គ្មានឫសក្នុងសំណុំ ℝ</text>
      <text x="440" y="98" font-family="serif" font-style="italic" font-weight="bold" font-size="11" fill="#dc2626" text-anchor="middle">S = ∅ (គ្មានឫសពិត)</text>
      <text x="440" y="120" font-family="sans-serif" font-size="9.5" fill="#64748b" text-anchor="middle">ប៉ារ៉ាបូលមិនកាត់អ័ក្ស x ទេ</text>

      <rect x="25" y="142" width="490" height="18" rx="4" fill="#ede9fe" stroke="#c4b5fd"/>
      <text x="270" y="155" font-family="serif" font-style="italic" font-weight="bold" font-size="11" fill="#4338ca" text-anchor="middle">ទម្រង់ទូទៅ៖ ax² + bx + c = 0 (a ≠ 0)   |   ផលបូកឫស S = -b/a   |   ផលគុណឫស P = c/a</text>
    </svg>
  `;
}

// 5. Mathematics: Geometry & Pythagoras / Trigonometry
export function getMathGeometryDiagram(): string {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 165">
      <rect width="540" height="165" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <text x="270" y="24" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="13" fill="#0f172a" text-anchor="middle">ដ្យាក្រាមធរណីមាត្រ៖ ទ្រឹស្តីបទពីតាក័រ និងផលធៀបត្រីកោណមាត្រ</text>
      
      <rect x="25" y="38" width="150" height="98" rx="7" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.2"/>
      <text x="100" y="58" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="12" fill="#1e40af" text-anchor="middle">ទ្រឹស្តីបទពីតាក័រ</text>
      <text x="100" y="80" font-family="serif" font-style="italic" font-weight="bold" font-size="14" fill="#2563eb" text-anchor="middle">c² = a² + b²</text>
      <text x="100" y="102" font-family="sans-serif" font-size="10" fill="#475569" text-anchor="middle">c: អ៊ីប៉ូតេនុស</text>
      <text x="100" y="120" font-family="sans-serif" font-size="10" fill="#475569" text-anchor="middle">a, b: ជ្រុងជាប់មុំកែង</text>

      <rect x="195" y="38" width="150" height="98" rx="7" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.2"/>
      <text x="270" y="58" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="12" fill="#15803d" text-anchor="middle">ស៊ីនុស និងកូស៊ីនុស</text>
      <text x="270" y="80" font-family="serif" font-style="italic" font-size="11.5" fill="#16a34a" text-anchor="middle">sin(α) = ឈម / អ៊ីប៉ូតេនុស</text>
      <text x="270" y="100" font-family="serif" font-style="italic" font-size="11.5" fill="#16a34a" text-anchor="middle">cos(α) = ជាប់ / អ៊ីប៉ូតេនុស</text>
      <text x="270" y="120" font-family="serif" font-style="italic" font-size="10.5" fill="#64748b" text-anchor="middle">sin²(α) + cos²(α) = 1</text>

      <rect x="365" y="38" width="150" height="98" rx="7" fill="#fff7ed" stroke="#ea580c" stroke-width="1.2"/>
      <text x="440" y="58" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="12" fill="#c2410c" text-anchor="middle">តង់សង់ និងកូតង់សង់</text>
      <text x="440" y="80" font-family="serif" font-style="italic" font-size="11.5" fill="#ea580c" text-anchor="middle">tan(α) = ឈម / ជាប់</text>
      <text x="440" y="100" font-family="serif" font-style="italic" font-size="11.5" fill="#ea580c" text-anchor="middle">cot(α) = ជាប់ / ឈម</text>
      <text x="440" y="120" font-family="serif" font-style="italic" font-size="10.5" fill="#64748b" text-anchor="middle">tan(α) = sin(α) / cos(α)</text>

      <rect x="25" y="142" width="490" height="18" rx="4" fill="#ede9fe" stroke="#c4b5fd"/>
      <text x="270" y="155" font-family="'Kantumruy Pro', sans-serif" font-size="10.5" fill="#4338ca" text-anchor="middle">អនុវត្តចំពោះត្រីកោណកែង៖ ផលបូកមុំក្នុងត្រីកោណ = 180°   |   ផ្ទៃក្រឡា S = (1/2) × a × b</text>
    </svg>
  `;
}

// 5b. Mathematics: Mathematical Logic, Propositions & Truth Tables (សញ្ញានៃសំណើ & តក្កវិទ្យា)
export function getMathLogicPropositionDiagram(): string {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 170">
      <rect width="540" height="170" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <text x="270" y="22" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="13" fill="#0f172a" text-anchor="middle">ដ្យាក្រាមតក្កវិទ្យា៖ សញ្ញានៃសំណើ ឈ្នាប់តក្កវិទ្យា និងតារាងតម្លៃពិត</text>
      
      <!-- Block 1: Proposition & Negation -->
      <rect x="20" y="34" width="155" height="106" rx="7" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.2"/>
      <rect x="20" y="34" width="155" height="22" rx="7" fill="#2563eb"/>
      <text x="97" y="49" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="11" fill="#ffffff" text-anchor="middle">១. សំណើ &amp; បដិសេធ</text>
      <text x="97" y="70" font-family="serif" font-size="10" fill="#1e40af" text-anchor="middle">សំណើ p (ពិត = 1, មិនពិត = 0)</text>
      <text x="97" y="88" font-family="serif" font-weight="bold" font-size="11" fill="#1d4ed8" text-anchor="middle">បដិសេធ៖ ~p (ឬ p̄)</text>
      <text x="97" y="106" font-family="sans-serif" font-size="9.5" fill="#475569" text-anchor="middle">p = 1 ⇒ ~p = 0</text>
      <text x="97" y="123" font-family="sans-serif" font-size="9.5" fill="#475569" text-anchor="middle">p = 0 ⇒ ~p = 1</text>
      <text x="97" y="135" font-family="sans-serif" font-size="8.5" fill="#64748b" text-anchor="middle">~(~p) ≡ p (បដិសេធពីរដង)</text>

      <!-- Block 2: Connectives AND / OR -->
      <rect x="185" y="34" width="165" height="106" rx="7" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.2"/>
      <rect x="185" y="34" width="165" height="22" rx="7" fill="#16a34a"/>
      <text x="267" y="49" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="11" fill="#ffffff" text-anchor="middle">២. ឈ្នាប់ «និង» &amp; ឈ្នាប់ «ឬ»</text>
      <text x="267" y="70" font-family="serif" font-weight="bold" font-size="10.5" fill="#15803d" text-anchor="middle">ឈ្នាប់ «និង» ៖ p ∧ q (Conjunction)</text>
      <text x="267" y="86" font-family="sans-serif" font-size="9" fill="#166534" text-anchor="middle">• ពិត (1) លុះត្រា p=1 និង q=1</text>
      <text x="267" y="104" font-family="serif" font-weight="bold" font-size="10.5" fill="#15803d" text-anchor="middle">ឈ្នាប់ «ឬ» ៖ p ∨ q (Disjunction)</text>
      <text x="267" y="120" font-family="sans-serif" font-size="9" fill="#166534" text-anchor="middle">• មិនពិត (0) លុះត្រា p=0 និង q=0</text>
      <text x="267" y="135" font-family="sans-serif" font-size="8.5" fill="#64748b" text-anchor="middle">Morgan: ~(p ∧ q) ≡ ~p ∨ ~q</text>

      <!-- Block 3: Implication & Equivalence -->
      <rect x="360" y="34" width="160" height="106" rx="7" fill="#fefce8" stroke="#ca8a04" stroke-width="1.2"/>
      <rect x="360" y="34" width="160" height="22" rx="7" fill="#ca8a04"/>
      <text x="440" y="49" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="11" fill="#ffffff" text-anchor="middle">៣. ឈ្នាប់ «នាំឲ្យ» &amp; «សមមូល»</text>
      <text x="440" y="70" font-family="serif" font-weight="bold" font-size="10.5" fill="#854d0e" text-anchor="middle">ឈ្នាប់ «នាំឲ្យ» ៖ p ⇒ q</text>
      <text x="440" y="86" font-family="sans-serif" font-size="9" fill="#713f12" text-anchor="middle">• មិនពិត (0) តែពេល p=1 និង q=0</text>
      <text x="440" y="104" font-family="serif" font-weight="bold" font-size="10.5" fill="#854d0e" text-anchor="middle">ឈ្នាប់ «សមមូល» ៖ p ⇔ q</text>
      <text x="440" y="120" font-family="sans-serif" font-size="9" fill="#713f12" text-anchor="middle">• ពិត (1) ពេល p និង q មានតម្លៃដូចគ្នា</text>
      <text x="440" y="135" font-family="sans-serif" font-size="8.5" fill="#64748b" text-anchor="middle">(p ⇔ q) ≡ (p ⇒ q) ∧ (q ⇒ p)</text>

      <!-- Bottom Summary Bar -->
      <rect x="20" y="146" width="500" height="18" rx="4" fill="#ede9fe" stroke="#c4b5fd"/>
      <text x="270" y="159" font-family="serif" font-weight="bold" font-size="10.5" fill="#4338ca" text-anchor="middle">សញ្ញាតក្កវិទ្យា៖ ~ (បដិសេធ)   |   ∧ (និង)   |   ∨ (ឬ)   |   ⇒ (នាំឲ្យ)   |   ⇔ (សមមូល)   |   តារាងតម្លៃពិត (Truth Table)</text>
    </svg>
  `;
}

// 5c. Mathematics: Vectors & Dot Product (វ៉ិចទ័រក្នុងប្លង់ និងលំហ)
export function getMathVectorDiagram(): string {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 170">
      <rect width="540" height="170" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <text x="270" y="22" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="13" fill="#0f172a" text-anchor="middle">ដ្យាក្រាមគណិតវិទ្យា៖ វ៉ិចទ័រក្នុងប្លង់ និងផលគុណស្កាលែ</text>
      
      <rect x="20" y="34" width="155" height="106" rx="7" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.2"/>
      <rect x="20" y="34" width="155" height="22" rx="7" fill="#2563eb"/>
      <text x="97" y="49" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="11" fill="#ffffff" text-anchor="middle">១. កូអរដោនេ &amp; ណ័រម៉</text>
      <text x="97" y="72" font-family="serif" font-weight="bold" font-size="11" fill="#1e40af" text-anchor="middle">u⃗ = (x, y) = x·i⃗ + y·j⃗</text>
      <text x="97" y="92" font-family="serif" font-size="10.5" fill="#1d4ed8" text-anchor="middle">ណ័រម៉៖ ||u⃗|| = √(x² + y²)</text>
      <text x="97" y="112" font-family="sans-serif" font-size="9.5" fill="#475569" text-anchor="middle">AB⃗ = (xB - xA, yB - yA)</text>
      <text x="97" y="130" font-family="sans-serif" font-size="9" fill="#64748b" text-anchor="middle">ចម្ងាយ AB = ||AB⃗||</text>

      <rect x="185" y="34" width="165" height="106" rx="7" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.2"/>
      <rect x="185" y="34" width="165" height="22" rx="7" fill="#16a34a"/>
      <text x="267" y="49" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="11" fill="#ffffff" text-anchor="middle">២. ប្រមាណវិធីលើវ៉ិចទ័រ</text>
      <text x="267" y="72" font-family="serif" font-weight="bold" font-size="11" fill="#15803d" text-anchor="middle">ផលបូក៖ u⃗ + v⃗ = (x+x', y+y')</text>
      <text x="267" y="92" font-family="serif" font-size="10" fill="#166534" text-anchor="middle">វិធាន Chasles: AB⃗ + BC⃗ = AC⃗</text>
      <text x="267" y="112" font-family="serif" font-size="10" fill="#166534" text-anchor="middle">វិធានប្រលេឡូក្រាម</text>
      <text x="267" y="130" font-family="serif" font-size="9" fill="#64748b" text-anchor="middle">គុណស្កាលែ៖ k·u⃗ = (kx, ky)</text>

      <rect x="360" y="34" width="160" height="106" rx="7" fill="#fff7ed" stroke="#ea580c" stroke-width="1.2"/>
      <rect x="360" y="34" width="160" height="22" rx="7" fill="#ea580c"/>
      <text x="440" y="49" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="11" fill="#ffffff" text-anchor="middle">៣. ផលគុណស្កាលែ &amp; អរតូកូណាល់</text>
      <text x="440" y="72" font-family="serif" font-weight="bold" font-size="11" fill="#c2410c" text-anchor="middle">u⃗ · v⃗ = x·x' + y·y'</text>
      <text x="440" y="92" font-family="serif" font-size="10" fill="#9a3412" text-anchor="middle">u⃗ · v⃗ = ||u⃗||·||v⃗||·cos(θ)</text>
      <text x="440" y="112" font-family="sans-serif" font-size="9.5" fill="#9a3412" text-anchor="middle">u⃗ ⊥ v⃗ ⇔ u⃗ · v⃗ = 0</text>
      <text x="440" y="130" font-family="sans-serif" font-size="8.5" fill="#64748b" text-anchor="middle">u⃗ || v⃗ ⇔ x·y' - x'·y = 0</text>

      <rect x="20" y="146" width="500" height="18" rx="4" fill="#ede9fe" stroke="#c4b5fd"/>
      <text x="270" y="159" font-family="serif" font-weight="bold" font-size="10.5" fill="#4338ca" text-anchor="middle">វ៉ិចទ័រ៖ ណ័រម៉ ||u⃗||   |   ផលបូក u⃗ + v⃗   |   ផលគុណស្កាលែ u⃗ · v⃗   |   មុំរវាងវ៉ិចទ័រ cos(θ)</text>
    </svg>
  `;
}

// 5d. Mathematics: Fractions, Decimals & Arithmetic (ប្រភាគ ចំនួនទសភាគ និងប្រមាណវិធី)
export function getMathFractionsArithmeticDiagram(): string {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 170">
      <rect width="540" height="170" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <text x="270" y="22" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="13" fill="#0f172a" text-anchor="middle">ដ្យាក្រាមគណិតវិទ្យា៖ ប្រភាគ ចំនួនទសភាគ និងប្រមាណវិធីគ្រឹះ</text>
      
      <!-- Block 1: Fractions -->
      <rect x="20" y="34" width="155" height="106" rx="7" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.2"/>
      <rect x="20" y="34" width="155" height="22" rx="7" fill="#2563eb"/>
      <text x="97" y="49" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="11" fill="#ffffff" text-anchor="middle">១. ប្រភាគ (Fractions)</text>
      <text x="97" y="70" font-family="serif" font-weight="bold" font-size="12" fill="#1e40af" text-anchor="middle">a / b  (b ≠ 0)</text>
      <text x="97" y="88" font-family="sans-serif" font-size="9.5" fill="#1d4ed8" text-anchor="middle">a: ភាគយក , b: ភាគបែង</text>
      <text x="97" y="106" font-family="serif" font-size="10.5" fill="#1e3a8a" text-anchor="middle">a/b ± c/b = (a±c)/b</text>
      <text x="97" y="123" font-family="serif" font-size="10" fill="#475569" text-anchor="middle">a/b × c/d = (ac)/(bd)</text>
      <text x="97" y="135" font-family="sans-serif" font-size="8.5" fill="#64748b" text-anchor="middle">ចែក៖ a/b ÷ c/d = a/b × d/c</text>

      <!-- Block 2: Decimals & Percentages -->
      <rect x="185" y="34" width="165" height="106" rx="7" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.2"/>
      <rect x="185" y="34" width="165" height="22" rx="7" fill="#16a34a"/>
      <text x="267" y="49" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="11" fill="#ffffff" text-anchor="middle">២. ទសភាគ &amp; ភាគរយ</text>
      <text x="267" y="70" font-family="serif" font-weight="bold" font-size="11" fill="#15803d" text-anchor="middle">1/4 = 0.25 = 25%</text>
      <text x="267" y="88" font-family="serif" font-size="10.5" fill="#15803d" text-anchor="middle">3/4 = 0.75 = 75%</text>
      <text x="267" y="106" font-family="sans-serif" font-size="9" fill="#166534" text-anchor="middle">ការបំប្លែងរវាងប្រភាគ និងទសភាគ</text>
      <text x="267" y="122" font-family="serif" font-size="9.5" fill="#166534" text-anchor="middle">ភាគរយ៖ P = (តម្លៃ/សរុប) × 100%</text>
      <text x="267" y="135" font-family="sans-serif" font-size="8.5" fill="#64748b" text-anchor="middle">ការបង្គត់ទសភាគត្រឹមខ្ទង់កំណត់</text>

      <!-- Block 3: Order of Operations -->
      <rect x="360" y="34" width="160" height="106" rx="7" fill="#fefce8" stroke="#ca8a04" stroke-width="1.2"/>
      <rect x="360" y="34" width="160" height="22" rx="7" fill="#ca8a04"/>
      <text x="440" y="49" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="11" fill="#ffffff" text-anchor="middle">៣. លំដាប់ប្រមាណវិធី (PEMDAS)</text>
      <text x="440" y="70" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="10" fill="#854d0e" text-anchor="middle">១. ក្នុងវង់ក្រចក ( )</text>
      <text x="440" y="86" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="10" fill="#854d0e" text-anchor="middle">២. ស្វ័យគុណ &amp; រ៉ាឌីកាល់ aⁿ, √a</text>
      <text x="440" y="104" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="10" fill="#854d0e" text-anchor="middle">៣. គុណ (×) &amp; ចែក (÷)</text>
      <text x="440" y="120" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="10" fill="#854d0e" text-anchor="middle">៤. បូក (+) &amp; ដក (-)</text>
      <text x="440" y="135" font-family="sans-serif" font-size="8.5" fill="#64748b" text-anchor="middle">គិតពីឆ្វេងទៅស្តាំជាលំដាប់</text>

      <!-- Bottom Summary -->
      <rect x="20" y="146" width="500" height="18" rx="4" fill="#ede9fe" stroke="#c4b5fd"/>
      <text x="270" y="159" font-family="serif" font-weight="bold" font-size="10.5" fill="#4338ca" text-anchor="middle">ប្រមាណវិធីលេខនព្វន្ធ៖ ប្រភាគ a/b   |   ទសភាគ   |   ភាគរយ %   |   តម្រូវភាគបែងរួម (LCM)</text>
    </svg>
  `;
}

// 5e. Mathematics: Linear Equations & Systems (ពីជគណិត និងប្រព័ន្ធសមីការ)
export function getMathAlgebraSystemDiagram(): string {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 170">
      <rect width="540" height="170" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <text x="270" y="22" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="13" fill="#0f172a" text-anchor="middle">ដ្យាក្រាមពិជគណិត៖ សមីការលីនេអ៊ែរ និងប្រព័ន្ធសមីការ</text>
      
      <!-- Block 1: Linear Equation -->
      <rect x="20" y="34" width="155" height="106" rx="7" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.2"/>
      <rect x="20" y="34" width="155" height="22" rx="7" fill="#2563eb"/>
      <text x="97" y="49" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="11" fill="#ffffff" text-anchor="middle">១. សមីការដឺក្រេទី១</text>
      <text x="97" y="70" font-family="serif" font-weight="bold" font-size="12" fill="#1e40af" text-anchor="middle">ax + b = 0  (a ≠ 0)</text>
      <text x="97" y="88" font-family="serif" font-weight="bold" font-size="12" fill="#1d4ed8" text-anchor="middle">x = -b / a</text>
      <text x="97" y="106" font-family="sans-serif" font-size="9" fill="#475569" text-anchor="middle">វិសមីការ៖ ax + b &gt; 0</text>
      <text x="97" y="122" font-family="sans-serif" font-size="8.5" fill="#475569" text-anchor="middle">បើ a &lt; 0 ត្រូវប្តូរទិសដៅវិសមភាព</text>
      <text x="97" y="135" font-family="sans-serif" font-size="8.5" fill="#64748b" text-anchor="middle">តារាងសញ្ញានៃ ax + b</text>

      <!-- Block 2: System of Equations -->
      <rect x="185" y="34" width="165" height="106" rx="7" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.2"/>
      <rect x="185" y="34" width="165" height="22" rx="7" fill="#16a34a"/>
      <text x="267" y="49" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="11" fill="#ffffff" text-anchor="middle">២. ប្រព័ន្ធសមីការ (២ អថេរ)</text>
      <text x="267" y="70" font-family="serif" font-weight="bold" font-size="10.5" fill="#15803d" text-anchor="middle">{ ax + by = c</text>
      <text x="267" y="86" font-family="serif" font-weight="bold" font-size="10.5" fill="#15803d" text-anchor="middle">{ a'x + b'y = c'</text>
      <text x="267" y="104" font-family="'Kantumruy Pro', sans-serif" font-size="9" fill="#166534" text-anchor="middle">• វិធីជំនួស (Substitution)</text>
      <text x="267" y="120" font-family="'Kantumruy Pro', sans-serif" font-size="9" fill="#166534" text-anchor="middle">• វិធីបូកបំបាត់ (Elimination)</text>
      <text x="267" y="135" font-family="'Kantumruy Pro', sans-serif" font-size="8.5" fill="#64748b" text-anchor="middle">• វិធីក្រាប (ចំណុចប្រសព្វបន្ទាត់)</text>

      <!-- Block 3: Special Products -->
      <rect x="360" y="34" width="160" height="106" rx="7" fill="#fefce8" stroke="#ca8a04" stroke-width="1.2"/>
      <rect x="360" y="34" width="160" height="22" rx="7" fill="#ca8a04"/>
      <text x="440" y="49" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="11" fill="#ffffff" text-anchor="middle">៣. ផលគុណពិសេស &amp; កន្សោម</text>
      <text x="440" y="70" font-family="serif" font-size="10" fill="#854d0e" text-anchor="middle">(a + b)² = a² + 2ab + b²</text>
      <text x="440" y="86" font-family="serif" font-size="10" fill="#854d0e" text-anchor="middle">(a - b)² = a² - 2ab + b²</text>
      <text x="440" y="104" font-family="serif" font-size="10" fill="#854d0e" text-anchor="middle">a² - b² = (a - b)(a + b)</text>
      <text x="440" y="120" font-family="sans-serif" font-size="9" fill="#713f12" text-anchor="middle">ការដាក់ជាផលគុណកត្តា</text>
      <text x="440" y="135" font-family="sans-serif" font-size="8.5" fill="#64748b" text-anchor="middle">សម្រួលកន្សោមសនិទាន</text>

      <!-- Bottom Summary -->
      <rect x="20" y="146" width="500" height="18" rx="4" fill="#ede9fe" stroke="#c4b5fd"/>
      <text x="270" y="159" font-family="serif" font-weight="bold" font-size="10.5" fill="#4338ca" text-anchor="middle">ពិជគណិត៖ សមីការលីនេអ៊ែរ   |   ប្រព័ន្ធសមីការ   |   ផលគុណពិសេស   |   សំណុំចម្លើយ S = {x}</text>
    </svg>
  `;
}

// 5f. Mathematics: Geometry - Perimeter, Area & Volume (បរិមាត្រ ផ្ទៃក្រឡា និងមាឌ)
export function getMathShapesAreaVolumeDiagram(): string {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 170">
      <rect width="540" height="170" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <text x="270" y="22" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="13" fill="#0f172a" text-anchor="middle">ដ្យាក្រាមធរណីមាត្រ៖ បរិមាត្រ ផ្ទៃក្រឡា និងមាឌនៃរូបធរណីមាត្រ</text>
      
      <!-- Block 1: 2D Plane Shapes -->
      <rect x="20" y="34" width="155" height="106" rx="7" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.2"/>
      <rect x="20" y="34" width="155" height="22" rx="7" fill="#2563eb"/>
      <text x="97" y="49" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="11" fill="#ffffff" text-anchor="middle">១. រូបប្លង់ (ផ្ទៃក្រឡា S)</text>
      <text x="97" y="70" font-family="serif" font-size="10" fill="#1e40af" text-anchor="middle">ចតុកោណកែង៖ S = L × w</text>
      <text x="97" y="86" font-family="serif" font-size="10" fill="#1e40af" text-anchor="middle">ការ៉េ៖ S = a²   |   P = 4a</text>
      <text x="97" y="104" font-family="serif" font-size="10" fill="#1e40af" text-anchor="middle">ត្រីកោណ៖ S = (1/2) b × h</text>
      <text x="97" y="120" font-family="serif" font-size="9.5" fill="#475569" text-anchor="middle">ចតុកោណព្នាយ៖ S = (a+b)h/2</text>
      <text x="97" y="135" font-family="sans-serif" font-size="8.5" fill="#64748b" text-anchor="middle">បរិមាត្រ P: ផលបូកប្រវែងជ្រុង</text>

      <!-- Block 2: Circle & Disc -->
      <rect x="185" y="34" width="165" height="106" rx="7" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.2"/>
      <rect x="185" y="34" width="165" height="22" rx="7" fill="#16a34a"/>
      <text x="267" y="49" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="11" fill="#ffffff" text-anchor="middle">២. រង្វង់ និងថាស (Circle)</text>
      <text x="267" y="70" font-family="serif" font-weight="bold" font-size="11" fill="#15803d" text-anchor="middle">បរិមាត្រ៖ C = 2πr = πd</text>
      <text x="267" y="88" font-family="serif" font-weight="bold" font-size="11" fill="#15803d" text-anchor="middle">ផ្ទៃក្រឡាថាស៖ S = πr²</text>
      <text x="267" y="106" font-family="sans-serif" font-size="9" fill="#166534" text-anchor="middle">π ≈ 3.14159... (ឬ 22/7)</text>
      <text x="267" y="122" font-family="serif" font-size="9.5" fill="#166534" text-anchor="middle">ធ្នូរង្វង់៖ L = (πrθ) / 180°</text>
      <text x="267" y="135" font-family="sans-serif" font-size="8.5" fill="#64748b" text-anchor="middle">ផ្លិតរង្វង់៖ S = (πr²θ) / 360°</text>

      <!-- Block 3: 3D Solids & Volume -->
      <rect x="360" y="34" width="160" height="106" rx="7" fill="#fff7ed" stroke="#ea580c" stroke-width="1.2"/>
      <rect x="360" y="34" width="160" height="22" rx="7" fill="#ea580c"/>
      <text x="440" y="49" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="11" fill="#ffffff" text-anchor="middle">៣. រូបក្នុងលំហ (មាឌ V)</text>
      <text x="440" y="70" font-family="serif" font-size="10" fill="#c2410c" text-anchor="middle">ប្រលេឡូពីប៉ែត៖ V = L × w × h</text>
      <text x="440" y="86" font-family="serif" font-size="10" fill="#c2410c" text-anchor="middle">គូប៖ V = a³   |   Stot = 6a²</text>
      <text x="440" y="104" font-family="serif" font-size="10" fill="#c2410c" text-anchor="middle">ស៊ីឡាំង៖ V = πr²h</text>
      <text x="440" y="120" font-family="serif" font-size="9.5" fill="#9a3412" text-anchor="middle">កោន៖ V = (1/3)πr²h</text>
      <text x="440" y="135" font-family="serif" font-size="9" fill="#9a3412" text-anchor="middle">ស្វ៊ែរ៖ V = (4/3)πr³   |   S = 4πr²</text>

      <!-- Bottom Summary -->
      <rect x="20" y="146" width="500" height="18" rx="4" fill="#ede9fe" stroke="#c4b5fd"/>
      <text x="270" y="159" font-family="serif" font-weight="bold" font-size="10.5" fill="#4338ca" text-anchor="middle">ខ្នាតរង្វាស់៖ ប្រវែង (m, cm)   |   ផ្ទៃក្រឡា (m², cm²)   |   មាឌ (m³, cm³, L)   |   1 m³ = 1000 L</text>
    </svg>
  `;
}

// 5g. Mathematics: Statistics & Probability (ស្ថិតិ និងប្រូបាប)
export function getMathStatisticsProbabilityDiagram(): string {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 170">
      <rect width="540" height="170" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <text x="270" y="22" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="13" fill="#0f172a" text-anchor="middle">ដ្យាក្រាមស្ថិតិ និងប្រូបាប៖ តម្លៃកណ្តាល និងការពិសោធន៍ចៃដន្យ</text>
      
      <!-- Block 1: Central Tendency -->
      <rect x="20" y="34" width="155" height="106" rx="7" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.2"/>
      <rect x="20" y="34" width="155" height="22" rx="7" fill="#2563eb"/>
      <text x="97" y="49" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="11" fill="#ffffff" text-anchor="middle">១. រង្វាស់ទីតាំងកណ្តាល</text>
      <text x="97" y="70" font-family="serif" font-weight="bold" font-size="11" fill="#1e40af" text-anchor="middle">មធ្យមភាគ៖ x̄ = Σx / N</text>
      <text x="97" y="88" font-family="'Kantumruy Pro', sans-serif" font-size="9.5" fill="#1d4ed8" text-anchor="middle">• មេដ្យាន (Median, Me)</text>
      <text x="97" y="104" font-family="sans-serif" font-size="8.5" fill="#475569" text-anchor="middle">តម្លៃកណ្តាលនៃទិន្នន័យរៀបតាមលំដាប់</text>
      <text x="97" y="120" font-family="'Kantumruy Pro', sans-serif" font-size="9.5" fill="#1d4ed8" text-anchor="middle">• ម៉ូត (Mode, Mo)</text>
      <text x="97" y="135" font-family="sans-serif" font-size="8.5" fill="#64748b" text-anchor="middle">តម្លៃដែលមានប្រេកង់ធំជាងគេ</text>

      <!-- Block 2: Data Presentation -->
      <rect x="185" y="34" width="165" height="106" rx="7" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.2"/>
      <rect x="185" y="34" width="165" height="22" rx="7" fill="#16a34a"/>
      <text x="267" y="49" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="11" fill="#ffffff" text-anchor="middle">២. ការបង្ហាញទិន្នន័យ</text>
      <text x="267" y="70" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="10.5" fill="#15803d" text-anchor="middle">• តារាងបំណែងចែកប្រេកង់</text>
      <text x="267" y="86" font-family="'Kantumruy Pro', sans-serif" font-size="9.5" fill="#166534" text-anchor="middle">• ដ្យាក្រាមបង្គោល (Bar Chart)</text>
      <text x="267" y="104" font-family="'Kantumruy Pro', sans-serif" font-size="9.5" fill="#166534" text-anchor="middle">• ដ្យាក្រាមផ្លិត (Pie Chart) θ = f/N × 360°</text>
      <text x="267" y="120" font-family="'Kantumruy Pro', sans-serif" font-size="9" fill="#166534" text-anchor="middle">• អ៊ីស្តូក្រាម និងពហុកោណប្រេកង់</text>
      <text x="267" y="135" font-family="sans-serif" font-size="8.5" fill="#64748b" text-anchor="middle">វិសាលភាព R = x_max - x_min</text>

      <!-- Block 3: Probability -->
      <rect x="360" y="34" width="160" height="106" rx="7" fill="#fefce8" stroke="#ca8a04" stroke-width="1.2"/>
      <rect x="360" y="34" width="160" height="22" rx="7" fill="#ca8a04"/>
      <text x="440" y="49" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="11" fill="#ffffff" text-anchor="middle">៣. ទ្រឹស្តីប្រូបាប (Probability)</text>
      <text x="440" y="70" font-family="serif" font-weight="bold" font-size="11.5" fill="#854d0e" text-anchor="middle">P(A) = n(A) / n(S)</text>
      <text x="440" y="88" font-family="sans-serif" font-size="9" fill="#713f12" text-anchor="middle">n(A): ចំនួនករណីស្រប</text>
      <text x="440" y="104" font-family="sans-serif" font-size="9" fill="#713f12" text-anchor="middle">n(S): ចំនួនករណីអាចទាំងអស់</text>
      <text x="440" y="120" font-family="serif" font-weight="bold" font-size="10.5" fill="#b45309" text-anchor="middle">0 ≤ P(A) ≤ 1</text>
      <text x="440" y="135" font-family="serif" font-size="8.5" fill="#64748b" text-anchor="middle">ព្រឹត្តិការណ៍ផ្ទុយ៖ P(Ā) = 1 - P(A)</text>

      <!-- Bottom Summary -->
      <rect x="20" y="146" width="500" height="18" rx="4" fill="#ede9fe" stroke="#c4b5fd"/>
      <text x="270" y="159" font-family="serif" font-weight="bold" font-size="10.5" fill="#4338ca" text-anchor="middle">ស្ថិតិ និងប្រូបាប៖ x̄ (មធ្យម)   |   Me (មេដ្យាន)   |   Mo (ម៉ូត)   |   P(A) (ប្រូបាប)   |   លំហសំណាក S</text>
    </svg>
  `;
}

// 5h. Mathematics: Problem Solving & Word Problems (Polya's 4 Steps - វិធីសាស្ត្រដោះស្រាយចំណោទគណិតវិទ្យា)
export function getMathProblemSolvingPolyaDiagram(): string {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 170">
      <rect width="540" height="170" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <text x="270" y="22" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="13" fill="#0f172a" text-anchor="middle">ដ្យាក្រាមវិធីសាស្ត្រដោះស្រាយចំណោទគណិតវិទ្យា (Polya's 4 Steps)</text>
      
      <!-- Step 1: Understand -->
      <rect x="18" y="34" width="120" height="106" rx="7" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.2"/>
      <rect x="18" y="34" width="120" height="22" rx="7" fill="#2563eb"/>
      <text x="78" y="49" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="10.5" fill="#ffffff" text-anchor="middle">១. យល់បញ្ហា</text>
      <text x="78" y="70" font-family="'Kantumruy Pro', sans-serif" font-size="9" fill="#1e40af" text-anchor="middle">• អានប្រធានចំណោទ</text>
      <text x="78" y="86" font-family="'Kantumruy Pro', sans-serif" font-size="9" fill="#1e40af" text-anchor="middle">• កំណត់បម្រាប់ស្គាល់</text>
      <text x="78" y="104" font-family="'Kantumruy Pro', sans-serif" font-size="9" fill="#1e40af" text-anchor="middle">• កំណត់សំណួររក</text>
      <text x="78" y="122" font-family="'Kantumruy Pro', sans-serif" font-size="8.5" fill="#475569" text-anchor="middle">តើទិន្នន័យគ្រប់គ្រាន់ទេ?</text>

      <!-- Step 2: Plan -->
      <rect x="146" y="34" width="120" height="106" rx="7" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.2"/>
      <rect x="146" y="34" width="120" height="22" rx="7" fill="#16a34a"/>
      <text x="206" y="49" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="10.5" fill="#ffffff" text-anchor="middle">២. ធ្វើផែនការ</text>
      <text x="206" y="70" font-family="'Kantumruy Pro', sans-serif" font-size="9" fill="#15803d" text-anchor="middle">• រកទំនាក់ទំនងគណិត</text>
      <text x="206" y="86" font-family="'Kantumruy Pro', sans-serif" font-size="9" fill="#15803d" text-anchor="middle">• ជ្រើសរើសរូបមន្ត</text>
      <text x="206" y="104" font-family="'Kantumruy Pro', sans-serif" font-size="9" fill="#15803d" text-anchor="middle">• គូរគំនូសតាង/ដ្យាក្រាម</text>
      <text x="206" y="122" font-family="'Kantumruy Pro', sans-serif" font-size="8.5" fill="#166534" text-anchor="middle">បង្កើតសមីការតាងអថេរ</text>

      <!-- Step 3: Execute -->
      <rect x="274" y="34" width="120" height="106" rx="7" fill="#fff7ed" stroke="#ea580c" stroke-width="1.2"/>
      <rect x="274" y="34" width="120" height="22" rx="7" fill="#ea580c"/>
      <text x="334" y="49" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="10.5" fill="#ffffff" text-anchor="middle">៣. អនុវត្តផែនការ</text>
      <text x="334" y="70" font-family="'Kantumruy Pro', sans-serif" font-size="9" fill="#c2410c" text-anchor="middle">• ជំនួសលេខចូលរូបមន្ត</text>
      <text x="334" y="86" font-family="'Kantumruy Pro', sans-serif" font-size="9" fill="#c2410c" text-anchor="middle">• គណនាតាមលំដាប់</text>
      <text x="334" y="104" font-family="'Kantumruy Pro', sans-serif" font-size="9" fill="#c2410c" text-anchor="middle">• ដោះស្រាយសមីការ</text>
      <text x="334" y="122" font-family="'Kantumruy Pro', sans-serif" font-size="8.5" fill="#9a3412" text-anchor="middle">រកតម្លៃអថេរ និងចម្លើយ</text>

      <!-- Step 4: Verify -->
      <rect x="402" y="34" width="120" height="106" rx="7" fill="#faf5ff" stroke="#a855f7" stroke-width="1.2"/>
      <rect x="402" y="34" width="120" height="22" rx="7" fill="#9333ea"/>
      <text x="462" y="49" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="10.5" fill="#ffffff" text-anchor="middle">៤. ផ្ទៀងផ្ទាត់</text>
      <text x="462" y="70" font-family="'Kantumruy Pro', sans-serif" font-size="9" fill="#7e22ce" text-anchor="middle">• ពិនិត្យលទ្ធផលលេខ</text>
      <text x="462" y="86" font-family="'Kantumruy Pro', sans-serif" font-size="9" fill="#7e22ce" text-anchor="middle">• ផ្ទៀងបម្រាប់ដើម</text>
      <text x="462" y="104" font-family="'Kantumruy Pro', sans-serif" font-size="9" fill="#7e22ce" text-anchor="middle">• ដាក់ខ្នាតរង្វាស់ (m,kg)</text>
      <text x="462" y="122" font-family="'Kantumruy Pro', sans-serif" font-size="8.5" fill="#6b21a8" text-anchor="middle">សរសេរចម្លើយឆ្លើយតប</text>

      <!-- Bottom Summary -->
      <rect x="18" y="146" width="504" height="18" rx="4" fill="#ede9fe" stroke="#c4b5fd"/>
      <text x="270" y="159" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="10" fill="#4338ca" text-anchor="middle">វិធីសាស្ត្រគន្លឹះដោះស្រាយចំណោទគណិតវិទ្យា ៤ ជំហានរបស់លោក George Pólya (ស្វែងយល់ ➔ ផែនការ ➔ អនុវត្ត ➔ ផ្ទៀងផ្ទាត់)</text>
    </svg>
  `;
}

// 5i. Mathematics: Calculus - Limits, Derivatives & Integrals (លីមីត ដេរីវេ និងអាំងតេក្រាល)
export function getMathCalculusDiagram(): string {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 170">
      <rect width="540" height="170" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <text x="270" y="22" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="13" fill="#0f172a" text-anchor="middle">ដ្យាក្រាមគណិតវិទ្យាជាន់ខ្ពស់៖ លីមីត ដេរីវេ និងអាំងតេក្រាល</text>
      
      <!-- Block 1: Limits -->
      <rect x="20" y="34" width="155" height="106" rx="7" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.2"/>
      <rect x="20" y="34" width="155" height="22" rx="7" fill="#2563eb"/>
      <text x="97" y="49" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="11" fill="#ffffff" text-anchor="middle">១. លីមីតនៃអនុគមន៍</text>
      <text x="97" y="70" font-family="serif" font-weight="bold" font-size="12" fill="#1e40af" text-anchor="middle">lim (x→a) f(x) = L</text>
      <text x="97" y="88" font-family="'Kantumruy Pro', sans-serif" font-size="9.5" fill="#1d4ed8" text-anchor="middle">ទម្រង់មិនកំណត់៖</text>
      <text x="97" y="106" font-family="serif" font-weight="bold" font-size="10.5" fill="#dc2626" text-anchor="middle">0/0 ,  ∞/∞ ,  +∞ - ∞ ,  0 × ∞</text>
      <text x="97" y="122" font-family="'Kantumruy Pro', sans-serif" font-size="9" fill="#475569" text-anchor="middle">វិធីដោះស្រាយ៖ ដាក់ជាផលគុណ</text>
      <text x="97" y="135" font-family="'Kantumruy Pro', sans-serif" font-size="8.5" fill="#64748b" text-anchor="middle">គុណកន្សោមឆ្លាស់ ឬរូបមន្តត្រីកោណមាត្រ</text>

      <!-- Block 2: Derivatives -->
      <rect x="185" y="34" width="165" height="106" rx="7" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.2"/>
      <rect x="185" y="34" width="165" height="22" rx="7" fill="#16a34a"/>
      <text x="267" y="49" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="11" fill="#ffffff" text-anchor="middle">២. ដេរីវេ និងការប្រែប្រួល</text>
      <text x="267" y="70" font-family="serif" font-weight="bold" font-size="11" fill="#15803d" text-anchor="middle">f'(x) = lim (h→0) [f(x+h)-f(x)]/h</text>
      <text x="267" y="88" font-family="serif" font-size="10" fill="#15803d" text-anchor="middle">(xⁿ)' = n·xⁿ⁻¹   |   (uv)' = u'v + uv'</text>
      <text x="267" y="106" font-family="serif" font-size="10" fill="#166534" text-anchor="middle">(u/v)' = (u'v - uv') / v²</text>
      <text x="267" y="122" font-family="'Kantumruy Pro', sans-serif" font-size="9" fill="#166534" text-anchor="middle">មេគុណប្រាប់ទិសបន្ទាត់ប៉ះ k = f'(x₀)</text>
      <text x="267" y="135" font-family="'Kantumruy Pro', sans-serif" font-size="8.5" fill="#64748b" text-anchor="middle">ទិសដៅអថេរភាព និងបរមាប៉ះ (Min/Max)</text>

      <!-- Block 3: Integrals -->
      <rect x="360" y="34" width="160" height="106" rx="7" fill="#fefce8" stroke="#ca8a04" stroke-width="1.2"/>
      <rect x="360" y="34" width="160" height="22" rx="7" fill="#ca8a04"/>
      <text x="440" y="49" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="11" fill="#ffffff" text-anchor="middle">៣. អាំងតេក្រាល &amp; ផ្ទៃក្រឡា</text>
      <text x="440" y="70" font-family="serif" font-weight="bold" font-size="11.5" fill="#854d0e" text-anchor="middle">∫ f(x)dx = F(x) + C</text>
      <text x="440" y="88" font-family="serif" font-size="10" fill="#854d0e" text-anchor="middle">∫ xⁿ dx = xⁿ⁺¹/(n+1) + C</text>
      <text x="440" y="106" font-family="serif" font-size="10" fill="#713f12" text-anchor="middle">អាំងតេក្រាលកំណត់៖ ∫_a^b f(x)dx</text>
      <text x="440" y="122" font-family="serif" font-size="9.5" fill="#713f12" text-anchor="middle">= F(b) - F(a) (ផ្ទៃក្រោមខ្សែកោង)</text>
      <text x="440" y="135" font-family="'Kantumruy Pro', sans-serif" font-size="8.5" fill="#64748b" text-anchor="middle">អាំងតេក្រាលដោយផ្នែក៖ ∫udv = uv - ∫vdu</text>

      <!-- Bottom Summary -->
      <rect x="20" y="146" width="500" height="18" rx="4" fill="#ede9fe" stroke="#c4b5fd"/>
      <text x="270" y="159" font-family="serif" font-weight="bold" font-size="10.5" fill="#4338ca" text-anchor="middle">គណិតវិទ្យាវិភាគ៖ លីមីត lim   |   ដេរីវេ f'(x)   |   ព្រីមីទីវ F(x)   |   អាំងតេក្រាល ∫ f(x)dx</text>
    </svg>
  `;
}

// 5j. Mathematics: Universal Pedagogical Math Concept Map (For Any Math Lesson)
export function getMathUniversalConceptDiagram(
  lessonTitle: string = '',
  subTopic: string = '',
  chapter: string = '',
  objectivesList?: string[]
): string {
  const cleanTitle = (subTopic || lessonTitle || 'មេរៀនគណិតវិទ្យា').slice(0, 36);
  const p1 = objectivesList?.[0] ? objectivesList[0].slice(0, 26) : 'និយមន័យ & ទ្រឹស្តីបទគ្រឹះ';
  const p2 = objectivesList?.[1] ? objectivesList[1].slice(0, 26) : 'រូបមន្ត & ទំនាក់ទំនងគណនា';
  const p3 = objectivesList?.[2] ? objectivesList[2].slice(0, 26) : 'ដោះស្រាយលំហាត់ជាក់ស្តែង';

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 170">
      <defs>
        <pattern id="mathGrid" width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M 16 0 L 0 0 0 16" fill="none" stroke="#e2e8f0" stroke-width="0.7"/>
        </pattern>
      </defs>
      <rect width="540" height="170" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <rect width="540" height="170" rx="10" fill="url(#mathGrid)" opacity="0.4"/>
      
      <!-- Coordinate Axes Watermark -->
      <path d="M 40 145 L 500 145 M 495 142 L 502 145 L 495 148" stroke="#94a3b8" stroke-width="0.9" fill="none"/>
      <text x="506" y="148" font-family="serif" font-style="italic" font-size="10" fill="#64748b">x</text>
      
      <!-- Title -->
      <text x="270" y="22" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="12.5" fill="#0f172a" text-anchor="middle">ដ្យាក្រាមគណិតវិទ្យា៖ ${cleanTitle}</text>
      
      <!-- Card 1: Definition & Concept -->
      <rect x="20" y="34" width="155" height="106" rx="7" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.2"/>
      <rect x="20" y="34" width="155" height="22" rx="7" fill="#2563eb"/>
      <text x="97" y="49" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="11" fill="#ffffff" text-anchor="middle">១. ស្គាល់ &amp; និយមន័យ</text>
      <text x="97" y="70" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="10.5" fill="#1e40af" text-anchor="middle">• ${cleanTitle.slice(0, 16)}</text>
      <text x="97" y="88" font-family="'Kantumruy Pro', sans-serif" font-size="9.5" fill="#1e40af" text-anchor="middle">${p1.slice(0, 20)}</text>
      <text x="97" y="106" font-family="serif" font-style="italic" font-size="11" fill="#2563eb" text-anchor="middle">f(x),  y = ax + b,  ∑</text>
      <text x="97" y="123" font-family="'Kantumruy Pro', sans-serif" font-size="9" fill="#475569" text-anchor="middle">លក្ខខណ្ឌ និងដែនកំណត់</text>
      <text x="97" y="135" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="9" fill="#1d4ed8" text-anchor="middle">លំហាត់ទី១ (អនុវត្តផ្ទាល់)</text>

      <!-- Card 2: Formulas & Operations -->
      <rect x="185" y="34" width="165" height="106" rx="7" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.2"/>
      <rect x="185" y="34" width="165" height="22" rx="7" fill="#16a34a"/>
      <text x="267" y="49" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="11" fill="#ffffff" text-anchor="middle">២. រូបមន្ត &amp; ទំនាក់ទំនង</text>
      <text x="267" y="70" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="10.5" fill="#15803d" text-anchor="middle">• រូបមន្តគន្លឹះក្នុងមេរៀន</text>
      <text x="267" y="88" font-family="'Kantumruy Pro', sans-serif" font-size="9.5" fill="#166534" text-anchor="middle">${p2.slice(0, 22)}</text>
      <text x="267" y="106" font-family="serif" font-style="italic" font-weight="bold" font-size="11" fill="#16a34a" text-anchor="middle">A = B ⇔ f(A) = f(B)</text>
      <text x="267" y="123" font-family="'Kantumruy Pro', sans-serif" font-size="9" fill="#166534" text-anchor="middle">ជំហានបំប្លែង និងគណនា</text>
      <text x="267" y="135" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="9" fill="#15803d" text-anchor="middle">លំហាត់ទី២ (កម្រិតមធ្យម)</text>

      <!-- Card 3: Real Problem Solving -->
      <rect x="360" y="34" width="160" height="106" rx="7" fill="#fffbeb" stroke="#f59e0b" stroke-width="1.2"/>
      <rect x="360" y="34" width="160" height="22" rx="7" fill="#d97706"/>
      <text x="440" y="49" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="11" fill="#ffffff" text-anchor="middle">៣. អនុវត្តដោះស្រាយបញ្ហា</text>
      <text x="440" y="70" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="10.5" fill="#b45309" text-anchor="middle">• ត្រិះរិះពិចារណា PISA</text>
      <text x="440" y="88" font-family="'Kantumruy Pro', sans-serif" font-size="9.5" fill="#78350f" text-anchor="middle">${p3.slice(0, 22)}</text>
      <text x="440" y="106" font-family="serif" font-style="italic" font-size="10.5" fill="#b45309" text-anchor="middle">S = {ចម្លើយពិត},  x ∈ ℝ</text>
      <text x="440" y="123" font-family="'Kantumruy Pro', sans-serif" font-size="9" fill="#78350f" text-anchor="middle">អនុវត្តដោះស្រាយចំណោទ</text>
      <text x="440" y="135" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="9" fill="#d97706" text-anchor="middle">លំហាត់ទី៣ (ស្តង់ដារ PISA ⭐)</text>

      <!-- Bottom Summary -->
      <rect x="20" y="146" width="500" height="18" rx="4" fill="#ede9fe" stroke="#c4b5fd"/>
      <text x="270" y="159" font-family="'Kantumruy Pro', sans-serif" font-size="10" fill="#4338ca" text-anchor="middle">គណិតវិទ្យា — កម្មវិធីសិក្សាក្រសួងអប់រំ យុវជន និងកីឡា (MathType / Standard Curriculum)</text>
    </svg>
  `;
}


// 6. Chemistry: Acid, Base & pH Scale
export function getChemistryPhDiagram(): string {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 165">
      <rect width="540" height="165" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <text x="270" y="24" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="13" fill="#0f172a" text-anchor="middle">ដ្យាក្រាមគីមីវិទ្យា៖ មាត្រដ្ឋាន pH (អាស៊ីត មជ្ឈមណ្ឌល និងបាស)</text>
      
      <rect x="25" y="38" width="150" height="98" rx="7" fill="#fef2f2" stroke="#ef4444" stroke-width="1.2"/>
      <text x="100" y="58" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="12" fill="#b91c1c" text-anchor="middle">មជ្ឈដ្ឋានអាស៊ីត (Acid)</text>
      <text x="100" y="80" font-family="sans-serif" font-weight="bold" font-size="13" fill="#dc2626" text-anchor="middle">pH &lt; 7</text>
      <text x="100" y="100" font-family="sans-serif" font-size="10" fill="#475569" text-anchor="middle">[H⁺] &gt; [OH⁻]</text>
      <text x="100" y="118" font-family="sans-serif" font-size="9.5" fill="#64748b" text-anchor="middle">ក្រដាសលីតមុសប្រែពណ៌ក្រហម</text>

      <rect x="195" y="38" width="150" height="98" rx="7" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.2"/>
      <text x="270" y="58" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="12" fill="#15803d" text-anchor="middle">មជ្ឈដ្ឋានណឺត (Neutral)</text>
      <text x="270" y="80" font-family="sans-serif" font-weight="bold" font-size="13" fill="#16a34a" text-anchor="middle">pH = 7</text>
      <text x="270" y="100" font-family="sans-serif" font-size="10" fill="#475569" text-anchor="middle">[H⁺] = [OH⁻] = 10⁻⁷ M</text>
      <text x="270" y="118" font-family="sans-serif" font-size="9.5" fill="#64748b" text-anchor="middle">ទឹកបរិសុទ្ធ (Pure H₂O)</text>

      <rect x="365" y="38" width="150" height="98" rx="7" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.2"/>
      <text x="440" y="58" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="12" fill="#1e40af" text-anchor="middle">មជ្ឈដ្ឋានបាស (Base)</text>
      <text x="440" y="80" font-family="sans-serif" font-weight="bold" font-size="13" fill="#2563eb" text-anchor="middle">pH &gt; 7</text>
      <text x="440" y="100" font-family="sans-serif" font-size="10" fill="#475569" text-anchor="middle">[OH⁻] &gt; [H⁺]</text>
      <text x="440" y="118" font-family="sans-serif" font-size="9.5" fill="#64748b" text-anchor="middle">ក្រដាសលីតមុសប្រែពណ៌ខៀវ</text>

      <rect x="25" y="142" width="490" height="18" rx="4" fill="#ede9fe" stroke="#c4b5fd"/>
      <text x="270" y="155" font-family="serif" font-style="italic" font-size="10.5" fill="#4338ca" text-anchor="middle">រូបមន្ត pH៖ pH = -log[H₃O⁺]   |   pOH = -log[OH⁻]   |   pH + pOH = 14 (នៅ 25°C)</text>
    </svg>
  `;
}

// 7. Biology: Plant vs Animal Cell
export function getBiologyCellDiagram(): string {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 165">
      <rect width="540" height="165" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <text x="270" y="24" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="13" fill="#0f172a" text-anchor="middle">ដ្យាក្រាមជីវវិទ្យា៖ ការប្រៀបធៀបកោសិកាបំរែបំរួល (រុក្ខជាតិ និងសត្វ)</text>
      
      <rect x="25" y="38" width="150" height="98" rx="7" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.2"/>
      <text x="100" y="58" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="12" fill="#15803d" text-anchor="middle">កោសិការុក្ខជាតិ</text>
      <text x="100" y="78" font-family="sans-serif" font-size="10" fill="#166534" text-anchor="middle">• មានភ្នាសកោសិកា (Cell Wall)</text>
      <text x="100" y="96" font-family="sans-serif" font-size="10" fill="#166534" text-anchor="middle">• មានក្លរ៉ូប្លាស (Chloroplast)</text>
      <text x="100" y="114" font-family="sans-serif" font-size="10" fill="#166534" text-anchor="middle">• វ៉ាគុយអូលធំនៅកណ្តាល</text>

      <rect x="195" y="38" width="150" height="98" rx="7" fill="#ede9fe" stroke="#8b5cf6" stroke-width="1.2"/>
      <text x="270" y="58" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="12" fill="#6d28d9" text-anchor="middle">ចំណុចរួម (Common)</text>
      <text x="270" y="78" font-family="sans-serif" font-size="10" fill="#5b21b6" text-anchor="middle">• ស្នូលកោសិកា (Nucleus)</text>
      <text x="270" y="96" font-family="sans-serif" font-size="10" fill="#5b21b6" text-anchor="middle">• ស៊ីតូប្លាស និងមីតូកុងឌ្រី</text>
      <text x="270" y="114" font-family="sans-serif" font-size="10" fill="#5b21b6" text-anchor="middle">• ភ្នាសប្លាសម៉ា (Cell Membrane)</text>

      <rect x="365" y="38" width="150" height="98" rx="7" fill="#fef2f2" stroke="#ef4444" stroke-width="1.2"/>
      <text x="440" y="58" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="12" fill="#b91c1c" text-anchor="middle">កោសិកាសត្វ</text>
      <text x="440" y="78" font-family="sans-serif" font-size="10" fill="#991b1b" text-anchor="middle">• គ្មានភ្នាសកោសិកា (រាងមិនថេរ)</text>
      <text x="440" y="96" font-family="sans-serif" font-size="10" fill="#991b1b" text-anchor="middle">• គ្មានក្លរ៉ូប្លាស</text>
      <text x="440" y="114" font-family="sans-serif" font-size="10" fill="#991b1b" text-anchor="middle">• វ៉ាគុយអូលតូចៗជាច្រើន</text>

      <rect x="25" y="142" width="490" height="18" rx="4" fill="#dcfce7" stroke="#86efac"/>
      <text x="270" y="155" font-family="'Kantumruy Pro', sans-serif" font-size="10.5" fill="#14532d" text-anchor="middle">ការសំយោគពន្លឺ (Photosynthesis)៖ 6CO₂ + 6H₂O + ពន្លឺព្រះអាទិត្យ → C₆H₁₂O₆ + 6O₂</text>
    </svg>
  `;
}

// 8. Earth Science & Geography: Water Cycle & Atmosphere
export function getEarthWaterCycleDiagram(): string {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 165">
      <rect width="540" height="165" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <text x="270" y="24" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="13" fill="#0f172a" text-anchor="middle">ដ្យាក្រាមផែនដីវិទ្យា៖ វដ្តនៃទឹកក្នុងធម្មជាតិ (Water Cycle)</text>
      
      <rect x="25" y="38" width="150" height="98" rx="7" fill="#fff7ed" stroke="#ea580c" stroke-width="1.2"/>
      <text x="100" y="58" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="12" fill="#c2410c" text-anchor="middle">១. រំហួត (Evaporation)</text>
      <text x="100" y="78" font-family="sans-serif" font-size="10" fill="#9a3412" text-anchor="middle">កម្តៅព្រះអាទិត្យដុតកម្តៅទឹក</text>
      <text x="100" y="96" font-family="sans-serif" font-size="10" fill="#9a3412" text-anchor="middle">ទឹកប្រែជាចំហាយហើរឡើងលើ</text>
      <text x="100" y="114" font-family="sans-serif" font-size="10" fill="#9a3412" text-anchor="middle">រួមទាំងរំហួតពីរុក្ខជាតិ (Transpiration)</text>

      <rect x="195" y="38" width="150" height="98" rx="7" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.2"/>
      <text x="270" y="58" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="12" fill="#1e40af" text-anchor="middle">២. កំណក (Condensation)</text>
      <text x="270" y="78" font-family="sans-serif" font-size="10" fill="#1e3a8a" text-anchor="middle">ចំហាយទឹកឡើងខ្ពស់ជួបត្រជាក់</text>
      <text x="270" y="96" font-family="sans-serif" font-size="10" fill="#1e3a8a" text-anchor="middle">បង្រួមជាដំណក់ទឹកតូចៗ</text>
      <text x="270" y="114" font-family="sans-serif" font-size="10" fill="#1e3a8a" text-anchor="middle">បង្កើតបានជាពពក (Clouds)</text>

      <rect x="365" y="38" width="150" height="98" rx="7" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.2"/>
      <text x="440" y="58" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="12" fill="#15803d" text-anchor="middle">៣. ធ្លាក់ភ្លៀង (Precipitation)</text>
      <text x="440" y="78" font-family="sans-serif" font-size="10" fill="#14532d" text-anchor="middle">ពពកធ្ងន់ធ្លាក់ជាទឹកភ្លៀង/ព្រិល</text>
      <text x="440" y="96" font-family="sans-serif" font-size="10" fill="#14532d" text-anchor="middle">ហូរចូលស្ទឹង ទន្លេ សមុទ្រ (Runoff)</text>
      <text x="440" y="114" font-family="sans-serif" font-size="10" fill="#14532d" text-anchor="middle">និងជ្រាបជាទឹកក្រោមដី</text>

      <rect x="25" y="142" width="490" height="18" rx="4" fill="#e0f2fe" stroke="#7dd3fc"/>
      <text x="270" y="155" font-family="'Kantumruy Pro', sans-serif" font-size="10.5" fill="#0369a1" text-anchor="middle">វដ្តបន្តឥតឈប់ឈរ៖ រំហួត → កំណកពពក → ធ្លាក់ភ្លៀង → ហូរប្រមូលផ្តុំ → វិលជុំជាថ្មី</text>
    </svg>
  `;
}

// 9. Khmer Literature & Story Analysis
export function getKhmerLiteratureDiagram(): string {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 165">
      <rect width="540" height="165" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <text x="270" y="24" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="13" fill="#0f172a" text-anchor="middle">ដ្យាក្រាមភាសាខ្មែរ៖ រចនាសម្ព័ន្ធវិភាគរឿង និងអក្សរសិល្ប៍</text>
      
      <rect x="25" y="38" width="150" height="98" rx="7" fill="#fdf4ff" stroke="#c084fc" stroke-width="1.2"/>
      <text x="100" y="58" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="12" fill="#7e22ce" text-anchor="middle">១. បរិយាកាស និងតួអង្គ</text>
      <text x="100" y="78" font-family="sans-serif" font-size="10" fill="#581c87" text-anchor="middle">• កាលអាកាស (ពេលវេលា ទីកន្លែង)</text>
      <text x="100" y="96" font-family="sans-serif" font-size="10" fill="#581c87" text-anchor="middle">• តួអង្គឯក តួអង្គរង តួអង្គអម</text>
      <text x="100" y="114" font-family="sans-serif" font-size="10" fill="#581c87" text-anchor="middle">• ចរិតលក្ខណៈតួអង្គ</text>

      <rect x="195" y="38" width="150" height="98" rx="7" fill="#fff7ed" stroke="#ea580c" stroke-width="1.2"/>
      <text x="270" y="58" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="12" fill="#c2410c" text-anchor="middle">២. ទំនាស់ និងសកម្មភាព</text>
      <text x="270" y="78" font-family="sans-serif" font-size="10" fill="#7c2d12" text-anchor="middle">• ទំនាស់ផ្ទៃក្នុង (ចិត្ត និងមនោសញ្ចេតនា)</text>
      <text x="270" y="96" font-family="sans-serif" font-size="10" fill="#7c2d12" text-anchor="middle">• ទំនាស់ផ្ទៃក្រៅ (មនុស្ស និងសង្គម)</text>
      <text x="270" y="114" font-family="sans-serif" font-size="10" fill="#7c2d12" text-anchor="middle">• ចំណុចកំពូលនៃសាច់រឿង (Climax)</text>

      <rect x="365" y="38" width="150" height="98" rx="7" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.2"/>
      <text x="440" y="58" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="12" fill="#15803d" text-anchor="middle">៣. ដំណោះស្រាយ និងអត្ថន័យ</text>
      <text x="440" y="78" font-family="sans-serif" font-size="10" fill="#14532d" text-anchor="middle">• ដំណោះស្រាយនៃទំនាស់</text>
      <text x="440" y="96" font-family="sans-serif" font-size="10" fill="#14532d" text-anchor="middle">• ទស្សនៈអប់រំ និងតម្លៃសីលធម៌</text>
      <text x="440" y="114" font-family="sans-serif" font-size="10" fill="#14532d" text-anchor="middle">• គំនិតស្នូលរបស់អ្នកនិពន្ធ</text>

      <rect x="25" y="142" width="490" height="18" rx="4" fill="#fae8ff" stroke="#e879f9"/>
      <text x="270" y="155" font-family="'Kantumruy Pro', sans-serif" font-size="10.5" fill="#86198f" text-anchor="middle">វិធីសាស្ត្រតែងសេចក្តី និងវិភាគអត្ថបទ៖ សេចក្តីផ្តើម → តួសេចក្តី (បកស្រាយ ពិភាក្សា) → សេចក្តីបញ្ចប់</text>
    </svg>
  `;
}

// 10. Physics: Optics & Light (ពន្លឺ ចំណាំងផ្លាត កញ្ចក់ និងឡង់ទី)
export function getPhysicsOpticsDiagram(): string {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 165">
      <rect width="540" height="165" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <text x="270" y="24" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="13" fill="#0f172a" text-anchor="middle">ដ្យាក្រាមអុបទិច៖ ពន្លឺ ចំណាំងផ្លាត និងរូបមន្តឡង់ទី (1/f = 1/p + 1/p')</text>
      
      <rect x="25" y="38" width="150" height="98" rx="7" fill="#fefce8" stroke="#eab308" stroke-width="1.2"/>
      <text x="100" y="58" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="12" fill="#854d0e" text-anchor="middle">១. ច្បាប់ចំណាំងផ្លាត</text>
      <text x="100" y="78" font-family="serif" font-style="italic" font-weight="bold" font-size="13" fill="#ca8a04" text-anchor="middle">i = r   (មុំធ្លាក់ = មុំផ្លាត)</text>
      <text x="100" y="98" font-family="sans-serif" font-size="10" fill="#713f12" text-anchor="middle">កាំពន្លឺធ្លាក់ កាំពន្លឺផ្លាត</text>
      <text x="100" y="116" font-family="sans-serif" font-size="10" fill="#713f12" text-anchor="middle">ស្ថិតក្នុងប្លង់តែមួយ</text>

      <rect x="195" y="38" width="150" height="98" rx="7" fill="#f0f9ff" stroke="#0284c7" stroke-width="1.2"/>
      <text x="270" y="58" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="12" fill="#0369a1" text-anchor="middle">២. ច្បាប់កំណុំ (Snell-Descartes)</text>
      <text x="270" y="78" font-family="serif" font-style="italic" font-weight="bold" font-size="13" fill="#0284c7" text-anchor="middle">n₁ · sin(i₁) = n₂ · sin(i₂)</text>
      <text x="270" y="98" font-family="sans-serif" font-size="10" fill="#075985" text-anchor="middle">n: សន្ទស្សន៍ចំណាំងបែរ</text>
      <text x="270" y="116" font-family="sans-serif" font-size="10" fill="#075985" text-anchor="middle">ពន្លឺឆ្លងកាត់មជ្ឈដ្ឋានពីរ</text>

      <rect x="365" y="38" width="150" height="98" rx="7" fill="#eff6ff" stroke="#3b82f6" stroke-width="1.2"/>
      <text x="440" y="58" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="12" fill="#1d4ed8" text-anchor="middle">៣. រូបមន្តឡង់ទីស្តើង</text>
      <text x="440" y="78" font-family="serif" font-style="italic" font-weight="bold" font-size="13" fill="#2563eb" text-anchor="middle">1/f = 1/p + 1/p'</text>
      <text x="440" y="98" font-family="sans-serif" font-size="10" fill="#1e40af" text-anchor="middle">f: កំណុំ, p: ចម្ងាយវត្ថុ</text>
      <text x="440" y="116" font-family="sans-serif" font-size="10" fill="#1e40af" text-anchor="middle">p': ចម្ងាយរូបភាព, γ = -p'/p</text>

      <rect x="25" y="142" width="490" height="18" rx="4" fill="#fef9c3" stroke="#fde047"/>
      <text x="270" y="155" font-family="'Kantumruy Pro', sans-serif" font-size="10.5" fill="#713f12" text-anchor="middle">អុបទិចធរណីមាត្រ៖ លក្ខណៈរូបភាពពិត/មិនពិត នៃកញ្ចក់ស្វ៊ែរ និងឡង់ទីបង្រួម/ពង្រីក</text>
    </svg>
  `;
}

// 11. Chemistry: Reactions & Conservation of Mass
export function getChemistryReactionsDiagram(): string {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 165">
      <rect width="540" height="165" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <text x="270" y="24" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="13" fill="#0f172a" text-anchor="middle">ដ្យាក្រាមគីមីវិទ្យា៖ ប្រតិកម្មគីមី និងច្បាប់រក្សាម៉ាស (ឡាវ៉ូស៊ីយេ)</text>
      
      <rect x="25" y="38" width="150" height="98" rx="7" fill="#ecfeff" stroke="#06b6d4" stroke-width="1.2"/>
      <text x="100" y="58" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="12" fill="#0e7490" text-anchor="middle">១. អង្គធាតុប្រតិករ</text>
      <text x="100" y="78" font-family="serif" font-style="italic" font-weight="bold" font-size="14" fill="#0891b2" text-anchor="middle">A + B</text>
      <text x="100" y="98" font-family="sans-serif" font-size="10" fill="#155e75" text-anchor="middle">ចំណងគីមីចាស់ត្រូវបំបែក</text>
      <text x="100" y="116" font-family="sans-serif" font-size="10" fill="#155e75" text-anchor="middle">ម៉ាសសរុប = m(A) + m(B)</text>

      <path d="M180 87 L205 87" stroke="#0891b2" stroke-width="3" marker-end="url(#arrow)"/>

      <rect x="195" y="38" width="150" height="98" rx="7" fill="#f0fdf4" stroke="#22c55e" stroke-width="1.2"/>
      <text x="270" y="58" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="12" fill="#15803d" text-anchor="middle">២. ការរក្សាអាតូម</text>
      <text x="270" y="78" font-family="serif" font-style="italic" font-weight="bold" font-size="13" fill="#16a34a" text-anchor="middle">Σ m(ប្រតិករ) = Σ m(កកើត)</text>
      <text x="270" y="98" font-family="sans-serif" font-size="10" fill="#166534" text-anchor="middle">ចំនួនអាតូមប្រភេទនីមួយៗ</text>
      <text x="270" y="116" font-family="sans-serif" font-size="10" fill="#166534" text-anchor="middle">រក្សាតម្លៃថេរគ្មានបាត់បង់</text>

      <rect x="365" y="38" width="150" height="98" rx="7" fill="#fef2f2" stroke="#ef4444" stroke-width="1.2"/>
      <text x="440" y="58" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="12" fill="#b91c1c" text-anchor="middle">៣. អង្គធាតុកកើត</text>
      <text x="440" y="78" font-family="serif" font-style="italic" font-weight="bold" font-size="14" fill="#dc2626" text-anchor="middle">C + D</text>
      <text x="440" y="98" font-family="sans-serif" font-size="10" fill="#991b1b" text-anchor="middle">ចំណងគីមីថ្មីកកើតឡើង</text>
      <text x="440" y="116" font-family="sans-serif" font-size="10" fill="#991b1b" text-anchor="middle">លក្ខណៈរូប និងគីមីថ្មី</text>

      <rect x="25" y="142" width="490" height="18" rx="4" fill="#e0f2fe" stroke="#38bdf8"/>
      <text x="270" y="155" font-family="'Kantumruy Pro', sans-serif" font-size="10.5" fill="#0369a1" text-anchor="middle">ច្បាប់ឡាវ៉ូស៊ីយេ៖ គ្មានអ្វីបាត់បង់ គ្មានអ្វីបង្កើតថ្មី គ្រប់យ៉ាងប្រែប្រួលរូបរាង</text>
    </svg>
  `;
}

// 12. Biology: Genetics & Mendel Laws
export function getBiologyGeneticsDiagram(): string {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 165">
      <rect width="540" height="165" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <text x="270" y="24" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="13" fill="#0f172a" text-anchor="middle">ដ្យាក្រាមសេនេទិច៖ ក្រូម៉ូសូម ហ្សែន និងច្បាប់តំណពូជមែនដែល</text>
      
      <rect x="25" y="38" width="150" height="98" rx="7" fill="#f5f3ff" stroke="#8b5cf6" stroke-width="1.2"/>
      <text x="100" y="58" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="12" fill="#6d28d9" text-anchor="middle">១. ហ្សែន និងអាឡែល</text>
      <text x="100" y="78" font-family="serif" font-style="italic" font-weight="bold" font-size="13" fill="#7c3aed" text-anchor="middle">AA, Aa, aa</text>
      <text x="100" y="98" font-family="sans-serif" font-size="10" fill="#5b21b6" text-anchor="middle">ហ្សែនលេច (A) គ្របសង្កត់</text>
      <text x="100" y="116" font-family="sans-serif" font-size="10" fill="#5b21b6" text-anchor="middle">ហ្សែនបន្ទាប់បន្សំ (a)</text>

      <rect x="195" y="38" width="150" height="98" rx="7" fill="#fdf2f8" stroke="#ec4899" stroke-width="1.2"/>
      <text x="270" y="58" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="12" fill="#be185d" text-anchor="middle">២. ជំនាន់កូន F1</text>
      <text x="270" y="78" font-family="serif" font-style="italic" font-weight="bold" font-size="13" fill="#db2777" text-anchor="middle">100% ឯកសណ្ឋាន [A]</text>
      <text x="270" y="98" font-family="sans-serif" font-size="10" fill="#9d174d" text-anchor="middle">សេណូទីបទាំងអស់គឺ Aa</text>
      <text x="270" y="116" font-family="sans-serif" font-size="10" fill="#9d174d" text-anchor="middle">បង្ហាញតែលក្ខណៈលេច</text>

      <rect x="365" y="38" width="150" height="98" rx="7" fill="#f0fdf4" stroke="#16a34a" stroke-width="1.2"/>
      <text x="440" y="58" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="12" fill="#15803d" text-anchor="middle">៣. ជំនាន់កូន F2</text>
      <text x="440" y="78" font-family="serif" font-style="italic" font-weight="bold" font-size="13" fill="#16a34a" text-anchor="middle">ផលធៀប 3 : 1</text>
      <text x="440" y="98" font-family="sans-serif" font-size="10" fill="#14532d" text-anchor="middle">3 ផេណូទីប [A] : 1 [a]</text>
      <text x="440" y="116" font-family="sans-serif" font-size="10" fill="#14532d" text-anchor="middle">1 AA : 2 Aa : 1 aa</text>

      <rect x="25" y="142" width="490" height="18" rx="4" fill="#ede9fe" stroke="#c4b5fd"/>
      <text x="270" y="155" font-family="'Kantumruy Pro', sans-serif" font-size="10.5" fill="#5b21b6" text-anchor="middle">ច្បាប់មែនដែល៖ ច្បាប់ឯកសណ្ឋានជំនាន់ទី១ និងច្បាប់បំណែងចែកឯករាជ្យនៃកាម៉ែត</text>
    </svg>
  `;
}

// 13. Dynamic Pedagogical Concept Diagram (Tailored to REAL lesson title, objectives, & steps)
export function getDynamicLessonDiagram(
  subject: string,
  lessonTitle: string = '',
  subTopic: string = '',
  chapter: string = '',
  objectivesList?: string[]
): string {
  const cleanTitle = (subTopic || lessonTitle || subject || 'មេរៀនថ្មី').slice(0, 42);
  const cleanSubject = (subject || 'មុខវិជ្ជា').slice(0, 18);
  const cleanChapter = (chapter || '').slice(0, 24);

  // Extract real objective concepts if available
  const p1 = objectivesList?.[0] ? objectivesList[0].slice(0, 30) : `១. និយមន័យ និងគោលគំនិតគ្រឹះ`;
  const p2 = objectivesList?.[1] ? objectivesList[1].slice(0, 30) : `២. វិភាគ ទំនាក់ទំនង និងរូបមន្ត`;
  const p3 = objectivesList?.[2] ? objectivesList[2].slice(0, 30) : `៣. អនុវត្តដោះស្រាយបញ្ហាជាក់ស្តែង`;

  return `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 540 165">
      <defs>
        <linearGradient id="boxGrad1" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#eff6ff"/>
          <stop offset="100%" stop-color="#dbeafe"/>
        </linearGradient>
        <linearGradient id="boxGrad2" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#f0fdf4"/>
          <stop offset="100%" stop-color="#dcfce7"/>
        </linearGradient>
        <linearGradient id="boxGrad3" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#fffbeb"/>
          <stop offset="100%" stop-color="#fef3c7"/>
        </linearGradient>
      </defs>
      <rect width="540" height="165" rx="10" fill="#f8fafc" stroke="#cbd5e1" stroke-width="1.5"/>
      <text x="270" y="24" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="12.5" fill="#0f172a" text-anchor="middle">ដ្យាក្រាមខ្លឹមសារមេរៀន៖ ${cleanTitle}</text>
      
      <!-- Block 1: Basic concept & Direct knowledge -->
      <rect x="25" y="38" width="150" height="98" rx="7" fill="url(#boxGrad1)" stroke="#3b82f6" stroke-width="1.2"/>
      <rect x="25" y="38" width="150" height="23" rx="7" fill="#2563eb"/>
      <text x="100" y="54" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="10.5" fill="#ffffff" text-anchor="middle">ដំណាក់កាលទី១៖ ស្គាល់</text>
      <text x="100" y="76" font-family="'Kantumruy Pro', sans-serif" font-size="9.5" fill="#1e40af" text-anchor="middle">• ${cleanTitle.slice(0, 18)}</text>
      <text x="100" y="94" font-family="'Kantumruy Pro', sans-serif" font-size="9" fill="#1e40af" text-anchor="middle">${p1.slice(0, 22)}</text>
      <text x="100" y="116" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="10" fill="#1d4ed8" text-anchor="middle">លំហាត់ទី១ (អនុវត្តផ្ទាល់)</text>

      <!-- Block 2: Analytical & Collaborative Work -->
      <rect x="195" y="38" width="150" height="98" rx="7" fill="url(#boxGrad2)" stroke="#16a34a" stroke-width="1.2"/>
      <rect x="195" y="38" width="150" height="23" rx="7" fill="#16a34a"/>
      <text x="270" y="54" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="10.5" fill="#ffffff" text-anchor="middle">ដំណាក់កាលទី២៖ យល់</text>
      <text x="270" y="76" font-family="'Kantumruy Pro', sans-serif" font-size="9.5" fill="#14532d" text-anchor="middle">• ទំនាក់ទំនង &amp; វិភាគ</text>
      <text x="270" y="94" font-family="'Kantumruy Pro', sans-serif" font-size="9" fill="#14532d" text-anchor="middle">${p2.slice(0, 22)}</text>
      <text x="270" y="116" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="10" fill="#15803d" text-anchor="middle">លំហាត់ទី២ (កម្រិតមធ្យម)</text>

      <!-- Block 3: Real world & PISA standards -->
      <rect x="365" y="38" width="150" height="98" rx="7" fill="url(#boxGrad3)" stroke="#f59e0b" stroke-width="1.2"/>
      <rect x="365" y="38" width="150" height="23" rx="7" fill="#d97706"/>
      <text x="440" y="54" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="10.5" fill="#ffffff" text-anchor="middle">ដំណាក់កាលទី៣៖ អនុវត្ត</text>
      <text x="440" y="76" font-family="'Kantumruy Pro', sans-serif" font-size="9.5" fill="#78350f" text-anchor="middle">• ត្រិះរិះពិចារណា PISA</text>
      <text x="440" y="94" font-family="'Kantumruy Pro', sans-serif" font-size="9" fill="#78350f" text-anchor="middle">${p3.slice(0, 22)}</text>
      <text x="440" y="116" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="10" fill="#b45309" text-anchor="middle">លំហាត់ទី៣ (ស្តង់ដារ PISA ⭐)</text>

      <rect x="25" y="142" width="490" height="18" rx="4" fill="#f1f5f9" stroke="#cbd5e1"/>
      <text x="270" y="155" font-family="'Kantumruy Pro', sans-serif" font-size="10" fill="#334155" text-anchor="middle">${cleanSubject}${cleanChapter ? ` • ${cleanChapter}` : ''} — កម្មវិធីសិក្សាក្រសួងអប់រំ យុវជន និងកីឡា</text>
    </svg>
  `;
}

/* =========================================================================
   DIAGRAM CATALOG (For Teacher Modal Selection)
   ========================================================================= */

export const AVAILABLE_DIAGRAMS_CATALOG: DiagramCatalogItem[] = [
  // --- MATHEMATICS (គណិតវិទ្យា) ---
  {
    id: 'math-concept',
    title: 'គណិតវិទ្យា៖ ផែនទីគំនិតគណិតវិទ្យាទូទៅ (Math Concept Map)',
    subject: 'គណិតវិទ្យា',
    description: 'និយមន័យ ទ្រឹស្តីបទ រូបមន្តគណនា និងដំណោះស្រាយលំហាត់ជាក់ស្តែង',
    svgUrl: encodeSvg(getMathUniversalConceptDiagram('មេរៀនគណិតវិទ្យា', 'រូបមន្ត និងដំណោះស្រាយ')),
  },
  {
    id: 'math-polya',
    title: 'គណិតវិទ្យា៖ វិធីសាស្ត្រដោះស្រាយចំណោទ ៤ ជំហានរបស់ Polya',
    subject: 'គណិតវិទ្យា',
    description: '១. យល់បញ្ហា  ២. ធ្វើផែនការ  ៣. អនុវត្តផែនការ  ៤. ផ្ទៀងផ្ទាត់លទ្ធផល',
    svgUrl: encodeSvg(getMathProblemSolvingPolyaDiagram()),
  },
  {
    id: 'math-quad',
    title: 'គណិតវិទ្យា៖ សមីការដឺក្រេទី២ និងឌីសគ្រីមីណង់ Δ = b² - 4ac',
    subject: 'គណិតវិទ្យា',
    description: 'ករណី Δ > 0, Δ = 0, Δ < 0 ព្រមទាំងរូបមន្តឫស និងប៉ារ៉ាបូល',
    svgUrl: encodeSvg(getMathQuadraticDiagram()),
  },
  {
    id: 'math-geom',
    title: 'គណិតវិទ្យា៖ ទ្រឹស្តីបទពីតាក័រ និងផលធៀបត្រីកោណមាត្រ',
    subject: 'គណិតវិទ្យា',
    description: 'c² = a² + b², sin, cos, tan, cot លើត្រីកោណកែង',
    svgUrl: encodeSvg(getMathGeometryDiagram()),
  },
  {
    id: 'math-fractions',
    title: 'គណិតវិទ្យា៖ ប្រភាគ ចំនួនទសភាគ និងប្រមាណវិធីគ្រឹះ',
    subject: 'គណិតវិទ្យា',
    description: 'ប្រភាគ a/b, ទសភាគ, ភាគរយ % និងលំដាប់ប្រមាណវិធី PEMDAS',
    svgUrl: encodeSvg(getMathFractionsArithmeticDiagram()),
  },
  {
    id: 'math-algebra',
    title: 'គណិតវិទ្យា៖ សមីការលីនេអ៊ែរ និងប្រព័ន្ធសមីការ',
    subject: 'គណិតវិទ្យា',
    description: 'សមីការ ax+b=0, ប្រព័ន្ធសមីការ ២ អថេរ និងផលគុណពិសេស (a±b)²',
    svgUrl: encodeSvg(getMathAlgebraSystemDiagram()),
  },
  {
    id: 'math-shapes',
    title: 'គណិតវិទ្យា៖ បរិមាត្រ ផ្ទៃក្រឡា និងមាឌនៃរូបធរណីមាត្រ',
    subject: 'គណិតវិទ្យា',
    description: 'ចតុកោណកែង ត្រីកោណ រង្វង់ ថាស ស៊ីឡាំង និងស្វ៊ែរ',
    svgUrl: encodeSvg(getMathShapesAreaVolumeDiagram()),
  },
  {
    id: 'math-stats',
    title: 'គណិតវិទ្យា៖ ស្ថិតិ និងប្រូបាប (តម្លៃកណ្តាល និងព្រឹត្តិការណ៍)',
    subject: 'គណិតវិទ្យា',
    description: 'មធ្យមភាគ x̄, មេដ្យាន Me, ម៉ូត Mo, ដ្យាក្រាម និងប្រូបាប P(A)',
    svgUrl: encodeSvg(getMathStatisticsProbabilityDiagram()),
  },
  {
    id: 'math-logic',
    title: 'គណិតវិទ្យា៖ សញ្ញានៃសំណើ ឈ្នាប់តក្កវិទ្យា និងតារាងតម្លៃពិត',
    subject: 'គណិតវិទ្យា',
    description: 'សំណើ p, បដិសេធ ~p, ឈ្នាប់ ∧, ∨, ⇒, ⇔ និងតារាងតម្លៃពិត',
    svgUrl: encodeSvg(getMathLogicPropositionDiagram()),
  },
  {
    id: 'math-vector',
    title: 'គណិតវិទ្យា៖ វ៉ិចទ័រក្នុងប្លង់ ណ័រម៉ និងផលគុណស្កាលែ',
    subject: 'គណិតវិទ្យា',
    description: 'កូអរដោនេ u⃗=(x,y), ណ័រម៉ ||u⃗||, ផលបូក និងផលគុណស្កាលែ u⃗·v⃗',
    svgUrl: encodeSvg(getMathVectorDiagram()),
  },
  {
    id: 'math-calculus',
    title: 'គណិតវិទ្យា៖ លីមីត ដេរីវេ និងអាំងតេក្រាល (ថ្នាក់ទី១១-១២)',
    subject: 'គណិតវិទ្យា',
    description: 'lim f(x), ដេរីវេ f\'(x), បន្ទាត់ប៉ះ និងអាំងតេក្រាល ∫ f(x)dx',
    svgUrl: encodeSvg(getMathCalculusDiagram()),
  },

  // --- PHYSICS (រូបវិទ្យា) ---
  {
    id: 'phys-temp',
    title: 'រូបវិទ្យា៖ ខ្នាតសីតុណ្ហភាព Celsius, Kelvin, Fahrenheit',
    subject: 'រូបវិទ្យា',
    description: 'មាត្រដ្ឋានប្រៀបធៀបសីតុណ្ហភាពទាំង ៣ និងរូបមន្តបំប្លែងខ្នាត',
    svgUrl: encodeSvg(getPhysicsTemperatureDiagram()),
  },
  {
    id: 'phys-mech',
    title: 'រូបវិទ្យា៖ មេកានិច កម្លាំង និងច្បាប់ញូតុន (F = m × a)',
    subject: 'រូបវិទ្យា',
    description: 'កម្លាំង ទម្ងន់ សំទុះទំនាញដី និងការងារថាមពល',
    svgUrl: encodeSvg(getPhysicsMechanicsDiagram()),
  },
  {
    id: 'phys-elec',
    title: 'រូបវិទ្យា៖ អគ្គិសនី ច្បាប់អូម និងសៀគ្វីស៊េរី/ខ្នែង',
    subject: 'រូបវិទ្យា',
    description: 'U = R × I, សៀគ្វីតជាស៊េរី និងសៀគ្វីតជាខ្នែង',
    svgUrl: encodeSvg(getPhysicsElectricityDiagram()),
  },
  {
    id: 'phys-optics',
    title: 'រូបវិទ្យា៖ អុបទិច ពន្លឺ ចំណាំងផ្លាត និងឡង់ទី',
    subject: 'រូបវិទ្យា',
    description: '1/f = 1/p + 1/p\', ច្បាប់ចំណាំងផ្លាត និងសន្ទស្សន៍ចំណាំងបែរ',
    svgUrl: encodeSvg(getPhysicsOpticsDiagram()),
  },

  // --- CHEMISTRY (គីមីវិទ្យា) ---
  {
    id: 'chem-ph',
    title: 'គីមីវិទ្យា៖ មាត្រដ្ឋាន pH អាស៊ីត ណឺត និងបាស',
    subject: 'គីមីវិទ្យា',
    description: 'មាត្រដ្ឋាន pH 0 ដល់ 14, កំហាប់ [H⁺] និង [OH⁻]',
    svgUrl: encodeSvg(getChemistryPhDiagram()),
  },
  {
    id: 'chem-rxn',
    title: 'គីមីវិទ្យា៖ ប្រតិកម្មគីមី និងច្បាប់រក្សាម៉ាស (A + B → C + D)',
    subject: 'គីមីវិទ្យា',
    description: 'ច្បាប់ឡាវ៉ូស៊ីយេ ការរក្សាអាតូម និងការថ្លឹងសមីការគីមី',
    svgUrl: encodeSvg(getChemistryReactionsDiagram()),
  },

  // --- BIOLOGY (ជីវវិទ្យា) ---
  {
    id: 'bio-cell',
    title: 'ជីវវិទ្យា៖ ការប្រៀបធៀបកោសិការុក្ខជាតិ និងកោសិកាសត្វ',
    subject: 'ជីវវិទ្យា',
    description: 'រចនាសម្ព័ន្ធកោសិកា ភ្នាស ក្លរ៉ូប្លាស វ៉ាគុយអូល និងការសំយោគពន្លឺ',
    svgUrl: encodeSvg(getBiologyCellDiagram()),
  },
  {
    id: 'bio-genetics',
    title: 'ជីវវិទ្យា៖ សេនេទិច ក្រូម៉ូសូម DNA និងច្បាប់មែនដែល',
    subject: 'ជីវវិទ្យា',
    description: 'អាឡែល សេណូទីប ផេណូទីប និងផលធៀបកូនកាត់ 3:1 នៃ F2',
    svgUrl: encodeSvg(getBiologyGeneticsDiagram()),
  },

  // --- EARTH & GEOGRAPHY (ផែនដីវិទ្យា / ភូមិវិទ្យា) ---
  {
    id: 'earth-water',
    title: 'ផែនដីវិទ្យា៖ វដ្តនៃទឹកក្នុងធម្មជាតិ (Water Cycle)',
    subject: 'ផែនដីវិទ្យា / ភូមិវិទ្យា',
    description: 'រំហួត កំណកពពក ធ្លាក់ទឹកភ្លៀង និងចរន្តទឹកក្នុងធម្មជាតិ',
    svgUrl: encodeSvg(getEarthWaterCycleDiagram()),
  },

  // --- KHMER LITERATURE (ភាសាខ្មែរ) ---
  {
    id: 'khmer-lit',
    title: 'ភាសាខ្មែរ៖ រចនាសម្ព័ន្ធវិភាគរឿង និងអក្សរសិល្ប៍',
    subject: 'ភាសាខ្មែរ',
    description: 'កាលអាកាស តួអង្គ ទំនាស់ ចំណុចកំពូល និងទស្សនៈអប់រំ',
    svgUrl: encodeSvg(getKhmerLiteratureDiagram()),
  },
];

/* =========================================================================
   INTELLIGENT DIAGRAM SELECTOR
   Subject-First Isolation: Ensures Math NEVER gets Khmer literature diagrams!
   ========================================================================= */

export function getStepIllustrations(
  subject: string,
  subTopic: string = '',
  lessonTitle: string = '',
  chapter: string = '',
  objectivesList?: string[]
): Record<string, StepVisualInfo> {
  const sLower = (subject || '').trim().toLowerCase();
  const combined = (subject + ' ' + subTopic + ' ' + lessonTitle + ' ' + chapter).toLowerCase();

  // Subject identification flags (Strict Subject Classification)
  const isMath =
    sLower.includes('គណិត') ||
    sLower.includes('math') ||
    sLower.includes('arithmetic') ||
    sLower.includes('algebra') ||
    sLower.includes('geometry') ||
    combined.includes('គណិតវិទ្យា');

  const isPhysics =
    !isMath &&
    (sLower.includes('រូបវិទ្យា') ||
     sLower.includes('រូប') ||
     sLower.includes('physic'));

  const isChemistry =
    !isMath &&
    (sLower.includes('គីមី') ||
     sLower.includes('chem'));

  const isBiology =
    !isMath &&
    (sLower.includes('ជីវ') ||
     sLower.includes('bio'));

  const isEarthGeo =
    !isMath &&
    (sLower.includes('ផែនដី') ||
     sLower.includes('ភូមិ') ||
     sLower.includes('earth') ||
     sLower.includes('geo'));

  const isKhmer =
    !isMath &&
    !isPhysics &&
    !isChemistry &&
    !isBiology &&
    !isEarthGeo &&
    (sLower.includes('អក្សរសិល្ប៍') ||
     sLower.includes('តែងសេចក្តី') ||
     sLower.includes('ភាសាខ្មែរ') ||
     sLower.includes('khmer'));

  let step3Svg = '';
  let step3Caption = '';

  // ==========================================
  // 1. MATHEMATICS (Strictly isolated domain)
  // ==========================================
  if (isMath) {
    if (
      combined.includes('តក្ក') ||
      combined.includes('សំណើ') ||
      combined.includes('តម្លៃពិត') ||
      combined.includes('logic') ||
      combined.includes('ឈ្នាប់')
    ) {
      step3Svg = getMathLogicPropositionDiagram();
      step3Caption = 'ដ្យាក្រាមតក្កវិទ្យា៖ សញ្ញានៃសំណើ ឈ្នាប់តក្កវិទ្យា និងតារាងតម្លៃពិត';
    } else if (
      combined.includes('វ៉ិចទ័រ') ||
      combined.includes('vector') ||
      combined.includes('ស្កាលែ') ||
      combined.includes('ណ័រម៉')
    ) {
      step3Svg = getMathVectorDiagram();
      step3Caption = 'ដ្យាក្រាមគណិតវិទ្យា៖ វ៉ិចទ័រក្នុងប្លង់ និងផលគុណស្កាលែ';
    } else if (
      combined.includes('ដឺក្រេទី២') ||
      combined.includes('ឌីសគ្រីមីណង់') ||
      combined.includes('ដេលតា') ||
      combined.includes('delta') ||
      combined.includes('ប៉ារ៉ាបូល') ||
      combined.includes('quadratic')
    ) {
      step3Svg = getMathQuadraticDiagram();
      step3Caption = 'ដ្យាក្រាមសមីការដឺក្រេទី២ និងឌីសគ្រីមីណង់ Δ = b² - 4ac';
    } else if (
      combined.includes('ពីតាក័រ') ||
      combined.includes('ត្រីកោណ') ||
      combined.includes('ស៊ីនុស') ||
      combined.includes('កូស៊ីនុស') ||
      combined.includes('តង់សង់') ||
      combined.includes('trig') ||
      combined.includes('pythagor') ||
      combined.includes('មុំ')
    ) {
      step3Svg = getMathGeometryDiagram();
      step3Caption = 'ដ្យាក្រាមធរណីមាត្រ៖ ទ្រឹស្តីបទពីតាក័រ និងផលធៀបត្រីកោណមាត្រ';
    } else if (
      combined.includes('ប្រភាគ') ||
      combined.includes('ទសភាគ') ||
      combined.includes('ចំនួនគត់') ||
      combined.includes('ភាគរយ') ||
      combined.includes('ប្រមាណវិធី') ||
      combined.includes('fraction') ||
      combined.includes('decimal') ||
      combined.includes('បូក') ||
      combined.includes('ដក') ||
      combined.includes('គុណ') ||
      combined.includes('ចែក')
    ) {
      step3Svg = getMathFractionsArithmeticDiagram();
      step3Caption = 'ដ្យាក្រាមគណិតវិទ្យា៖ ប្រភាគ ចំនួនទសភាគ និងប្រមាណវិធីគ្រឹះ';
    } else if (
      combined.includes('ពីជគណិត') ||
      combined.includes('សមីការលីនេអ៊ែរ') ||
      combined.includes('ប្រព័ន្ធសមីការ') ||
      combined.includes('កន្សោម') ||
      combined.includes('algebra')
    ) {
      step3Svg = getMathAlgebraSystemDiagram();
      step3Caption = 'ដ្យាក្រាមពិជគណិត៖ សមីការលីនេអ៊ែរ និងប្រព័ន្ធសមីការ';
    } else if (
      combined.includes('ផ្ទៃក្រឡា') ||
      combined.includes('មាឌ') ||
      combined.includes('បរិមាត្រ') ||
      combined.includes('រង្វង់') ||
      combined.includes('ចតុកោណ') ||
      combined.includes('ស៊ីឡាំង') ||
      combined.includes('កោន') ||
      combined.includes('ស្វ៊ែរ') ||
      combined.includes('area') ||
      combined.includes('volume')
    ) {
      step3Svg = getMathShapesAreaVolumeDiagram();
      step3Caption = 'ដ្យាក្រាមធរណីមាត្រ៖ បរិមាត្រ ផ្ទៃក្រឡា និងមាឌនៃរូបធរណីមាត្រ';
    } else if (
      combined.includes('ស្ថិតិ') ||
      combined.includes('ប្រូបាប') ||
      combined.includes('មធ្យមភាគ') ||
      combined.includes('មេដ្យាន') ||
      combined.includes('ម៉ូត') ||
      combined.includes('statistic') ||
      combined.includes('probability')
    ) {
      step3Svg = getMathStatisticsProbabilityDiagram();
      step3Caption = 'ដ្យាក្រាមស្ថិតិ និងប្រូបាប៖ តម្លៃកណ្តាល និងការពិសោធន៍ចៃដន្យ';
    } else if (
      combined.includes('ចំណោទ') ||
      combined.includes('បញ្ហា') ||
      combined.includes('រឿង') ||
      combined.includes('ដំណោះស្រាយចំណោទ') ||
      combined.includes('problem')
    ) {
      // Word problems / Story problem in math (4 steps of Polya)
      step3Svg = getMathProblemSolvingPolyaDiagram();
      step3Caption = 'ដ្យាក្រាមវិធីសាស្ត្រដោះស្រាយចំណោទគណិតវិទ្យា (Polya 4-Step Method)';
    } else if (
      combined.includes('លីមីត') ||
      combined.includes('ដេរីវេ') ||
      combined.includes('អាំងតេក្រាល') ||
      combined.includes('ព្រីមីទីវ') ||
      combined.includes('limit') ||
      combined.includes('derivative') ||
      combined.includes('calculus')
    ) {
      step3Svg = getMathCalculusDiagram();
      step3Caption = 'ដ្យាក្រាមគណិតវិទ្យាជាន់ខ្ពស់៖ លីមីត ដេរីវេ និងអាំងតេក្រាល';
    } else {
      // Universal mathematical diagram tailored to this specific math lesson
      step3Svg = getMathUniversalConceptDiagram(lessonTitle, subTopic, chapter, objectivesList);
      step3Caption = `ដ្យាក្រាមខ្លឹមសារគណិតវិទ្យា៖ ${subTopic || lessonTitle || 'មេរៀនគណិតវិទ្យា'}`;
    }
  }

  // ==========================================
  // 2. PHYSICS (រូបវិទ្យា)
  // ==========================================
  else if (isPhysics) {
    if (
      combined.includes('សីតុណ្ហភាព') ||
      combined.includes('កម្តៅ') ||
      combined.includes('ទែម៉ូ') ||
      combined.includes('temperature') ||
      combined.includes('heat')
    ) {
      step3Svg = getPhysicsTemperatureDiagram();
      step3Caption = 'ដ្យាក្រាមប្រៀបធៀបមាត្រដ្ឋានសីតុណ្ហភាព Celsius, Kelvin, Fahrenheit';
    } else if (
      combined.includes('អុបទិច') ||
      combined.includes('ពន្លឺ') ||
      combined.includes('ឡង់ទី') ||
      combined.includes('កញ្ចក់') ||
      combined.includes('ចំណាំងផ្លាត') ||
      combined.includes('កំណុំ')
    ) {
      step3Svg = getPhysicsOpticsDiagram();
      step3Caption = 'ដ្យាក្រាមអុបទិច៖ ពន្លឺ ចំណាំងផ្លាត និងរូបមន្តឡង់ទី';
    } else if (
      combined.includes('អគ្គិសនី') ||
      combined.includes('សៀគ្វី') ||
      combined.includes('ចរន្ត') ||
      combined.includes('តង់ស្យុង') ||
      combined.includes('រេស៊ីស្តង់') ||
      combined.includes('អូម')
    ) {
      step3Svg = getPhysicsElectricityDiagram();
      step3Caption = 'ដ្យាក្រាមអគ្គិសនី៖ ច្បាប់អូម និងការតសៀគ្វីជាស៊េរី/ខ្នែង';
    } else {
      step3Svg = getPhysicsMechanicsDiagram();
      step3Caption = 'ដ្យាក្រាមមេកានិច៖ កម្លាំង ចលនា និងច្បាប់ញូតុន (F = m × a)';
    }
  }

  // ==========================================
  // 3. CHEMISTRY (គីមីវិទ្យា)
  // ==========================================
  else if (isChemistry) {
    if (
      combined.includes('ph') ||
      combined.includes('អាស៊ីត') ||
      combined.includes('បាស') ||
      combined.includes('ណឺត') ||
      combined.includes('សូលុយស្យុង')
    ) {
      step3Svg = getChemistryPhDiagram();
      step3Caption = 'ដ្យាក្រាមគីមីវិទ្យា៖ មាត្រដ្ឋាន pH អាស៊ីត ណឺត និងបាស';
    } else {
      step3Svg = getChemistryReactionsDiagram();
      step3Caption = 'ដ្យាក្រាមគីមីវិទ្យា៖ ប្រតិកម្មគីមី និងច្បាប់រក្សាម៉ាស';
    }
  }

  // ==========================================
  // 4. BIOLOGY (ជីវវិទ្យា)
  // ==========================================
  else if (isBiology) {
    if (
      combined.includes('ហ្សែន') ||
      combined.includes('សេនេទិច') ||
      combined.includes('ក្រូម៉ូសូម') ||
      combined.includes('dna') ||
      combined.includes('មែនដែល') ||
      combined.includes('តំណពូជ')
    ) {
      step3Svg = getBiologyGeneticsDiagram();
      step3Caption = 'ដ្យាក្រាមសេនេទិច៖ ក្រូម៉ូសូម ហ្សែន និងច្បាប់តំណពូជមែនដែល';
    } else {
      step3Svg = getBiologyCellDiagram();
      step3Caption = 'ដ្យាក្រាមជីវវិទ្យា៖ ការប្រៀបធៀបកោសិការុក្ខជាតិ និងកោសិកាសត្វ';
    }
  }

  // ==========================================
  // 5. EARTH SCIENCE / GEOGRAPHY (ផែនដីវិទ្យា / ភូមិវិទ្យា)
  // ==========================================
  else if (isEarthGeo) {
    step3Svg = getEarthWaterCycleDiagram();
    step3Caption = 'ដ្យាក្រាមផែនដីវិទ្យា៖ វដ្តនៃទឹកក្នុងធម្មជាតិ (Water Cycle)';
  }

  // ==========================================
  // 6. KHMER LITERATURE (ភាសាខ្មែរ / អក្សរសិល្ប៍)
  // ==========================================
  else if (isKhmer) {
    step3Svg = getKhmerLiteratureDiagram();
    step3Caption = 'ដ្យាក្រាមភាសាខ្មែរ៖ រចនាសម្ព័ន្ធវិភាគរឿង និងអក្សរសិល្ប៍';
  }

  // ==========================================
  // 7. OTHER OR GENERAL SUBJECTS
  // ==========================================
  else {
    if (
      combined.includes('អក្សរសិល្ប៍') ||
      combined.includes('តែងសេចក្តី') ||
      combined.includes('វិភាគរឿង')
    ) {
      step3Svg = getKhmerLiteratureDiagram();
      step3Caption = 'ដ្យាក្រាមភាសាខ្មែរ៖ រចនាសម្ព័ន្ធវិភាគរឿង និងអក្សរសិល្ប៍';
    } else {
      step3Svg = getDynamicLessonDiagram(subject, lessonTitle, subTopic, chapter, objectivesList);
      step3Caption = `ដ្យាក្រាមខ្លឹមសារមេរៀន៖ ${subTopic || lessonTitle || subject}`;
    }
  }

  // Generic Step 1, 2, 4, 5 tailored with subject styling
  return {
    step1: {
      url: encodeSvg(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 120">
          <rect width="400" height="120" rx="10" fill="#f0f9ff" stroke="#bae6fd" stroke-width="1.5"/>
          <circle cx="50" cy="60" r="24" fill="#0284c7"/>
          <text x="50" y="66" font-family="sans-serif" font-size="16" fill="#fff" text-anchor="middle">📋</text>
          <text x="90" y="44" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="13" fill="#0369a1">រដ្ឋបាលថ្នាក់ និងវិន័យសិក្សា (${subject || 'មុខវិជ្ជា'})</text>
          <text x="90" y="68" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#475569">✓ ពិនិត្យវត្តមាន សណ្តាប់ធ្នាប់ អនាម័យ និងតុ</text>
          <text x="90" y="90" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#475569">✓ ត្រៀមសៀវភៅពុម្ព ប៊ិច និងសម្ភាររៀនសូត្រ</text>
        </svg>
      `),
      caption: `ដ្យាក្រាមរដ្ឋបាលថ្នាក់ និងការរៀបចំសណ្តាប់ធ្នាប់ (${subject})`,
    },
    step2: {
      url: encodeSvg(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 440 125">
          <rect width="440" height="125" rx="10" fill="#fffbeb" stroke="#fde68a" stroke-width="1.5"/>
          <text x="220" y="24" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="12.5" fill="#92400e" text-anchor="middle">ដ្យាក្រាមរំឭកមេរៀនចាស់ (Review &amp; Bridge)</text>
          <rect x="25" y="42" width="165" height="65" rx="6" fill="#ffffff" stroke="#f59e0b" stroke-width="1.2"/>
          <text x="107" y="66" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="11.5" fill="#b45309" text-anchor="middle">លំហាត់រំឭក ១ &amp; ២</text>
          <text x="107" y="86" font-family="sans-serif" font-size="10" fill="#64748b" text-anchor="middle">ចំណេះដឹងគ្រឹះពីមុន</text>
          <path d="M195 74 L235 74" stroke="#f59e0b" stroke-width="2" stroke-dasharray="3"/>
          <rect x="245" y="42" width="170" height="65" rx="6" fill="#ffffff" stroke="#10b981" stroke-width="1.2"/>
          <text x="330" y="66" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="11.5" fill="#047857" text-anchor="middle">ស្ពានចម្លងពុទ្ធិ</text>
          <text x="330" y="86" font-family="sans-serif" font-size="10" fill="#047857" text-anchor="middle">ឆ្ពោះទៅមេរៀនថ្មីថ្ងៃនេះ</text>
        </svg>
      `),
      caption: 'ដ្យាក្រាមភ្ជាប់ទំនាក់ទំនងមេរៀនចាស់ និងលំហាត់រំឭក',
    },
    step3: {
      url: encodeSvg(step3Svg),
      caption: step3Caption,
    },
    step4: {
      url: encodeSvg(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 420 120">
          <rect width="420" height="120" rx="10" fill="#faf5ff" stroke="#e9d5ff" stroke-width="1.5"/>
          <text x="210" y="24" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="12.5" fill="#6b21a8" text-anchor="middle">ដ្យាក្រាមពង្រឹងពុទ្ធិ (Consolidation Assessment)</text>
          <circle cx="80" cy="70" r="26" fill="#f3e8ff" stroke="#9333ea"/>
          <text x="80" y="68" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="10.5" fill="#6b21a8" text-anchor="middle">លំហាត់ទី១</text>
          <text x="80" y="82" font-family="sans-serif" font-size="9" fill="#7e22ce" text-anchor="middle">សំណួរគន្លឹះ</text>
          <path d="M112 70 L152 70" stroke="#9333ea" stroke-width="2" stroke-dasharray="3"/>
          <circle cx="185" cy="70" r="26" fill="#e0e7ff" stroke="#4f46e5"/>
          <text x="185" y="68" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="10.5" fill="#3730a3" text-anchor="middle">លំហាត់ទី២</text>
          <text x="185" y="82" font-family="sans-serif" font-size="9" fill="#4338ca" text-anchor="middle">អនុវត្តរហ័ស</text>
          <path d="M217 70 L257 70" stroke="#4f46e5" stroke-width="2" stroke-dasharray="3"/>
          <rect x="270" y="48" width="130" height="46" rx="6" fill="#dcfce7" stroke="#16a34a"/>
          <text x="335" y="68" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="11" fill="#166534" text-anchor="middle">លទ្ធផលយល់ដឹង</text>
          <text x="335" y="83" font-family="sans-serif" font-size="9.5" fill="#15803d" text-anchor="middle">វាស់ស្ទង់ថ្នាក់ទាំងមូល</text>
        </svg>
      `),
      caption: 'ដ្យាក្រាមពង្រឹងចំណេះដឹង និងការវាស់ស្ទង់សមត្ថភាពសិស្សរហ័ស',
    },
    step5: {
      url: encodeSvg(`
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 380 110">
          <rect width="380" height="110" rx="10" fill="#f0fdf4" stroke="#bbf7d0" stroke-width="1.5"/>
          <circle cx="45" cy="55" r="22" fill="#16a34a"/>
          <text x="45" y="61" font-family="sans-serif" font-size="16" fill="#fff" text-anchor="middle">🏠</text>
          <text x="85" y="40" font-family="'Kantumruy Pro', sans-serif" font-weight="bold" font-size="13" fill="#15803d">កិច្ចការផ្ទះ និងការស្រាវជ្រាវស្វ័យសិក្សា</text>
          <text x="85" y="65" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#334155">• លំហាត់អនុវត្តបន្តនៅផ្ទះ និងការឆ្លុះបញ្ចាំង</text>
          <text x="85" y="88" font-family="'Kantumruy Pro', sans-serif" font-size="11" fill="#334155">• អាន និងត្រៀមមេរៀនបន្ទាប់តាមការណែនាំ</text>
        </svg>
      `),
      caption: 'កិច្ចការផ្ទះ និងការស្រាវជ្រាវស្វ័យសិក្សា',
    },
  };
}
