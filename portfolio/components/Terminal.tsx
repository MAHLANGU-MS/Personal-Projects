
import React, { useState, useRef, useEffect } from 'react';
import { TerminalLine, PortfolioData } from '../types';
import { askAssistant } from '../services/gemini';

interface TerminalProps {
  data: PortfolioData;
  onCommand: (command: string) => void;
  greeting: string[];
}

const Terminal: React.FC<TerminalProps> = ({ data, onCommand, greeting }) => {
  const [input, setInput] = useState('');
  
  const generateInitialHistory = (): TerminalLine[] => {
    const history: TerminalLine[] = greeting.map((text, i) => ({ 
      text, 
      type: 'output', 
      id: `greet-${i}` 
    }));
    
    const userPrompt = `${data.profile.name.toLowerCase().split(' ')[0]}@portfolio:~$`;
    
    // Initial "help" command simulation for onboarding
    history.push({ 
      text: `${userPrompt} help`, 
      type: 'input', 
      id: 'initial-help-input' 
    });
    
    const helpResults = [
      "Available commands:",
      "  about      - Display background and objective",
      "  skills     - Technical stack and proficiencies",
      "  projects   - Show engineering works",
      "  contact    - Reach out to me",
      "  clear      - Clear buffer",
      "  gui        - Switch to modern dashboard view",
      "  ai [query] - Consult the strategic assistant"
    ];
    
    helpResults.forEach((res, i) => {
      history.push({ text: res, type: 'output', id: `initial-help-res-${i}` });
    });
    
    return history;
  };

  const [history, setHistory] = useState<TerminalLine[]>(generateInitialHistory);
  const [commandHistory, setCommandHistory] = useState<string[]>(['help']);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [isProcessing, setIsProcessing] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const addLine = (text: string, type: TerminalLine['type'] = 'output') => {
    setHistory(prev => [...prev, { text, type, id: Math.random().toString(36).substr(2, 9) }]);
  };

  const handleCommand = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isProcessing) return;

    const cmd = input.trim();
    const [base, ...args] = cmd.toLowerCase().split(' ');
    const userPrompt = `${data.profile.name.toLowerCase().split(' ')[0]}@portfolio:~$`;
    
    addLine(`${userPrompt} ${cmd}`, 'input');
    setCommandHistory(prev => [cmd, ...prev]);
    setHistoryIndex(-1);
    setInput('');

    switch (base) {
      case 'help':
        addLine("Available commands:");
        addLine("  about      - Display background and objective");
        addLine("  skills     - Technical stack and proficiencies");
        addLine("  projects   - Show engineering works");
        addLine("  contact    - Reach out to me");
        addLine("  clear      - Clear buffer");
        addLine("  gui        - Switch to modern dashboard view");
        addLine("  ai [query] - Consult the strategic assistant");
        break;
      case 'clear':
        setHistory([]);
        break;
      case 'about':
        addLine(`${data.profile.name} // ${data.profile.role}`);
        addLine(data.profile.bio);
        addLine(`Location: ${data.profile.location}`);
        break;
      case 'skills':
        addLine("SYSTEM_CAPABILITIES:");
        data.skills.forEach(s => addLine(`  [${s.name.padEnd(20)}] ${'█'.repeat(Math.round(s.level / 10))}${'.'.repeat(10 - Math.round(s.level / 10))} ${s.level}%`));
        break;
      case 'projects':
        addLine("ACTIVE_REPOSITORIES:");
        data.projects.forEach(p => addLine(`  > ${p.title}: ${p.description}`));
        break;
      case 'contact':
        addLine(`EMAIL: ${data.profile.email}`);
        addLine(`TEL  : 0837527724`);
        addLine(`WEB  : ${data.profile.linkedin}`);
        break;
      case 'gui':
        onCommand('gui');
        break;
      case 'ai':
        if (args.length === 0) {
          addLine("Usage: ai [question about Siphamandla]", "error");
        } else {
          setIsProcessing(true);
          addLine("Querying Assistant...", "success");
          const answer = await askAssistant(args.join(' '), data);
          addLine(`[AI]: ${answer}`, "ai");
          setIsProcessing(false);
        }
        break;
      default:
        addLine(`'${base}' is not recognized as an internal or external command.`, "error");
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const nextIndex = historyIndex + 1;
      if (nextIndex < commandHistory.length) {
        setHistoryIndex(nextIndex);
        setInput(commandHistory[nextIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const nextIndex = historyIndex - 1;
      if (nextIndex >= 0) {
        setHistoryIndex(nextIndex);
        setInput(commandHistory[nextIndex]);
      } else {
        setHistoryIndex(-1);
        setInput('');
      }
    }
  };

  return (
    <div 
      className="bg-[#0a0a0a] border border-[#262626] rounded-lg shadow-2xl p-4 h-[600px] flex flex-col font-mono text-sm sm:text-base relative overflow-hidden"
      onClick={() => inputRef.current?.focus()}
    >
      <div className="flex-1 overflow-y-auto space-y-1 mb-4 scrollbar-hide">
        {history.map((line) => (
          <div key={line.id} className="whitespace-pre-wrap break-words">
            {line.type === 'input' && <span className="text-lime-400 opacity-50 mr-2">➜</span>}
            <span className={`
              ${line.type === 'input' ? 'text-lime-400 font-bold' : ''}
              ${line.type === 'output' ? 'text-lime-400 opacity-90' : ''}
              ${line.type === 'error' ? 'text-red-400' : ''}
              ${line.type === 'success' ? 'text-cyan-400' : ''}
              ${line.type === 'ai' ? 'text-purple-400 italic' : ''}
            `}>
              {line.text}
            </span>
          </div>
        ))}
        {isProcessing && (
          <div className="text-cyan-400 animate-pulse">Assistant is thinking...</div>
        )}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleCommand} className="flex items-center gap-2 border-t border-[#262626] pt-2">
        <span className="text-lime-400 font-bold whitespace-nowrap">
          {data.profile.name.toLowerCase().split(' ')[0]}@portfolio:~$
        </span>
        <input
          ref={inputRef}
          autoFocus
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent border-none outline-none text-lime-400 p-0 caret-lime-400"
          spellCheck={false}
          autoComplete="off"
        />
      </form>
      
      {/* Decorative scanline effect */}
      <div className="absolute inset-0 pointer-events-none opacity-10 scanlines"></div>
    </div>
  );
};

export default Terminal;
