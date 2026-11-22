import "./App.css";
import StatsRecettes from "./components/StatsRecettes";
import ListeMembres from "./components/ListeMembres";
import TableCaptures from "./components/TableCaptures";

export default function App() {
  return (
    <main>
      <h1>Coopérative de pêcheurs</h1>
      <StatsRecettes />
      <ListeMembres />
      <TableCaptures />
    </main>
  );
}