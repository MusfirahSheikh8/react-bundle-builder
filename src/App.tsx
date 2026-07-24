import { BuilderProvider } from './context/BuilderContext';
import { Builder } from './components/Builder';
import { ReviewPanel } from './components/ReviewPanel';
import './index.css';

function App() {
  return (
    <BuilderProvider>
      <div className="min-h-screen bg-gray-50 font-sans text-gray-900 antialiased">

        <header className="bg-white border-b border-gray-200 py-4 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2">

              <div className="w-8 h-8 bg-[#5c21ff] rounded-lg flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 1L14 4.5V11.5L8 15L2 11.5V4.5L8 1Z" stroke="white" strokeWidth="1.5" fill="none" />
                  <circle cx="8" cy="8" r="2.5" fill="white" />
                </svg>
              </div>
              <span className="font-semibold text-gray-900 text-lg tracking-tight">Wyze</span>
            </div>
            <span className="text-xs text-gray-400 uppercase tracking-widest hidden sm:block">Bundle Builder</span>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col gap-8">

          <div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-gray-900 leading-tight">
              Let's get started!
            </h1>
            <p className="text-gray-500 mt-2 text-base">
              Build your custom security system in just 4 steps.
            </p>
          </div>

          <Builder />

          <ReviewPanel />
        </main>

        <footer className="border-t border-gray-200 mt-8 py-6">
          <p className="text-center text-xs text-gray-400">
            © {new Date().getFullYear()} Wyze Labs, Inc. All rights reserved.
          </p>
        </footer>
      </div>
    </BuilderProvider>
  );
}

export default App;
