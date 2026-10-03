'use client';

import React, { useMemo } from 'react';
import katex from 'katex';

interface MathTextProps {
  text: string;
  className?: string;
  displayMode?: boolean;
}

/**
 * Normalizes plain Cambodian curriculum math formulas into LaTeX so KaTeX can render them.
 * Converts common symbols: ×, ÷, ±, √, ², ³, Δ, π, etc.
 */
function normalizeFormulaToLatex(formula: string): string {
  let tex = formula.trim();

  // Remove surrounding parenthesis if it wraps whole formula
  tex = tex
    .replace(/²/g, '^2')
    .replace(/³/g, '^3')
    .replace(/⁴/g, '^4')
    .replace(/ⁿ/g, '^n')
    .replace(/₀/g, '_0')
    .replace(/₁/g, '_1')
    .replace(/₂/g, '_2')
    .replace(/₃/g, '_3')
    .replace(/ₙ/g, '_n')
    .replace(/Δ/g, '\\Delta ')
    .replace(/π/g, '\\pi ')
    .replace(/×/g, ' \\times ')
    .replace(/÷/g, ' \\div ')
    .replace(/±/g, ' \\pm ')
    .replace(/≠/g, ' \\neq ')
    .replace(/≤/g, ' \\le ')
    .replace(/≥/g, ' \\ge ')
    .replace(/≈/g, ' \\approx ')
    .replace(/→/g, ' \\to ')
    .replace(/⇒/g, ' \\implies ')
    .replace(/∈/g, ' \\in ')
    .replace(/∉/g, ' \\notin ')
    .replace(/⊂/g, ' \\subset ')
    .replace(/∪/g, ' \\cup ')
    .replace(/∩/g, ' \\cap ')
    .replace(/°C/g, ' ^{\\circ}\\text{C}')
    .replace(/°F/g, ' ^{\\circ}\\text{F}')
    .replace(/√\(([^)]+)\)/g, '\\sqrt{$1}')
    .replace(/√([a-zA-Z0-9\Delta\pi]+)/g, '\\sqrt{$1}');

  return tex;
}

/**
 * Checks if a string contains mathematical equations, operators, or variables.
 */
function isMathExpression(str: string): boolean {
  const trimmed = str.trim();
  if (!trimmed || trimmed.length < 2) return false;

  // Has equal sign or inequality with Latin letters or numbers
  if (/[a-zA-Z0-9\)\^]\s*(=|<|>|≤|≥|≠|≈)\s*[a-zA-Z0-9\(\-]/.test(trimmed)) {
    return true;
  }

  // Has explicit math operator sequences like a × b, a / b, x² + y², etc.
  if (/[a-zA-Z0-9]\s*(×|÷|\+|\-|\*|\/|\^|±)\s*[a-zA-Z0-9]/.test(trimmed)) {
    return true;
  }

  // Has Greek math symbols like Delta, Pi or square root
  if (/[Δπ√]/.test(trimmed)) {
    return true;
  }

  // Has function notations like f(x), g(x), P(x), sin(x), cos(x)
  if (/^(f|g|h|P|Q|S|V|A|T|v|m|d)\s*\([a-zA-Z0-9,\s]+\)/.test(trimmed)) {
    return true;
  }

  // Physics temperature formulas
  if (/T\(K\)|t\(°C\)|t\(°F\)/.test(trimmed)) {
    return true;
  }

  return false;
}

/**
 * Formats a plain string token with MathType typography
 * Latin letters in serif italic, numbers and operators in serif upright.
 */
function renderMathTypePlain(token: string): React.ReactNode {
  // Split token by variables [a-zA-Z], numbers, operators, or Khmer chars
  const chunks = token.split(/([a-zA-Z]+|[0-9]+(?:\.[0-9]+)?|[=+\-×÷±*/<>≤≥≠≈^_√Δπ()[\],.:;])/g).filter(Boolean);

  return (
    <span className="mathtype-formula font-serif tracking-normal text-slate-900 inline-block px-0.5">
      {chunks.map((ch, idx) => {
        // Variable letter (single letter or short name)
        if (/^[a-zA-Z]$/.test(ch)) {
          return (
            <span key={idx} className="mathtype-var italic font-serif text-indigo-950 font-medium">
              {ch}
            </span>
          );
        }
        // Numbers
        if (/^[0-9]+(?:\.[0-9]+)?$/.test(ch)) {
          return (
            <span key={idx} className="mathtype-num font-serif not-italic text-slate-900">
              {ch}
            </span>
          );
        }
        // Operators
        if (/^[=+\-×÷±*\/<>≤≥≠≈^_√Δπ]$/.test(ch)) {
          return (
            <span key={idx} className="mathtype-op font-serif not-italic text-slate-800 px-0.5">
              {ch}
            </span>
          );
        }
        // Superscript exponents
        if (/^\^[0-9a-zA-Z]+$/.test(ch)) {
          return (
            <sup key={idx} className="text-[0.75em] font-serif italic text-indigo-900 font-bold">
              {ch.slice(1)}
            </sup>
          );
        }
        return <span key={idx}>{ch}</span>;
      })}
    </span>
  );
}

/**
 * Intelligent parser that extracts formulas from mixed Khmer + Math text
 */
function parseTextIntoTokens(text: string): Array<{ type: 'text' | 'inline-math' | 'block-math'; content: string }> {
  if (!text) return [];

  // 1. If explicit $...$ or $$...$$ delimiters are present, honor them
  const hasDelimiters = /(\$\$[\s\S]*?\$\$|\$[^$\n]+?\$)/.test(text);
  if (hasDelimiters) {
    const regex = /(\$\$[\s\S]*?\$\$|\$[^$\n]+?\$)/g;
    const tokens: Array<{ type: 'text' | 'inline-math' | 'block-math'; content: string }> = [];
    let lastIndex = 0;
    let match: RegExpExecArray | null;

    while ((match = regex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        tokens.push({
          type: 'text',
          content: text.slice(lastIndex, match.index),
        });
      }

      const matchStr = match[0];
      if (matchStr.startsWith('$$') && matchStr.endsWith('$$')) {
        tokens.push({
          type: 'block-math',
          content: matchStr.slice(2, -2).trim(),
        });
      } else if (matchStr.startsWith('$') && matchStr.endsWith('$')) {
        tokens.push({
          type: 'inline-math',
          content: matchStr.slice(1, -1).trim(),
        });
      }

      lastIndex = regex.lastIndex;
    }

    if (lastIndex < text.length) {
      tokens.push({
        type: 'text',
        content: text.slice(lastIndex),
      });
    }

    return tokens;
  }

  // 2. No $ delimiters: check line by line and find embedded math formulas
  // Lines matching full formula patterns like "y = ax^2 + bx + c", "Δ = b^2 - 4ac", "S = a × b"
  const lines = text.split('\n');
  const tokens: Array<{ type: 'text' | 'inline-math' | 'block-math'; content: string }> = [];

  lines.forEach((line, lIdx) => {
    if (lIdx > 0) {
      tokens.push({ type: 'text', content: '\n' });
    }

    const trimmed = line.trim();
    // If the entire line is a formula like "y = 2x + 1" or "Δ = b² - 4ac"
    if (isMathExpression(trimmed) && trimmed.length < 80 && !/[\u1780-\u17FF]{8,}/.test(trimmed)) {
      tokens.push({
        type: 'inline-math',
        content: normalizeFormulaToLatex(trimmed),
      });
      return;
    }

    // Check for inline math inside the line, e.g. "សមីការ 2x² - 5x + 2 = 0 មាន..."
    // Match formula segments (Latin variables, operators, numbers)
    const formulaRegex = /([a-zA-Z0-9\(\)\^\_\/\+\-\*\×\÷\±\√\.\,\s\Δ\π\°\=]{3,}(?:=|<|>|≤|≥|≠|≈)[a-zA-Z0-9\(\)\^\_\/\+\-\*\×\÷\±\√\.\,\s\Δ\π\°\-]+|[a-zA-Z]\s*\^\s*[0-9]+|[a-zA-Z]\s*_\s*[0-9]+|T\(K\)\s*=\s*[^,\n]+|t\(°[CF]\)\s*=\s*[^,\n]+|f\([a-zA-Z]\)\s*=\s*[^,\n]+)/g;

    let cursor = 0;
    let match: RegExpExecArray | null;
    let foundAny = false;

    while ((match = formulaRegex.exec(line)) !== null) {
      const matchStr = match[0];
      // Filter out false positives
      if (isMathExpression(matchStr) && matchStr.trim().length >= 3) {
        foundAny = true;
        if (match.index > cursor) {
          tokens.push({
            type: 'text',
            content: line.slice(cursor, match.index),
          });
        }

        tokens.push({
          type: 'inline-math',
          content: normalizeFormulaToLatex(matchStr),
        });

        cursor = formulaRegex.lastIndex;
      }
    }

    if (foundAny && cursor < line.length) {
      tokens.push({
        type: 'text',
        content: line.slice(cursor),
      });
    } else if (!foundAny) {
      tokens.push({
        type: 'text',
        content: line,
      });
    }
  });

  return tokens;
}

export const MathText: React.FC<MathTextProps> = ({ text, className = '', displayMode = false }) => {
  const parts = useMemo(() => {
    return parseTextIntoTokens(text);
  }, [text]);

  if (!text) return null;

  // Single plain text without math
  if (parts.length === 1 && parts[0].type === 'text') {
    return <span className={className}>{formatPlainLines(parts[0].content)}</span>;
  }

  return (
    <span className={`mathtype-container ${className}`}>
      {parts.map((part, index) => {
        if (part.type === 'inline-math') {
          try {
            const html = katex.renderToString(part.content, {
              displayMode: false,
              throwOnError: false,
            });
            return (
              <span
                key={index}
                className="inline-block px-1 py-0.5 mathtype-inline align-baseline text-slate-900"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          } catch {
            return (
              <span key={index} className="inline-block px-1 py-0.5 mathtype-inline">
                {renderMathTypePlain(part.content)}
              </span>
            );
          }
        }

        if (part.type === 'block-math' || displayMode) {
          try {
            const html = katex.renderToString(part.content, {
              displayMode: true,
              throwOnError: false,
            });
            return (
              <div
                key={index}
                className="my-2 mathtype-block text-center text-slate-900 overflow-x-auto"
                dangerouslySetInnerHTML={{ __html: html }}
              />
            );
          } catch {
            return (
              <div key={index} className="my-2 mathtype-block text-center text-slate-900 font-serif italic font-semibold">
                {renderMathTypePlain(part.content)}
              </div>
            );
          }
        }

        // Plain text token (can contain newlines or general Khmer descriptions)
        return (
          <React.Fragment key={index}>
            {formatPlainLines(part.content)}
          </React.Fragment>
        );
      })}
    </span>
  );
};

function formatPlainLines(text: string): React.ReactNode {
  if (!text) return null;
  const lines = text.split('\n');

  return lines.map((line, idx) => (
    <React.Fragment key={idx}>
      {idx > 0 && <br />}
      {renderLineWithFormattedSupSub(line)}
    </React.Fragment>
  ));
}

function renderLineWithFormattedSupSub(line: string): React.ReactNode {
  // Format ^2, ^3, _1, _2, degrees, and common math symbols with MathType serif typography
  const parts = line.split(/(\^[0-9a-zA-Z]+|_[0-9a-zA-Z]+|°C|°F|²|³|[Δπ√×÷±≤≥≠≈])/g);
  return parts.map((chunk, cIdx) => {
    if (chunk === '²') {
      return <sup key={cIdx} className="text-[0.75em] font-serif font-bold text-slate-900">2</sup>;
    }
    if (chunk === '³') {
      return <sup key={cIdx} className="text-[0.75em] font-serif font-bold text-slate-900">3</sup>;
    }
    if (chunk.startsWith('^')) {
      return <sup key={cIdx} className="text-[0.75em] font-serif font-bold text-slate-900">{chunk.slice(1)}</sup>;
    }
    if (chunk.startsWith('_')) {
      return <sub key={cIdx} className="text-[0.75em] font-serif text-slate-800">{chunk.slice(1)}</sub>;
    }
    if (chunk === '°C' || chunk === '°F') {
      return <span key={cIdx} className="font-serif font-semibold text-sky-800">{chunk}</span>;
    }
    if (chunk === '√') {
      return <span key={cIdx} className="font-serif font-bold text-slate-900">√</span>;
    }
    if (['Δ', 'π', '×', '÷', '±', '≤', '≥', '≠', '≈'].includes(chunk)) {
      return <span key={cIdx} className="font-serif not-italic text-slate-900 px-0.5">{chunk}</span>;
    }
    return chunk;
  });
}

// MathType Quick Symbol Toolbar for Teachers
interface MathToolbarProps {
  onInsertSymbol: (symbol: string) => void;
  className?: string;
}

export const MathToolbar: React.FC<MathToolbarProps> = ({ onInsertSymbol, className = '' }) => {
  const symbolCategories = [
    {
      group: 'ប្រភាគ & ស្វ័យគុណ',
      items: [
        { label: 'a/b', latex: '$\\frac{a}{b}$', tip: 'ប្រភាគ (Fraction)' },
        { label: 'x²', latex: '$x^2$', tip: 'ស្វ័យគុណ (Power x²)' },
        { label: 'xⁿ', latex: '$x^n$', tip: 'ស្វ័យគុណ xⁿ' },
        { label: 'xₙ', latex: '$x_n$', tip: 'សន្ទស្សន៍ (Subscript xₙ)' },
        { label: '√x', latex: '$\\sqrt{x}$', tip: 'រ៉ាឌីកាល់ការ៉េ (Square Root)' },
        { label: 'ⁿ√x', latex: '$\\sqrt[n]{x}$', tip: 'រ៉ាឌីកាល់ទី n' },
      ],
    },
    {
      group: 'សមីការ & ពិជគណិត',
      items: [
        { label: 'ax²+bx+c=0', latex: '$ax^2 + bx + c = 0$', tip: 'សមីការដឺក្រេទី២' },
        { label: 'Δ=b²-4ac', latex: '$\\Delta = b^2 - 4ac$', tip: 'រូបមន្តឌីសគ្រីមីណង់ ដេលតា' },
        { label: 'x=(-b±√Δ)/2a', latex: '$x = \\frac{-b \\pm \\sqrt{\\Delta}}{2a}$', tip: 'ឬសសមីការដឺក្រេទី២' },
        { label: 'y=ax+b', latex: '$y = ax + b$', tip: 'សមីការបន្ទាត់' },
        { label: 'S=a×b', latex: '$S = a \\times b$', tip: 'ក្រឡាផ្ទៃចតុកោណកែង' },
        { label: 'P=2(a+b)', latex: '$P = 2(a + b)$', tip: 'បរិមាត្រចតុកោណកែង' },
        { label: 'A=πr²', latex: '$A = \\pi r^2$', tip: 'ក្រឡាផ្ទៃរង្វង់' },
        { label: 'a²+b²=c²', latex: '$a^2 + b^2 = c^2$', tip: 'ទ្រឹស្តីបទពីតាក័រ' },
      ],
    },
    {
      group: 'សញ្ញាគណិតវិទ្យា MathType',
      items: [
        { label: '±', latex: '$\\pm$', tip: 'បូកដក (Plus-Minus)' },
        { label: '×', latex: '$\\times$', tip: 'គុណ' },
        { label: '÷', latex: '$\\div$', tip: 'ចែក' },
        { label: '≈', latex: '$\\approx$', tip: 'ប្រហែល' },
        { label: '≠', latex: '$\\neq$', tip: 'មិនស្មើ' },
        { label: '≤', latex: '$\\le$', tip: 'តូចជាងឬស្មើ' },
        { label: '≥', latex: '$\\ge$', tip: 'ធំជាងឬស្មើ' },
        { label: 'Δ', latex: '$\\Delta$', tip: 'ដេលតា (Delta)' },
        { label: 'π', latex: '$\\pi$', tip: 'ផាយ (Pi)' },
        { label: 'α', latex: '$\\alpha$', tip: 'អាល់ហ្វា (Alpha)' },
        { label: 'β', latex: '$\\beta$', tip: 'បេតា (Beta)' },
        { label: 'θ', latex: '$\\theta$', tip: 'តេតា (Theta)' },
        { label: '∑', latex: '$\\sum_{i=1}^n$', tip: 'ផលបូក (Sigma)' },
        { label: 'lim', latex: '$\\lim_{x \\to x_0}$', tip: 'លីមីត (Limit)' },
        { label: '∫', latex: '$\\int f(x)dx$', tip: 'អាំងតេក្រាល (Integral)' },
        { label: '∈', latex: '$\\in$', tip: 'ជារបស់ (In Set)' },
        { label: '→', latex: '$\\to$', tip: 'ព្រួញចង្អុល' },
        { label: '⇒', latex: '$\\implies$', tip: 'នាំឱ្យ (Implies)' },
        { label: '°C', latex: '$^{\\circ}\\text{C}$', tip: 'អង្សាសេ' },
      ],
    },
  ];

  return (
    <div className={`p-2 bg-slate-100/90 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-xl text-xs space-y-2 ${className}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold text-indigo-900 dark:text-indigo-300 flex items-center gap-1.5 font-serif">
          <span>📐 របាររូបមន្ត MathType Typography</span>
          <span className="text-[10px] font-sans font-normal text-slate-500 dark:text-slate-400">
            (Cambria Math & Times New Roman Serif Standard)
          </span>
        </span>
      </div>

      <div className="space-y-1.5">
        {symbolCategories.map((cat, cIdx) => (
          <div key={cIdx} className="flex flex-wrap items-center gap-1">
            <span className="text-[10px] font-semibold text-slate-500 dark:text-slate-400 w-24 shrink-0 font-sans">
              {cat.group}៖
            </span>
            <div className="flex flex-wrap items-center gap-1">
              {cat.items.map((sym, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => onInsertSymbol(sym.latex)}
                  title={sym.tip}
                  className="px-2 py-0.5 bg-white dark:bg-slate-700 hover:bg-indigo-50 dark:hover:bg-indigo-900/40 border border-slate-300 dark:border-slate-600 hover:border-indigo-400 rounded-md text-[11px] font-serif font-medium text-slate-800 dark:text-slate-100 transition-colors shadow-2xs cursor-pointer active:scale-95"
                >
                  {sym.label}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
