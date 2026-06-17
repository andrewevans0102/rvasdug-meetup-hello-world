import { agents } from '../data/agents';
import AgentItem from './AgentItem';
import './AgentList.css';

function AgentList() {
  return (
    <div className="agent-list-container">
      <h2 className="agent-list-title">Reygent Agents</h2>
      <ul className="agent-list">
        {agents.map((agent) => (
          <AgentItem key={agent.id} agent={agent} />
        ))}
      </ul>
    </div>
  );
}

export default AgentList;
