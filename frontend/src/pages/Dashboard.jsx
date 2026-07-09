import CodeEditor from "../components/CodeEditor";
import Navbar from "../components/Navbar";
import WelcomeCard from "../components/WelcomeCard";

function Dashboard() {
  return (
<>
  <Navbar />

  <div
    style={{
      padding: "30px",
      background: "#f5f5f5",
      minHeight: "100vh",
    }}
  >
    <WelcomeCard />

    <CodeEditor />
  </div>
</>
  );
}

export default Dashboard;