const Footer = () => {
    return (
      <footer className="w-full bg-gray-800 text-white p-4 mt-auto">
        <div className="max-w-4xl mx-auto text-center">
        <p className="text-center text-sm text-gray-400">
          Made with ❤️ by dude dot box LLC. &copy; {new Date().getFullYear()}. All rights reserved.
        </p>
        </div>
      </footer>
    );
  };
  
  export default Footer;