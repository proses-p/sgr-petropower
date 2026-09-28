"use client";

import { useEffect, useState } from "react";

export default function ClientLogoStrip() {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    let isCurrent = true;

    async function loadClients() {
      try {
        const response = await fetch("/api/clients");
        if (!response.ok) return;

        const result = await response.json();
        if (isCurrent) setClients(result.data || []);
      } catch (error) {
        console.error("CLIENTS LOAD ERROR:", error);
      }
    }

    loadClients();
    return () => {
      isCurrent = false;
    };
  }, []);

  if (!clients.length) return null;

  return (
    <section className="bg-white px-5 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20" aria-labelledby="client-logo-heading">
      <div className="mx-auto max-w-7xl">
        <h2 id="client-logo-heading" className="text-center text-3xl font-semibold leading-tight text-[#242426] sm:text-4xl">
          Our Projects We Have Done
        </h2>
        <ul className="mt-9 grid grid-cols-2 items-center justify-items-center gap-x-6 gap-y-10 sm:grid-cols-3 sm:gap-x-10 lg:mt-12 lg:grid-cols-6 lg:gap-x-8 lg:gap-y-12">
        {clients.map((client) => {
          const logo = (
            <img
              src={client.logoUrl}
              alt={client.name}
              loading="lazy"
              className="partner-logo-float h-16 w-full max-w-44 object-contain sm:h-18 lg:h-20"
            />
          );

          return (
            <li key={client.id} className="flex min-h-16 w-full items-center justify-center">
              {client.website ? (
                <a href={client.website} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${client.name}`}>
                  {logo}
                </a>
              ) : logo}
            </li>
          );
        })}
        </ul>
      </div>
    </section>
  );
}