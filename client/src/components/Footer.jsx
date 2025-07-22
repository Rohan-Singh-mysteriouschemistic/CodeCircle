import React from "react";

const Footer = () => {
  return (
    <footer className="mt-16 border-t border-border bg-background/50 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col items-center justify-center text-sm text-muted-foreground text-center">
        <p>
          © {new Date().getFullYear()}{" "}
          <span className="font-medium text-foreground">CodeCircle</span>.  
          Built for coders, by{" "}
          <span className="font-semibold gradient-text">Rohan Singh</span>.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
