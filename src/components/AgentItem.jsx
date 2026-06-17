import { useState } from 'react';
import {
  FaCode,
  FaCheckCircle,
  FaClipboardList,
  FaShieldAlt,
  FaCodeBranch,
  FaWrench
} from 'react-icons/fa';
import './AgentItem.css';

const iconMap = {
  dev: FaCode,
  qe: FaCheckCircle,
  planner: FaClipboardList,
  security: FaShieldAlt,
  pr: FaCodeBranch,
  adhoc: FaWrench,
};

function AgentItem({ agent }) {
  const [isFocused, setIsFocused] = useState(false);
  const IconComponent = iconMap[agent.id];

  const handleFocus = () => {
    setIsFocused(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
  };

  return (
    <li
      className="agent-item"
      tabIndex={0}
      onFocus={handleFocus}
      onBlur={handleBlur}
      aria-label={`${agent.name}: ${agent.description}`}
    >
      <div className="agent-icon">
        <IconComponent aria-hidden="true" />
      </div>
      <div className="agent-name">{agent.name}</div>
      {isFocused && (
        <div className="agent-description-panel" role="tooltip" aria-live="polite">
          {agent.description}
        </div>
      )}
    </li>
  );
}

export default AgentItem;
