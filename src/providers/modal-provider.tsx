"use client";
import SettingsModal from "@/components/modals/settings-modal";
import useToggleStore from "@/hooks/use-toggle";

const ModalProvider: React.FC = ({}) => {
  const { isSettingsModalOpen, setToggleSettingsModal } = useToggleStore();

  return (
    <>
      <SettingsModal
        open={isSettingsModalOpen}
        onChange={() => setToggleSettingsModal(!isSettingsModalOpen)}
        setOpenSettingsModal={setToggleSettingsModal}
      />
    </>
  );
};

export default ModalProvider;
