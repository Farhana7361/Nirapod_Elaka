export default function Footer() {
  return (
    <footer className="bg-base-100 px-6 py-8 mt-auto">
      <p className="text-center text-sm opacity-70">
        © {new Date().getFullYear()} Nirapod Elaka — Crowdsourced public safety for Bangladesh.
      </p>
    </footer>
  );
}