export default function FinancialStatementSection({ title }: { title: string }) {
  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-lg font-semibold">{title}</h2>
      <div className="h-24 flex items-center justify-center text-gray-400">[Financial Statement Placeholder]</div>
    </div>
  );
} 