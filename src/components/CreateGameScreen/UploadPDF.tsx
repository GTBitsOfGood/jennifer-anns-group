import { Upload, X } from "lucide-react";
import React, { useRef, useState } from "react";

const UploadPDF = ({ pdfFormKeys }: { pdfFormKeys: string[] }) => {
  const lessonRef = useRef<HTMLInputElement>(null);
  const parentingGuideRef = useRef<HTMLInputElement>(null);
  const answerKeyRef = useRef<HTMLInputElement>(null);

  const [selectedPdfInputs, setSelectedPdfInputs] = useState({
    parentingGuide: false,
    answerKey: false,
    lesson: false,
  });

  return (
    <div className="flex w-full flex-col gap-12">
      <div className="relative flex w-fit flex-col gap-3 md:w-2/3">
        <label className="text-xl font-semibold">Parenting Guide</label>
        <div className="flex w-fit flex-row items-center justify-start gap-2">
          <label htmlFor={pdfFormKeys[0]}>
            <div className="flex h-12 w-32 flex-row items-center justify-center gap-3 rounded-md border border-[#666666] bg-[#FAFBFC] text-slate-900 hover:opacity-80">
              <div>
                <Upload size={24} />
              </div>
              <p className="text-sm">Upload</p>
            </div>
          </label>
          <input
            ref={parentingGuideRef}
            className="block w-fit min-w-0 text-sm file:hidden"
            id={pdfFormKeys[0]}
            name={pdfFormKeys[0]}
            type="file"
            accept=".pdf"
            onChange={(e) => {
              const files = e.currentTarget.files;
              setSelectedPdfInputs({
                ...selectedPdfInputs,
                parentingGuide: !!files,
              });
            }}
          />
          <X
            className={
              selectedPdfInputs.parentingGuide
                ? "block text-orange-primary hover:cursor-pointer"
                : "hidden"
            }
            onClick={() => {
              if (!parentingGuideRef.current) return;
              parentingGuideRef.current.value = "";

              setSelectedPdfInputs({
                ...selectedPdfInputs,
                parentingGuide: false,
              });
            }}
          />
        </div>
      </div>

      <div className="relative flex w-full flex-col gap-3 md:w-2/3">
        <label className="text-xl font-semibold">Lesson Plan</label>
        <div className="flex w-fit flex-row items-center justify-start gap-2">
          <label htmlFor={pdfFormKeys[1]}>
            <div className="flex h-12 w-32 flex-row items-center justify-center gap-3 rounded-md border border-[#666666] bg-[#FAFBFC] text-slate-900 hover:opacity-80">
              <div>
                <Upload size={24} />
              </div>
              <p className="text-sm">Upload</p>
            </div>
          </label>
          <input
            ref={lessonRef}
            className="block w-fit text-sm file:hidden"
            id={pdfFormKeys[1]}
            name={pdfFormKeys[1]}
            type="file"
            accept=".pdf"
            onChange={(e) => {
              const files = e.currentTarget.files;
              setSelectedPdfInputs({
                ...selectedPdfInputs,
                lesson: !!files,
              });
            }}
          />
          <X
            className={
              selectedPdfInputs.lesson
                ? "block text-orange-primary hover:cursor-pointer"
                : "hidden"
            }
            onClick={() => {
              if (!lessonRef.current) return;
              lessonRef.current.value = "";

              setSelectedPdfInputs({
                ...selectedPdfInputs,
                lesson: false,
              });
            }}
          />
        </div>
      </div>

      <div className="relative flex w-full flex-col gap-3 md:w-2/3">
        <label className="text-xl font-semibold">Answer Key</label>
        <div className="flex w-fit flex-row items-center justify-start gap-2">
          <label htmlFor={pdfFormKeys[2]}>
            <div className="flex h-12 w-32 flex-row items-center justify-center gap-3 rounded-md border border-[#666666] bg-[#FAFBFC] text-slate-900 hover:opacity-80">
              <div>
                <Upload size={24} />
              </div>
              <p className="text-sm">Upload</p>
            </div>
          </label>
          <input
            ref={answerKeyRef}
            className="block w-fit text-sm file:hidden"
            id={pdfFormKeys[2]}
            name={pdfFormKeys[2]}
            type="file"
            accept=".pdf"
            onChange={(e) => {
              const files = e.currentTarget.files;
              setSelectedPdfInputs({
                ...selectedPdfInputs,
                answerKey: !!files,
              });
            }}
          />
          <X
            className={
              selectedPdfInputs.answerKey
                ? "block text-orange-primary hover:cursor-pointer"
                : "hidden"
            }
            onClick={() => {
              if (!answerKeyRef.current) return;
              answerKeyRef.current.value = "";

              setSelectedPdfInputs({
                ...selectedPdfInputs,
                answerKey: false,
              });
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default UploadPDF;
