import React, { useState } from 'react';
import { X, Terminal, Copy, Check, Database, Server, Code, FileCode } from 'lucide-react';
import { SPRING_BOOT_BACKEND_CODE } from '../data/springBootCode';

interface SpringBootArchitectureModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SpringBootArchitectureModal: React.FC<SpringBootArchitectureModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [selectedFileIndex, setSelectedFileIndex] = useState(0);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const currentFile = SPRING_BOOT_BACKEND_CODE[selectedFileIndex];

  const handleCopy = () => {
    navigator.clipboard.writeText(currentFile.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/75 backdrop-blur-sm overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-stone-900 text-stone-100 rounded-2xl shadow-2xl overflow-hidden my-auto border border-stone-800">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-800 bg-stone-950 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-400">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-editorial text-lg font-medium text-white">
                  Java 21 + Spring Boot 3 &amp; MySQL Architecture
                </span>
                <span className="text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-mono font-semibold">
                  REST API Backend
                </span>
              </div>
              <p className="text-xs text-stone-400">
                Production-grade backend classes and MySQL DDL ready for deployment
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full text-stone-400 hover:text-white transition-colors"
            aria-label="Close architecture modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tech Stack Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 px-6 py-3 bg-stone-900 border-b border-stone-800 text-xs">
          <div className="flex items-center gap-2 text-stone-300">
            <Server className="w-4 h-4 text-emerald-400" />
            <span>Java 21 (Virtual Threads)</span>
          </div>
          <div className="flex items-center gap-2 text-stone-300">
            <Code className="w-4 h-4 text-amber-400" />
            <span>Spring Boot 3.3.x</span>
          </div>
          <div className="flex items-center gap-2 text-stone-300">
            <Database className="w-4 h-4 text-sky-400" />
            <span>MySQL 8.0+ (HikariCP)</span>
          </div>
          <div className="flex items-center gap-2 text-stone-300">
            <FileCode className="w-4 h-4 text-purple-400" />
            <span>JPA / Hibernate / REST</span>
          </div>
        </div>

        {/* Code Explorer */}
        <div className="grid grid-cols-1 md:grid-cols-4 h-[500px]">
          {/* File sidebar */}
          <div className="p-3 bg-stone-950 border-r border-stone-800 space-y-1 overflow-y-auto">
            <span className="text-[10px] uppercase font-mono tracking-wider text-stone-500 px-2 block mb-2">
              Architecture Files:
            </span>
            {SPRING_BOOT_BACKEND_CODE.map((file, idx) => (
              <button
                key={file.filename}
                onClick={() => setSelectedFileIndex(idx)}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono transition-all block ${
                  selectedFileIndex === idx
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    : 'text-stone-400 hover:bg-stone-900 hover:text-stone-200'
                }`}
              >
                <div className="font-medium truncate">{file.filename}</div>
                <div className="text-[10px] text-stone-500 font-sans truncate">{file.language.toUpperCase()}</div>
              </button>
            ))}
          </div>

          {/* Code Viewer */}
          <div className="md:col-span-3 flex flex-col bg-[#141210] overflow-hidden">
            <div className="px-4 py-2.5 bg-stone-950/80 border-b border-stone-800 flex items-center justify-between text-xs">
              <div className="space-y-0.5">
                <span className="font-mono text-amber-300 text-xs font-semibold">
                  {currentFile.filename}
                </span>
                <p className="text-[11px] text-stone-400">
                  {currentFile.description}
                </p>
              </div>

              <button
                onClick={handleCopy}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-mono transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy Source'}</span>
              </button>
            </div>

            <div className="flex-1 p-4 overflow-y-auto font-mono text-xs text-stone-300 leading-relaxed bg-[#12100E] scrollbar-thin">
              <pre className="whitespace-pre">{currentFile.code}</pre>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-stone-950 border-t border-stone-800 flex items-center justify-between text-xs text-stone-400">
          <span>Target Platform: Spring Boot on Linux / Cloud Run / AWS ECS + AWS RDS MySQL</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-stone-800 hover:bg-stone-700 text-white rounded-lg text-xs"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
