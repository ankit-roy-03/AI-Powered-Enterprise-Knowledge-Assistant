function StatCard({ title, value, description, icon: Icon, tone = "blue" }) {
  return (
    <div className={`stat-card stat-card-${tone}`}>
      <div className="stat-card-heading">
        <p className="stat-title">{title}</p>
        {Icon && <span className="stat-card-icon"><Icon size={18} /></span>}
      </div>
      <strong className="stat-value">{value}</strong>
      <span className="stat-description">{description}</span>
    </div>
  );
}

export default StatCard;