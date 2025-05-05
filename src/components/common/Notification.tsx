import { XMarkIcon } from '@heroicons/react/24/outline';

interface NotificationProps {
  message: string;
  type: 'error' | 'success' | 'warning';
  onClose: () => void;
}

export default function Notification({ message, type, onClose }: NotificationProps) {
  const bgColor = type === 'error' ? 'bg-red-50' : type === 'success' ? 'bg-green-50' : 'bg-yellow-50';
  const textColor = type === 'error' ? 'text-red-800' : type === 'success' ? 'text-green-800' : 'text-yellow-800';
  const iconColor = type === 'error' ? 'text-red-400' : type === 'success' ? 'text-green-400' : 'text-yellow-400';

  return (
    <div className={`fixed top-4 right-4 z-50 ${bgColor} rounded-lg p-4 shadow-lg max-w-md`}>
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <XMarkIcon className={`h-5 w-5 ${iconColor}`} aria-hidden="true" />
        </div>
        <div className="ml-3">
          <p className={`text-sm font-medium ${textColor}`}>{message}</p>
        </div>
        <div className="ml-auto pl-3">
          <div className="-mx-1.5 -my-1.5">
            <button
              type="button"
              onClick={onClose}
              className={`inline-flex rounded-md p-1.5 ${iconColor} hover:bg-opacity-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-50 focus:ring-gray-600`}
            >
              <span className="sr-only">Dismiss</span>
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
} 