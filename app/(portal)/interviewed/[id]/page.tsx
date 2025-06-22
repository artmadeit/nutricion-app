import { EditInterview } from "./EditInterview";

async function EditInterviewPage({ params }: { params: Promise<{ id: number }> }) {
  const { id } = await params;
  return <EditInterview id={id}/>
}

export default EditInterviewPage;
