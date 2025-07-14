import { EditInterviewed } from "./EditInterviewed";

async function EditInterviewPage({ params }: { params: Promise<{ id: number }> }) {
  const { id } = await params;
  return <EditInterviewed id={id}/>
}

export default EditInterviewPage;
