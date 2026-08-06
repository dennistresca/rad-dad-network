import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-black text-neutral-900">Page Not Found</h1>
      <p className="mt-4 text-lg text-neutral-600">
        Looks like this episode got lost in the feed. Let's get you back home.
      </p>
      <Link
        to="/"
        className="mt-8 inline-flex rounded-full bg-orange-500 px-6 py-3 font-semibold text-white transition-colors hover:bg-orange-600"
      >
        Back to Home
      </Link>
    </div>
  );
}
