import Link from "next/link";
import React from "react";

export const Footer = () => {
  // replace with actual social links when nonprofit gets back
  const socialLinks = {
    Facebook: ["https://www.facebook.com", "11", "19"],
    Twitter: ["https://www.x.com", "19", "15"],
    Instagram: ["https://www.instagram.com", "19", "19"],
    LinkedIn: ["https://www.linkedin.com", "19", "18"],
    YouTube: ["https://www.youtube.com", "21", "15"],
    Mastodon: ["https://joinmastodon.org/", "19", "15"],
    Pinterest: ["https://www.pinterest.com", "19", "19"],
  };

  return (
    <div>
      <div className="flex w-full justify-center border-t border-zinc-200">
        <div className="flex w-[calc(100%-4rem)] max-w-7xl flex-row justify-between py-24">
          <div className="mb-5 ml-5 mr-5 shrink-0">
            <img
              src="/logo_gray.svg"
              className="mb-5 h-36 w-36"
              alt="Logo"
            ></img>
            <div className="flex flex-col items-start justify-center gap-2">
              <div className="font-dm-sans text-sm font-normal text-slate-500">
                Jennifer Ann&apos;s Group&reg;
              </div>
              <div className="font-dm-sans text-sm font-normal text-slate-500">
                #stopTDV
              </div>
              <div className="font-dm-sans text-sm font-normal text-slate-500">
                501(c)(3) Public Charity
              </div>
              <div className="font-dm-sans text-sm font-normal text-slate-500">
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
                      src={`/footer/social/${name}.svg`}
                      className={`w-[${width}px] h-[${height}px]`}
                      alt={name}
                    />
                  </Link>
                ),
              )}
            </div>
          </div>
          <div className="mb-5 ml-5 mr-5 mt-7 shrink lg:ml-[20vw] lg:mr-[5vw]">
            <div className="mb-10 font-dm-sans text-xl font-bold leading-snug text-indigo-950">
              Mission
            </div>
            <div className="font-dm-sans text-lg font-normal text-slate-500">
              Preventing teen dating violence through awareness, education, and
              advocacy.
            </div>
          </div>
          <div className="m-5 mt-7 flex shrink-0 flex-col gap-6">
            <div className="mb-[14px] font-dm-sans text-xl font-bold leading-snug text-indigo-950">
              Contact us
            </div>
            <div className="flex gap-[6px]">
              <img src="/footer/Website.svg"></img>
              <Link
                className="font-dm-sans text-lg font-normal leading-tight text-slate-500 hover:underline"
                href="https://jenniferann.org/"
                target="_blank"
              >
                JenniferAnn.org
              </Link>
            </div>
            <img
              src="/footer/Email_Contact.png"
              className="h-5 w-[245px]"
            ></img>
            <div className="flex gap-[6px]">
              <img src="/footer/Phone.svg"></img>
              <div className="font-dm-sans text-lg font-normal leading-tight text-slate-500">
                877-786-7838 (877 STOP TDV)
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="mx-auto mb-20 w-11/12 border-t border-zinc-200"></div>
    </div>
  );
};
