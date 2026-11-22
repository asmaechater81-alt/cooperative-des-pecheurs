import StatsRecettes from "./components/StatsRecettes";
import ListeMembres from "./components/ListeMembres";

export default function App() {
  return (
    <main>
      <h1>Coopérative de pêcheurs</h1>
      <StatsRecettes />
      <ListeMembres />
    </main>
  );
}