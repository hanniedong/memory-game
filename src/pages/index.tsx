import '../app/globals.css';
import GameBoard from '@/components/GameBoard';

const App: React.FC = () => {

  return (
    <div className="App p-4">
      <h1 className="text-3xl font-bold mb-4">Memory Game</h1>
      <GameBoard /> 
    </div>
  );
};

export default App;