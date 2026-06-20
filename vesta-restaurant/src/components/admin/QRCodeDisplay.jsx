import { QRCodeSVG } from 'qrcode.react';
import { TABLES } from '../../data/menuData';

const tableColors = [
  { bg: 'bg-purple-50', border: 'border-purple-200', label: 'text-purple-700', dot: 'bg-purple-500' },
  { bg: 'bg-blue-50',   border: 'border-blue-200',   label: 'text-blue-700',   dot: 'bg-blue-500'   },
  { bg: 'bg-amber-50',  border: 'border-amber-200',  label: 'text-amber-700',  dot: 'bg-amber-500'  },
  { bg: 'bg-green-50',  border: 'border-green-200',  label: 'text-green-700',  dot: 'bg-green-500'  },
];

function getTableUrl(tableId) {
  return `${window.location.origin}/?table=${tableId}`;
}

export default function QRCodeDisplay() {
  const handlePrint = () => window.print();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-bold text-gray-900">Table QR Codes</h2>
          <p className="text-gray-400 text-sm mt-0.5">
            Print and place at each table — customers scan to open their menu directly
          </p>
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 px-4 py-2.5 bg-purple-700 text-white text-sm font-semibold rounded-xl hover:bg-purple-800 active:scale-95 transition-all shadow-md shadow-purple-200"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
              d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"
            />
          </svg>
          Print All QR Codes
        </button>
      </div>

      {/* QR grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {TABLES.map((tableId, idx) => {
          const c = tableColors[idx];
          const url = getTableUrl(tableId);
          return (
            <div
              key={tableId}
              className={`${c.bg} border-2 ${c.border} rounded-2xl p-5 flex flex-col items-center text-center animate-fade-in`}
            >
              {/* QR Code */}
              <div className="bg-white p-3 rounded-xl shadow-sm mb-4">
                <QRCodeSVG
                  value={url}
                  size={140}
                  bgColor="#ffffff"
                  fgColor="#1F2937"
                  level="M"
                  includeMargin={false}
                />
              </div>

              {/* Table label */}
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-2.5 h-2.5 rounded-full ${c.dot}`} />
                <span className={`font-bold text-lg ${c.label}`}>Table {tableId}</span>
              </div>

              {/* URL preview */}
              <p className="text-xs text-gray-400 break-all leading-relaxed mb-3">
                {url}
              </p>

              {/* Copy URL button */}
              <CopyButton url={url} colorClass={c.label} borderClass={c.border} bgClass={c.bg} />
            </div>
          );
        })}
      </div>

      {/* Instructions */}
      <div className="mt-8 p-5 bg-gray-50 rounded-2xl border border-gray-200">
        <h3 className="font-semibold text-gray-900 text-sm mb-3">How it works</h3>
        <ol className="space-y-2">
          {[
            'Print this page and cut out each QR card',
            'Place each QR card at its corresponding table',
            'Customers scan the code with their phone camera',
            'The menu opens automatically pre-selected to their table',
          ].map((step, i) => (
            <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
              <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5">
                {i + 1}
              </span>
              {step}
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}

function CopyButton({ url, colorClass, borderClass, bgClass }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(url).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <button
      onClick={handleCopy}
      className={`
        w-full py-2 rounded-xl text-xs font-semibold border transition-all duration-200
        ${copied
          ? 'bg-green-500 border-green-500 text-white'
          : `${bgClass} ${borderClass} ${colorClass} hover:opacity-80`
        }
      `}
    >
      {copied ? '✓ Copied!' : 'Copy Link'}
    </button>
  );
}

// useState import needed inside same file
import { useState } from 'react';
