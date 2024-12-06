import Link from "next/link";
import React from "react";
import PrivacyPolicyModal from "../Registration/PrivacyPolicyModal";
import { useState } from "react";

export const Footer = () => {
  const [isModalOpen, setModalOpen] = useState<boolean>(false);

  // replace with actual social links when nonprofit gets back
  const socialLinks = {
    Facebook: ["https://www.facebook.com", "11", "19"],
    Twitter: ["https://www.x.com", "19", "15"],
    Instagram: ["https://www.instagram.com", "19", "19"],
    LinkedIn: ["https://www.linkedin.com", "19", "18"],
    YouTube: ["https://www.youtube.com", "21", "15"],
    // Mastodon: ["https://joinmastodon.org/", "19", "15"],
    // Pinterest: ["https://www.pinterest.com", "19", "19"],
  };

  return (
    <div>
      <div className="flex w-full overflow-hidden border-t border-zinc-200 md:justify-between">
        <div className="flex w-full flex-col justify-between gap-8 px-8 pb-8 md:flex-row md:gap-4 md:px-16 md:py-16">
          <div className="w-full">
            <img
              src="/logo_gray.svg"
              className="mb-5 h-36 w-36"
              alt="Logo"
            ></img>
            <div className="flex flex-col items-start justify-center gap-2">
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
          <div className="w-full">
            <div className="mb-4 font-dm-sans text-lg font-bold leading-snug text-indigo-950">
              Mission
            </div>
            <div className="font-dm-sans text-base font-normal text-slate-500">
              Preventing teen dating violence through awareness, education, and
              advocacy.
            </div>
          </div>
          <div className="w-full">
            <div className="mb-4 font-dm-sans text-lg font-bold leading-snug text-indigo-950">
              Contact us
            </div>
            <div className="flex shrink-0 flex-col gap-3 text-base lg:max-w-xs">
              <div className="flex gap-2">
                <img src="/footer/Website.svg" width={"20px"}></img>
                <Link
                  className="font-dm-sans font-normal leading-tight text-slate-500 hover:underline"
                  href="https://jenniferann.org/"
                  target="_blank"
                >
                  JenniferAnn.org
                </Link>
              </div>
              <div className="flex gap-2 font-dm-sans font-normal leading-tight text-slate-500">
                <img src="/footer/Email.svg" width={"20px"}></img>
                <p>contact@JenniferAnn.org</p>
              </div>
              <div className="flex gap-2">
                <img src="/footer/Phone.svg" width={"20px"}></img>
                <div className="font-dm-sans font-normal leading-tight text-slate-500">
                  877-786-7838 (877 STOP TDV)
                </div>
              </div>
              <div className="mt-4 text-base text-slate-500">
                For details about how we use your information, please see our{" "}
                <span onClick={() => setModalOpen(true)} className="underline">
                  privacy policy
                </span>
                .
              </div>
              <PrivacyPolicyModal
                isOpen={isModalOpen}
                onClose={() => setModalOpen(false)}
              />
            </div>
          </div>
        </div>
      </div>
      <div className="px-8 pb-16 md:px-16">
        <div className="flex items-center gap-4">
          <img src="/footer/Netlify.svg" width={"40px"}></img>
          <p className="text-base text-slate-500">
            This site is powered by Netlify
          </p>
        </div>
      </div>
    </div>
  );
};
