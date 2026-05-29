import { Badge, statusLabelToVariant } from "@/components/ui/Badge";
import type { Conference } from "@/lib/types";

interface ConferenceMetaProps {
  conference: Conference;
}

export function ConferenceMeta({ conference }: ConferenceMetaProps) {
  return (
    <dl className="grid gap-3 text-sm sm:grid-cols-2">
      <div>
        <dt className="text-gray-500">Status</dt>
        <dd className="mt-1">
          <Badge variant={statusLabelToVariant(conference.status)}>
            {conference.status}
          </Badge>
        </dd>
      </div>
      <div>
        <dt className="text-gray-500">Date</dt>
        <dd className="mt-1 text-gray-700">{conference.date}</dd>
      </div>
      <div>
        <dt className="text-gray-500">Location</dt>
        <dd className="mt-1 text-gray-700">{conference.location}</dd>
      </div>
      <div>
        <dt className="text-gray-500">Format</dt>
        <dd className="mt-1 text-gray-700">{conference.format}</dd>
      </div>
      <div className="sm:col-span-2">
        <dt className="text-gray-500">Category</dt>
        <dd className="mt-1 text-gray-700">{conference.category}</dd>
      </div>
      <div className="sm:col-span-2">
        <dt className="text-gray-500">Event reference code</dt>
        <dd className="mt-1 font-mono text-navy">{conference.eventReferenceCode}</dd>
      </div>
    </dl>
  );
}
