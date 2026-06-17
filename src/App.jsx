import './App.css';
import AgentList from './components/AgentList';

function App() {
  return (
    <>
      <section id="center">
        <div>
          <h1 className="blinking-title">RVASDUG Meetup</h1>
        </div>
        <AgentList />
      </section>

      <div className="ticks"></div>

      <div className="ticks"></div>
      <section id="spacer"></section>
    </>
  );
}

export default App;
