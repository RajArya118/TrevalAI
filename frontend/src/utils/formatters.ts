export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateString;
  }
};

export const getCategoryColor = (category: string): string => {
  const cat = category.toLowerCase();
  if (cat.includes('beach')) return 'bg-cyan-50 text-cyan-700 border-cyan-200';
  if (cat.includes('mountain')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
  if (cat.includes('heritage') || cat.includes('culture')) return 'bg-amber-50 text-amber-700 border-amber-200';
  if (cat.includes('adventure')) return 'bg-orange-50 text-orange-700 border-orange-200';
  if (cat.includes('urban')) return 'bg-indigo-50 text-indigo-700 border-indigo-200';
  return 'bg-sky-50 text-sky-700 border-sky-200';
};
