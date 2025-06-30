"use client";

import React, { Suspense } from "react";
import ListInterviewed from "./ListInterviewed";

export default function Home() {
  return (
    <Suspense>
      <ListInterviewed />
    </Suspense>
  );
}
