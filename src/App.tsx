import DashboardApp from "./components/DashboardApp";
import Sidebar from "./components/Sidebar";
import {FaRegMehBlank} from 'react-icons/fa';

const App: React.FC = () => {
  return (
    <>
      <div className="dashboard">
        <Sidebar />
        <DashboardApp />
      </div>
      <div className="shapes__one"><FaRegMehBlank size={500}/></div>
    </>
  );
}

export default App;