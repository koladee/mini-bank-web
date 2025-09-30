export default function Loading({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="w-full py-6 text-center text-gray-600">{label}</div>
  );
}
