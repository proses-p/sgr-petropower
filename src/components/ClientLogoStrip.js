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

  const duplicatedClients = [...clients, ...clients];

  return (
    <section className="bg-white px-5 py-14 sm:px-6 sm:py-16 lg:px-8 lg:py-20 overflow-hidden" aria-labelledby="client-logo-heading">
      <div className="mx-auto max-w-7xl">
        <h2 id="client-logo-heading" className="text-center text-3xl font-semibold leading-tight text-[#242426] sm:text-4xl mb-9 lg:mb-12">
          Projects done by among members of our team
        </h2>

        <div className="relative w-full overflow-hidden [mask-image:_linear-gradient(to_right,transparent_0,_black_128px,_black_calc(100%-128px),transparent_100%)] sm:[mask-image:_linear-gradient(to_right,transparent_0,_black_200px,_black_calc(100%-200px),transparent_100%)]">
          <div className="flex w-max animate-infinite-scroll items-center gap-10 sm:gap-16 py-4">
            {duplicatedClients.map((client, index) => {
              const logo = (
                <img
                  src={client.logoUrl}
                  alt={client.name}
                  loading="lazy"
                  className="h-16 w-32 sm:h-20 sm:w-40 object-contain  hover:grayscale-0 transition-all duration-300 opacity-80 hover:opacity-100"
                />
              );

              return (
                <div key={`${client.id}-${index}`} className="flex items-center justify-center shrink-0">
                  {client.website ? (
                    <a href={client.website} target="_blank" rel="noopener noreferrer" aria-label={`Visit ${client.name}`}>
                      {logo}
                    </a>
                  ) : (
                    logo
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}