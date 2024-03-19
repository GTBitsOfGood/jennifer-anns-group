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
    <div className="fixed bottom-0 left-0 flex w-full justify-center border border-gray-100">
      <div className="flex w-10/12 flex-col justify-between">
        <div className="flex justify-between p-12">
          <div className="mb-5 ml-5 mr-5">
            <img
              src="/logo_gray.svg"
              className="mb-5 h-36 w-36"
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
              className="mt-5 inline-flex items-center justify-start gap-5"
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
          <div className="m-5">
            <div className="font-['DM Sans'] mb-10 text-xl font-bold leading-snug text-indigo-950">
              Mission
            </div>
            <div className="font-['DM Sans'] text-lg font-normal text-slate-500">
              Preventing teen dating violence through awareness, education, and
              advocacy.
            </div>
          </div>
          <div className="m-5">
            <div className="font-['DM Sans'] mb-10 text-xl font-bold leading-snug text-indigo-950">
              Contact us
            </div>
            <img className="w-full" src="/contact.svg" alt="Contact"></img>
          </div>
        </div>
        <div className="mx-auto mb-12 w-11/12 border-t border-zinc-200"></div>
      </div>
    </div>
  );
};
