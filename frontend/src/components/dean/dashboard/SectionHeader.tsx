import React from "react";

interface SectionHeaderProps {
  title: string;
  subtitle: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({ title, subtitle }) => (
  <div className="mb-6">
    <h2 className="text-lg font-bold text-slate-800">{title}</h2>
    <p className="text-sm text-slate-500">{subtitle}</p>
  </div>
);

export default SectionHeader;
