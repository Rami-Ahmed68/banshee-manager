import { useToast } from "@chakra-ui/react";

export const useNotification = () => {
  const toast = useToast();

  const showSuccess = (message = "Operation completed successfully!") => {
    toast({
      title: "Success",
      description: message,
      status: "success",
      duration: 3000,
      isClosable: true,
      position: "bottom-right",
    });
  };

  const showError = (message = "Something went wrong!") => {
    toast({
      title: "Error",
      description: message,
      status: "error",
      duration: 5000,
      isClosable: true,
      position: "top-center",
    });
  };

  const showWarning = (message = "Please check your input.") => {
    toast({
      title: "Warning",
      description: message,
      status: "warning",
      duration: 4000,
      isClosable: true,
      position: "top-right",
    });
  };

  const showInfo = (message = "Here's some information.") => {
    toast({
      title: "Info",
      description: message,
      status: "info",
      duration: 3000,
      isClosable: true,
      position: "top-right",
    });
  };

  const showLoading = (message = "Processing...") => {
    return toast({
      title: "Loading",
      description: message,
      status: "loading",
      duration: null, // Stays until closed
      isClosable: true,
      position: "top-right",
    });
  };

  return {
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
  };
};
