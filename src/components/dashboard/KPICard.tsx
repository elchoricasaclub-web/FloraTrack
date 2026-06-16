type KPICardProps = {
  icon: string;
  value: string;
  title: string;
  subtitle?: string;
};

export default function KPICard({
  icon,
  value,
  title,
  subtitle,
}: KPICardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <div className="text-3xl mb-2">{icon}</div>

      <h3 className="text-4xl font-bold text-green-700">
        {value}
      </h3>

      <p className="font-semibold">
        {title}
      </p>

      <p className="text-sm text-slate-500">
        {subtitle}
      </p>
    </div>
  );
}