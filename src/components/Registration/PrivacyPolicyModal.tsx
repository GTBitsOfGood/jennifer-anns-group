import Image from "next/image";
import PrivacyPolicyContent from "../ProfileModal/PrivacyPolicyContent";

interface PrivacyPolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PrivacyPolicyModal: React.FC<PrivacyPolicyModalProps> = ({
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="flex h-[500px] w-[512px] flex-col items-start overflow-hidden rounded-lg bg-white">
        <div className="flex justify-between self-stretch border-b-[1px] border-gray-200 p-6">
          <Image
            src="/cross.svg"
            alt="No views"
            width={24}
            height={24}
            onClick={onClose}
          />
        </div>
        <div className="flex flex-col items-start gap-3 overflow-auto p-6">
          <PrivacyPolicyContent />
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyModal;
