import { Package, Clock, CheckCircle, Truck } from "lucide-react";

function clsx(...classes) {
  return classes.filter(Boolean).join(" ");
}

function StatCard({ title, value, icon: Icon, color, bg }) {
  return (
    <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-600">{title}</p>
          <p className="text-3xl font-bold text-slate-900 mt-2">{value}</p>
        </div>
        <div
          className={clsx(
            "w-12 h-12 rounded-lg flex items-center justify-center",
            bg
          )}
        >
          <Icon className={clsx("w-6 h-6", color)} />
        </div>
      </div>
    </div>
  );
}

export default function StatusCards({ stats }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <StatCard title="Total Orders" value={stats.total} icon={Package} />
      <StatCard
        title="Shipped"
        value={stats.shipped}
        icon={Truck}
        color="text-amber-600"
        bg="bg-amber-100"
      />
      <StatCard
        title="Processing"
        value={stats.processing}
        icon={Package}
        color="text-blue-600"
        bg="bg-blue-100"
      />
      <StatCard
        title="Delivered"
        value={stats.delivered}
        icon={CheckCircle}
        color="text-green-600"
        bg="bg-green-100"
      />
    </div>
  );
}
