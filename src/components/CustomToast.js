import toast from 'react-hot-toast';
import { CheckCircle, XCircle, AlertCircle, Info, Coins } from 'lucide-react';

const CustomToast = {
  success: (message, options = {}) => {
    return toast.success(message, {
      duration: 4000,
      style: {
        background: '#10B981',
        color: 'white',
        borderRadius: '12px',
        padding: '16px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      },
      icon: <CheckCircle className="w-5 h-5" />,
      ...options
    });
  },

  error: (message, options = {}) => {
    return toast.error(message, {
      duration: 5000,
      style: {
        background: '#EF4444',
        color: 'white',
        borderRadius: '12px',
        padding: '16px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      },
      icon: <XCircle className="w-5 h-5" />,
      ...options
    });
  },

  warning: (message, options = {}) => {
    return toast(message, {
      duration: 4000,
      style: {
        background: '#F59E0B',
        color: 'white',
        borderRadius: '12px',
        padding: '16px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      },
      icon: <AlertCircle className="w-5 h-5" />,
      ...options
    });
  },

  info: (message, options = {}) => {
    return toast(message, {
      duration: 3000,
      style: {
        background: '#3B82F6',
        color: 'white',
        borderRadius: '12px',
        padding: '16px',
        fontSize: '14px',
        fontWeight: '500',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      },
      icon: <Info className="w-5 h-5" />,
      ...options
    });
  },

  earning: (amount, options = {}) => {
    return toast.success(`+${amount} F ajoutés !`, {
      duration: 5000,
      style: {
        background: 'linear-gradient(135deg, #10B981, #059669)',
        color: 'white',
        borderRadius: '12px',
        padding: '16px',
        fontSize: '16px',
        fontWeight: '600',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      },
      icon: <Coins className="w-6 h-6" />,
      ...options
    });
  }
};

export default CustomToast;