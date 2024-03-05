import React, { PropsWithChildren } from "react";

//change to objid
interface Props {
  id: string;
}

export default function pdf(props: PropsWithChildren<Props>) {
  return (
    <div>
      <h1>{props.id}</h1>
      <iframe src={`${props.id}`} width="50%" height="600px"></iframe>
      <a
        href={props.id}
        download="stack-smashing.pdf"
        target="_blank"
        className="text-blue-primary text font-bold"
      >
        Download PDF here
      </a>
    </div>
  );
}
