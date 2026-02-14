import { useState, useEffect, useCallback } from 'react';
import { TokenInput } from './components/TokenInput';
import { RateLimitCard } from './components/RateLimitCard';

interface ResourceData {
  limit: number;
  used: number;
  remaining: number;
  reset: number;
}

interface RateLimitResponse {
  resources: {
    [key: string]: ResourceData;
  };
  rate: ResourceData;
}

function App() {
  const [token, setToken] = useState<string | null>(localStorage.getItem('github_token'));
  const [data, setData] = useState<RateLimitResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async (authToken: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('https://api.github.com/rate_limit', {
        headers: {
          Authorization: `token ${authToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid token. Please check your token and try again.');
        }
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const jsonData: RateLimitResponse = await response.json();
      setData(jsonData);
      // Save token only if request succeeds
      localStorage.setItem('github_token', authToken);
      setToken(authToken);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      // If unauthorized, clear token to allow re-entry
      if (err instanceof Error && err.message.includes('Invalid token')) {
        setToken(null);
        localStorage.removeItem('github_token');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (token) {
      fetchData(token);
    }
  }, [token, fetchData]);

  const handleTokenSubmit = (newToken: string) => {
    fetchData(newToken);
  };

  const handleLogout = () => {
    setToken(null);
    setData(null);
    localStorage.removeItem('github_token');
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 p-4 sm:p-8 font-sans">
      <div className="max-w-6xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
              GitHub Rate Limit
            </h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">
              Visualize your API usage quotas
            </p>
          </div>
          
          {token && (
             <div className="flex gap-3">
               <button 
                 onClick={() => fetchData(token)}
                 disabled={loading}
                 className="px-4 py-2 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
               >
                 <span className={`${loading ? 'animate-spin' : ''}`}>↻</span> Refresh
               </button>
               <button 
                 onClick={handleLogout}
                 className="px-4 py-2 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 rounded-lg text-sm font-medium transition-colors"
               >
                 Logout
               </button>
             </div>
          )}
        </header>

        <main>
          {!token ? (
            <div className="flex flex-col items-center justify-center min-h-[50vh]">
              <TokenInput onTokenSubmit={handleTokenSubmit} />
              {error && (
                <div className="mt-4 p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg max-w-md w-full text-center">
                  {error}
                </div>
              )}
            </div>
          ) : (
            <>
               {error && (
                <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 rounded-lg">
                  Error: {error}
                </div>
              )}

              {loading && !data && (
                <div className="flex justify-center items-center h-64">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                </div>
              )}

              {data && (
                <div className="space-y-8">
                  {/* Primary Rate Limit */}
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <span className="w-2 h-8 bg-blue-500 rounded-full"></span>
                      Overall API Rate
                    </h2>
                    <div className="max-w-xl">
                      <RateLimitCard title="Core API" data={data.rate} />
                    </div>
                  </div>

                  {/* Detailed Resources */}
                  <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                      <span className="w-2 h-8 bg-purple-500 rounded-full"></span>
                      Resource Specific Limits
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {Object.entries(data.resources).map(([key, value]) => (
                        <RateLimitCard key={key} title={key} data={value} />
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </main>

        <footer className="mt-12 text-center text-sm text-gray-500 dark:text-gray-500">
          <p>Data provided by GitHub API. Local processing only.</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
