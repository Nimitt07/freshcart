export default function EmptyState({ title, body }) {
  return (
    <div className="rounded-lg border border-dashed border-black/20 bg-white p-10 text-center">
      <h2 className="text-xl font-bold">{title}</h2>
      <p className="mt-2 text-black/60">{body}</p>
    </div>
  );
}
