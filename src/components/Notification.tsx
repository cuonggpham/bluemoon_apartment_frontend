import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';

const StyledToastContainer = styled(ToastContainer)`
  /* Modern toast styling */
  .Toastify__toast {
    border-radius: var(--border-radius-xl);
    box-shadow: var(--shadow-lg);
    border: 1px solid var(--color-grey-200);
    font-family: var(--font-family-sans);
    font-size: var(--font-size-sm);
    font-weight: var(--font-weight-medium);
    backdrop-filter: blur(20px);
    min-height: 64px;
  }

  .Toastify__toast--success {
    background: linear-gradient(135deg, var(--color-green-50), var(--color-green-100));
    border-color: var(--color-green-200);
    color: var(--color-green-800);
  }

  .Toastify__toast--error {
    background: linear-gradient(135deg, var(--color-red-50), var(--color-red-100));
    border-color: var(--color-red-200);
    color: var(--color-red-800);
  }

  .Toastify__toast--warning {
    background: linear-gradient(135deg, var(--color-orange-50), var(--color-orange-100));
    border-color: var(--color-orange-200);
    color: var(--color-orange-800);
  }

  .Toastify__toast--info {
    background: linear-gradient(135deg, var(--color-blue-50), var(--color-blue-100));
    border-color: var(--color-blue-200);
    color: var(--color-blue-800);
  }

  .Toastify__progress-bar {
    height: 3px;
  }

  .Toastify__progress-bar--success {
    background: var(--color-green-500);
  }

  .Toastify__progress-bar--error {
    background: var(--color-red-500);
  }

  .Toastify__progress-bar--warning {
    background: var(--color-orange-500);
  }

  .Toastify__progress-bar--info {
    background: var(--color-blue-500);
  }

  .Toastify__close-button {
    color: inherit;
    opacity: 0.6;
    
    &:hover {
      opacity: 1;
    }
  }
`;

const Notification = () => {
  return (
    <StyledToastContainer 
      position="bottom-right"
      autoClose={4000}
      hideProgressBar={false}
      newestOnTop={true}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="light"
    />
  );
};

export default Notification;