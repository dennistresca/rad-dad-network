// Full Rad Dad Network logo lockup (headphones + equalizer mark, wordmark,
// "EST. 2023"). Black background blends into the site's dark navbar/footer.
export default function Logo({ className = "h-12 w-12" }) {
  return (
    <img
      src="/logo-full.jpg"
      alt="Rad Dad Network"
      className={`${className} rounded-lg object-contain`}
    />
  );
}
