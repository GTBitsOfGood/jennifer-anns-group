import pageAccessHOC from "../HOC/PageAccess";

interface Props {
  onSuccess: () => void;
}

function PasswordResetUpdate({ onSuccess }: Props) {
  return <div>Placeholder</div>;
}

export default pageAccessHOC(PasswordResetUpdate);
