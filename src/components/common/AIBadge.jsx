import React from 'react';
import { Sparkles } from 'lucide-react';
import './common.css';

export default function AIBadge({ size = 'sm', label = 'AI Intelligence', pulse = false }) {
  return (
    <span className={`ai-badge ai-badge--${size} ${pulse ? 'ai-badge--pulse' : ''}`}>
      <Sparkles size={size === 'sm' ? 12 : 14} className="ai-badge__icon" />
      <span>{label}</span>
    </span>
  );
}
