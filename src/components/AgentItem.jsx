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
  const IconComponent = iconMap[agent.id];

  return (
    <li className="agent-item">
      <div className="agent-icon">
        <IconComponent aria-hidden="true" />
      </div>
      <div className="agent-name">{agent.name}</div>
    </li>
  );
}

export default AgentItem;
