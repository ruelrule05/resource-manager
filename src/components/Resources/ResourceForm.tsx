import { useParams } from "react-router";

function ResourceForm() {
  const { id } = useParams();

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">{id ? `Edit Resource: ${id}` : `Create New Resource`}</h2>
    </div>
  );
}

export default ResourceForm;