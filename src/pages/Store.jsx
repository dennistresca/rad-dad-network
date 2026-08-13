import { usePageMeta } from "../hooks/usePageMeta";
import { featuredProducts } from "../data/featuredProducts";

const STORE_URL = import.meta.env.VITE_STORE_URL || "https://rad-dad-network.printify.me/";

export default function Store() {
  usePageMeta("Store", "Grab your Rad Dad Network merch.");

  return (
    <div className="px-4 py-16 sm:px-6 lg:px-8">
      <section className="mx-auto flex max-w-3xl flex-col items-center text-center">
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
        <p className="mt-4 text-sm text-neutral-400">Opens our external store in a new tab.</p>
      </section>

      <section className="mx-auto mt-16 max-w-6xl" aria-labelledby="featured-heading">
        <h2 id="featured-heading" className="text-center text-2xl font-bold text-neutral-900">
          A Few of Our Favorites
        </h2>
        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3">
          {featuredProducts.map((product) => (
            <a
              key={product.name}
              href={product.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group overflow-hidden rounded-xl border border-neutral-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="aspect-square overflow-hidden bg-neutral-100">
                <img
                  src={product.image}
                  alt={product.name}
                  loading="lazy"
                  className="h-full w-full object-cover transition-transform group-hover:scale-105"
                />
              </div>
              <div className="p-4">
                <p className="text-sm font-semibold text-neutral-900">{product.name}</p>
                <p className="mt-1 text-sm text-neutral-500">{product.price}</p>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
