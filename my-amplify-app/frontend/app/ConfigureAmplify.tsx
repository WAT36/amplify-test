"use client";

import { Amplify } from "aws-amplify";
import outputs from "../amplify_outputs.json";
import { useEffect } from "react";

Amplify.configure(outputs, { ssr: true });

export default function ConfigureAmplify({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
