import { Dialog, Transition } from "@headlessui/react";

interface DialogProps {
  isOpen: boolean;
  outsideClickClose: boolean;
  title?: string;
  description?: string | undefined;
  children?: any | undefined;
  submitButton?: boolean;
  submitButtonMessage?: string;
  submitButtonFunc: () => void;
  cancelButton?: boolean | undefined;
  cancelButtonMessage?: string | undefined;
  cancelButtonFunc?: () => void;
}

export default function MyDialog(props: DialogProps) {

  const {
    isOpen,
    outsideClickClose,
    title,
    description,
    children,
    submitButton,
    submitButtonMessage,
    submitButtonFunc,
    cancelButton,
    cancelButtonMessage,
    cancelButtonFunc,
  } = props;

  return (
    <>
      <Transition show={isOpen}>
        <Dialog 
          open={isOpen}
          onClose={() => outsideClickClose ? submitButtonFunc() : null}
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
              <Dialog.Overlay className="fixed inset-0 bg-slate-800 bg-opacity-40" />
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
                  {title || null}
                </Dialog.Title>

                {children ? children : null}

                <Dialog.Description className="ml-2 text-red-500 font-light mb-5">
                  {description ? description : null}
                </Dialog.Description>

              <div className="flex w-44 justify-between">

                {
                  submitButton && 
                    <button 
                    onClick={submitButtonFunc}
                    className="p-2 w-20 font-semibold rounded-2xl bg-green-400 transition hover:scale-110 hover:bg-green-300" 
                    >{submitButtonMessage || "Default button message"}</button>
                }

                {
                  cancelButton &&
                    <button
                    onClick={cancelButtonFunc}
                    className="p-2 w-20 font-semibold rounded-2xl bg-red-400 transition hover:scale-110 hover:bg-red-300"
                    >{cancelButtonMessage || "Default button message"}</button>
                }
              </div>

              </div>
            
            </Transition.Child>

          </div>
        </Dialog>
      </Transition>
    </>
  )
}