import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";

const DeleteModal = ({ isOpen, onClose, onConfirm, title, type, message }) => {
  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity flex items-center justify-center">
          <Dialog.Panel className="bg-white p-6 rounded-lg max-w-sm w-full">
            <Dialog.Title className="text-lg font-semibold">{title}</Dialog.Title>
            <Dialog.Description className="mt-2 text-gray-600">{message}</Dialog.Description>

            <div className="flex justify-end gap-4 mt-4">
              <button 
                onClick={onClose} 
                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-500 transition"
              >
                Cancel
              </button>
              <button 
                onClick={onConfirm} 
                className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500 transition"
              >
               {type == "delete"? "Delete" : "Restore"}
              </button>
            </div>
          </Dialog.Panel>
        </div>
      </Dialog>
    </Transition>
  );
};

export default DeleteModal;
