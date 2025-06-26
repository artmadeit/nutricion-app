import { InterviewForm } from "../InterviewForm";

export default async function InterviewPage({ params }: { params: Promise<{ id: number }> }) {
    const { id: personId } = await params;

    return <InterviewForm personId={personId} />
}