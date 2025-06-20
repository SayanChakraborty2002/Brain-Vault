export function LandingPage() {
    return (
        <div className="min-h-screen w-full bg-gray-100">
            {/* Main Content */}
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
                {/* Hero Section */}
                <section className="mb-16 md:mb-24 text-center">
                    <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-6">
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-blue-800">
                            Welcome to Brain-Vault
                        </h1>
                        <img 
                            className="w-16 h-16 sm:w-20 sm:h-20" 
                            src="/logo/brainLogo.png" 
                            alt="brain logo" 
                        />
                    </div>
                    <p className="text-base sm:text-lg text-gray-700 max-w-2xl mx-auto">
                        Organize your digital mind—save links, notes, videos, and more. Share, search, and never lose your thoughts again.
                    </p>
                    <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <a 
                            href="/signup" 
                            className="w-full sm:w-auto bg-blue-800 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition text-sm sm:text-base font-medium"
                        >
                            Get Started
                        </a>
                        <a 
                            href="/signin" 
                            className="w-full sm:w-auto text-blue-800 font-semibold hover:underline text-sm sm:text-base"
                        >
                            Already have an account?
                        </a>
                    </div>
                </section>

                {/* Features Section */}
                <section id="features" className="px-2 sm:px-0">
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-blue-800 mb-8 md:mb-12 text-center">Features</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <FeatureCard
                            title="Smart Search"
                            description="Find anything instantly using semantic AI-powered search."
                        />
                        <FeatureCard
                            title="Multimedia Storage"
                            description="Save notes, YouTube links, tweets, PDFs, and more."
                        />
                        <FeatureCard
                            title="Share with Ease"
                            description="Send collections via shareable links and collaborate effortlessly."
                        />
                    </div>
                </section>
            </main>
        </div>
    );
}

function FeatureCard({ title, description }: { title: string; description: string }) {
    return (
        <div className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition h-full">
            <h3 className="text-lg sm:text-xl font-semibold text-blue-800 mb-3">{title}</h3>
            <p className="text-sm sm:text-base text-gray-600">{description}</p>
        </div>
    );
}