import pageAccessHOC from "../HOC/PageAccess";

interface Props {
  onSuccess: () => void;
}

function PasswordResetVerification({ onSuccess }: Props) {
  return <div>Placeholder</div>;
}

export default pageAccessHOC(PasswordResetVerification);
