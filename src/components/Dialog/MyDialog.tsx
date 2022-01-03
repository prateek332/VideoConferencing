import { Dialog, Transition } from "@headlessui/react";
import { useState, Fragment } from "react";

interface DialogProps {
  isOpen: boolean;
  closeDialog: () => void;
  outsideClickClose: boolean;
  title: string;
  description: string;
  submitButton: boolean;
  buttonMessage: string;
  children: any;
}

export default function MyDialog(props: DialogProps) {

  const {
    isOpen,
    closeDialog,
    outsideClickClose,
    title,
    description,
    children,
    buttonMessage,
    submitButton,
  } = props;

  return (
    <>
      <Transition show={isOpen}>
        <Dialog 
          open={isOpen} 
          onClose={() => outsideClickClose ? closeDialog() : null}
          className="fixed flex items-center justify-center z-10 inset-0 overflow-y-auto"
        >
          <div className="flex items-center justify-center">
            <Transition.Child
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-slate-700 bg-opacity-20" />
            </Transition.Child>

            <Transition.Child
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div className="p-4 relative bg-white rounded-xl max-w-sm mx-auto">
                <Dialog.Title className="text-4xl font-semibold mb-5">
                  {title || "Default modal title"}
                </Dialog.Title>

                {children ? children : null}
                <Dialog.Description className="ml-2 text-red-500 font-light mb-5">
                  {description ? description : null}
                </Dialog.Description>

                {
                  submitButton && 
                    <button 
                      onClick={closeDialog}
                      className="p-2 font-semibold rounded-2xl bg-green-400 transition hover:scale-110 hover:bg-green-300" 
                    >{buttonMessage || "Default button message"}</button>
                }
              </div>
            
            </Transition.Child>

          </div>
        </Dialog>
      </Transition>
    </>
  )
}