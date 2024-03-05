import Link from "next/link";

export const Footer = () => {
  // replace with actual social links when nonprofit gets back
  const socialLinks = {
    Facebook: ["https://www.facebook.com", "11", "19"],
    Twitter: ["https://www.x.com", "19", "15"],
    Instagram: ["https://www.instagram.com", "19", "19"],
    LinkedIn: ["https://www.linkedin.com", "19", "18"],
    YouTube: ["https://www.youtube.com", "21", "15"],
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
            alt="Logo"
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
            aria-label="Social Links"
          >
            {Object.entries(socialLinks).map(
              ([name, [link, width, height]]) => (
                <Link href={link} key={name} target="_blank">
                  <img
                    src={`/social/${name}.svg`}
                    className={`w-[${width}px] h-[${height}px]`}
                    alt={name}
                  />
                </Link>
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
          <img src="/contact.svg" alt="Contact"></img>
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
