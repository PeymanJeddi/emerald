import Link from "next/link";

interface Props {
  unreadCount: number;
}

export function MessagesWidget({ unreadCount }: Props) {
  return (
    <div className="archival-card rounded-sm p-6">
      <div className="flex items-center justify-between">
        <h2 className="font-serif text-xl text-emerald">Notifications</h2>
        <Link href="/messages" className="text-xs text-emerald hover:underline">
          Open messages
        </Link>
      </div>
      <ul className="mt-4 space-y-2 text-sm text-graphite/75">
        {unreadCount > 0 && (
          <li>You have {unreadCount} unread message{unreadCount === 1 ? "" : "s"}.</li>
        )}
        <li>Check messages for application updates and verification notices.</li>
      </ul>
    </div>
  );
}
