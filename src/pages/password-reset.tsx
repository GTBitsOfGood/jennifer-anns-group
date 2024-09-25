import pageAccessHOC from "@/components/HOC/PageAccess";
import HeroImage from "@/components/HeroImage";
import PasswordResetConfirmation from "@/components/PasswordReset/PasswordResetConfirmation";
import PasswordResetRequest from "@/components/PasswordReset/PasswordResetRequest";
import PasswordResetUpdate from "@/components/PasswordReset/PasswordResetUpdate";
import PasswordResetVerification from "@/components/PasswordReset/PasswordResetVerification";
import { useMemo, useRef, useState } from "react";

enum PasswordResetPage {
  REQUEST,
  VERIFY,
  UPDATE,
  CONFIRMATION,
}

function PasswordReset() {
  const [page, setPage] = useState<PasswordResetPage>(
    PasswordResetPage.REQUEST,
  );
  const emailRef = useRef<HTMLInputElement>(null);

  const pageComponents = useMemo(
    () => ({
      [PasswordResetPage.REQUEST]: (
        <PasswordResetRequest
          onSuccess={() => setPage(PasswordResetPage.VERIFY)}
          emailRef={emailRef}
        />
      ),
      [PasswordResetPage.VERIFY]: (
        <PasswordResetVerification
          onSuccess={() => setPage(PasswordResetPage.UPDATE)}
          // emailRef={emailRef}
        />
      ),
      [PasswordResetPage.UPDATE]: (
        <PasswordResetUpdate
          onSuccess={() => setPage(PasswordResetPage.UPDATE)}
          // emailRef={emailRef}
        />
      ),
      [PasswordResetPage.CONFIRMATION]: <PasswordResetConfirmation />,
    }),
    [],
  );

  const pageComponent = useMemo(() => {
    return (
      <HeroImage containerClassName="flex flex-col items-center justify-center">
        {pageComponents[page]}
      </HeroImage>
    );
  }, [pageComponents, page]);

  return pageComponent;
}

export default pageAccessHOC(PasswordReset);
