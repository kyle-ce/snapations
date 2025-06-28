import { FaGithub, FaInstagram, FaTwitter } from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-muted px-6 py-10 border-t">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div className="text-center sm:text-left">
          <p className="font-bold text-foreground">Snaptions</p>
          <p className="text-xs">
            © {new Date().getFullYear()} All memes reserved.
          </p>
        </div>

        <div className="flex items-center gap-4">
          <a
            href="https://github.com/kyle-ce/snapations"
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground"
          >
            <FaGithub className="w-5 h-5" />
          </a>
          <a
            href="https://twitter.com/yourhandle"
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground"
          >
            <FaTwitter className="w-5 h-5" />
          </a>
          <a
            href="https://instagram.com/yourhandle"
            target="_blank"
            rel="noreferrer"
            className="hover:text-foreground"
          >
            <FaInstagram className="w-5 h-5" />
          </a>
        </div>
      </div>
    </footer>
  );
}
