import { AcademicCard } from "./AcademicCard";

interface EmptyStateProps {
  title: string;
  message: string;
}

export function EmptyState({ title, message }: EmptyStateProps) {
  return (
    <AcademicCard className="py-12 text-center">
      <h3 className="font-serif text-xl text-navy">{title}</h3>
      <p className="mx-auto mt-3 max-w-md text-gray-600">{message}</p>
    </AcademicCard>
  );
}
