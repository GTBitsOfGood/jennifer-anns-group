import pageAccessHOC from "@/components/HOC/PageAccess";
import HeroImage from "@/components/HeroImage";
import PasswordResetConfirmation from "@/components/PasswordReset/PasswordResetConfirmation";
import PasswordResetRequest from "@/components/PasswordReset/PasswordResetRequest";
import PasswordResetUpdate from "@/components/PasswordReset/PasswordResetUpdate";
import PasswordResetVerification from "@/components/PasswordReset/PasswordResetVerification";
import { useMemo, useState } from "react";

enum PasswordResetPage {
  REQUEST,
  VERIFY,
  UPDATE,
  CONFIRMATION,
}

const pageComponents = (setPage: (page: PasswordResetPage) => void) => ({
  [PasswordResetPage.REQUEST]: (
    <PasswordResetRequest onSuccess={() => setPage(PasswordResetPage.VERIFY)} />
  ),
  [PasswordResetPage.VERIFY]: (
    <PasswordResetVerification
      onSuccess={() => setPage(PasswordResetPage.UPDATE)}
    />
  ),
  [PasswordResetPage.UPDATE]: (
    <PasswordResetUpdate onSuccess={() => setPage(PasswordResetPage.UPDATE)} />
  ),
  [PasswordResetPage.CONFIRMATION]: <PasswordResetConfirmation />,
});

function PasswordReset() {
  const [page, setPage] = useState<PasswordResetPage>(
    PasswordResetPage.REQUEST,
  );

  const pageComponent = useMemo(() => {
    return (
      <HeroImage containerClassName="flex flex-col items-center justify-center">
        {pageComponents(setPage)[page]}
      </HeroImage>
    );
  }, [page]);

  return pageComponent;
}

export default pageAccessHOC(PasswordReset);
