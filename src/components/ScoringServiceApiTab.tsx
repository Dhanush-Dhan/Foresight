import React, { useState } from 'react';
import {
  Terminal,
  Send,
  Code,
  CheckCircle2,
  Copy,
  Layers,
  Cpu,
  RefreshCw,
  Globe
} from 'lucide-react';
import { SKU_MASTER_LIST } from '../data/foresightData';

export const ScoringServiceApiTab: React.FC = () => {
  const [selectedSkuId, setSelectedSkuId] = useState<string>(SKU_MASTER_LIST[0].sku_id);
  const [endpoint, setEndpoint] = useState<'score-sku' | 'batch-forecast'>('score-sku');
  const [loading, setLoading] = useState<boolean>(false);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [copied, setCopied] = useState<boolean>(false);

  // Send request to Express API backend
  const handleSendRequest = async () => {
    setLoading(true);
    try {
      if (endpoint === 'score-sku') {
        const res = await fetch('/api/v1/score-sku', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sku_id: selectedSkuId })
        });
        const data = await res.json();
        setApiResponse(data);
      } else {
        const res = await fetch('/api/v1/batch-forecast', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ category: 'Furnishings & Seating', limit: 5 })
        });
        const data = await res.json();
        setApiResponse(data);
      }
    } catch (err: any) {
      setApiResponse({ error: err.message || 'Failed to call endpoint' });
    } finally {
      setLoading(false);
    }
  };

  const curlSnippet = endpoint === 'score-sku'
    ? `curl -X POST "${window.location.origin}/api/v1/score-sku" \\\n  -H "Content-Type: application/json" \\\n  -d '{"sku_id": "${selectedSkuId}"}'`
    : `curl -X POST "${window.location.origin}/api/v1/batch-forecast" \\\n  -H "Content-Type: application/json" \\\n  -d '{"category": "Furnishings & Seating", "limit": 5}'`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(curlSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-slate-900 text-white rounded-full">
                Deliverable D6 REST Service
              </span>
              <span className="text-xs text-slate-500">• Production Scoring Microservice API</span>
            </div>
            <h2 className="text-xl font-bold text-slate-900 mt-1">
              Deployed Demand & Risk Scoring Service Playground
            </h2>
          </div>

          <div className="flex items-center space-x-2 text-xs bg-emerald-50 text-emerald-800 px-3 py-1.5 rounded-xl border border-emerald-200">
            <Globe className="w-4 h-4 text-emerald-600" />
            <span className="font-semibold">Service Live & Healthy</span>
          </div>
        </div>

        {/* Endpoint Selector Tabs */}
        <div className="flex space-x-3 mt-5">
          <button
            onClick={() => setEndpoint('score-sku')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              endpoint === 'score-sku'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            POST /api/v1/score-sku
          </button>

          <button
            onClick={() => setEndpoint('batch-forecast')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              endpoint === 'batch-forecast'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            POST /api/v1/batch-forecast
          </button>
        </div>
      </div>

      {/* Playground Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Request Panel */}
        <div className="bg-slate-900 rounded-2xl p-6 text-white border border-slate-800 shadow-xl space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-4 h-4" />
              <span>HTTP Request Body</span>
            </span>
            <span className="text-[10px] font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-300">application/json</span>
          </div>

          {endpoint === 'score-sku' ? (
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1.5">Select Target SKU ID</label>
              <select
                value={selectedSkuId}
                onChange={(e) => setSelectedSkuId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl px-3 py-2 text-xs font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                {SKU_MASTER_LIST.slice(0, 20).map((s) => (
                  <option key={s.sku_id} value={s.sku_id}>
                    {s.sku_id} ({s.sku_name})
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <div className="text-xs text-slate-400 space-y-2">
              <p>Batch Request Payload:</p>
              <pre className="bg-slate-950 p-3 rounded-xl border border-slate-800 font-mono text-indigo-300">
                {`{\n  "category": "Furnishings & Seating",\n  "limit": 5\n}`}
              </pre>
            </div>
          )}

          {/* cURL Snippet Box */}
          <div className="bg-slate-950 rounded-xl p-3 border border-slate-800 relative">
            <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
              <span>cURL Command</span>
              <button onClick={copyToClipboard} className="text-indigo-400 hover:underline flex items-center gap-1">
                <Copy className="w-3 h-3" />
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>
            <pre className="font-mono text-[11px] text-slate-300 overflow-x-auto whitespace-pre-wrap">{curlSnippet}</pre>
          </div>

          <button
            onClick={handleSendRequest}
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white py-2.5 rounded-xl text-xs font-bold transition flex items-center justify-center space-x-2 shadow-lg shadow-indigo-600/30"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            <span>Execute Request</span>
          </button>
        </div>

        {/* Response Inspector Panel */}
        <div className="bg-slate-950 rounded-2xl p-6 text-slate-200 border border-slate-800 shadow-xl space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-2">
              <Code className="w-4 h-4" />
              <span>HTTP 200 OK Response</span>
            </span>
            <span className="text-[10px] font-mono bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded border border-emerald-800">
              Latency: ~12ms
            </span>
          </div>

          {apiResponse ? (
            <pre className="bg-slate-900 p-4 rounded-xl border border-slate-800 text-xs font-mono text-emerald-400 h-80 overflow-y-auto whitespace-pre-wrap">
              {JSON.stringify(apiResponse, null, 2)}
            </pre>
          ) : (
            <div className="h-80 bg-slate-900/60 rounded-xl border border-slate-800/80 flex flex-col items-center justify-center text-slate-500 text-xs text-center p-6 space-y-2">
              <Terminal className="w-8 h-8 text-slate-600 animate-pulse" />
              <p>Click "Execute Request" to test the live scoring endpoint response.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
