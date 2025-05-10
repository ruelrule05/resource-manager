import {Link} from "react-router";

function DashboardView() {
  return (
    <>
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
      <p>Welcome to the Resource Management Dashboard!</p>
      <Link to="/resources" className="">Resources</Link>
    </>
  );
}

export default DashboardView;