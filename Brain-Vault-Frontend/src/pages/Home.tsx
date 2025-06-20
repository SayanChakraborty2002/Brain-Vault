import { useNavigate } from "react-router-dom";
import { Button } from "../components/ui/Button";

export function HomePage() {
  const navigate = useNavigate();
  function logout() {
    localStorage.removeItem("Authorization");
    setTimeout(() => {
      navigate("/");
    }, 500);
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-800 flex flex-col">
      {/* Header - Enhanced Responsive */}
      <header className="bg-white shadow-sm sticky top-0 z-10 p-4 sm:p-5 md:p-6 flex justify-between items-center">
        <div className="flex items-center">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-800 tracking-tight">
            Brain-Vault
          </h1>
        </div>
        <nav className="flex gap-2 sm:gap-3 md:gap-4">
          <Button
            title="Dashboard"
            variant="primary"
            size="sm"
            onClick={() => navigate("/dashboard")}
            className="text-center"
          />
          <Button
            title="Logout"
            variant="outline"
            size="sm"
            onClick={logout}
            className="text-center"
          />
        </nav>
      </header>

      {/* Hero Section - Enhanced Responsive */}
      <section className="py-10 sm:py-14 md:py-20 px-5 sm:px-6 text-center flex-1">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold mb-4 sm:mb-5 leading-tight">
            Your Second Brain in the Cloud
          </h2>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Save, organize, and search your important thoughts, links, notes, and
            files—all in one secure place.
          </p>
        </div>
      </section>

      {/* Features Section - Enhanced Responsive */}
      <section className="px-5 sm:px-8 py-12 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto">
          <h3 className="text-2xl sm:text-3xl font-bold text-blue-800 mb-8 sm:mb-12 text-center">
            What You Can Do
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <FeatureCard
              title="Organize Everything"
              description="Group your thoughts into folders and categories with our intuitive tagging system."
            />
            <FeatureCard
              title="Powerful Search"
              description="Find anything instantly with our AI-powered semantic search technology."
            />
            <FeatureCard
              title="Stay Synced"
              description="Access your knowledge base from any device, anywhere in the world."
            />
          </div>
        </div>
      </section>

      {/* Footer - Enhanced Responsive */}
      <footer className="bg-gray-900 text-white py-6 sm:py-8">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 text-center">
          <p className="text-sm sm:text-base">
            &copy; {new Date().getFullYear()} Brain-Vault. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="bg-gray-50 hover:bg-white p-6 sm:p-7 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 h-full border border-gray-200">
      <h4 className="text-xl font-semibold text-blue-700 mb-3 sm:mb-4">
        {title}
      </h4>
      <p className="text-gray-600 sm:text-lg">{description}</p>
    </div>
  );
}