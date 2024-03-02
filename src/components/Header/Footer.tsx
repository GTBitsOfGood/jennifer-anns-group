export const Footer = () => {
  // replace with social links when nonprofit gets back
  const socialLinks = {
    Facebook: ["www.facebook.com", "11", "19"],
    Twitter: ["www.x.com", "19", "15"],
    Instagram: ["www.instagram.com", "19", "19"],
    LinkedIn: ["www.linkedin.com", "19", "18"],
    YouTube: ["www.youtube.com", "21", "15"],
  };

  return (
    <div className="flex h-[541px] w-screen flex-col justify-between">
      <div className="flex justify-between">
        <div
          style={{
            paddingLeft: "6.88vw",
            paddingTop: "9.2vh",
          }}
        >
          <img
            src="/logo_gray.svg"
            className="h-[127px] w-[158px]"
            style={{ marginBottom: "20px" }}
          ></img>
          <div className="flex flex-col items-start justify-center gap-2">
            <div className="font-['DM Sans'] text-sm font-normal text-slate-500">
              #stopTDV
            </div>
            <div className="font-['DM Sans'] text-sm font-normal text-slate-500">
              501(c)(3) Public Charity
            </div>
            <div className="font-['DM Sans'] text-sm font-normal text-slate-500">
              EIN 20-4618499
            </div>
          </div>
          <div
            className="inline-flex items-center justify-start gap-[22px]"
            style={{ marginTop: "3.125vh" }}
          >
            {Object.entries(socialLinks).map(
              ([name, [link, width, height]]) => (
                <a href={link} key={name} target="_blank">
                  <img
                    src={`/social/${name}.svg`}
                    className={`w-[${width}px] h-[${height}px]`}
                  />
                </a>
              ),
            )}
          </div>
        </div>
        <div
          className="flex flex-col "
          style={{
            paddingLeft: "13.8vw",
            paddingTop: "6.9vw",
          }}
        >
          <div
            className="font-['DM Sans'] text-xl font-bold leading-snug text-indigo-950"
            style={{ paddingBottom: "4vh" }}
          >
            Mission
          </div>
          <div className="font-['DM Sans'] w-[365px] text-lg font-normal text-slate-500">
            Preventing teen dating violence through awareness, education, and
            advocacy.
          </div>
        </div>
        <div
          className="flex flex-col "
          style={{
            paddingRight: "6vw",
            paddingTop: "6.9vw",
          }}
        >
          <div
            className="font-['DM Sans'] text-xl font-bold leading-snug text-indigo-950"
            style={{ paddingBottom: "4vh" }}
          >
            Contact us
          </div>
          <div className="flex gap-[6px]" style={{ paddingBottom: "22px" }}>
            <img src="/contact/globe.svg"></img>
            <div className="font-['DM Sans'] text-lg font-normal leading-tight text-slate-500">
              JenniferAnn.org
            </div>
          </div>
          <div className="flex gap-[6px]" style={{ paddingBottom: "22px" }}>
            <img src="/contact/Email.svg"></img>
            <div className="font-['DM Sans'] text-lg font-normal leading-tight text-slate-500">
              contact@JenniferAnn.org
            </div>
          </div>
          <div className="flex gap-[6px]" style={{ paddingBottom: "22px" }}>
            <img src="/contact/phone.svg"></img>
            <div className="font-['DM Sans'] text-lg font-normal leading-tight text-slate-500">
              877-786-7838 (877 STOP TDV)
            </div>
          </div>
        </div>
      </div>
      <div style={{ marginBottom: "79px" }}>
        <center>
          <div className="w-[1241px] border-t border-zinc-200"></div>
        </center>
      </div>
    </div>
  );
};
