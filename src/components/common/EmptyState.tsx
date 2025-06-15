
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
    <div className="text-center py-8">
      <div className="w-12 h-12 text-gray-400 mx-auto mb-4">
        {icon}
      </div>
      <h3 className="text-lg font-semibold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      {(actionLabel && (actionHref || onAction)) && (
        <Button 
          asChild={!!actionHref}
          onClick={onAction}
          className="bg-blue-600 hover:bg-blue-700"
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
