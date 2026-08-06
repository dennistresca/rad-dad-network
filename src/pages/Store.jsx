const STORE_URL = import.meta.env.VITE_STORE_URL || "https://rad-dad-network.printify.me/";

export default function Store() {
  return (
    <section className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center px-4 py-24 text-center sm:px-6 lg:px-8">
      <h1 className="text-3xl font-black text-neutral-900 sm:text-4xl">
        Rad Dad Network Store
      </h1>
      <p className="mt-4 text-lg text-neutral-600">Grab your swag here!</p>
      <a
        href={STORE_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-8 inline-flex rounded-full bg-orange-500 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-orange-600"
      >
        Shop the Merch Store
      </a>
      <p className="mt-4 text-sm text-neutral-400">
        Opens our external store in a new tab.
      </p>
    </section>
  );
}
