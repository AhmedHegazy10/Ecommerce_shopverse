import Link from "next/link";
import { RiShoppingBag3Fill } from "react-icons/ri";
import {
  FaGithub,
  FaTwitter,
  FaInstagram,
  FaLinkedin,
} from "react-icons/fa";
import { HiMail, HiPhone, HiLocationMarker } from "react-icons/hi";

const footerLinks = {
  Company: ["About Us", "Careers", "Press", "Blog"],
  Products: ["New Arrivals", "Best Sellers", "Sale", "Gift Cards"],
  Support: ["Help Center", "Returns", "Order Status", "Contact Us"],
};

const socials = [
  { icon: FaGithub, href: "#" },
  { icon: FaTwitter, href: "#" },
  { icon: FaInstagram, href: "#" },
  { icon: FaLinkedin, href: "#" },
];

export default function Footer() {
  return (
    <footer id="contact" className="bg-dark-800 border-t border-white/5 mt-auto">
      {/* Main footer */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5 mb-5 w-fit group">
              <div className="w-9 h-9 bg-primary-500 rounded-xl flex items-center justify-center shadow-glow-sm group-hover:shadow-glow-orange transition-all duration-300">
                <RiShoppingBag3Fill className="text-white text-lg" />
              </div>
              <span className="font-heading text-xl font-bold">
                <span className="text-white">Shop</span>
                <span className="gradient-text">Verse</span>
              </span>
            </Link>
            <p className="text-white/40 text-sm leading-relaxed mb-6 max-w-xs">
              Your premium destination for quality products. Discover thousands
              of items curated for your lifestyle.
            </p>
            {/* Contact info */}
            <div className="space-y-3">
              {[
                { icon: HiMail, text: "hello@shopverse.com" },
                { icon: HiPhone, text: "+1 (555) 123-4567" },
                { icon: HiLocationMarker, text: "123 Commerce St, NY 10001" },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3 text-white/40 text-sm">
                  <Icon className="text-primary-500 shrink-0" size={15} />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white text-sm font-semibold mb-4 uppercase tracking-wider">
                {title}
              </h4>
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      className="text-white/40 text-sm hover:text-primary-400 transition-colors duration-200"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-12 pt-10 border-t border-white/5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h4 className="text-white font-semibold mb-1">Stay in the loop</h4>
              <p className="text-white/40 text-sm">
                Get notified about new products and exclusive deals.
              </p>
            </div>
            <div className="flex gap-3 max-w-md w-full">
              <input
                type="email"
                placeholder="your@email.com"
                className="input-field flex-1 py-2.5 text-sm"
              />
              <button className="btn-primary text-sm whitespace-nowrap py-2.5 px-5">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/30 text-xs">
            © {new Date().getFullYear()} ShopVerse. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            {socials.map(({ icon: Icon, href }) => (
              <a
                key={href + Icon.name}
                href={href}
                className="w-8 h-8 rounded-lg bg-white/5 hover:bg-primary-500/15 border border-white/10 hover:border-primary-500/30 flex items-center justify-center text-white/40 hover:text-primary-400 transition-all duration-200"
              >
                <Icon size={14} />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
