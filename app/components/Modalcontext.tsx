import React, { createContext, useState, useContext, ReactNode } from 'react';
// Modal context definition
const ModalContext = createContext<{
  isEnquiryOpen: boolean;
  modalEnquiryData: any;
  openEnquiry: (data: any) => void;
  closeEnquiry: () => void;
  isQuickViewOpen: boolean;
  modalQuickViewData: any;
  openQuickView: (data: any) => void;
  closeQuickView: () => void;
}>({
  isEnquiryOpen: false,
  modalEnquiryData: null,
  openEnquiry: () => { },
  closeEnquiry: () => { },
  isQuickViewOpen: false,
  modalQuickViewData: null,
  openQuickView: () => { },
  closeQuickView: () => { },
});

// ModalProvider component to wrap your application and provide modal state
export const ModalProvider = ({ children }: { children: ReactNode }) => {
  const [isEnquiryOpen, setIsEnquiryOpen] = useState(false);
  const [modalEnquiryData, setModalEnquiryData] = useState<any>(null);

  const openEnquiry = (data: any) => {
    setModalEnquiryData(data);
    setIsEnquiryOpen(true);
  };

  const closeEnquiry = () => {
    setModalEnquiryData(null);
    setIsEnquiryOpen(false);
  };

  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [modalQuickViewData, setModalQuickViewData] = useState<any>(null);

  const openQuickView = (data: any) => {
    setModalQuickViewData(data);
    setIsQuickViewOpen(true);
  };

  const closeQuickView = () => {
    setModalQuickViewData(null);
    setIsQuickViewOpen(false);
  };

  return (
    <ModalContext.Provider value={{ isEnquiryOpen, modalEnquiryData, openEnquiry, closeEnquiry, isQuickViewOpen, modalQuickViewData, openQuickView, closeQuickView }}>
      {children}
    </ModalContext.Provider>
  );
};

// Custom hook to use the modal context
export const useModal = () => useContext(ModalContext);
