import React from "react";

const Footer = () => {
    const footerItems = [
        {
            heading: "About",
            items: [
                { name: "About Us", href: "#" },
                { name: "Blog", href: "#" },
                { name: "Careers", href: "#" },
            ],
        },
        {
            heading: "Support",
            items: [
                { name: "Help Center", href: "#" },
                { name: "Contact Us", href: "#" },
                { name: "FAQ", href: "#" },
            ],
        },
        {
            heading: "Legal",
            items: [
                { name: "Privacy Policy", href: "#" },
                { name: "Terms of Service", href: "#" },
                { name: "Cookie Policy", href: "#" },
            ],
        },
        {
            heading: "Follow Us",
            items: [
                { name: "X", href: "#" },
                { name: "Facebook", href: "#" },
                { name: "Instagram", href: "#" },
            ],
        },
    ];
    return (
        <footer className="bg-footer">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10">
                <div className="md:grid grid-cols-1 md:grid-cols-4 gap-8 mb-8 hidden">
                    {footerItems.map((item, index) => (
                        <div key={index}>
                            <h3 className="font-bold mb-4">{item.heading}</h3>
                            <ul className="space-y-">
                                {item.items.map((menu, i) => (
                                    <li key={i} className="leading-relaxed">
                                        <a
                                            href={menu.href}
                                            className="hover:text-white"
                                        >
                                            {menu.name}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
                <div className="border-t border-gray-800 py-5 text-center">
                    <p className="text-xs tracking-wide">
                        &copy; 2026 OTTplay, HT Media Labs. All rights reserved.
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
