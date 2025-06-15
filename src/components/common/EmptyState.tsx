
import React from 'react';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  onAction?: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  actionLabel,
  actionHref,
  onAction
}) => {
  return (
    <div className="text-center py-12 px-6">
      <div className="w-16 h-16 text-gray-300 mx-auto mb-6 p-4 bg-gray-50 rounded-full">
        {icon}
      </div>
      <h3 className="text-xl font-semibold mb-3 text-gray-800">{title}</h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">{description}</p>
      {(actionLabel && (actionHref || onAction)) && (
        <Button 
          asChild={!!actionHref}
          onClick={onAction}
          className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300"
        >
          {actionHref ? (
            <a href={actionHref}>{actionLabel}</a>
          ) : (
            <span>{actionLabel}</span>
          )}
        </Button>
      )}
    </div>
  );
};

export default EmptyState;
