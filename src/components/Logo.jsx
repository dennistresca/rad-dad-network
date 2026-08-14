// Icon-only crop of the Rad Dad Network logo (headphones + equalizer
// mark), cropped from the official logo file. The full lockup's baked-in
// wordmark text is illegible at navbar/footer scale, so pair this with a
// real text label instead. Black background blends into the site's dark
// navbar/footer.
export default function Logo({ className = "h-10 w-10" }) {
  return (
    <img
      src="/logo-icon-only.png"
      alt="Rad Dad Network logo"
      className={`${className} rounded-full object-cover`}
    />
  );
}
