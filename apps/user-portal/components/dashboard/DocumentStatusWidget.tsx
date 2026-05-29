const STATUS_COPY: Record<string, { label: string; description: string }> = {
  not_submitted: {
    label: "Not Submitted",
    description: "Upload your identity document in your profile.",
  },
  submitted: {
    label: "Submitted",
    description: "Your document has been uploaded and is awaiting review.",
  },
  under_review: {
    label: "Under Review",
    description: "Our team is verifying your identity document.",
  },
  approved: {
    label: "Approved",
    description: "Your identity document has been verified.",
  },
  rejected: {
    label: "Rejected",
    description: "Please upload a valid document again.",
  },
  resubmission_required: {
    label: "Resubmission Required",
    description: "Upload a replacement identity document.",
  },
};

interface Props {
  status: string;
}

export function DocumentStatusWidget({ status }: Props) {
  const key = status.replace(/ /g, "_").toLowerCase();
  const copy = STATUS_COPY[key] || STATUS_COPY.not_submitted;

  return (
    <div className="archival-card rounded-sm p-6">
      <h2 className="font-serif text-xl text-emerald">Document Verification</h2>
      <p className="mt-3 text-sm font-medium text-graphite">{copy.label}</p>
      <p className="mt-1 text-sm text-graphite/65">{copy.description}</p>
    </div>
  );
}
